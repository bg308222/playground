// ---------------------------------------------------------------------------
// Core SAML primitives, written by hand so every step is visible:
//   - building the AuthnRequest / Response XML
//   - the HTTP-Redirect binding encoding (DEFLATE + base64 + urlencode)
//   - the HTTP-POST binding encoding (base64)
//   - XML signing & signature verification (via xml-crypto)
//   - parsing requests/responses back into plain objects
// ---------------------------------------------------------------------------

import { deflateRawSync, inflateRawSync } from "node:zlib";
import { randomBytes } from "node:crypto";
import { SignedXml } from "xml-crypto";
import { DOMParser } from "@xmldom/xmldom";
import * as xpath from "xpath";
import {
  NS,
  BINDING,
  NAMEID_FORMAT,
  STATUS,
} from "./config";

// SAML IDs must be XML NCNames -> cannot start with a digit, so prefix with "_".
export function genId(): string {
  return "_" + randomBytes(16).toString("hex");
}

// SAML timestamps are UTC ISO-8601 without milliseconds.
export function now(): Date {
  return new Date();
}
export function isoTime(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

// --- xpath helper that is namespace-agnostic (matches by local-name) -------
function selectFirst(doc: any, localName: string): Element | null {
  const nodes = xpath.select(
    `//*[local-name(.)='${localName}']`,
    doc as any,
  ) as Element[];
  return nodes[0] ?? null;
}

// ===========================================================================
// HTTP-Redirect binding: used for the AuthnRequest (SP -> IdP).
// The message is raw-DEFLATE compressed, base64 encoded, then URL-encoded and
// placed in a query-string parameter.
// ===========================================================================
export function deflateAndEncode(xml: string): string {
  return deflateRawSync(Buffer.from(xml, "utf8")).toString("base64");
}
export function decodeAndInflate(param: string): string {
  return inflateRawSync(Buffer.from(param, "base64")).toString("utf8");
}

// ===========================================================================
// HTTP-POST binding: used for the SAML Response (IdP -> SP).
// The (already signed) XML is simply base64 encoded into a form field.
// ===========================================================================
export function postEncode(xml: string): string {
  return Buffer.from(xml, "utf8").toString("base64");
}
export function postDecode(param: string): string {
  return Buffer.from(param, "base64").toString("utf8");
}

// ===========================================================================
// 1) SP builds an AuthnRequest
// ===========================================================================
export interface AuthnRequestParams {
  issuer: string; // SP entityID
  destination: string; // IdP SSO URL
  acsUrl: string; // where the IdP should POST the response
}

export function buildAuthnRequest(p: AuthnRequestParams): { id: string; xml: string } {
  const id = genId();
  const xml =
    `<samlp:AuthnRequest xmlns:samlp="${NS.protocol}" xmlns:saml="${NS.assertion}" ` +
    `ID="${id}" Version="2.0" IssueInstant="${isoTime(now())}" ` +
    `Destination="${destination(p.destination)}" ` +
    `AssertionConsumerServiceURL="${p.acsUrl}" ` +
    `ProtocolBinding="${BINDING.post}">` +
    `<saml:Issuer>${p.issuer}</saml:Issuer>` +
    `<samlp:NameIDPolicy Format="${NAMEID_FORMAT.email}" AllowCreate="true"/>` +
    `</samlp:AuthnRequest>`;
  return { id, xml };
}

function destination(url: string) {
  return url;
}

export interface ParsedAuthnRequest {
  id: string;
  issuer: string;
  acsUrl: string | null;
}

export function parseAuthnRequest(xml: string): ParsedAuthnRequest {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const root = selectFirst(doc, "AuthnRequest");
  if (!root) throw new Error("not an AuthnRequest");
  const issuerEl = selectFirst(doc, "Issuer");
  return {
    id: root.getAttribute("ID") || "",
    issuer: issuerEl?.textContent?.trim() || "",
    acsUrl: root.getAttribute("AssertionConsumerServiceURL"),
  };
}

// ===========================================================================
// 2) IdP builds a signed Response containing an Assertion
// ===========================================================================
export interface AssertionUser {
  nameId: string; // typically the email
  attributes: Record<string, string>;
}

export interface ResponseParams {
  idpEntityId: string;
  spEntityId: string; // becomes the Audience
  acsUrl: string; // Destination + SubjectConfirmation Recipient
  inResponseTo: string; // the AuthnRequest ID
  user: AssertionUser;
  privateKey: string; // PEM
  certificate: string; // PEM (embedded into KeyInfo)
}

export function buildSignedResponse(p: ResponseParams): { responseId: string; assertionId: string; xml: string } {
  const responseId = genId();
  const assertionId = genId();
  const issueInstant = isoTime(now());
  // The assertion is valid for a 5-minute window.
  const notBefore = isoTime(new Date(Date.now() - 60 * 1000));
  const notOnOrAfter = isoTime(new Date(Date.now() + 5 * 60 * 1000));
  const sessionIndex = genId();

  const attrs = Object.entries(p.user.attributes)
    .map(
      ([name, value]) =>
        `<saml:Attribute Name="${name}" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">` +
        `<saml:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" ` +
        `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">${escapeXml(value)}</saml:AttributeValue>` +
        `</saml:Attribute>`,
    )
    .join("");

  // Note: <Issuer> must be the FIRST child of <Assertion>; the enveloped
  // signature is inserted immediately after it (see signAssertion()).
  const assertion =
    `<saml:Assertion xmlns:saml="${NS.assertion}" ID="${assertionId}" Version="2.0" IssueInstant="${issueInstant}">` +
    `<saml:Issuer>${p.idpEntityId}</saml:Issuer>` +
    `<saml:Subject>` +
    `<saml:NameID Format="${NAMEID_FORMAT.email}">${escapeXml(p.user.nameId)}</saml:NameID>` +
    `<saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">` +
    `<saml:SubjectConfirmationData InResponseTo="${p.inResponseTo}" Recipient="${p.acsUrl}" NotOnOrAfter="${notOnOrAfter}"/>` +
    `</saml:SubjectConfirmation>` +
    `</saml:Subject>` +
    `<saml:Conditions NotBefore="${notBefore}" NotOnOrAfter="${notOnOrAfter}">` +
    `<saml:AudienceRestriction><saml:Audience>${p.spEntityId}</saml:Audience></saml:AudienceRestriction>` +
    `</saml:Conditions>` +
    `<saml:AuthnStatement AuthnInstant="${issueInstant}" SessionIndex="${sessionIndex}">` +
    `<saml:AuthnContext><saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef></saml:AuthnContext>` +
    `</saml:AuthnStatement>` +
    `<saml:AttributeStatement>${attrs}</saml:AttributeStatement>` +
    `</saml:Assertion>`;

  const signedAssertion = signAssertion(assertion, p.privateKey, p.certificate);

  const xml =
    `<samlp:Response xmlns:samlp="${NS.protocol}" xmlns:saml="${NS.assertion}" ` +
    `ID="${responseId}" Version="2.0" IssueInstant="${issueInstant}" ` +
    `Destination="${p.acsUrl}" InResponseTo="${p.inResponseTo}">` +
    `<saml:Issuer>${p.idpEntityId}</saml:Issuer>` +
    `<samlp:Status><samlp:StatusCode Value="${STATUS.success}"/></samlp:Status>` +
    signedAssertion +
    `</samlp:Response>`;

  return { responseId, assertionId, xml };
}

// Sign just the <Assertion> with an enveloped, exclusive-c14n, RSA-SHA256
// signature. The <ds:Signature> is placed right after the assertion's <Issuer>,
// as required by the SAML schema.
function signAssertion(assertionXml: string, privateKey: string, certificate: string): string {
  const sig = new SignedXml({
    privateKey,
    publicCert: certificate,
    signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
    canonicalizationAlgorithm: "http://www.w3.org/2001/10/xml-exc-c14n#",
  });

  sig.addReference({
    xpath: "//*[local-name(.)='Assertion']",
    transforms: [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/2001/10/xml-exc-c14n#",
    ],
    digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
  });

  sig.computeSignature(assertionXml, {
    prefix: "ds",
    location: {
      // place signature right after the Assertion's <Issuer> element
      reference: "//*[local-name(.)='Assertion']/*[local-name(.)='Issuer']",
      action: "after",
    },
  });

  return sig.getSignedXml();
}

// ===========================================================================
// 3) SP verifies & parses the Response
// ===========================================================================
export interface VerifyResult {
  ok: boolean;
  errors: string[];
  responseId?: string;
  inResponseTo?: string;
  status?: string;
  issuer?: string;
  nameId?: string;
  audience?: string;
  notBefore?: string;
  notOnOrAfter?: string;
  attributes?: Record<string, string>;
}

export interface VerifyOptions {
  idpCertificate: string; // PEM the SP trusts
  expectedAudience: string; // SP entityID
  expectedAcs: string; // SP ACS URL (Recipient/Destination check)
  isRequestPending: (inResponseTo: string) => boolean;
  // When true, a response with NO InResponseTo is accepted as an IdP-initiated
  // login (the pending-request check is skipped). This loses the anti-replay /
  // anti-CSRF guarantee that InResponseTo provides, so keep it opt-in.
  allowIdpInitiated?: boolean;
}

export function verifyResponse(xml: string, opts: VerifyOptions): VerifyResult {
  const errors: string[] = [];
  const doc = new DOMParser().parseFromString(xml, "text/xml");

  // --- (a) signature verification ------------------------------------------
  // We must verify BEFORE trusting any data inside the message. Different IdPs
  // place the signature differently: our demo IdP signs the <Assertion>, while
  // Authentik (and others) may sign the <Response>, the <Assertion>, or both.
  // Accept any valid signature whose reference covers one of those elements.
  const responseId0 = selectFirst(doc, "Response")?.getAttribute("ID") || "";
  const assertionId0 = selectFirst(doc, "Assertion")?.getAttribute("ID") || "";

  const sigNodes = (
    xpath.select(
      "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']",
      doc as any,
    ) as Element[]
  ).filter((n) => {
    const parent = (n.parentNode as Element | null)?.localName;
    return parent === "Assertion" || parent === "Response";
  });

  if (sigNodes.length === 0) {
    errors.push("no signature found on Assertion or Response");
  } else {
    let anyValid = false;
    let coversSubject = false;
    for (const node of sigNodes) {
      const sig = new SignedXml({ publicCert: opts.idpCertificate });
      try {
        sig.loadSignature(node);
        if (sig.checkSignature(xml)) {
          anyValid = true;
          // Defend against XML signature-wrapping: the signed reference must be
          // the very element (Assertion or Response) carrying the data we trust.
          const uri = (
            xpath.select(
              "string(./*[local-name(.)='SignedInfo']/*[local-name(.)='Reference']/@URI)",
              node as any,
            ) as string
          ).replace(/^#/, "");
          if (uri && (uri === assertionId0 || uri === responseId0)) coversSubject = true;
        }
      } catch {
        // ignore and try the next signature node
      }
    }
    if (!anyValid) errors.push("signature is INVALID");
    else if (!coversSubject)
      errors.push("signature does not cover the Assertion/Response (possible wrapping)");
  }

  // --- (b) status ----------------------------------------------------------
  const status = (
    xpath.select(
      "string(//*[local-name(.)='StatusCode']/@Value)",
      doc as any,
    ) as string
  ) || "";
  if (status !== STATUS.success) errors.push(`status is not Success: ${status}`);

  // --- (c) pull the data out of the assertion ------------------------------
  const responseEl = selectFirst(doc, "Response");
  const inResponseTo = responseEl?.getAttribute("InResponseTo") || "";
  const issuerEl = selectFirst(doc, "Issuer");
  const nameIdEl = selectFirst(doc, "NameID");
  const audienceEl = selectFirst(doc, "Audience");
  const conditionsEl = selectFirst(doc, "Conditions");
  const notBefore = conditionsEl?.getAttribute("NotBefore") || "";
  const notOnOrAfter = conditionsEl?.getAttribute("NotOnOrAfter") || "";

  // --- (d) InResponseTo must match a request WE sent -----------------------
  // No InResponseTo => IdP-initiated login. Only accept that when explicitly
  // allowed; otherwise an SP-initiated flow must echo a request we issued.
  if (!inResponseTo) {
    if (!opts.allowIdpInitiated) {
      errors.push("missing InResponseTo (set ALLOW_IDP_INITIATED=true to permit IdP-initiated login)");
    }
  } else if (!opts.isRequestPending(inResponseTo)) {
    errors.push(`InResponseTo "${inResponseTo}" does not match any pending request (possible replay/forgery)`);
  }

  // --- (e) audience must be us ---------------------------------------------
  const audience = audienceEl?.textContent?.trim() || "";
  if (audience !== opts.expectedAudience) {
    errors.push(`audience "${audience}" != expected "${opts.expectedAudience}"`);
  }

  // --- (f) time window -----------------------------------------------------
  const t = Date.now();
  if (notBefore && t < Date.parse(notBefore) - 5000) errors.push("assertion not yet valid (NotBefore)");
  if (notOnOrAfter && t >= Date.parse(notOnOrAfter)) errors.push("assertion expired (NotOnOrAfter)");

  // --- (g) collect attributes ----------------------------------------------
  const attributes: Record<string, string> = {};
  const attrEls = xpath.select(
    "//*[local-name(.)='Attribute']",
    doc as any,
  ) as Element[];
  for (const a of attrEls) {
    const name = a.getAttribute("Name") || "";
    const valEl = xpath.select(
      "string(.//*[local-name(.)='AttributeValue'])",
      a as any,
    ) as string;
    if (name) attributes[name] = (valEl || "").trim();
  }

  return {
    ok: errors.length === 0,
    errors,
    responseId: responseEl?.getAttribute("ID") || undefined,
    inResponseTo,
    status,
    issuer: issuerEl?.textContent?.trim() || undefined,
    nameId: nameIdEl?.textContent?.trim() || undefined,
    audience,
    notBefore,
    notOnOrAfter,
    attributes,
  };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Pretty-print XML for the transparency UI. Naive but good enough for display.
export function prettyXml(xml: string): string {
  let formatted = "";
  let indent = 0;
  const tokens = xml.replace(/>\s*</g, "><").replace(/></g, ">\n<").split("\n");
  for (const node of tokens) {
    if (/^<\/\w/.test(node)) indent--;
    formatted += "  ".repeat(Math.max(indent, 0)) + node + "\n";
    if (/^<\w[^>]*[^/]>$/.test(node) && !/^<.*<\/.*>$/.test(node)) indent++;
  }
  return formatted.trim();
}
