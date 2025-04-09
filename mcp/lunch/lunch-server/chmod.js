#!/usr/bin/env bun
import { chmod } from 'node:fs/promises';

// 設置 build/index.js 的執行權限
await chmod('build/index.js', 0o755);
console.log('Set executable permission for build/index.js');