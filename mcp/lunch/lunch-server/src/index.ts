#!/usr/bin/env bun
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// 定義午餐數據的類型
interface LunchData {
  [restaurant: string]: string[];
}

// 創建 MCP 服務器
const server = new McpServer({
  name: "lunch-server",
  version: "1.0.0"
});

// 設置午餐數據文件路徑
const lunchFilePath = './lunch.json';

// 讀取午餐數據
async function readLunchData(): Promise<LunchData> {
  try {
    return await Bun.file(lunchFilePath).json() as LunchData;
  } catch (error) {
    console.error('Error reading lunch data:', error);
    throw new Error(`Failed to read lunch data: ${error}`);
  }
}

// 寫入午餐數據
async function writeLunchData(data: LunchData): Promise<void> {
  try {
    await Bun.write(lunchFilePath, JSON.stringify(data, null, 4));
  } catch (error) {
    console.error('Error writing lunch data:', error);
    throw new Error(`Failed to write lunch data: ${error}`);
  }
}

// 添加查詢餐廳歷史點餐狀況的工具
server.tool(
  "get_restaurant_history",
  { restaurant: z.string().describe('餐廳名稱') },
  async ({ restaurant }) => {
    if (!restaurant) {
      throw new Error('餐廳名稱不能為空');
    }

    const lunchData = await readLunchData();

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
          text: `餐廳 "${restaurant}" 的點餐記錄：\n${lunchData[restaurant].map((order, index) => `${index + 1}. ${order}`).join('\n')}`,
        },
      ],
    };
  }
);

// 添加新增餐點的工具
server.tool(
  "add_restaurant_order",
  {
    restaurant: z.string().describe('餐廳名稱'),
    order: z.string().describe('餐點內容')
  },
  async ({ restaurant, order }) => {
    if (!restaurant || !order) {
      throw new Error('餐廳名稱和餐點內容不能為空');
    }

    const lunchData = await readLunchData();

    // 如果餐廳不存在，創建一個新的數組
    if (!lunchData[restaurant]) {
      lunchData[restaurant] = [];
    }

    // 添加新的餐點
    lunchData[restaurant].push(order);

    // 寫回文件
    await writeLunchData(lunchData);

    return {
      content: [
        {
          type: 'text',
          text: `成功添加餐點 "${order}" 到餐廳 "${restaurant}"`,
        },
      ],
    };
  }
);

// 啟動服務器
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error('Lunch MCP server running on stdio');
}).catch(error => {
  console.error('Error starting server:', error);
});