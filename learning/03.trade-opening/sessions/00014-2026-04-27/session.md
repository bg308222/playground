# Session 00014-2026-04-27

## 使用者判斷

- 市場分類：gap down reversal，但不強、重疊很高
- 結構：Bar 7、Bar 10 形成 DT
- Signal bar：Bar 13
- 進場：Bar 14 做空

## AI 判斷

**STEP 1**：Bar 14 ≤ 24 → ✓

**STEP 2 市場分類**：Gap Down → 前 3–5 根無空頭 follow-through，有反向推進但重疊高 → 判定 **Opening Range**（非 Opening Reversal）。依據：tree.md「重疊棒、無方向 → Opening Range」，高重疊代表多空無人控制，方向不等於控制權。

**STEP 3 Always-In**：偏空（DT 確認、EMA 下彎）

**STEP 4 Signal Bar（Bar 13）**：
1. 棒身有實體 ✓（假設）
2. 收盤偏空 ✓（假設）
3. 結構：DT at range top + EMA 下彎壓力 ✓

→ ✅ Bar 14 開盤做空，停損設 Bar 13 高點

## 分歧點

**STEP 2 分類**：
- 使用者：Opening Reversal
- AI：Opening Range

原因：使用者已知「重疊很高」，但仍歸 Opening Reversal。依 tree.md 與 Brooks 框架，高重疊 = 無方向控制 = Opening Range，方向只是微幅偏多，不代表多方接管。

進場方向與 signal bar 判斷無分歧，分類不同但交易結論相同。

## 概念釐清（本次新增）

**Q1：上行但重疊高 → Range 還是 Reversal？**
Opening Range。判斷依據是「誰控制每根棒」，不是方向。上行重疊棒 = 多方推不動 = 原地整理。

**Q2：3b「有結構（DT/DB）」指的是哪個？**
指 DB（reversal 的起點），對應做多（跟 reversal 方向）。3b 的交易是做多，不是在 reversal top 做空。
使用者 Bar 14 做空的路徑是 3c（DT at range top）或 Gap Trend 延伸（reversal 失敗 → Always-In 翻回偏空），不是 3b。

## 結論

執行失誤（分類判斷）——「重疊很高」本身已符合 Opening Range 條件，使用 Reversal 框架欠缺充分依據。交易方向正確，但需釐清走的是哪條 tree 路徑，以確保後續 context 解讀一致。
