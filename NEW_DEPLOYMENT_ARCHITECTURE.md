# 🚀 新的部署架构说明

## 📋 架构变更概述

### 变更前（三平台部署）
- **Cloudflare Workers**: API服务
- **Cloudflare Pages**: 静态网站
- **Railway**: 备用部署

### 变更后（双平台部署）
- **Cloudflare Pages**: 静态网站 + KV存储
- **Railway**: API服务 + R2存储

## 🏗️ 新的部署架构

### 1. Cloudflare Pages（前端 + KV存储）

#### 功能职责
- ✅ 静态网站托管
- ✅ 用户界面展示
- ✅ 图片展示页面
- ✅ 分享页面
- ✅ KV存储管理

#### 技术栈
- **框架**: Next.js 15
- **构建**: 静态导出
- **存储**: Cloudflare KV
- **域名**: 2kawaii.com

#### 配置要点
```bash
# 构建命令
npm run build:pages

# 环境变量
CF_PAGES=true
NEXT_PUBLIC_APP_URL=https://2kawaii.com

# KV存储
SHARE_DATA_KV=77b81f5b787b449e931fa6a51263b38c
```

### 2. Railway（后端API + R2存储）

#### 功能职责
- ✅ 图片生成API
- ✅ 图片上传API
- ✅ 图片处理API
- ✅ 任务状态API
- ✅ R2存储管理

#### 技术栈
- **框架**: Next.js 15
- **运行时**: Node.js 20
- **存储**: Cloudflare R2
- **域名**: api.2kawaii.com 或 railway.app域名

#### 配置要点
```bash
# 构建命令
npm run build:railway

# 启动命令
npm start

# 环境变量
RAILWAY=true
NODE_ENV=production
PORT=3000
```

## 🔧 迁移步骤

### 第一步：清理Workers配置
- ✅ 删除 `wrangler.toml`
- ✅ 删除 `src/worker.js`
- ✅ 移除package.json中的Workers脚本

### 第二步：更新Pages配置
- ✅ 在 `wrangler.pages.toml` 中添加KV配置
- ✅ 更新构建脚本
- ✅ 配置环境变量

### 第三步：配置Railway
- ✅ 创建 `railway.json` 配置文件
- ✅ 设置环境变量
- ✅ 配置域名

### 第四步：测试部署
- ✅ 测试Pages构建：`npm run build:pages`
- ✅ 测试Railway构建：`npm run build:railway`
- ✅ 测试Pages部署：`npm run deploy:pages`

## 🌐 域名配置

### Cloudflare Pages
```
主域名: 2kawaii.com
www: www.2kawaii.com
```

### Railway API
```
API域名: api.2kawaii.com
备用域名: your-project.up.railway.app
```

## 📊 性能优化

### Pages优化
- 静态导出减少加载时间
- KV存储提供快速数据访问
- CDN全球分发

### Railway优化
- Node.js运行时优化
- R2存储高性能访问
- 自动扩缩容

## 🔒 安全配置

### 环境变量管理
- Pages: 通过Cloudflare Dashboard管理
- Railway: 通过Railway Dashboard管理

### API安全
- CORS配置
- 请求频率限制
- 错误处理

## 📈 监控和维护

### 监控指标
- Pages访问量
- Railway API调用量
- KV存储使用量
- R2存储使用量

### 维护任务
- 定期清理缓存
- 监控错误日志
- 更新依赖包

## 🚨 注意事项

1. **API路由**: 确保所有API路由在Railway上正常工作
2. **环境变量**: 确保所有必要的环境变量在两个平台都正确配置
3. **域名解析**: 确保域名正确指向对应平台
4. **数据同步**: 确保KV和R2数据的一致性
5. **错误处理**: 添加适当的错误处理和回退机制

## 📞 支持

如果遇到部署问题，请检查：
1. 构建日志
2. 环境变量配置
3. 域名DNS设置
4. 平台服务状态 