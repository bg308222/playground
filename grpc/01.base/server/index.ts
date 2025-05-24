import grpc, { ServerUnaryCall, ServerWritableStream, sendUnaryData } from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import type { HelloRequest, HelloResponse } from '../types/greeting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入 proto 檔案
const PROTO_PATH = path.join(__dirname, '../proto/greeting.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const greetingProto = grpc.loadPackageDefinition(packageDefinition).greeting as any;

// 實作服務方法
const greetingService = {
  // 簡單問候
  sayHello: (call: ServerUnaryCall<HelloRequest, HelloResponse>, callback: sendUnaryData<HelloResponse>) => {
    const { name }: HelloRequest = call.request;
    const response: HelloResponse = {
      message: `你好，${name}！歡迎使用 gRPC 服務！`,
      timestamp: Date.now(),
    };

    console.log(`收到問候請求：${name}`);
    callback(null, response);
  },

  // 串流問候
  sayHelloStream: (call: ServerWritableStream<HelloRequest, HelloResponse>) => {
    const { name }: HelloRequest = call.request;
    let count: number = 0;

    console.log(`收到串流問候請求：${name}`);

    // 每秒發送一次問候
    const interval = setInterval(() => {
      count++;
      const response: HelloResponse = {
        message: `你好，${name}！這是第 ${count} 次問候`,
        timestamp: Date.now(),
      };

      call.write(response);

      // 發送 5 次後結束
      if (count >= 5) {
        clearInterval(interval);
        call.end();
      }
    }, 1000);

    // 處理客戶端取消請求
    call.on('cancelled', () => {
      console.log('客戶端取消了串流請求');
      clearInterval(interval);
    });
  },
};

// 建立並啟動 server
function startServer(): void {
  const server = new grpc.Server();

  // 新增服務
  server.addService(greetingProto.GreetingService.service, greetingService);

  // 綁定埠口
  const port = '0.0.0.0:50051';
  server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (err: Error | null, boundPort: number) => {
    if (err) {
      console.error('伺服器啟動失敗：', err);
      return;
    }

    console.log(`gRPC 伺服器已啟動，監聽埠口：${boundPort}`);
  });
}

// 優雅關閉處理
process.on('SIGINT', () => {
  console.log('\n正在關閉 gRPC 伺服器...');
  process.exit(0);
});

// 啟動伺服器
startServer();