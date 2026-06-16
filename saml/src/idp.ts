// ===========================================================================
// Identity Provider (IdP)  —  http://localhost:4000
//
// Responsibilities:
//   - receive the AuthnRequest over the HTTP-Redirect binding (GET /sso)
//   - authenticate the user (login form, or reuse an existing IdP session = SSO)
//   - mint a signed SAML Response and POST it back to the SP's ACS
//   - publish its metadata (entityID + signing certificate)
// ===========================================================================

import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import {
  IDP_ENTITY_ID,
  IDP_SSO_URL,
  SP_ENTITY_ID,
  NS,
  BINDING,
} from "./config";
import {
  decodeAndInflate,
  parseAuthnRequest,
  buildSignedResponse,
  postEncode,
  prettyXml,
} from "./saml";
import { layout, codeBlock, kvTable } from "./views";

const PRIVATE_KEY = readFileSync(new URL("../certs/idp-key.pem", import.meta.url), "utf8");
const CERTIFICATE = readFileSync(new URL("../certs/idp-cert.pem", import.meta.url), "utf8");

// Demo user directory living at the IdP. These attributes are what the SP
// receives inside the assertion.
const USERS: Record<string, { password: string; attributes: Record<string, string> }> = {
  "alice@example.com": {
    password: "password123",
    attributes: {
      email: "alice@example.com",
      displayName: "Alice Anderson",
      department: "Engineering",
      role: "admin",
    },
  },
  "bob@example.com": {
    password: "hunter2",
    attributes: {
      email: "bob@example.com",
      displayName: "Bob Brown",
      department: "Sales",
      role: "user",
    },
  },
};

// Very small in-memory IdP session store (the basis for SSO).
const idpSessions = new Map<string, string>(); // sessionId -> username

export const idp = new Hono();

// --- metadata --------------------------------------------------------------
idp.get("/metadata", (c) => {
  const certBody = CERTIFICATE.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const xml =
    `<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${IDP_ENTITY_ID}">` +
    `<IDPSSODescriptor protocolSupportEnumeration="${NS.protocol}">` +
    `<KeyDescriptor use="signing"><KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">` +
    `<X509Data><X509Certificate>${certBody}</X509Certificate></X509Data></KeyInfo></KeyDescriptor>` +
    `<SingleSignOnService Binding="${BINDING.redirect}" Location="${IDP_SSO_URL}"/>` +
    `</IDPSSODescriptor></EntityDescriptor>`;
  return c.text(prettyXml(xml), 200, { "content-type": "application/xml; charset=utf-8" });
});

// --- step 2/3: receive AuthnRequest, show login or SSO-continue ------------
idp.get("/sso", (c) => {
  const samlRequest = c.req.query("SAMLRequest");
  const relayState = c.req.query("RelayState") ?? "";
  if (!samlRequest) return c.text("missing SAMLRequest", 400);

  let decoded: string;
  let parsed;
  try {
    decoded = decodeAndInflate(samlRequest);
    parsed = parseAuthnRequest(decoded);
  } catch (e) {
    return c.text("could not decode SAMLRequest: " + (e as Error).message, 400);
  }

  const sessionUser = currentUser(c);

  const requestInfo = kvTable([
    ["Request ID", parsed.id],
    ["Issuer (SP)", parsed.issuer],
    ["ACS URL", parsed.acsUrl ?? "(none)"],
    ["RelayState", relayState || "(none)"],
  ]);

  // Carry the original message through the login POST untouched.
  const hidden =
    `<input type="hidden" name="SAMLRequest" value="${attr(samlRequest)}">` +
    `<input type="hidden" name="RelayState" value="${attr(relayState)}">`;

  const ssoBanner = sessionUser
    ? `<div class="card"><p>你在 IdP 已經有登入 session：<b>${sessionUser}</b>。</p>
        <form method="post" action="/authorize">${hidden}
          <button class="btn purple" type="submit">以 ${sessionUser} 繼續（SSO，免再輸入密碼）</button>
        </form>
        <p class="muted">這就是 SSO：IdP 記得你，SP 不需要再次驗證密碼。</p></div>`
    : "";

  const body =
    `<p>SP 透過 <b>HTTP-Redirect binding</b> 把 AuthnRequest 送來了。IdP 先把它 base64+inflate 解開：</p>` +
    requestInfo +
    codeBlock("解開後的 AuthnRequest XML", prettyXml(decoded)) +
    ssoBanner +
    `<div class="card"><h2>在 IdP 登入</h2>
      <form method="post" action="/login">${hidden}
        <label>帳號</label><input name="username" value="alice@example.com" autofocus>
        <label>密碼</label><input name="password" type="password" value="password123">
        <p style="margin-top:14px"><button class="btn purple" type="submit">登入並授權</button></p>
      </form>
      <p class="muted">可用帳號：alice@example.com / password123 ・ bob@example.com / hunter2</p>
    </div>`;

  return c.html(layout({ title: "IdP：收到登入請求", role: "idp", step: 3, body }));
});

// --- login with credentials ------------------------------------------------
idp.post("/login", async (c) => {
  const form = await c.req.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  const samlRequest = String(form.get("SAMLRequest") ?? "");
  const relayState = String(form.get("RelayState") ?? "");

  const user = USERS[username];
  if (!user || user.password !== password) {
    return c.html(
      layout({
        title: "IdP：登入失敗",
        role: "idp",
        step: 3,
        body: `<div class="card"><p class="bad">帳號或密碼錯誤。</p><p><a href="javascript:history.back()">返回</a></p></div>`,
      }),
      401,
    );
  }

  // Establish an IdP session so a subsequent login becomes SSO.
  const sid = randomBytes(16).toString("hex");
  idpSessions.set(sid, username);
  setCookie(c, "idp_session", sid, { httpOnly: true, path: "/", sameSite: "Lax" });

  return issueResponsePage(c, username, samlRequest, relayState);
});

// --- SSO continue (reuse existing IdP session) -----------------------------
idp.post("/authorize", async (c) => {
  const form = await c.req.formData();
  const samlRequest = String(form.get("SAMLRequest") ?? "");
  const relayState = String(form.get("RelayState") ?? "");
  const username = currentUser(c);
  if (!username) return c.text("no IdP session", 401);
  return issueResponsePage(c, username, samlRequest, relayState);
});

// --- build & present the signed Response (step 4/5) ------------------------
function issueResponsePage(c: any, username: string, samlRequestB64: string, relayState: string) {
  const user = USERS[username];
  if (!user) return c.text("unknown user", 401);
  const parsed = parseAuthnRequest(decodeAndInflate(samlRequestB64));
  const acsUrl = parsed.acsUrl!;

  const { xml } = buildSignedResponse({
    idpEntityId: IDP_ENTITY_ID,
    spEntityId: SP_ENTITY_ID,
    acsUrl,
    inResponseTo: parsed.id,
    user: { nameId: username, attributes: user.attributes },
    privateKey: PRIVATE_KEY,
    certificate: CERTIFICATE,
  });

  const samlResponseB64 = postEncode(xml);

  // Auto-submitting form = the HTTP-POST binding in action.
  const body =
    `<p>IdP 驗證通過，產生了一份 <b>用 IdP 私鑰簽章</b> 的 SAML Response，準備透過 <b>HTTP-POST binding</b> 送回 SP 的 ACS。</p>` +
    kvTable([
      ["登入使用者", username],
      ["InResponseTo", parsed.id],
      ["Destination (ACS)", acsUrl],
      ["Signature", "enveloped, exclusive-c14n, RSA-SHA256（在 <Assertion> 上）"],
    ]) +
    codeBlock("簽章後的 SAML Response XML（注意 <ds:Signature> 區塊）", prettyXml(xml)) +
    `<form id="f" method="post" action="${attr(acsUrl)}">
       <input type="hidden" name="SAMLResponse" value="${attr(samlResponseB64)}">
       <input type="hidden" name="RelayState" value="${attr(relayState)}">
       <button class="btn" type="submit">POST 回 SP 的 ACS →</button>
       <span class="muted">（真實情況會自動送出；這裡讓你手動觀察）</span>
     </form>`;

  return c.html(layout({ title: "IdP：已簽章，準備 POST 回 SP", role: "idp", step: 4, body }));
}

// --- helpers ---------------------------------------------------------------
function currentUser(c: any): string | null {
  const sid = getCookie(c, "idp_session");
  return sid ? idpSessions.get(sid) ?? null : null;
}
function attr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
