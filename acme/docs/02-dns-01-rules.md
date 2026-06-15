# DNS-01 / DNS 命名規則速查（附權威文件）

> DNS-01 challenge 與憑證網域命名的規則整理。每條都附上權威來源。

---

## 1. DNS-01 challenge 怎麼運作

CA 給你一串值，你把它放進一筆 **TXT 記錄**，CA 查 DNS 確認 → 證明你控制這個網域。

- TXT 記錄名稱 = 要簽的網域**前面加 `_acme-challenge`**。
- 每次 challenge 的值都是**新的隨機 token**（續簽時會不同）。
- 不需要伺服器對外、不需要開 port，只要能改 DNS。

| 要簽的網域 | TXT 記錄放在 |
|---|---|
| `pct.works` | `_acme-challenge.pct.works` |
| `www.pct.works` | `_acme-challenge.www.pct.works` |
| `*.pct.works` | `_acme-challenge.pct.works` |

> **權威來源**
> - RFC 8555 (ACME) §8.4 DNS Challenge：https://datatracker.ietf.org/doc/html/rfc8555#section-8.4
> - Let's Encrypt — Challenge Types：https://letsencrypt.org/docs/challenge-types/

---

## 2. 同一個名稱可有多筆 TXT

簽 `-d "*.pct.works" -d "pct.works"` 時，兩者的 challenge 名稱**都是** `_acme-challenge.pct.works`。
DNS 允許同一名稱下有**多筆 TXT 記錄**，兩個值都加上去即可。

> **權威來源**
> - RFC 1035 §3.3.14（TXT RR 可重複）：https://datatracker.ietf.org/doc/html/rfc1035#section-3.3.14

---

## 3. DNS 名稱長度上限

| 限制 | 數值 |
|---|---|
| 單一 label（每段）長度 | ≤ 63 字元 |
| 完整網域名總長 | ≤ 253 字元 |
| label 數量（段數） | 最多 127 |

非 wildcard 名稱「幾段都行」，只要不超過上述上限。例如 `a.b.c.d.pct.works` 合法。

> **權威來源**
> - RFC 1035 §2.3.4（長度限制）：https://datatracker.ietf.org/doc/html/rfc1035#section-2.3.4

---

## 4. Wildcard（`*`）規則 — 嚴格

| 寫法 | 合法? | 說明 |
|---|---|---|
| `*.pct.works` | ✅ | `*` 在最左、只比對一層。配 `www.pct.works`，不配 `a.b.pct.works` |
| `*.sub.pct.works` | ✅ | `*` 仍在最左，基底可多層 |
| `a.*.pct.works` | ❌ | `*` 不在最左 → 拒絕 |
| `*.*.pct.works` | ❌ | 多個 `*` → 不允許 |

規則：
1. `*` **只能在最左邊那一段，且只能有一個**。
2. `*` **只吃一層**：`*.pct.works` 不涵蓋 `a.b.pct.works`。
3. Wildcard 憑證**只能用 DNS-01** 簽（HTTP-01 不行）。
4. Wildcard **不含裸網域**：`*.pct.works` 不含 `pct.works`，要另外用 `-d pct.works` 一起簽。

> **權威來源**
> - CA/Browser Forum Baseline Requirements（Wildcard Domain Name 定義，§1.6.1 / Wildcard 章節）：
>   https://cabforum.org/working-groups/server/baseline-requirements/documents/
> - RFC 6125 §6.4.3（wildcard 只比對最左一層）：https://datatracker.ietf.org/doc/html/rfc6125#section-6.4.3
> - Let's Encrypt — Challenge Types（wildcard 需 DNS-01）：https://letsencrypt.org/docs/challenge-types/

---

## 5. 網域寫在憑證的哪裡？SAN，不是 CN

- 所有網域寫進 **Subject Alternative Name (SAN)** 擴充，型別 `dNSName`。
- **CN (Common Name) 已廢棄**做網域比對；現代瀏覽器只看 SAN。Let's Encrypt 逐步完全不放 CN。

```bash
# 檢視憑證的 SAN
sudo openssl x509 -in /etc/letsencrypt/live/pct.works/fullchain.pem \
  -noout -ext subjectAltName
```

> **權威來源**
> - RFC 5280 §4.2.1.6（Subject Alternative Name）：https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.6
> - CA/Browser Forum BR（憑證內容須含 SAN）：https://cabforum.org/working-groups/server/baseline-requirements/documents/

---

## 6. 在 GoDaddy 加 TXT 的填法

| 欄位 | 填什麼 |
|---|---|
| Type | `TXT` |
| Name / Host | `_acme-challenge`（簽 www 則填 `_acme-challenge.www`，GoDaddy 自動補 `.pct.works`） |
| Value | certbot 給的那串字串 |
| TTL | 選最短（600 秒 / 1 小時） |

驗證是否生效（按 certbot 的 Enter 前先確認）：
```bash
dig +short TXT _acme-challenge.pct.works @8.8.8.8
```
