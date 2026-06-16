# SAML SSO Demo (Bun + TypeScript)

一個**同時包含 SP（服務提供者）與 IdP（身分提供者）** 的本機 demo，把 SAML 2.0
SP-initiated SSO 的**每一步真實 XML、binding 編碼、簽章與驗證**都顯示在畫面上，
讓你完整體驗 SAML 怎麼運作。

沒有黑箱：AuthnRequest / Response 的 XML 都是手寫產生的，簽章與驗證用 `xml-crypto`，
你在瀏覽器上能看到流動中的每一份原始訊息。

## 跑起來

```bash
bun install          # 安裝相依套件
bun run gen-certs    # 產生 IdP 簽章用的金鑰 / 憑證（第一次才需要）
bun start            # 同時啟動 SP(:3000) 與 IdP(:4000)
```

打開 **http://localhost:3000** 開始。

示範帳號：

| 帳號 | 密碼 | 屬性 |
|---|---|---|
| `alice@example.com` | `password123` | role=admin, dept=Engineering |
| `bob@example.com` | `hunter2` | role=user, dept=Sales |

## 完整流程（畫面上會逐步看到）

```
 你的瀏覽器        SP (:3000)              IdP (:4000)
     │                │                        │
     │  點「SSO 登入」 │                        │
     │───────────────>│ ① 產生 AuthnRequest    │
     │                │   DEFLATE+base64        │
     │<───────────────│ ② 302 Redirect ─────────────────┐
     │  GET /sso?SAMLRequest=...&RelayState=...          ▼
     │─────────────────────────────────────────>│ ③ 解開請求、顯示登入頁
     │                                           │   驗證帳密
     │<──────────────────────────────────────────│ ④ 產生「簽章過」的 Response
     │  POST /acs  SAMLResponse=...(base64)       │   （HTTP-POST binding）
     │───────────────>│ ⑥ 驗章 + 檢查 Conditions │
     │                │   建立本地 session       │
     │<───────────────│   顯示使用者屬性          │
```

1. **SP 產生 `AuthnRequest`** — `GET /login`，用 **HTTP-Redirect binding**
   （raw DEFLATE → base64 → urlencode 進網址）。
2. **Redirect 到 IdP** 的 `/sso`。
3. **IdP 解開請求、登入** — 解析 `AuthnRequest`，顯示登入表單（或用既有 IdP
   session 直接 SSO 放行，免再輸入密碼）。
4. **IdP 簽章 `SAMLResponse`** — 用 IdP 私鑰對 `<Assertion>` 做 enveloped、
   exclusive-c14n、RSA-SHA256 簽章。
5. **HTTP-POST binding** 把 base64 後的 Response POST 回 SP 的 `/acs`。
6. **SP 在 ACS 驗證** — 驗簽章、`Status`、`InResponseTo`、`Audience`、時間窗，
   全部通過才建立 session 並讀出屬性。

## SAML 的關鍵觀念（這個 demo 親手示範的）

- **信任靠的是簽章，不是網路連線**：SP 與 IdP 之間不需要直接連線，訊息是透過
  「使用者的瀏覽器」傳遞的。SP 之所以相信 assertion，是因為它**用 IdP 公鑰驗證了簽章**。
- **SP 不存密碼**：身分驗證完全在 IdP，SP 只收到簽章過的屬性。
- **兩種 binding**：請求用 Redirect（GET，壓縮放網址）、回應用 POST（base64 放表單）。
- **防護機制**（demo 都有實作，可在 `/acs` 結果頁看到逐項檢查）：
  - 簽章驗證 + 防 XML signature wrapping（檢查被簽的 Reference 就是那份 assertion）
  - `InResponseTo` 必須對得上 SP 發出且尚未使用的請求（防重放 / 防偽造）
  - `Audience` 必須是本 SP
  - `NotBefore` / `NotOnOrAfter` 時間窗
- **SSO**：登入過一次後，IdP 端有 session，再次登入會直接放行（畫面上會出現
  「以 X 繼續，免再輸入密碼」）。

## 親手驗證安全性

把畫面上 `SAMLResponse` 的內容竄改任何一個字（例如改 `role`），再 POST 到
`/acs`，會看到 **「assertion signature is INVALID」** → 被拒絕。
把同一份合法 Response 重送兩次，第二次會因 `InResponseTo` 不在待處理清單而被拒。
（這兩種情境本專案已實測通過。）

## 檔案結構

| 檔案 | 角色 |
|---|---|
| `src/config.ts` | 共用設定：entityID、URL、SAML URN 常數 |
| `src/saml.ts` | 核心：建 XML、binding 編碼、`xml-crypto` 簽章 / 驗證、解析 |
| `src/idp.ts` | Identity Provider（:4000）：`/sso` `/login` `/authorize` `/metadata` |
| `src/sp.ts` | Service Provider（:3000）：`/` `/login` `/acs` `/metadata` `/logout` |
| `src/views.ts` | 透明化 UI 的 HTML 樣板 |
| `src/server.ts` | 一個指令同時啟動兩邊 |
| `certs/` | IdP 簽章用的自簽憑證 / 私鑰 |

> ⚠️ 這是教學用 demo：用記憶體存 session、自簽憑證、AuthnRequest 未簽章、
> 明文密碼帳號。正式環境請改用成熟的 SAML 函式庫（如 `@node-saml/node-saml`、
> `samlify`）並遵循完整的安全規範。
