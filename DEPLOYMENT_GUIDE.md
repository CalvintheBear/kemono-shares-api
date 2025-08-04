# Furycode 统一部署指南

## 项目配置优化完成

### 已完成的优化：
1. ✅ 统一了Next.js配置文件（删除6个重复配置）
2. ✅ 简化了package.json脚本（删除重复构建命令）
3. ✅ 统一了wrangler配置（删除重复配置文件）
4. ✅ 删除了重复的构建脚本（删除8个重复脚本）

### 当前部署配置：

#### Cloudflare Pages 部署
```bash
# 构建命令
npm run build:pages

# 构建输出目录
.vercel/output/static

# 根目录
/

# 部署命令
npm run deploy:pages
```

#### Cloudflare Workers 部署
```bash
# 构建命令
npm run build:cloudflare

# 部署命令
npm run deploy
```

#### Railway 部署
```bash
# 构建命令
npm run build:railway

# Watch Paths
src/**, package.json, next.config.ts
```

### 环境变量说明：
- `CF_PAGES=true`: 用于Cloudflare Pages构建
- `CF_WORKERS=true`: 用于Cloudflare Workers构建  
- `RAILWAY=true`: 用于Railway构建

### 统一后的命令：
```bash
# 开发
npm run dev

# 构建（根据环境自动选择配置）
npm run build:pages    # Cloudflare Pages
npm run build:cloudflare # Cloudflare Workers
npm run build:railway   # Railway

# 部署
npm run deploy         # Cloudflare Workers
npm run deploy:dev     # Cloudflare Workers (开发环境)
npm run deploy:pages   # Cloudflare Pages
npm run deploy:pages:dev # Cloudflare Pages (开发环境)

# 清理
npm run clean          # 清理缓存
npm run clean:build    # 清理构建文件
```

### 注意事项：
1. 所有API交互保持不变
2. 构建配置根据环境变量自动调整
3. 删除了重复和冲突的配置文件
4. 简化了部署流程

### 测试建议：
1. 先测试本地开发：`npm run dev`
2. 测试各平台构建：`npm run build:pages`、`npm run build:cloudflare`、`npm run build:railway`
3. 测试部署：`npm run deploy:pages`、`npm run deploy` 