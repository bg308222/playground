// gRPC 相關型別定義
import type { ServerUnaryCall, ServerWritableStream, sendUnaryData } from '@grpc/grpc-js';

export interface GrpcCall<T> extends ServerUnaryCall<T, any> {}

export interface GrpcStreamCall<T> extends ServerWritableStream<T, any> {}

export type GrpcCallback<T> = sendUnaryData<T>;

// 重新匯出主要型別
export type { HelloRequest, HelloResponse } from './greeting.js';