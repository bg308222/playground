# Session 00019-2026-04-27

## 使用者判斷

- Gap up，no following 並開始重疊 → Opening Range
- Bar 8 DT，Bar 9 signal bar，Bar 10 做空（不確定該不該做）
- Bar 13 突破且是 signal，可準備空，但碰到 EMA 不確定該不該做

## AI 判斷

**STEP 1**：Bar 2–22 可見，全部 ≤ 24 根 → 繼續

**STEP 2**：Gap Up。觀察 Bar 2–6 棒型：多數為紅棒，AI 將整體下行視覺斜率判讀為「反向推進」→ 誤判為 Opening Reversal。

**STEP 3b**（誤）：Always-In 偏空，約 Bar 6–8 翻轉，尋找做空 Signal Bar。

**STEP 4**（誤）：Signal Bar 約 Bar 8 或 Bar 10，Bar 11 開盤做空，停損 Bar 10 高點上方。

## 分歧點

**分歧 1（主要）：市場分類**

- AI：Opening Reversal（誤）
- 使用者：Opening Range（正確）

根因：tree.md 區分 Opening Reversal 與 Opening Range 的標準是棒型結構：
- Opening Reversal：需有「反向推進」——反向大棒、DT/DB、失敗推進
- Opening Range：重疊棒、無方向

AI 把視覺上整體偏低的走勢斜率誤判為「反向推進」，但實際上 Bar 2–6 是小實體重疊棒，應分類為 Opening Range。

Brooks 依據：判斷分類的標準是單根棒的棒型控制權（誰在控制每根棒），不是整體價位走勢的方向。

**分歧 2：Bar 8/9/10 setup**

無分歧。在 Opening Range 框架下，DT at range top → Signal Bar → 進場，邏輯正確。使用者猶豫點應聚焦 Bar 9 Signal Bar 三條件是否成立（實體、收近低點、結構位置），三點全過則應做空。

**分歧 3：Bar 13 + EMA**

無實質分歧，但討論了 EMA 角色。使用者的猶豫方向正確，但解法是先確認 Always-In：
- 若 AIS 已成立：EMA 從支撐翻為壓力（concept.md），Bar 13 在 EMA 附近破低是 AIS 確認，做空有效
- 若 AI 仍不明確：EMA 提供支撐的風險存在，等待更清晰結構

## 結論

**執行失誤**（AI 方）

AI 在 STEP 2 分類時以視覺走勢斜率取代棒型結構判斷，將重疊棒誤判為反向推進，導致市場分類錯誤（Opening Reversal vs Opening Range）。

防止規則：分類時必須逐棒檢查早期棒的棒型（實體大小、重疊程度），不得以整體斜率作為判斷依據。

使用者的兩個 setup（Bar 8/9/10 與 Bar 13）邏輯均有依據，Bar 13 的 EMA 猶豫可透過確認 Always-In 狀態解決。
