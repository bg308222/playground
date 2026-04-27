# Session 00011-2026-04-27

## 使用者判斷

Gap down 開盤。
- Bar 1–8：很弱但勉強維持 gap trend
- Bar 9–10–11：三根明確陽線，猶豫是否要轉 AIL
- Bar 12：DT 且在 EMA 附近
- Bar 13：signal 空

主要疑問：9–10–11 是強陽，Brooks 會怎麼看待？

## AI 判斷

**原始場景（Bar 12 = DT）**

用 AI Flip 標準逐條檢驗 9–10–11：
1. 棒身有實體、收近高點 ✅
2. 反向棒 ≥ 原始趨勢棒 — 1–8 弱棒，9–11 強棒，可能滿足
3. 每次反彈有更高的高點 ❌ — Bar 12 形成 DT，第二高點 ≤ 第一高點

第三條否決 AI 翻轉。AI 維持 AIS，9–11 是 pullback，DT at Bar 12 + EMA 是結構壓力，Bar 13 空是正確進場。

強 pullback 不改變方向，只是給你更高的做空入場點。

**假設場景（Bar 12 = 強陽）**

三條全過：AI 從 AIS 翻到 AIL，Opening Reversal 確認。
接下來應等 pullback + signal bar 做多，而非追四根強陽之後的位置。

## 分歧點

無明顯分歧（使用者原始判斷 Bar 13 空是正確的）。

猶豫來自「強陽 = AI 翻轉」的直覺，但 Brooks 框架的分界線是結構突破，不是反向棒大小。

## 延伸討論

**假設場景引出 tree 漏洞**：
tree.md 3b 只覆蓋「在反轉起點抓結構（DT/DB/failed push）」，未覆蓋「Opening Reversal 已確認且跑出一段後，pullback 如何交易」。
推導方向：AI 翻到 AIL 後，pullback 邏輯等同 3a 鏡像，但無 Brooks 原文支撐。
→ 新增 GA-004，暫不修樹。

**術語修正**：
- 錯誤：AIS 翻轉
- 正確：AI 翻轉（AI = Always-In 概念；AIS = Always-In Short；AIL = Always-In Long）
- 已更新 concept.md

## 結論

原始場景：無分歧，Bar 13 空正確。
假設場景：tree 有漏洞（3b 未覆蓋反轉確認後的 pullback），進入 GA-004 待解。
