// TypeScript 型別檢查範例
import type { HelloRequest, HelloResponse } from '../types/greeting.js';

// 正確的型別使用
const validRequest: HelloRequest = {
  name: "測試用戶"
};

const validResponse: HelloResponse = {
  message: "你好！",
  timestamp: Date.now()
};

// 以下會產生型別錯誤（註解掉以避免編譯錯誤）

// 錯誤：缺少必要屬性
// const invalidRequest: HelloRequest = {};

// 錯誤：型別不匹配
// const invalidRequest2: HelloRequest = {
//   name: 123  // 應該是 string
// };

// 錯誤：額外屬性
// const invalidResponse: HelloResponse = {
//   message: "你好！",
//   timestamp: Date.now(),
//   extraField: "不應該存在"
// };

console.log('型別檢查通過！');
console.log('有效請求：', validRequest);
console.log('有效回應：', validResponse);