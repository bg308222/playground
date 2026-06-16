// Tiny HTML helpers for the transparency UI. No framework, just template
// strings, so the focus stays on the SAML flow rather than the front-end.

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const CSS = `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  max-width: 920px; margin: 0 auto; padding: 24px; line-height: 1.55; }
h1 { font-size: 1.5rem; } h2 { font-size: 1.15rem; margin-top: 1.6em; }
.role { display:inline-block; font-size:.72rem; font-weight:700; letter-spacing:.05em;
  padding:2px 8px; border-radius:999px; text-transform:uppercase; }
.role.sp { background:#1d4ed8; color:#fff; } .role.idp { background:#9333ea; color:#fff; }
pre { background:#0b1020; color:#d6e2ff; padding:14px 16px; border-radius:10px;
  overflow:auto; font-size:.8rem; line-height:1.45; border:1px solid #1e293b; }
.kv { width:100%; border-collapse:collapse; font-size:.9rem; }
.kv td { border-bottom:1px solid #8884; padding:6px 8px; vertical-align:top; }
.kv td:first-child { font-weight:600; white-space:nowrap; width:200px; color:#64748b; }
.btn { display:inline-block; background:#1d4ed8; color:#fff !important; text-decoration:none;
  padding:10px 18px; border-radius:8px; font-weight:600; border:none; cursor:pointer; font-size:1rem; }
.btn.purple { background:#9333ea; } .btn.ghost { background:#475569; }
.card { border:1px solid #8883; border-radius:12px; padding:18px 20px; margin:14px 0; }
.ok { color:#16a34a; font-weight:700; } .bad { color:#dc2626; font-weight:700; }
.muted { color:#64748b; font-size:.85rem; }
.flow { display:flex; gap:6px; flex-wrap:wrap; align-items:center; font-size:.8rem; margin:10px 0 4px; }
.flow span { padding:3px 9px; border:1px solid #8886; border-radius:6px; }
.flow .here { background:#facc15; color:#000; font-weight:700; border-color:#eab308; }
label { display:block; margin:10px 0 4px; font-weight:600; font-size:.9rem; }
input { width:100%; padding:9px 11px; border:1px solid #8886; border-radius:8px; font-size:1rem; background:transparent; color:inherit; }
form { margin:8px 0; }
a { color:#1d4ed8; }
ul.errs li { color:#dc2626; }
`;

export function layout(opts: {
  title: string;
  role: "sp" | "idp";
  step?: number;
  body: string;
}): string {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}</title><style>${CSS}</style></head>
<body>
<p><span class="role ${opts.role}">${opts.role === "sp" ? "Service Provider :3000" : "Identity Provider :4000"}</span></p>
${flowBar(opts.step)}
<h1>${esc(opts.title)}</h1>
${opts.body}
</body></html>`;
}

function flowBar(step?: number): string {
  if (!step) return "";
  const steps = [
    "1. SP 產生 AuthnRequest",
    "2. Redirect → IdP",
    "3. IdP 登入",
    "4. IdP 簽章 Response",
    "5. POST → SP ACS",
    "6. SP 驗證 + 建立 session",
  ];
  return (
    `<div class="flow">` +
    steps
      .map((s, i) => `<span class="${i + 1 === step ? "here" : ""}">${esc(s)}</span>`)
      .join(`<span class="muted">→</span>`) +
    `</div>`
  );
}

export function codeBlock(label: string, content: string): string {
  return `<h2>${esc(label)}</h2><pre>${esc(content)}</pre>`;
}

export function kvTable(rows: [string, string][]): string {
  return (
    `<table class="kv">` +
    rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("") +
    `</table>`
  );
}
