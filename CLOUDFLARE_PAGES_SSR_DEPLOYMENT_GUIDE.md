# Cloudflare Pages SSR 部署指南

## 🎯 项目概述

这是一个基于 Next.js 的 AI 生成平台，部署在 Cloudflare Pages 上，使用：
- **Cloudflare Pages** - 静态资源托管
- **Cloudflare Functions** - SSR 和 API 路由处理
- **Cloudflare R2** - 图片存储
- **Cloudflare KV** - 数据存储

## 📁 正确的目录结构

```
.vercel/output/
├── static/               --> 静态资源（供 Pages 使用）
├── functions/            --> SSR 函数（供 CF Functions 使用）
└── config.json           --> 路由配置
```

## 🔧 配置文件

### 1. wrangler.toml

```toml
# Cloudflare Pages 配置文件 - SSR + 静态资源支持
name = "kemono-shares-api"
account_id = "9a5ff316a26b8abb696af519e515d2de"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat", "global_fetch_strictly_public"]
type = "javascript"

# ✅ 关键配置：指定输出目录（必须在根级别）
pages_build_output_dir = ".vercel/output/static"

# ✅ 使用 @cloudflare/next-on-pages 构建命令
[build]
command = "npm run build:pages:dynamic"
cwd = "./"
watch_dir = "./"

# ✅ Functions 设置（动态渲染函数）
[functions]
directory = ".vercel/output/functions"

# ✅ 生产环境配置
[env.production]
pages_build_output_dir = ".vercel/output/static"

[env.production.vars]
NODE_ENV = "production"
NEXT_PUBLIC_APP_URL = "https://2kawaii.com"
# ... 其他环境变量

# ✅ 预览环境配置
[env.preview]
pages_build_output_dir = ".vercel/output/static"

[env.preview.vars]
NODE_ENV = "development"
NEXT_PUBLIC_APP_URL = "https://dev.2kawaii.com"
# ... 其他环境变量
```

### 2. package.json 构建脚本

```json
{
  "scripts": {
    "build": "npx @cloudflare/next-on-pages@latest --experimental-minify",
    "build:pages": "npx @cloudflare/next-on-pages@latest --experimental-minify",
    "build:pages:dynamic": "npx @cloudflare/next-on-pages@latest --experimental-minify",
    "verify:cf-build": "node scripts/verify-cloudflare-build.js"
  }
}
```

### 3. next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 移除静态导出配置，支持SSR
  // output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  
  // 使用默认配置，支持SSR
  trailingSlash: false,
  distDir: '.next',
  
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-d00e7b41917848d1a8403c984cb62880.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '2kawaii.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/',
        destination: '/workspace',
        permanent: false,
      },
    ]
  },
  
  // 构建配置
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
```

## 🚀 部署流程

### 1. 本地构建测试

```bash
# 安装依赖
npm install

# 构建项目
npm run build:pages:dynamic

# 验证构建输出
npm run verify:cf-build
```

### 2. 推送到 GitHub

```bash
git add .
git commit -m "配置 Cloudflare Pages SSR 部署"
git push origin master
```

### 3. Cloudflare Pages 自动部署

Cloudflare Pages 会：
1. 读取 `wrangler.toml` 配置
2. 执行 `npm run build:pages:dynamic`
3. 生成 `.vercel/output` 目录
4. 部署静态资源到 Pages
5. 部署 Functions 处理动态路由

## 🔍 验证部署

### 1. 检查构建输出

```bash
# 验证构建输出
npm run verify:cf-build
```

### 2. 检查目录结构

```
.vercel/output/
├── static/
│   ├── index.html
│   ├── _next/
│   ├── images/
│   └── ...
├── functions/
│   ├── api/
│   ├── share/
│   └── ...
└── config.json
```

### 3. 访问网站

- **生产环境**: https://2kawaii.com
- **预览环境**: https://dev.2kawaii.com

## 🛠️ 故障排除

### 问题 1: "Output directory 'out' not found"

**原因**: 使用了错误的构建命令或输出目录配置

**解决方案**:
1. 确保使用 `npx @cloudflare/next-on-pages@latest --experimental-minify`
2. 确保 `pages_build_output_dir = ".vercel/output/static"`
3. 不要在 `next.config.ts` 中设置 `output: 'export'`

### 问题 2: "wrangler.toml file was found but it does not appear to be valid"

**原因**: `wrangler.toml` 格式错误或缺少必要配置

**解决方案**:
1. 确保 `pages_build_output_dir` 在根级别声明
2. 检查 TOML 语法是否正确
3. 确保路径使用正斜杠 `/`

### 问题 3: Functions 不工作

**原因**: Functions 目录配置错误

**解决方案**:
1. 确保 `[functions]` 部分配置正确
2. 检查 `.vercel/output/functions` 目录是否存在
3. 验证 API 路由是否正确生成

## 📋 检查清单

- [ ] `wrangler.toml` 包含 `pages_build_output_dir = ".vercel/output/static"`
- [ ] `package.json` 使用 `@cloudflare/next-on-pages@latest --experimental-minify`
- [ ] `next.config.ts` 没有设置 `output: 'export'`
- [ ] 本地构建生成 `.vercel/output` 目录
- [ ] GitHub 推送成功
- [ ] Cloudflare Pages 构建成功
- [ ] 网站可以正常访问
- [ ] SSR 功能正常工作
- [ ] API 路由正常工作

## 🎉 成功标志

当看到以下输出时，说明部署成功：

```
✅ .vercel/output 目录存在
✅ .vercel/output/static 目录存在
✅ .vercel/output/functions 目录存在
✅ .vercel/output/config.json 文件存在
✅ Cloudflare Pages 构建输出验证完成
```

网站应该能够：
- 正常显示静态页面
- 处理动态路由（如 `/share/[id]`）
- 响应 API 请求
- 支持 SSR 功能
