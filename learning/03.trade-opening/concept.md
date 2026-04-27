# Brooks Price Action 核心概念定義

> 本文件收錄 Brooks 框架中有明確原始定義的概念，供判斷時優先參照。
> 與 `gray-areas.md` 的區別：這裡是「已有答案」的概念，不是待收斂的模糊地帶。

---

## Always-In（AI）

Brooks 的定義：市場在任何時間點都處於「偏多」或「偏空」的狀態，永遠有一個方向在佔優。

- 答案只有三個：**偏多 / 偏空 / 不明確**
- 「不明確」是合法答案，等同 Opening Range 狀態
- AI 不是靜態的，需要 bar-by-bar 動態更新

### AI 翻轉 vs Pullback 的區分

判斷關鍵不是「跌了多遠」，而是**誰在控制每一根棒**。

| 維度 | Pullback（回調） | AI Flip（趨勢翻轉） |
|---|---|---|
| 棒型 | 弱棒：小實體、影線多、互相重疊 | 強棒：大實體、收近高/低點 |
| 反彈棒 | 隨時能出一根強向棒 | 反彈棒本身就是弱棒 |
| Lower highs | 不一定 | 每次反彈都低於上一個高點 |
| 反向棒 vs 原始趨勢棒大小 | 反向棒明顯弱於原始趨勢棒 | 反向棒 ≥ 原始趨勢棒 |

Brooks 原則：**Bears are not in control of the individual bars** = 這是 pullback，不是翻轉。

### EMA 的角色

EMA（20 期）代表最近 N 根的均價，是「市場重心」，不是魔法線。

EMA 作為支撐/壓力的前提：
1. 已建立的趨勢（多根同向棒確認方向）
2. EMA 仍朝趨勢方向傾斜
3. 之前至少被「驗證過」（觸碰後被買起/壓下）

**EMA 不提供支撐的情境：**
- 早盤前幾十根，EMA 尚未被驗證
- EMA 已開始轉平或反向彎曲（代表它在追跌/追漲，而非錨定趨勢）
- AI 已從 AIL 翻至 AIS：此時 EMA 從支撐變為壓力，反彈至 EMA 是追空點，不是買點

Brooks 原則：**Market proves it to you — 你不能因為「理論上 EMA 是支撐」就假設支撐存在。**

---

## 空頭力竭的識別（Three Pushes / Climactic Bar）

在 Opening Reversal 的情境中，若要考慮逆勢做多，需先確認空頭力竭：

**Three Pushes（Wedge Bottom）**：
- 出現三段向下推進
- 每段的動能遞減（棒子變小、影線增多）
- 第三推後出現明確多頭 signal bar → 才考慮進多

**Climactic Bar**：
- 單根極大空棒（氣竭型）
- 緊接出現強多棒反包 → 才考慮進多

**重要**：到達 EMA ≠ 力竭。力竭需要有棒型結構作為依據，不能靠「價位」判斷。

---

## Wrong Context Bias（情境框架錯誤）

Brooks 描述的常見錯誤：用 A 市場狀態的框架去解讀 B 市場狀態的行情。

典型案例：
- 市場已進入 Opening Reversal，但仍用 Gap Trend 的「pullback 後做多」邏輯找進場 → 錯誤
- 市場在 Opening Range 中間，但因為「感覺快突破了」就提前進場 → 錯誤

修正方式：先確認當前市場分類，再決定允許哪些交易類型。
