# Session 2026-04-26-005

## 使用者判斷

> gap up, 2-4 trend following
> 後面開始一路往下，我不知道怎麼看
> 是深度 pullback 還是已經轉 AIS 了？
> 該不該在下側積極找 DB or 三推 wedge

## AI 判斷

**STEP 1｜時間**：Bar 2–30 可見，Bar 26–30 已超出 24 根窗口。

**STEP 2｜市場分類**：Gap up + Bar 2–4 有 follow-through → 初始分類 Gap Trend。

**STEP 3a｜Always-In 確認**：
- Bar 4 之後出現連續強空棒，反彈棒為弱棒
- Sequential lower highs + lower lows（Bar 6 往下可數出多段）
- EMA 從支撐轉為壓力，price 持續在 EMA 下方
- 下跌幅度超過 gap 的 50–60%，deep pullback 前提不成立
- 判斷：AIS 於 Bar 12–16 附近翻轉為 Short

→ 重新分類為 **Opening Reversal** → STEP 3b

**STEP 3b｜Opening Reversal（偏空）**：結構已確認（Bar 2–4 高點為 Failed Push），主方向為空。做空的進場窗口在 Bar 12–20 的反彈段（已過）。

## 分歧點

**STEP 3a：Deep pullback vs AIS flip 的判斷**

使用者：不確定，傾向可能是 deep pullback，考慮在 EMA 附近等多頭反轉型態。

AI：AIS 已翻轉為 Short。

**Brooks 依據（本次深度討論）：**

1. **AIS 翻轉的判斷依據是棒型控制權，不是距離**
   - Pullback：弱棒（小實體、重疊）、bears are NOT in control of the bars
   - AIS Flip：強空棒（大實體、收近低點）、反彈棒本身即弱棒、每次反彈高點低於前次

2. **EMA 支撐的前提條件**
   - EMA 作為支撐須同時滿足：已建立趨勢、EMA 仍朝趨勢方向傾斜、之前被驗證過
   - 本次早盤 EMA 尚未被驗證為支撐，且已轉平下彎（追跌均線，非錨定支撐）
   - 在 Opening Reversal 情境中，EMA 是空頭壓力線，不是多頭支撐

3. **Wrong Context Bias**
   - 使用者在 Opening Reversal 的情境中，用 Gap Trend 的「EMA 支撐 + 等多頭反轉」邏輯判斷
   - 這是框架套用錯誤，而非判斷細節的偏差

## 結論

**執行失誤（概念層面）**：非 tree 漏洞。

分歧來自對「AIS 翻轉 vs Pullback」的判斷標準不清晰，以及對「EMA 在不同市場分類中角色不同」的認識缺失。這屬於 Brooks 框架的基礎概念問題，不是 tree 的節點設計問題。

**後續行動**：
- 新增 `concept.md`，收錄 AIS 翻轉 vs Pullback 區分表、EMA 角色定義、Wrong Context Bias 說明
- `CLAUDE.md` 新增判斷優先順序：Brooks 原話 > tree.md > 主觀判斷
