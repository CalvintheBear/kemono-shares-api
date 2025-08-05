# 部署指南

## 概述
本项目支持在Cloudflare Pages和Railway上部署，使用静态导出模式。

## 部署架构
- **前端**: Cloudflare Pages (静态导出)
- **后端API**: Railway (Node.js服务器)
- **存储**: Cloudflare R2

## 部署步骤

### 1. Cloudflare Pages 部署

#### 构建配置
- **构建命令**: `npm run build:pages`
- **输出目录**: `out`
- **Node.js版本**: 20.x

#### 环境变量
确保在Cloudflare Pages中设置以下环境变量：
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://2kawaii.com
CF_PAGES=true
STATIC_EXPORT=true
```

#### R2存储桶配置
在Cloudflare Pages中绑定以下R2存储桶：
- `R2_BUCKET`: kemono-uploadimage
- `R2_AFTERIMAGE_BUCKET`: kemono-afterimage

### 2. Railway 部署

#### 构建配置
- **构建命令**: `npm run build:railway`
- **启动命令**: `npm start`
- **Node.js版本**: 20.x

#### 环境变量
在Railway中设置以下环境变量：
```
NODE_ENV=production
RAILWAY=true
NEXT_PUBLIC_APP_URL=https://your-railway-domain.railway.app
```

### 3. 域名配置

#### 主域名 (2kawaii.com)
- 指向Cloudflare Pages
- 支持静态页面访问

#### API子域名
- 创建API子域名指向Railway
- 例如: `api.2kawaii.com` -> Railway部署

### 4. 静态导出说明

由于使用静态导出，以下功能需要特殊处理：

#### API路由
- 静态导出时API路由不可用
- 需要将API请求重定向到Railway部署
- 在Cloudflare Pages中配置重写规则

#### 重写规则配置
在Cloudflare Pages中配置以下重写规则：
```
/api/* -> https://your-railway-api.railway.app/api/$1
```

### 5. 构建和部署命令

#### 本地测试
```bash
# 静态构建测试
npm run build:static

# 启动开发服务器
npm run dev
```

#### Cloudflare Pages部署
```bash
# 构建
npm run build:pages

# 部署
npm run deploy:pages
```

#### Railway部署
```bash
# 构建
npm run build:railway

# Railway会自动部署
```

### 6. 故障排除

#### 常见问题
1. **API路由404**: 确保重写规则正确配置
2. **图片上传失败**: 检查R2存储桶权限
3. **构建失败**: 检查Node.js版本和环境变量

#### 调试命令
```bash
# 检查生产配置
npm run check:production

# 测试R2配置
npm run test:r2-config
```

## 注意事项

1. **静态导出限制**: API路由在静态导出时不可用，需要通过重写规则处理
2. **环境变量**: 确保所有必要的环境变量都已正确设置
3. **R2权限**: 确保R2存储桶有正确的读写权限
4. **域名配置**: 确保域名DNS配置正确指向对应服务

## 更新部署

当需要更新部署时：
1. 推送代码到Git仓库
2. Cloudflare Pages会自动触发构建
3. Railway会自动重新部署
4. 检查部署状态和功能 