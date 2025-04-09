#!/usr/bin/env bun
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// 定義午餐數據的類型
interface LunchData {
  [restaurant: string]: string[];
}

class LunchServer {
  private server: Server;
  private lunchFilePath: string;

  constructor() {
    this.server = new Server(
      {
        name: 'lunch-history-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // 設置午餐數據文件路徑（相對於當前工作目錄）
    this.lunchFilePath = './lunch.json';

    this.setupToolHandlers();

    // 錯誤處理
    this.server.onerror = (error: Error) => console.error('[MCP Error]', error);
    Bun.serve({
      fetch() { return new Response('MCP Server Running'); },
      error() { return new Response('Error'); },
      port: 0, // 不實際監聽任何端口
    });
  }

  // 讀取午餐數據
  private async readLunchData(): Promise<LunchData> {
    try {
      return await Bun.file(this.lunchFilePath).json() as LunchData;
    } catch (error) {
      console.error('Error reading lunch data:', error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to read lunch data: ${error}`
      );
    }
  }

  // 寫入午餐數據
  private async writeLunchData(data: LunchData): Promise<void> {
    try {
      await Bun.write(this.lunchFilePath, JSON.stringify(data, null, 4));
    } catch (error) {
      console.error('Error writing lunch data:', error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to write lunch data: ${error}`
      );
    }
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_restaurant_history',
          description: '給定一個餐廳，列出歷史點餐狀況',
          inputSchema: {
            type: 'object',
            properties: {
              restaurant: {
                type: 'string',
                description: '餐廳名稱',
              },
            },
            required: ['restaurant'],
          },
        },
        {
          name: 'add_restaurant_order',
          description: '給定餐廳 + 餐點，寫回檔案中',
          inputSchema: {
            type: 'object',
            properties: {
              restaurant: {
                type: 'string',
                description: '餐廳名稱',
              },
              order: {
                type: 'string',
                description: '餐點內容',
              },
            },
            required: ['restaurant', 'order'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      switch (request.params.name) {
        case 'get_restaurant_history': {
          const { restaurant } = request.params.arguments as { restaurant: string };

          if (!restaurant) {
            throw new McpError(
              ErrorCode.InvalidParams,
              '餐廳名稱不能為空'
            );
          }

          const lunchData = await this.readLunchData();

          if (!lunchData[restaurant]) {
            return {
              content: [
                {
                  type: 'text',
                  text: `找不到餐廳 "${restaurant}" 的點餐記錄`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: 'text',
                text: `餐廳 "${restaurant}" 的點餐記錄：\n${lunchData[restaurant].map((order: string, index: number) => `${index + 1}. ${order}`).join('\n')}`,
              },
            ],
          };
        }

        case 'add_restaurant_order': {
          const { restaurant, order } = request.params.arguments as { restaurant: string; order: string };

          if (!restaurant || !order) {
            throw new McpError(
              ErrorCode.InvalidParams,
              '餐廳名稱和餐點內容不能為空'
            );
          }

          const lunchData = await this.readLunchData();

          // 如果餐廳不存在，創建一個新的數組
          if (!lunchData[restaurant]) {
            lunchData[restaurant] = [];
          }

          // 添加新的餐點
          lunchData[restaurant].push(order);

          // 寫回文件
          await this.writeLunchData(lunchData);

          return {
            content: [
              {
                type: 'text',
                text: `成功添加餐點 "${order}" 到餐廳 "${restaurant}"`,
              },
            ],
          };
        }

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `未知工具: ${request.params.name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Lunch MCP server running on stdio');
  }
}

const server = new LunchServer();
server.run().catch(console.error);