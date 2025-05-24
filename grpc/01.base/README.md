# gRPC 簡單 API 範例

這是一個使用 TypeScript、Node.js 和 gRPC 建立的簡單問候服務範例。

## 專案結構

```
├── proto/
│   └── greeting.proto      # gRPC 服務定義
├── types/
│   ├── greeting.ts         # 服務型別定義
│   └── grpc.ts            # gRPC 相關型別
├── server/
│   ├── index.ts           # gRPC 伺服器實作 (TypeScript)
│   └── index.js           # gRPC 伺服器實作 (JavaScript)
├── client/
│   ├── index.ts           # gRPC 客戶端實作 (TypeScript)
│   └── index.js           # gRPC 客戶端實作 (JavaScript)
└── package.json
```

## 功能特色

- **完整 TypeScript 支援**：包含型別定義和型別安全
- **簡單問候**：發送名字，收到問候訊息
- **串流問候**：發送名字，收到 5 次連續的問候訊息
- **雙版本支援**：同時提供 TypeScript 和 JavaScript 版本

## 安裝依賴

```bash
bun install
```

## 使用方法

### TypeScript 版本（推薦）

1. 啟動伺服器：
```bash
bun run server
```

2. 在另一個終端執行客戶端：
```bash
bun run client
```

### JavaScript 版本

1. 啟動伺服器：
```bash
bun run server:js
```

2. 在另一個終端執行客戶端：
```bash
bun run client:js
```

## API 說明

### SayHello
- **類型**：一元 RPC
- **輸入**：`HelloRequest { name: string }`
- **輸出**：`HelloResponse { message: string, timestamp: int64 }`

### SayHelloStream
- **類型**：伺服器串流 RPC
- **輸入**：`HelloRequest { name: string }`
- **輸出**：串流 `HelloResponse { message: string, timestamp: int64 }`

## 範例輸出

### 簡單問候
```
回應：你好，小明！歡迎使用 gRPC 服務！
時間戳：2024/5/24 下午4:45:00
```

### 串流問候
```
串流回應：你好，小華！這是第 1 次問候
時間戳：2024/5/24 下午4:45:01

串流回應：你好，小華！這是第 2 次問候
時間戳：2024/5/24 下午4:45:02

...（共 5 次）

串流結束
```

## 技術細節

- **TypeScript 支援**：完整的型別定義和型別安全
- **gRPC 實作**：使用 `@grpc/grpc-js` 作為 gRPC 實作
- **Proto 載入**：使用 `@grpc/proto-loader` 動態載入 proto 檔案
- **模組系統**：支援 ES6 模組
- **執行環境**：使用 Bun 作為執行環境，原生支援 TypeScript
- **型別定義**：
  - `types/greeting.ts`：服務介面和訊息型別
  - `types/grpc.ts`：gRPC 相關型別定義
- **雙版本支援**：同時維護 TypeScript 和 JavaScript 版本

## TypeScript 特色

- **型別安全**：編譯時期型別檢查
- **自動完成**：IDE 智慧提示
- **介面定義**：清楚的 API 契約
- **錯誤預防**：減少執行時期錯誤
