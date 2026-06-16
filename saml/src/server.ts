// Launches BOTH the SP (:3000) and the IdP (:4000) in one Bun process so the
// whole demo starts with a single command. They are still independent Hono
// apps — in production they would be separate deployments.

import { sp } from "./sp";
import { idp } from "./idp";
import { SP_PORT, IDP_PORT, SP_ORIGIN, IDP_ORIGIN } from "./config";

Bun.serve({ port: SP_PORT, fetch: sp.fetch });
Bun.serve({ port: IDP_PORT, fetch: idp.fetch });

console.log("\n  SAML demo is running\n");
console.log(`  ▶  Service Provider (start here):  ${SP_ORIGIN}`);
console.log(`     Identity Provider:               ${IDP_ORIGIN}`);
console.log(`\n  Demo users:  alice@example.com / password123   ·   bob@example.com / hunter2\n`);
