// gRPC 服務型別定義

export interface HelloRequest {
  name: string;
}

export interface HelloResponse {
  message: string;
  timestamp: number;
}

export interface GreetingServiceHandlers {
  [key: string]: any;
  sayHello: (
    call: { request: HelloRequest },
    callback: (error: Error | null, response?: HelloResponse) => void
  ) => void;

  sayHelloStream: (
    call: {
      request: HelloRequest;
      write: (response: HelloResponse) => void;
      end: () => void;
      on: (event: string, callback: () => void) => void;
    }
  ) => void;
}

export interface GreetingServiceClient {
  sayHello: (
    request: HelloRequest,
    callback: (error: Error | null, response?: HelloResponse) => void
  ) => void;

  sayHelloStream: (request: HelloRequest) => {
    on: (event: 'data' | 'end' | 'error', callback: (data?: any) => void) => void;
  };

  close: () => void;
}