# Session 00017-2026-04-27

## 使用者判斷

- 市場分類：BOM
- Bar 10 突破上緣，Bar 11 做多
- Bar 16 翻回空
- Bar 17–23 一路弱往上，Bar 24 signal，Bar 25 做空

## AI 判斷

- 市場分類：Opening Range（未識別出 BOM 的雙側測試條件）
- 未允許 Bar 11 做多（理由：前 session EMA 偏空，逆勢）
- Bar 16 為 signal bar，Bar 17 做空
- Bar 25 進場有效（Bar 24 為 signal bar，Bar 25 開盤為機械執行）

## 分歧點

### 分歧 1｜市場分類

- 使用者：BOM（雙側均被突破且失敗）
- AI：Opening Range（未識別 BOM 條件）
- 根因：AI 沒有明確判斷 Bars 2–8 是否構成雙側突破失敗，直接用較寬鬆的「Opening Range」帶過

### 分歧 2｜Bar 11 做多

- 使用者：進場
- AI：排除（理由為逆勢、EMA 偏空背景）
- 根因：AI 在 STEP 3c 完成後插入了一個 tree.md 和 Brooks 都不支持的主觀 filter
- Brooks 觀點：BOM 上緣突破為高確定性，逆勢不等於不進，應以 scalp 心態管理
- **AI 執行失誤，已記入 retraction-log**

### 分歧 3｜做空時機

- 使用者：Bar 24 signal → Bar 25 進場（second entry）
- AI：Bar 16 signal → Bar 17 進場（first entry，failed breakout）
- Brooks 觀點：兩者皆有效
  - Bar 17：Failed Breakout 是 Brooks 最高確定性 setup 之一，第一進場更積極
  - Bar 25：Second entry，bars 17–23 弱多失敗進一步確認，更保守但也有效
- **無分歧**（框架允許兩種選擇，不同風格偏好）

## 結論

**分歧 1**：執行失誤（AI 未走完 BOM 識別條件）
**分歧 2**：執行失誤（AI 加了框架外的主觀 filter，已 retract）
**分歧 3**：無分歧（Brooks 允許 first entry 和 second entry，差異在風格）

## 待追蹤議題

**tree.md 潛在漏洞**：3c 路徑中「DT at top / failed breakout → 立即反轉做空」的對應節點描述不夠清晰，導致 AI 本次無法清楚將 Bar 16 signal 對應到 3c 的哪一個子路徑。
目前暫不修樹，等下次同類情境出現後對比再決定。
