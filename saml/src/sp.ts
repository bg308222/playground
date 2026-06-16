// ===========================================================================
// Service Provider (SP)  —  http://localhost:3000
//
// Responsibilities:
//   - start SSO by building an AuthnRequest and redirecting to the IdP
//   - receive & verify the signed SAML Response at the ACS endpoint
//   - establish a local application session from the assertion
// ===========================================================================

import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import {
  SP_ENTITY_ID,
  SP_ACS_URL,
  IDP_ENTITY_ID,
  IDP_SSO_URL,
  NS,
  BINDING,
} from "./config";
import {
  buildAuthnRequest,
  deflateAndEncode,
  postDecode,
  verifyResponse,
  prettyXml,
} from "./saml";
import { layout, codeBlock, kvTable } from "./views";

// The SP trusts this IdP certificate. In the real world it is exchanged
// out-of-band via the IdP's metadata; here we read it from disk directly.
const IDP_CERTIFICATE = readFileSync(new URL("../certs/idp-cert.pem", import.meta.url), "utf8");

// AuthnRequest IDs we have issued and are still waiting on. Used to validate
// InResponseTo (prevents accepting unsolicited / replayed responses).
const pendingRequests = new Map<string, number>(); // id -> issuedAt

// Local application sessions created after a successful SSO.
interface AppSession {
  nameId: string;
  attributes: Record<string, string>;
  loginAt: string;
}
const appSessions = new Map<string, AppSession>();

export const sp = new Hono();

// --- home / protected app --------------------------------------------------
sp.get("/", (c) => {
  const session = currentSession(c);
  if (session) {
    const rows = Object.entries(session.attributes).map(
      ([k, v]) => [k, v] as [string, string],
    );
    const body =
      `<div class="card"><p class="ok">✅ 已透過 SAML SSO 登入</p>` +
      kvTable([["NameID", session.nameId], ["登入時間", session.loginAt], ...rows]) +
      `<p style="margin-top:16px"><a class="btn ghost" href="/logout">登出</a>
       <a class="btn" href="/login">再跑一次 SSO（會看到 IdP 直接 SSO 放行）</a></p></div>` +
      `<p class="muted">這些屬性全部來自 IdP 簽章的 assertion，SP 自己沒有密碼資料。</p>`;
    return c.html(layout({ title: "受保護的應用首頁", role: "sp", body }));
  }

  const body =
    `<div class="card"><p>這是一個受保護的應用。它本身<b>不存任何密碼</b>，登入交給 IdP 處理。</p>
      <p style="margin-top:16px"><a class="btn" href="/login">使用 SAML SSO 登入 →</a></p></div>
     <p class="muted">點下去後，SP 會產生 AuthnRequest 並把你導向 IdP。</p>
     <p class="muted">參考端點：<a href="/metadata">SP metadata</a> ・ <a href="${IDP_SSO_URL.replace("/sso", "/metadata")}">IdP metadata</a></p>`;
  return c.html(layout({ title: "服務提供者 Demo App", role: "sp", body }));
});

// --- step 1: build AuthnRequest and show the redirect ----------------------
sp.get("/login", (c) => {
  const { id, xml } = buildAuthnRequest({
    issuer: SP_ENTITY_ID,
    destination: IDP_SSO_URL,
    acsUrl: SP_ACS_URL,
  });
  pendingRequests.set(id, Date.now());

  // HTTP-Redirect binding: DEFLATE + base64 + urlencode into the query string.
  const encoded = deflateAndEncode(xml);
  const relayState = "/"; // where to land after login (deep-link support)
  const redirectUrl =
    `${IDP_SSO_URL}?SAMLRequest=${encodeURIComponent(encoded)}` +
    `&RelayState=${encodeURIComponent(relayState)}`;

  const body =
    `<p>SP 產生了一份 AuthnRequest（明文 XML 如下），並準備用 <b>HTTP-Redirect binding</b> 送往 IdP。</p>` +
    kvTable([
      ["Request ID", id],
      ["Issuer (SP)", SP_ENTITY_ID],
      ["Destination", IDP_SSO_URL],
      ["ACS URL", SP_ACS_URL],
    ]) +
    codeBlock("AuthnRequest XML（明文）", prettyXml(xml)) +
    codeBlock("DEFLATE + base64 後（實際放進網址的內容）", encoded) +
    codeBlock("完整的 Redirect 網址", redirectUrl) +
    `<p><a class="btn" href="${attr(redirectUrl)}">送往 IdP（Redirect）→</a></p>`;

  return c.html(layout({ title: "SP：產生 AuthnRequest", role: "sp", step: 1, body }));
});

// --- step 6: Assertion Consumer Service ------------------------------------
sp.post("/acs", async (c) => {
  const form = await c.req.formData();
  const samlResponse = String(form.get("SAMLResponse") ?? "");
  const relayState = String(form.get("RelayState") ?? "/");
  if (!samlResponse) return c.text("missing SAMLResponse", 400);

  const xml = postDecode(samlResponse);

  const result = verifyResponse(xml, {
    idpCertificate: IDP_CERTIFICATE,
    expectedAudience: SP_ENTITY_ID,
    expectedAcs: SP_ACS_URL,
    isRequestPending: (id) => pendingRequests.has(id),
  });

  // Consume the request id (one-time use) regardless of outcome.
  if (result.inResponseTo) pendingRequests.delete(result.inResponseTo);

  const checks: [string, string][] = [
    ["簽章驗證 (IdP 公鑰)", boolLabel(!result.errors.some((e) => /signature|reference/.test(e)))],
    ["Status = Success", boolLabel(result.status?.endsWith("Success") ?? false)],
    ["InResponseTo 對得上待處理請求", boolLabel(!result.errors.some((e) => /InResponseTo/.test(e)))],
    ["Audience = 本 SP", boolLabel(!result.errors.some((e) => /audience/.test(e)))],
    ["時間窗 (NotBefore/NotOnOrAfter)", boolLabel(!result.errors.some((e) => /NotBefore|expired/.test(e)))],
  ];

  if (!result.ok) {
    const body =
      `<div class="card"><p class="bad">❌ 驗證失敗，拒絕建立 session。</p>` +
      `<ul class="errs">${result.errors.map((e) => `<li>${escHtml(e)}</li>`).join("")}</ul></div>` +
      `<table class="kv">${checks.map(([k, v]) => `<tr><td>${escHtml(k)}</td><td>${v}</td></tr>`).join("")}</table>` +
      codeBlock("收到的 SAML Response", prettyXml(xml)) +
      `<p><a class="btn ghost" href="/">回首頁</a></p>`;
    return c.html(layout({ title: "SP ACS：驗證結果", role: "sp", step: 6, body }), 400);
  }

  // Success -> create the local session.
  const sid = randomBytes(16).toString("hex");
  appSessions.set(sid, {
    nameId: result.nameId!,
    attributes: result.attributes ?? {},
    loginAt: new Date().toISOString(),
  });
  setCookie(c, "sp_session", sid, { httpOnly: true, path: "/", sameSite: "Lax" });

  const body =
    `<div class="card"><p class="ok">✅ SAML Response 全部檢查通過！</p>` +
    `<table class="kv">${checks.map(([k, v]) => `<tr><td>${escHtml(k)}</td><td>${v}</td></tr>`).join("")}</table></div>` +
    kvTable([
      ["NameID", result.nameId ?? ""],
      ["Issuer (IdP)", result.issuer ?? ""],
      ["Audience", result.audience ?? ""],
      ["有效期", `${result.notBefore} ~ ${result.notOnOrAfter}`],
      ...Object.entries(result.attributes ?? {}),
    ]) +
    codeBlock("已驗證的 SAML Response XML", prettyXml(xml)) +
    `<p><a class="btn" href="${attr(relayState || "/")}">進入應用 →</a></p>`;

  return c.html(layout({ title: "SP ACS：驗證成功，已建立 session", role: "sp", step: 6, body }));
});

// --- metadata --------------------------------------------------------------
sp.get("/metadata", (c) => {
  const xml =
    `<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${SP_ENTITY_ID}">` +
    `<SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="${NS.protocol}">` +
    `<NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</NameIDFormat>` +
    `<AssertionConsumerService index="0" Binding="${BINDING.post}" Location="${SP_ACS_URL}"/>` +
    `</SPSSODescriptor></EntityDescriptor>`;
  return c.text(prettyXml(xml), 200, { "content-type": "application/xml; charset=utf-8" });
});

sp.get("/logout", (c) => {
  const sid = getCookie(c, "sp_session");
  if (sid) appSessions.delete(sid);
  deleteCookie(c, "sp_session", { path: "/" });
  return c.redirect("/");
});

// --- helpers ---------------------------------------------------------------
function currentSession(c: any): AppSession | null {
  const sid = getCookie(c, "sp_session");
  return sid ? appSessions.get(sid) ?? null : null;
}
function boolLabel(ok: boolean): string {
  return ok ? `<span class="ok">通過</span>` : `<span class="bad">失敗</span>`;
}
function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function attr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
