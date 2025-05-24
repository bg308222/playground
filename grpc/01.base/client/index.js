import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

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

const greetingProto = grpc.loadPackageDefinition(packageDefinition).greeting;

// 建立客戶端
const client = new greetingProto.GreetingService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 測試簡單問候
function testSayHello() {
  console.log('=== 測試簡單問候 ===');

  const request = { name: '小明' };

  client.sayHello(request, (error, response) => {
    if (error) {
      console.error('錯誤：', error);
      return;
    }

    console.log('回應：', response.message);
    console.log('時間戳：', new Date(parseInt(response.timestamp)).toLocaleString());
  });
}

// 測試串流問候
function testSayHelloStream() {
  console.log('\n=== 測試串流問候 ===');

  const request = { name: '小華' };
  const call = client.sayHelloStream(request);

  call.on('data', (response) => {
    console.log('串流回應：', response.message);
    console.log('時間戳：', new Date(parseInt(response.timestamp)).toLocaleString());
  });

  call.on('end', () => {
    console.log('串流結束');
  });

  call.on('error', (error) => {
    console.error('串流錯誤：', error);
  });
}

// 等待連線並執行測試
function runTests() {
  console.log('正在連線到 gRPC 伺服器...');

  // 等待一下讓伺服器準備好
  setTimeout(() => {
    testSayHello();

    // 延遲執行串流測試
    setTimeout(() => {
      testSayHelloStream();
    }, 2000);
  }, 1000);
}

// 優雅關閉處理
process.on('SIGINT', () => {
  console.log('\n正在關閉客戶端...');
  client.close();
  process.exit(0);
});

// 執行測試
runTests();