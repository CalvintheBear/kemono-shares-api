# Crypto模块修复总结

## 问题描述

在Cloudflare Pages Functions部署时遇到以下错误：

```
✘ [ERROR] Could not resolve "crypto"
api/upload-image.ts:5:25:
  5 │   const crypto = require('crypto');
      ╵                          ~~~~~~~~

The package "crypto" wasn't found on the file system but is built into node. 
Are you trying to bundle for node? You can use "platform: 'node'" to do that, 
which will remove this error.
```

## 问题原因

Cloudflare Pages Functions运行在V8隔离环境中，不支持Node.js的内置模块如`crypto`。需要使用Web Crypto API或更新导入方式。

## 修复方案

### 1. 使用Web Crypto API替代Node.js crypto模块

**文件**: `functions/api/upload-image.ts`

#### 修复前：
```typescript
const crypto = require('crypto');
const payloadHash = crypto.createHash('sha256').update(Buffer.from(data)).digest('hex');
```

#### 修复后：
```typescript
// 使用Web Crypto API进行哈希计算
async function sha256Hash(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 使用Web Crypto API进行HMAC计算
async function hmacSha256(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(key);
  const dataBuffer = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### 2. 更新所有相关函数为异步

由于Web Crypto API是异步的，需要将所有使用crypto的函数更新为async/await：

```typescript
// 生成AWS S3兼容的签名
async function generateS3Signature(stringToSign: string, secretKey: string): Promise<string> {
  return await hmacSha256(secretKey, stringToSign);
}

// 在uploadToMainBucket函数中
const payloadHash = await sha256Hash(data);
const canonicalRequestHash = await sha256Hash(new TextEncoder().encode(canonicalRequest));
const dateKey = await hmacSha256(`AWS4${env.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`, dateStamp);
// ... 其他HMAC计算
```

## 技术细节

### Web Crypto API vs Node.js crypto

| 特性 | Node.js crypto | Web Crypto API |
|------|----------------|----------------|
| 环境支持 | Node.js环境 | 浏览器和Cloudflare Workers |
| 同步/异步 | 同步 | 异步 |
| 导入方式 | require('crypto') | 全局crypto对象 |
| 兼容性 | 需要Node.js环境 | 标准Web API |

### 修复的函数

1. **sha256Hash**: 计算SHA-256哈希值
2. **hmacSha256**: 计算HMAC-SHA256签名
3. **generateS3Signature**: 生成AWS S3兼容签名
4. **uploadToMainBucket**: R2上传主函数

## 预期效果

修复后，Cloudflare Pages Functions应该能够：

1. ✅ 成功构建和部署
2. ✅ 正常进行R2上传操作
3. ✅ 生成正确的AWS S3兼容签名
4. ✅ 避免crypto模块导入错误

## 注意事项

1. **异步处理**: 所有crypto操作现在都是异步的，需要正确处理Promise
2. **性能**: Web Crypto API可能比Node.js crypto稍慢，但在Cloudflare环境中是唯一选择
3. **兼容性**: Web Crypto API是现代标准，在Cloudflare Workers中完全支持

## 测试建议

1. 重新部署到Cloudflare Pages
2. 测试图片上传功能
3. 验证R2上传是否成功
4. 检查签名是否正确生成

## 相关文档

- [Web Crypto API MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Cloudflare Workers Crypto API](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
- [AWS S3签名版本4](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html) 