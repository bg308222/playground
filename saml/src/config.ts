// ---------------------------------------------------------------------------
// Shared configuration for the SAML demo.
//
// In a real deployment the SP and IdP are separate systems on separate hosts.
// Here we run both inside one Bun process (two Bun.serve() listeners) so you
// can launch the whole thing with a single command, but the code is split into
// `sp.ts` and `idp.ts` to keep the two roles conceptually distinct.
// ---------------------------------------------------------------------------

export const SP_PORT = 3000;
export const IDP_PORT = 4000;

export const SP_ORIGIN = `http://localhost:${SP_PORT}`;
export const IDP_ORIGIN = `http://localhost:${IDP_PORT}`;

// --- Service Provider identity ---------------------------------------------
// The "entityID" is the globally-unique name the SP uses to identify itself.
// This is also the value the IdP must echo back as the <Audience>.
export const SP_ENTITY_ID = process.env.SP_ENTITY_ID ?? `${SP_ORIGIN}/metadata`;
// Assertion Consumer Service: the SP endpoint the IdP POSTs the response to.
export const SP_ACS_URL = process.env.SP_ACS_URL ?? `${SP_ORIGIN}/acs`;

// --- Identity Provider identity --------------------------------------------
// These default to the bundled demo IdP, but can be pointed at a real IdP
// (e.g. Authentik) via env vars — see README "接真實 IdP".
//   IDP_ENTITY_ID  -> the IdP's Issuer / entityID
//   IDP_SSO_URL    -> the IdP's SAML SSO (HTTP-Redirect) endpoint
//   IDP_CERT_PATH  -> path to the IdP's signing certificate (consumed in sp.ts)
export const IDP_ENTITY_ID = process.env.IDP_ENTITY_ID ?? `${IDP_ORIGIN}/metadata`;
export const IDP_SSO_URL = process.env.IDP_SSO_URL ?? `${IDP_ORIGIN}/sso`;

// SAML 2.0 standard URN constants -------------------------------------------
export const NS = {
  protocol: "urn:oasis:names:tc:SAML:2.0:protocol",
  assertion: "urn:oasis:names:tc:SAML:2.0:assertion",
};

export const BINDING = {
  redirect: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
  post: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
};

export const NAMEID_FORMAT = {
  email: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
};

export const STATUS = {
  success: "urn:oasis:names:tc:SAML:2.0:status:Success",
};
