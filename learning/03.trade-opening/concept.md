# Brooks Price Action 核心概念定義

> 本文件收錄 Brooks 框架中有明確原始定義的概念，供判斷時優先參照。
> 與 `gray-areas.md` 的區別：這裡是「已有答案」的概念，不是待收斂的模糊地帶。

---

## Always-In（AI）

Brooks 的定義：市場在任何時間點都處於「偏多」或「偏空」的狀態，永遠有一個方向在佔優。

- 答案只有三個：**偏多 / 偏空 / 不明確**
- 「不明確」是合法答案，等同 Opening Range 狀態
- AIS 不是靜態的，需要 bar-by-bar 動態更新

### AIS 翻轉 vs Pullback 的區分

判斷關鍵不是「跌了多遠」，而是**誰在控制每一根棒**。

| 維度 | Pullback（回調） | AIS Flip（趨勢翻轉） |
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
- AIS 已翻轉：此時 EMA 從支撐變為壓力，反彈至 EMA 是追空點，不是買點

Brooks 原則：**Market proves it to you — 你不能因為「理論上 EMA 是支撐」就假設支撐存在。**

---

## Signal Bar

以下三點必須同時成立：

1. **棒身有實體**（非十字星、非蜻蜓型）
2. **收盤方向與進場方向一致**（做多收近高，做空收近低）
3. **有結構支撐**（不是孤立形態，與市場分類邏輯吻合）

Brooks 對「有結構」的說明：signal bar 本身不能是唯一理由進場，它必須出現在：
- Pullback 後的趨勢延伸點
- DT / DB 的確認位置
- Wedge 的第三推後

---

## 三種市場分類

### Gap Trend

- 條件：gap up / down + 前 3–5 根出現同方向 follow-through（強棒收近高/低）
- AIS 方向：與 gap 一致
- 交易邏輯：等 pullback → signal bar → 順勢進場

### Opening Reversal

- 條件：gap 後無法延續，出現失敗推進 / DT / DB
- AIS 方向：從 gap 方向翻轉
- 交易邏輯：等反轉結構確認 + signal bar → 逆 gap 方向進場
- 注意：在 Opening Reversal 中，EMA 是壓力（對原 gap 方向而言），不是支撐

### Opening Range / Breakout Mode

- 條件：開盤後無方向，棒子重疊，EMA 附近震盪
- AIS 方向：不明確
- 交易邏輯：等 range 邊界出現 DB / DT + signal bar，或等明確突破 + signal bar

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
