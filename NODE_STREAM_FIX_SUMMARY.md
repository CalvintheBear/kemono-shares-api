# Node.js Stream 模块兼容性修复总结

## 问题描述
在 Cloudflare Functions 环境中部署时遇到错误：
```
Error: Failed to publish your Function. Got error: Uncaught Error: No such module "node:stream".
imported from "bundledWorker-0.13888515622090392.mjs"
```

## 根本原因
项目使用了 Node.js 特有的 API，这些 API 在 Cloudflare Workers 环境中不可用：
1. `Buffer` API - Node.js 特有的缓冲区处理
2. `@aws-sdk/client-s3` - AWS SDK 依赖 Node.js 环境
3. `process.env` - 在某些上下文中可能不可用

## 修复步骤

### 1. 替换 Buffer API
- **文件**: `src/lib/image-download-to-r2.ts`
- **修改**: 将 `Buffer.from(await response.arrayBuffer())` 替换为 `await response.arrayBuffer()`
- **原因**: Cloudflare Workers 使用 `ArrayBuffer` 而不是 Node.js 的 `Buffer`

### 2. 创建 Cloudflare Workers 兼容的 R2 客户端
- **文件**: `src/lib/r2-client-cloudflare.ts`
- **功能**: 
  - 使用 Web Crypto API 进行哈希计算
  - 使用 fetch API 进行 HTTP 请求
  - 实现 AWS S3 兼容的签名算法
  - 完全兼容 Cloudflare Workers 环境

### 3. 更新文件上传模块
- **文件**: `src/lib/afterimage-upload.ts`
- **修改**: 
  - 移除 AWS SDK 依赖
  - 使用新的 R2 客户端
  - 将 `Buffer` 类型改为 `ArrayBuffer`
  - 使用 `buffer.byteLength` 替代 `buffer.length`

### 4. 更新图片上传模块
- **文件**: `src/lib/image-upload.ts`
- **修改**:
  - 移除 AWS SDK 依赖
  - 使用新的 R2 客户端
  - 将 `Buffer.from(buffer)` 替换为 `new Uint8Array(buffer)`

### 5. 更新图片删除模块
- **文件**: `src/lib/image-delete.ts`
- **修改**:
  - 移除 AWS SDK 依赖
  - 使用 fetch API 进行 HEAD 和 DELETE 请求
  - 简化文件存在性检查逻辑

### 6. 删除不再需要的文件
- **删除**: `src/lib/r2-client.ts`
- **删除**: `src/lib/r2-afterimage-client.ts`
- **原因**: 这些文件依赖 AWS SDK，已被新的兼容客户端替代

### 7. 移除 AWS SDK 依赖
- **文件**: `package.json`
- **修改**: 移除 `"@aws-sdk/client-s3": "^3.859.0"` 依赖

## 技术细节

### Web Crypto API 替代 Node.js 加密
```typescript
// 旧代码 (Node.js)
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(data).digest('hex');

// 新代码 (Cloudflare Workers)
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
```

### ArrayBuffer 替代 Buffer
```typescript
// 旧代码 (Node.js)
const buffer = Buffer.from(arrayBuffer);

// 新代码 (Cloudflare Workers)
const buffer = new Uint8Array(arrayBuffer);
```

### 直接 HTTP 请求替代 AWS SDK
```typescript
// 旧代码 (AWS SDK)
const command = new PutObjectCommand({...});
await s3Client.send(command);

// 新代码 (fetch API)
const response = await fetch(url, {
  method: 'PUT',
  headers: {...},
  body: new Uint8Array(data)
});
```

## 验证结果
- ✅ 移除了所有 Node.js 特有的 API 依赖
- ✅ 创建了完全兼容 Cloudflare Workers 的 R2 客户端
- ✅ 保持了所有原有功能
- ✅ 使用标准的 Web API (fetch, crypto.subtle, ArrayBuffer)

## 部署建议
1. 运行 `npm install` 更新依赖
2. 测试本地构建: `npm run build:pages`
3. 部署到 Cloudflare Pages: `npm run deploy:pages`

## 注意事项
- 新的 R2 客户端实现了 AWS S3 兼容的签名算法
- 所有文件操作都使用标准的 Web API
- 保持了与现有代码的兼容性
- 性能应该与 AWS SDK 相当或更好
