# 我的 SAML 理解模型

**Client（SP）**
- 有一個自己的 **id**（entityID）。在 server 設定成 **aud**，這樣 callback 回來時可以驗 id 是否一致。
- 有一個 **ACS endpoint**：會被帶進 redirect 的 request 中，也會到 server 註冊。
  request 裡的 ACS 和註冊的一致，server 才放行。

**Server（IdP）**
- 確認 ACS 沒問題後，讓使用者登入。
- 成功後組成 response，callback 回 ACS。
- response 裡的 **aud = server 自己設定的值（原樣蓋進去）**。

**Client（SP）在 ACS**
- 驗簽名有效（地基）、XML 資料合法、aud 一致 → 取出 username，結束。

---

微修：
- aud 一致是**必驗**（不一致就拒），不是選配。
- aud 來源是 **IdP 自己設定的值**蓋進去，不是從 request 搬來的。
- 「XML 資料合法」= `Status=Success` + 時間窗 `NotBefore/NotOnOrAfter` +（SP-initiated 時）`InResponseTo` 對得上。
