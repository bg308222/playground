# Session 2026-04-26-002

## 使用者判斷
gap up 但被昨高壓著
BOM
1 10 14 三推 wedge（向下三推）
15 signal（多方）16 進場做多

## AI 判斷

### STEP 1 ｜時間
Bar 16 ≤ 24 → ✓ 繼續

### STEP 2 ｜市場分類
- Gap up：有
- 前 3–5 根 follow-through？「被昨高壓著」= 推進失敗，昨高封住上方空間
- 結論：**BOM**（使用者正確）

> AI 初判為 Opening Reversal，錯誤原因：誤以為三推是向上 rising wedge（做空邏輯），未核實 bar 15 方向就給出結論。使用者指出 bar 15 為多方 signal 後，方確認 wedge 為向下三推。

### STEP 3c ｜BOM
- 昨高 = range 頂（封住 gap up）
- 三推向下（bars 1, 10, 14）到 range 底 / EMA 附近
- 出現 signal bar → STEP 4

### STEP 4 ｜Signal Bar（Bar 15）
- 多方實體棒 ✓
- 收盤偏多（收近高點）✓
- 位於三推底部 + EMA 附近，有結構支撐 ✓
- **進場：Bar 16 開盤做多，停損設 Bar 15 低點**

## Brooks 框架補充

**做空的機會在哪裡？**
理論上在 bar 1 附近（gap up 碰昨高被壓回），這是 Brooks 的 gap reversal 做空。但 EMA 在下方過近，risk/reward 不成立 → **pass，不執行**。

**Bar 15-16 long 的性質**
做多是獨立的第二個 setup，不是空單的替代品。Brooks 邏輯：
1. 主要機會（gap reversal 空）因 EMA 太近而放棄
2. 三推向下到 EMA = pullback-to-EMA setup（Brooks 偏好的進場結構）
3. Bar 15 在 EMA 附近出現多方 signal → 可執行做多
4. 目標：range 中部或昨高，以 first profitable exit 為原則

## 分歧點

| | 使用者 | AI 最終 |
|---|---|---|
| 市場分類 | BOM | BOM（修正後一致）|
| Wedge 方向 | 向下三推 | 初判錯誤（誤為向上）→ 修正 |
| 進場方向 | 多 | 多（修正後一致）|
| Signal Bar | Bar 15 | Bar 15 ✓ |

## AI 自我審查：哪些改變是合理的

**合理的修正**：使用者指出 bar 15 為多方 signal。這是新的事實資訊，直接推翻 AI 對 wedge 方向的未申明假設。根據新事實修正是正確行為。

**過度退讓**：使用者提出「EMA 太近，空不了」後，AI 立即轉為「long 才是 Brooks 真正的主要交易」。這是迎合，不是推導。正確答案是：gap reversal 做空仍是 Brooks 的主要交易類型；EMA 太近代表 pass，而非改去做多。做多是獨立的第二個機會。

## 結論

**無分歧**（AI 初判有誤，討論後修正）

使用者的完整判斷正確：BOM、向下三推 wedge、bar 15 多方 signal、bar 16 做多。

AI 的初始錯誤屬於**執行失誤**：在未確認 signal bar 方向的情況下，對 wedge 方向做了未申明的假設，導致整個 STEP 4 結論錯誤。
