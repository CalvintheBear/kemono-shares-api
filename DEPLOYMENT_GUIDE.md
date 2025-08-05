# Furycode 统一部署指南

## 项目配置优化完成

### 已完成的优化：
1. ✅ 统一了Next.js配置文件（删除6个重复配置）
2. ✅ 简化了package.json脚本（删除重复构建命令）
3. ✅ 统一了wrangler配置（删除重复配置文件）
4. ✅ 删除了重复的构建脚本（删除8个重复脚本）
5. ✅ 移除了Cloudflare Workers部署，只保留Pages和Railway

### 当前部署配置：

#### Cloudflare Pages 部署（静态网站 + KV存储）
```bash
# 构建命令
npm run build:pages

# 构建输出目录
out/

# 根目录
/

# 部署命令
npm run deploy:pages
```

#### Railway 部署（API服务）
```bash
# 构建命令
npm run build:railway

# 启动命令
npm start

# Watch Paths
src/**, package.json, next.config.ts
```

### 环境变量说明：
- `CF_PAGES=true`: 用于Cloudflare Pages构建
- `RAILWAY=true`: 用于Railway构建

### 统一后的命令：
```bash
# 开发
npm run dev

# 构建（根据环境自动选择配置）
npm run build:pages    # Cloudflare Pages
npm run build:railway   # Railway

# 部署
npm run deploy:pages   # Cloudflare Pages
npm run deploy:pages:dev # Cloudflare Pages (开发环境)

# 清理
npm run clean          # 清理缓存
npm run clean:build    # 清理构建文件
```

### 部署架构：

#### Cloudflare Pages（前端 + KV存储）
- **用途**: 静态网站托管
- **功能**: 用户界面、图片展示、分享页面
- **存储**: Cloudflare KV用于分享数据
- **域名**: 2kawaii.com

#### Railway（后端API）
- **用途**: API服务
- **功能**: 图片生成、上传、处理
- **存储**: Cloudflare R2用于图片存储
- **域名**: api.2kawaii.com 或 railway.app域名

### 注意事项：
1. 所有API交互保持不变
2. 构建配置根据环境变量自动调整
3. 删除了重复和冲突的配置文件
4. 简化了部署流程
5. Pages负责前端，Railway负责后端API

### 测试建议：
1. 先测试本地开发：`npm run dev`
2. 测试各平台构建：`npm run build:pages`、`npm run build:railway`
3. 测试部署：`npm run deploy:pages`
4. 测试Railway部署：通过GitHub连接自动部署 