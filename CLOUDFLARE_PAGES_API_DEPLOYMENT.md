# Cloudflare Pages API 部署指南

## 问题分析

从构建日志可以看出，Cloudflare Pages 使用了 `npm run build:pages` 命令，这个命令是为静态导出设计的，但我们的修改移除了静态导出模式以支持API路由，所以没有生成 `out` 目录，导致构建失败。

## 解决方案

### 1. 新的构建脚本

创建了 `scripts/build-for-cloudflare-pages.js` 脚本，专门用于支持API路由的Cloudflare Pages构建：

```javascript
// 设置环境变量 - 支持API路由
process.env.CF_PAGES = 'true';
process.env.STATIC_EXPORT = 'false'; // 禁用静态导出以支持API
process.env.NODE_ENV = 'production';

// 执行Next.js构建
execSync('next build', { 
  stdio: 'inherit',
  env: { ...process.env }
});
```

### 2. 新的配置文件

创建了 `wrangler.pages.api.toml` 配置文件：

```toml
[build]
command = "npm run build:pages:api"
output_directory = ".next"

[build.environment]
NODE_VERSION = "20"
NPM_VERSION = "10"

# 环境变量配置
[vars]
NODE_ENV = "production"
CF_PAGES = "true"
STATIC_EXPORT = "false"
```

### 3. 新的构建命令

添加了新的构建命令：

```json
{
  "scripts": {
    "build:pages:api": "node scripts/build-for-cloudflare-pages.js",
    "deploy:pages:api": "wrangler pages deploy .next --config wrangler.pages.api.toml"
  }
}
```

## 部署步骤

### 1. 本地测试构建

```bash
# 设置环境变量
$env:CLOUDFLARE_R2_ACCOUNT_ID="9a5ff316a26b8abb696af519e515d2de"
$env:CLOUDFLARE_R2_ACCESS_KEY_ID="8072494c2581823ba4eefd7da9e910ca"
$env:CLOUDFLARE_R2_SECRET_ACCESS_KEY="ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59"
$env:CLOUDFLARE_R2_BUCKET_NAME="kemono-uploadimage"
$env:CLOUDFLARE_R2_PUBLIC_URL="https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev"
$env:CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME="kemono-afterimage"
$env:CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL="https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev"

# 测试构建
npm run build:pages:api
```

### 2. Cloudflare Pages 配置

在 Cloudflare Pages 控制台中：

1. **构建设置**：
   - 构建命令：`npm run build:pages:api`
   - 输出目录：`.next`
   - Node.js 版本：20

2. **环境变量**：
   ```
   CLOUDFLARE_R2_ACCOUNT_ID=9a5ff316a26b8abb696af519e515d2de
   CLOUDFLARE_R2_ACCESS_KEY_ID=8072494c2581823ba4eefd7da9e910ca
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59
   CLOUDFLARE_R2_BUCKET_NAME=kemono-uploadimage
   CLOUDFLARE_R2_PUBLIC_URL=https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev
   CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage
   CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev
   NODE_ENV=production
   CF_PAGES=true
   STATIC_EXPORT=false
   ```

3. **函数设置**：
   - 启用 Functions
   - 兼容性标志：`nodejs_compat`

### 3. 本地部署测试

```bash
# 使用新的部署命令
npm run deploy:pages:api
```

## 关键差异

### 静态导出 vs API路由

| 特性 | 静态导出 (build:pages) | API路由 (build:pages:api) |
|------|----------------------|-------------------------|
| 输出目录 | `out` | `.next` |
| API支持 | ❌ 不支持 | ✅ 支持 |
| 服务器端功能 | ❌ 不支持 | ✅ 支持 |
| 文件上传 | ❌ 不支持 | ✅ 支持 |
| 动态路由 | ❌ 不支持 | ✅ 支持 |

### 构建流程对比

**旧的静态导出流程**：
```
npm run build:pages
↓
设置 STATIC_EXPORT=true
↓
next build (生成 out 目录)
↓
部署 out 目录
```

**新的API路由流程**：
```
npm run build:pages:api
↓
设置 STATIC_EXPORT=false
↓
next build (生成 .next 目录)
↓
创建 _worker.js 和 _routes.json
↓
部署 .next 目录
```

## 验证部署

### 1. 检查API路由

部署后访问以下端点验证：

- `GET /api/upload-image` - 应该返回405错误（不支持GET）
- `POST /api/upload-image` - 应该返回400错误（缺少文件）

### 2. 测试图片上传

1. 打开网站
2. 尝试上传图片
3. 检查控制台是否有错误
4. 验证图片是否成功上传到R2

### 3. 检查Cloudflare Pages日志

在Cloudflare Pages控制台中查看构建日志，确保：

- 构建成功完成
- 没有错误信息
- API路由正常工作

## 故障排除

### 常见问题

1. **构建失败：输出目录不存在**
   - 确保使用 `build:pages:api` 而不是 `build:pages`
   - 检查 `output_directory` 设置为 `.next`

2. **API路由返回404**
   - 确保启用了 Functions
   - 检查 `nodejs_compat` 兼容性标志
   - 验证环境变量设置

3. **图片上传失败**
   - 检查R2环境变量配置
   - 验证R2存储桶权限
   - 查看Cloudflare Pages函数日志

### 调试命令

```bash
# 验证环境变量
npm run validate:env

# 本地构建测试
npm run build:pages:api

# 本地启动测试
npm start

# 检查构建输出
ls -la .next/
```

## 性能优化

1. **缓存策略**
   - 静态资源：长期缓存
   - API路由：不缓存
   - 图片：CDN缓存

2. **函数优化**
   - 使用 `nodejs_compat` 标志
   - 优化依赖包大小
   - 实现错误重试机制

3. **监控和日志**
   - 启用Cloudflare Analytics
   - 监控函数执行时间
   - 设置错误告警 