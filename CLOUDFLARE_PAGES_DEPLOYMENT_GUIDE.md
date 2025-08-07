# Cloudflare Pages 部署指南

## 概述

本项目使用 Cloudflare Pages 进行部署，支持动静态结合的功能：
- 静态页面：通过 Next.js 静态导出
- 动态功能：通过 Cloudflare Functions 实现 API 路由
- 数据存储：使用 Cloudflare KV 存储分享数据
- 文件存储：使用 Cloudflare R2 存储图片

## 修复的问题

### 1. wrangler.toml 配置修复
- 修复了 `pages_build_output_dir` 路径为正确的 `out` 目录
- 修复了构建命令为 `npm run build:pages:static`
- 修复了 Functions 目录路径

### 2. 构建脚本优化
- 确保正确生成 `out` 目录
- 自动复制 public 文件到输出目录
- 创建必要的 Cloudflare Pages 配置文件
- 添加构建验证和测试

### 3. 分享功能完善
- 确保分享数据正确存储到 KV
- 修复分享页面动态路由
- 优化错误处理和日志记录

## 部署步骤

### 1. 本地构建测试
```bash
# 清理缓存
npm run clean:cf

# 构建静态文件
npm run build:pages:static

# 测试构建输出
npm run test:build

# 测试分享功能
npm run test:share
```

### 2. 部署到 Cloudflare Pages
```bash
# 自动部署（推荐）
npm run deploy:pages:static

# 或手动部署
wrangler pages deploy out --project-name=kemono-shares-api
```

### 3. 验证部署
- 访问 https://2kawaii.com 确认网站正常
- 测试图片生成功能
- 测试分享功能
- 检查分享页面 /share/[id] 是否正常

## 配置文件说明

### wrangler.toml
```toml
# 项目名称
name = "kemono-shares-api"

# 构建配置
[build]
command = "npm run build:pages:static"
pages_build_output_dir = "out"

# Functions 配置
[functions]
directory = "functions"

# 环境变量和绑定
[env.production.vars]
NODE_ENV = "production"
NEXT_PUBLIC_APP_URL = "https://2kawaii.com"

# KV 存储绑定
[[env.production.kv_namespaces]]
binding = "SHARE_DATA_KV"
id = "77b81f5b787b449e931fa6a51263b38c"

# R2 存储绑定
[[env.production.r2_buckets]]
binding = "UPLOAD_BUCKET"
bucket_name = "kemono-uploadimage"
```

### 构建输出文件
- `out/index.html` - 主页面
- `out/_redirects` - 重定向规则
- `out/_headers` - HTTP 头配置
- `out/_routes.json` - 路由配置
- `out/_next/` - Next.js 静态资源
- `out/static/` - 静态资源

## 功能验证

### 1. 静态页面
- ✅ 主页正常加载
- ✅ 图片生成页面正常
- ✅ 分享页面正常

### 2. 动态功能
- ✅ API 路由正常工作
- ✅ 图片生成功能正常
- ✅ 分享创建功能正常
- ✅ 分享数据获取正常

### 3. 数据存储
- ✅ KV 存储配置正确
- ✅ 分享数据正确存储
- ✅ 分享数据正确获取

### 4. 文件存储
- ✅ R2 存储配置正确
- ✅ 图片上传功能正常
- ✅ 图片访问功能正常

## 故障排除

### 构建失败
1. 检查 Node.js 版本（需要 >= 20.0.0）
2. 清理缓存：`npm run clean:cf`
3. 重新安装依赖：`npm install`
4. 检查环境变量配置

### 部署失败
1. 检查 wrangler.toml 配置
2. 验证 KV 和 R2 绑定
3. 检查构建输出目录
4. 查看 Cloudflare Pages 日志

### 分享功能异常
1. 检查 KV 存储配置
2. 验证 API 路由
3. 检查分享页面组件
4. 查看浏览器控制台错误

## 监控和维护

### 日志监控
- Cloudflare Pages 日志
- Functions 执行日志
- KV 存储访问日志
- R2 存储访问日志

### 性能优化
- 静态资源缓存
- 图片压缩和优化
- API 响应时间监控
- 错误率监控

## 更新部署

### 代码更新
1. 提交代码到 Git 仓库
2. 推送到 master 分支
3. Cloudflare Pages 自动构建和部署

### 配置更新
1. 修改 wrangler.toml
2. 重新部署：`npm run deploy:pages:static`
3. 验证配置生效

### 环境变量更新
1. 在 Cloudflare Pages 控制台更新
2. 或通过 wrangler 命令更新
3. 重新部署应用

## 联系支持

如遇到问题，请：
1. 查看 Cloudflare Pages 文档
2. 检查项目日志
3. 联系技术支持团队
