# 早盤交易 MVP 計劃（v1）

## 目標
建立一個「只專注早盤」的最小可行交易系統，用來：
- 降低決策複雜度
- 提升一致性
- 避免過度交易
- 建立可重複的盤中判斷框架

---

## 時間範圍
- 僅交易：開盤後前 24 根 5K（約 2 小時）
- 超過 24 根：
  - ❌ 不開新倉
  - ✔ 已有倉位可管理
  - ✔ 僅允許 trend continuation（若非常明確）

---

## 核心概念（只用三種市場狀態）

### 1. Gap Trend（有方向）
定義：
- Gap up / down
- 開盤後 3–5 根內出現 follow-through

特徵：
- 方向明確
- K 棒有延續性
- pullback 相對淺

---

### 2. Opening Reversal（開盤反轉）
定義：
- gap 後無法延續原方向
- 出現失敗突破
- early double top / double bottom / wedge

特徵：
- 推進失敗
- 出現反向壓力
- 轉弱訊號明顯

---

### 3. Breakout Mode（盤整模式）
定義：
- 開盤後 5–10 根沒有方向
- high / low 重疊
- EMA 附近震盪

特徵：
- 方向未決定
- 假突破頻繁
- 波動收縮

---

## 交易類型（只允許三種）

---

### 1. Trend Continuation（順勢交易）

條件：
- Gap trend 成立
- 出現 pullback

進場方式：
- 使用 signal bar（你既有系統）

邏輯：
- 買回檔 / 賣反彈
- 不追高、不追低

---

### 2. Opening Reversal（反轉交易）

條件：
- Gap failure
- 明確 DT / DB + 推進失敗

進場方式：
- signal bar break reversal 結構

邏輯：
- 抓 early trend failure

---

### 3. Breakout Trade（突破交易）

條件：
- Breakout mode 成立
- range 明確被打破

進場方式：
- breakout + signal bar confirmation

邏輯：
- 等市場選方向後再進

---

## 進場規則（Signal Bar 約束）

只有在以下條件同時成立時才允許進場：

- 已完成市場分類（Gap / Reversal / Breakout）
- 出現明確 signal bar
- 有結構優勢（不是純形態）

---

## 風控規則

- 每日最多 2～4 筆交易
- 每筆固定停損（signal bar 另一側）
- 不加碼、不攤平
- 不預測，只跟隨結構

---

## 時間規則（24-bar cutoff）

### 0–24 bars（主交易區）
- 完整執行所有策略
- 可做 reversal / breakout / trend

### 24 bars 之後（限制區）
- ❌ 不開新 setup
- ✔ 只管理已有倉位
- ✔ 僅允許非常明確的 trend continuation

---

## 系統核心原則

1. 先分類市場狀態，不預測
2. 只在「結構完成 + signal bar」時進場
3. 不交易模糊區間
4. 用時間限制降低過度交易
5. 放棄部分行情換取穩定性

---

## 下一階段擴展（未啟用）

未來可加入：

- 第二段行情（post-24 bars trend system）
- EMA dynamic behavior（20EMA role refinement）
- H2 / L2 二次進場系統
- range day 專屬策略

---

## 一句話總結

這個系統的本質是：

> 用「早盤市場分類 + signal bar」取代預測
> 用「時間限制」換取決策一致性