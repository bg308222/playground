# Session 2026-04-26-001

## 使用者判斷

- Gap down
- Bar 2–5：Opening Reversal，Always-In up，但無結構 → 不進場
- Bar 6 之後：不會看，請 AI 教學

## AI 判斷

**STEP 1**：圖中最後一根為 Bar 26，主要進場機會集中在 Bar 12 之前，在 24 根窗口內。

**STEP 2**：Gap down。Bar 2–3 多頭非常強 = 無 bearish follow-through → **Opening Reversal**。

**STEP 3b**：Always-In 已從 down 翻 up（Bar 2–3 強多）。結構？Bar 4 為中性棒（上引線 25%、實體 50%、下引線 25%），未收近高點，**不是 signal bar**，無結構 → 等待，不進場。

**Bar 5–6**：空頭力道也很強 → Always-In 第二次翻轉。多空雙方力道相當，沒有一方壓倒對方 → **Always-In 不明確，進入 Breakout Mode**。

**Bar 8–10**：市場繼續下跌至最低點，形成底部結構（Double Bottom 或 Failed Push Lower）。Always-In 翻回 up，結構成立 → Opening Reversal long 機會。Signal bar 在 Bar 10 或 Bar 12（綠色實體、收近高點、位於底部結構）→ 下一根開盤做多，停損設 signal bar 低點。

**Bar 12–26**：強勢上漲，EMA 翻揚，Always-In 明確 up。每次回調（1–2 根紅棒靠近 EMA）+ signal bar → Trend Continuation long。

## 分歧點

**AI 初期執行失誤**：
AI 一開始說「Bar 5 always-in 翻回 down，Bar 6 是 signal bar，Bar 7 做空」。
但隨後得知 Bar 2–3 多頭非常強，這代表 Gap Trend（down）從未建立（無 bearish follow-through），Gap Trend pullback 的解讀不成立。
加上 Bar 5–6 空頭力道與 Bar 2–3 多頭力道相當，雙方勢均力敵 → 正確判斷是 **不明確（TR），不進場**，而非做空。

**使用者判斷（Bar 2–5）**：完全正確，無分歧。

## 結論

執行失誤（AI）：在不知道 Bar 2–3 棒型的情況下，過早判斷 Bar 6 是做空 signal bar。取得棒型資訊後修正為「不明確，不進場」。

Tree 無漏洞。

---

## 本次重要討論

### 1. 「明確」的操作定義

Always-In「明確」的判準：
- 可以毫不猶豫選一個方向並撐過接下來 3–4 根棒
- 連續 4–5 根同向棒、收近極端、無立即反向 → 明確
- Always-In 每 2–3 根就翻一次 → 本身即是不明確的定義

### 2. 「高度重疊」的兩個層次

| 層次 | 定義 |
|---|---|
| 棒身層次 | 相鄰兩棒棒身有交集 |
| 區間層次 | 整段 High/Low 構成有上下界的水平框，沒有有效突破 |

判斷 Always-In 是否不明確，用**區間層次**，不是棒身層次。

### 3. 新規則（已收入 GA-002）

> **Always-In 在同一段行情中翻轉第二次 → 視為 TR，進入 Breakout Mode，不進場。**
>
> 例外：第二次翻轉力道壓倒性大於第一次（非匹配而是壓制）→ 強方勝出，可判 Always-In 翻向。

### 4. Gap Trend vs Opening Reversal 判斷關鍵

Gap Trend（down）成立條件：開盤後 3–5 根出現同向（下）的強棒。
若開盤後強棒是**反方向**（如本例 Bar 2–3 強多），Gap Trend 從未建立，後續的反向動作不能稱為「pullback in Gap Trend」，只能是 Opening Reversal 或 TR。

### 5. Tree 修改：STEP 3c 補入 Boundary Reversal

**修改節點**：STEP 3c（Breakout Mode）

**原因**：本計劃目標是涵蓋 Brooks 所有早盤操作，唯一人為限制是 24 根截止。Brooks 確實交易 TR 邊界的 DB / DT，原 tree 遺漏此路徑。

**修改內容**：
- 原：只有「突破 range」和「不明確等待」兩條路
- 改後：加入「range 邊界 DB/DT + signal bar → 進場」

**不影響**：STEP 3a、3b、STEP 4 條件不變。
