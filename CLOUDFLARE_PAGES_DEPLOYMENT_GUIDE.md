# 🚀 Cloudflare Pages 部署指南

## 📋 问题分析

根据日志分析，Cloudflare Pages 部署失败的主要原因是：

1. **文件大小超限**：`cache/webpack/client-production/0.pack` 文件大小为 29.6 MiB，超过了 Cloudflare Pages 的 25 MiB 限制
2. **配置问题**：`wrangler.toml` 文件缺少 `pages_build_output_dir` 属性
3. **构建输出过大**：Next.js 构建生成了过大的 webpack 包

## 🔧 解决方案

### 1. 配置文件优化

#### wrangler.toml 更新
```toml
name = "kemono-shares-api"
main = "src/index.js"
compatibility_date = "2024-07-01"
compatibility_flags = ["nodejs_compat", "global_fetch_strictly_public"]

# Cloudflare Pages 配置
pages_build_output_dir = ".vercel/output/static"

[build]
command = "npm run build:cloudflare-optimized"

[env.production]
name = "kemono-shares-api"

[env.development]
name = "kemono-shares-api-dev"

[[kv_namespaces]]
binding = "SHARE_DATA_KV"
id = "77b81f5b787b449e931fa6a51263b38c"
preview_id = "2d7d8b533f3049b89d808fbb569bb09c"

[vars]
NODE_ENV = "production"
NEXT_PUBLIC_APP_URL = "https://2kawaii.com"
```

### 2. Next.js 配置优化

创建了专门的 `next.config.pages.ts` 文件，包含：

- 极激进的代码分割（最大块大小 10KB）
- 严格的性能限制（100KB 入口点）
- 优化的模块解析
- 禁用的图片优化

### 3. 构建脚本优化

创建了 `scripts/build-cloudflare-optimized.js` 脚本，包含：

- 自动清理构建文件
- 文件大小检查
- 优化环境变量设置
- 详细的构建日志

## 🚀 部署步骤

### 步骤 1: 清理项目
```bash
npm run clean
```

### 步骤 2: 运行优化构建
```bash
npm run build:cloudflare-optimized
```

### 步骤 3: 检查构建输出
脚本会自动检查文件大小，确保所有文件都在 25MB 限制内。

### 步骤 4: 部署到 Cloudflare Pages
```bash
npm run pages:deploy
```

## 📊 优化策略

### 代码分割策略
- **React 库**：最大 8KB
- **Next.js 库**：最大 8KB  
- **AWS SDK**：最大 5KB
- **其他第三方库**：最大 6KB
- **公共代码**：最大 5KB
- **样式文件**：最大 4KB

### 性能限制
- **入口点大小**：100KB
- **资源大小**：100KB
- **运行时块**：5KB

## 🔍 故障排除

### 如果仍然出现 25MB 错误

1. **检查大文件**：
   ```bash
   npm run analyze
   ```

2. **进一步优化**：
   - 移除不必要的依赖
   - 使用动态导入
   - 优化图片资源

3. **使用更激进的配置**：
   - 修改 `next.config.pages.ts` 中的 `maxSize` 值
   - 减少 `maxEntrypointSize` 和 `maxAssetSize`

### 常见问题

1. **构建失败**：检查 Node.js 版本（需要 >= 20.0.0）
2. **依赖问题**：运行 `npm install` 重新安装依赖
3. **缓存问题**：清理 `.next` 和 `cache` 目录

## 📈 监控和优化

### 构建监控
- 脚本会自动检查文件大小
- 提供详细的构建日志
- 显示优化建议

### 持续优化
- 定期检查依赖更新
- 监控包大小变化
- 优化代码分割策略

## 🎯 预期结果

使用优化后的配置，应该能够：

1. ✅ 成功构建项目
2. ✅ 所有文件都在 25MB 限制内
3. ✅ 成功部署到 Cloudflare Pages
4. ✅ 保持良好的性能

## 📞 支持

如果遇到问题，请检查：

1. 构建日志中的错误信息
2. 文件大小检查结果
3. 网络连接和权限设置
4. Cloudflare Pages 控制台中的部署状态

---

**注意**：此配置专门针对 Cloudflare Pages 的 25MB 文件大小限制进行了优化。如果需要在其他平台部署，请使用标准的 `next.config.ts` 配置。 