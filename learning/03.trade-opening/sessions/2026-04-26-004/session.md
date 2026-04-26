# Session 2026-04-26-004

## 使用者判斷

- Gap down reversal 到 EMA，無有效結構
- Bar 11 進入 BOM
- Bar 18 DT、Bar 20 DB、Bar 23 三推 wedge top，問哪些該做

## AI 判斷

**市場分類：** Gap down → Opening Reversal 無結構 → Bar 11 進入 BOM（Opening Range）

**STEP 3c 框架下逐一評估：**

| Setup | 結論 | 理由 |
|---|---|---|
| Bar 18 DT | ✅ 做 | Range top，signal bar → STEP 4，與 gap 方向同向 |
| Bar 20 DB | ✅ 做 | Range bottom，signal bar → STEP 4，BOM 允許兩側 |
| Bar 23 Wedge Top | ✅ 做 | Range top，三推耗竭，最強結構 |

**優先序：** Bar 23 > Bar 18 > Bar 20

**Brooks 視角：**
- Trading range 兩側都做，不因 gap 方向完全放棄多側
- 三推 wedge top 是三個裡品質最高的
- DB long 目標 EMA，不追打到 range top

## 分歧點

**AI 初始判斷錯誤：** 第一輪回應對 Bar 20 DB 給出「❌ 跳過」，理由是「Always-In 偏空，逆向做多」。

使用者質疑：tree.md STEP 3c 並無「逆 Always-In 不做邊界反轉」這條規則。

**分歧原因：**
- STEP 3c 明文列出「DB at bottom / DT at top」均為有效觸發條件，並列無優先序
- BOM 定義本身就是 Always-In 不明確，AI 說「Always-In 偏空」與 BOM 定義矛盾
- Brooks 框架在 TR 中明確允許兩側邊界交易

## 結論

**執行失誤（AI 判斷失誤）**

AI 在 STEP 3c 加入了 tree 裡不存在的過濾條件（逆 Always-In 不做邊界反轉），屬於超出規則範圍的過度限制。使用者的質疑有效，Brooks 框架支持 Bar 20 DB 的做法。

Tree 本身無漏洞，不需修改。
