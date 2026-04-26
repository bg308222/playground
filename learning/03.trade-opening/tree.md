# 早盤交易決策樹

---

## STEP 1｜時間檢查

```
現在是第幾根 5K？
├── > 24 根 → ❌ 不開新倉，只管理既有倉位 → STOP
└── ≤ 24 根 → 繼續 STEP 2
```

---

## STEP 2｜市場分類

```
今天有 gap 嗎？
├── 否（平開）→ Opening Range → STEP 3c
└── 是（gap up / down）
    ↓
    前 3–5 根出現 follow-through（同方向強棒，收近高/低點）？
    ├── 是 → Gap Trend → STEP 3a
    ├── 否，但有反向推進（反向棒、DT/DB、推進失敗）→ Opening Reversal → STEP 3b
    └── 否，原地整理（重疊棒、無方向）→ Opening Range → STEP 3c
```

---

## STEP 3｜Always-In 確認

> 每進入一個分類前先問：「現在多空哪邊佔優？」
> 答案只有三個：**偏多 / 偏空 / 不明確**
> 不明確時 = 跳回 Opening Range，等候

### 3a｜Gap Trend → Trend Continuation

```
Always-In 與 gap 方向一致？
├── 是 → 等 pullback 出現
│        ↓
│        出現 signal bar？→ STEP 4
└── 否（Always-In 已翻轉）→ 重新分類為 Opening Reversal → STEP 3b
```

### 3b｜Opening Reversal

```
Always-In 已從 gap 方向翻轉？
├── 是，且有結構（DT / DB / failed push）→ 等 signal bar → STEP 4
└── 否（翻轉不明確）→ 等待，不進場
```

### 3c｜Opening Range

> **BOM（Breakout Mode）**：Bar 1 高低點兩側都被突破後失敗，是 Opening Range 的高確定性形態，進場邏輯與 Opening Range 相同。

```
價格在哪裡？
├── 在 range 邊界（DB at bottom / DT at top）
│   └── 出現 signal bar？→ STEP 4
├── range 高低點被明確突破
│   └── 等 signal bar confirmation → STEP 4
└── 價格在 range 中間 → 繼續等，不進場
```

---

## STEP 4｜Signal Bar 驗證

以下三點必須同時成立：

```
1. 棒身有實體（非十字星）
2. 收盤方向與進場方向一致（做多收近高，做空收近低）
3. 有結構支撐（不是孤立形態，與分類邏輯吻合）

三點全過？
├── 是 → ✅ 進場（停損設 signal bar 另一側）
└── 否 → 不進場，等下一個機會
```

---

## 一頁速查

| 市場狀態 | Always-In | 交易類型 | 進場觸發 |
|---|---|---|---|
| Gap Trend | 與 gap 同向 | Trend Continuation | pullback + signal bar |
| Opening Reversal | 已翻轉 | Reversal | DT/DB 結構 + signal bar |
| Opening Range | 不明確 | Breakout | 突破 range + signal bar |
| Opening Range | 不明確 | Boundary Reversal | range 邊界 DB/DT + signal bar |
| 任何狀態 | 不明確 | ❌ 不交易 | — |
