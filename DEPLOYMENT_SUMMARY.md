# 部署配置总结

## 当前架构
- **前端**: Cloudflare Pages (静态导出)
- **后端**: Railway (Node.js API服务)
- **存储**: Cloudflare R2 (图片存储)
- **语言**: 仅支持日语

## 已完成的配置修改

### 1. 国际化配置
- ✅ 修改 `src/i18n/request.ts` - 只支持日语
- ✅ 修改 `src/middleware.ts` - 使用根路径，无语言前缀
- ✅ 创建 `src/app/[locale]/layout.tsx` - 国际化布局
- ✅ 删除英文语言文件，只保留日语

### 2. Next.js配置
- ✅ 优化 `next.config.ts` - 支持静态导出
- ✅ 配置图片优化和代码分割
- ✅ 设置正确的输出目录和路径

### 3. Cloudflare Pages配置
- ✅ 更新 `wrangler.pages.toml` - 移除KV，只保留R2
- ✅ 创建 `_redirects` - API重定向规则
- ✅ 配置R2存储桶绑定

### 4. 构建脚本
- ✅ 更新 `package.json` - 简化构建命令
- ✅ 创建 `scripts/build-for-pages.js` - 专用构建脚本
- ✅ 移除KV相关的测试脚本

### 5. 部署文档
- ✅ 创建 `DEPLOYMENT_GUIDE.md` - 详细部署指南
- ✅ 创建 `DEPLOYMENT_SUMMARY.md` - 配置总结

## 部署步骤

### 1. Cloudflare Pages部署
```bash
# 构建
npm run build:pages

# 部署
npm run deploy:pages
```

### 2. Railway部署
```bash
# 构建
npm run build:railway

# Railway会自动部署
```

### 3. 域名配置
- 主域名 `2kawaii.com` -> Cloudflare Pages
- API子域名 -> Railway (可选)

## 重要配置

### 环境变量
```
# Cloudflare Pages
CF_PAGES=true
STATIC_EXPORT=true
NODE_ENV=production

# Railway
RAILWAY=true
NODE_ENV=production
```

### R2存储桶
- `R2_BUCKET`: kemono-uploadimage
- `R2_AFTERIMAGE_BUCKET`: kemono-afterimage

### API重定向
在Cloudflare Pages中配置：
```
/api/* -> https://your-railway-api.railway.app/api/$1
```

## 注意事项

1. **静态导出限制**: API路由在静态导出时不可用，需要通过重写规则处理
2. **语言支持**: 当前只支持日语，所有页面都在根路径
3. **存储**: 使用R2存储图片，不再使用KV
4. **部署**: Pages负责前端，Railway负责API

## 测试建议

1. 本地测试: `npm run dev`
2. 静态构建测试: `npm run build:static`
3. Pages构建测试: `npm run build:pages`
4. Railway构建测试: `npm run build:railway`

## 下一步

1. 在Cloudflare Pages中配置环境变量
2. 绑定R2存储桶
3. 配置API重定向规则
4. 部署到Railway
5. 测试完整功能 