# Cloudflare Pages 优化部署指南

## 问题描述
Cloudflare Pages 有 25MB 的文件大小限制，当 webpack 生成的客户端包文件超过此限制时会导致构建失败。

## 解决方案

### 1. 使用优化的构建脚本

```bash
# 运行优化的构建
npm run pages:build

# 或者使用完整优化流程
npm run build:optimized
```

### 2. 构建脚本说明

#### `scripts/build-cloudflare.js`
- 清理之前的构建文件
- 设置优化环境变量
- 运行 Next.js 构建
- 检查文件大小
- 运行 Cloudflare Pages 构建

#### `scripts/optimize-bundle.js`
- 分析构建输出文件大小
- 提供优化建议
- 检查是否超过 25MB 限制

### 3. Next.js 配置优化

#### webpack 优化
- 启用代码分割 (`splitChunks`)
- 设置最大块大小为 250KB (`maxSize: 244000`)
- 分离不同类型的依赖项：
  - React 相关库
  - Next.js 相关库
  - AWS SDK
  - 其他第三方库
  - 公共代码

#### 模块解析优化
- 禁用不必要的 Node.js 模块
- 启用模块连接
- 启用副作用优化

### 4. 环境变量设置

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_CACHE=false
```

### 5. 部署步骤

1. **清理构建缓存**
   ```bash
   npm run clean
   ```

2. **运行优化构建**
   ```bash
   npm run pages:build
   ```

3. **检查构建输出**
   ```bash
   npm run analyze
   ```

4. **部署到 Cloudflare Pages**
   ```bash
   npm run pages:deploy
   ```

### 6. 故障排除

#### 如果仍然遇到 25MB 限制：

1. **检查依赖项**
   ```bash
   npm ls --depth=0
   ```

2. **分析包大小**
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   npm run analyze
   ```

3. **移除不必要的依赖**
   - 检查 `package.json` 中的依赖项
   - 移除未使用的库
   - 考虑使用更轻量的替代方案

4. **使用动态导入**
   ```javascript
   // 而不是静态导入
   import HeavyComponent from './HeavyComponent'
   
   // 使用动态导入
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

5. **优化图片和静态资源**
   - 压缩图片
   - 使用 WebP 格式
   - 考虑使用 CDN

### 7. 监控和验证

构建完成后，检查以下内容：

1. **文件大小检查**
   - 所有 `.js` 文件都应小于 25MB
   - 总包大小应合理

2. **功能验证**
   - 确保所有功能正常工作
   - 检查页面加载性能

3. **部署验证**
   - 确认 Cloudflare Pages 部署成功
   - 检查生产环境功能

### 8. 性能优化建议

1. **代码分割**
   - 使用 `dynamic()` 进行路由级代码分割
   - 按功能模块分割代码

2. **依赖优化**
   - 使用 `optimizePackageImports` 优化大型库
   - 考虑使用 CDN 加载大型库

3. **缓存策略**
   - 利用 Cloudflare 的 CDN 缓存
   - 设置适当的缓存头

### 9. 常用命令

```bash
# 清理和重新构建
npm run build:clean

# 优化构建
npm run build:optimized

# 分析包大小
npm run analyze

# 部署到 Cloudflare Pages
npm run pages:deploy

# 开发模式
npm run pages:dev
```

## 注意事项

1. **构建时间**：优化后的构建可能需要更长时间
2. **缓存**：确保清理构建缓存以避免旧文件影响
3. **测试**：在生产环境部署前充分测试
4. **监控**：持续监控包大小和性能指标

## 联系支持

如果问题仍然存在，请：
1. 检查构建日志中的详细错误信息
2. 运行 `npm run analyze` 查看包大小分析
3. 考虑进一步优化依赖项或使用 CDN 