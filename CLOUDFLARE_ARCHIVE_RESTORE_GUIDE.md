# Cloudflare Pages 存档点恢复指南

## 概述
此指南帮助您完全恢复到存档点：`master 90bb218 修复kv兼容问题` 的状态。

## 配置状态总结

### 1. 构建配置
- **构建命令**: `npm run build:pages:static`
- **构建输出目录**: `/out`
- **构建系统版本**: 3 （最新）
- **根目录**: `//` (空，默认根目录)

### 2. 环境变量设置
在 Cloudflare Pages 控制台中需要设置以下环境变量：

```bash
CLOUDFLARE_ACCOUNT_ID=9a5ff316a26b8abb696af519e515d2de
CLOUDFLARE_API_TOKEN=HJ5ugyPnYiDdOjK_OjsFoZI8KgVytyIjN4GWNpZ9
CLOUDFLARE_R2_ACCESS_KEY_ID=8072494c2581823ba4eefd7da9e910ca
CLOUDFLARE_R2_ACCOUNT_ID=9a5ff316a26b8abb696af519e515d2de
CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev
CLOUDFLARE_R2_BUCKET_NAME=kemono-uploadimage
CLOUDFLARE_R2_PUBLIC_URL=https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev
CLOUDFLARE_R2_SECRET_ACCESS_KEY=ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59
IMGBB_API_KEY=f62c400dfa7cffdbe66ebcdbf6f2d783
KIE_AI_4O_BASE_URL=https://api.kie.ai
KIE_AI_API_KEY=2800cbec975bf014d815f4e5353c826a
KIE_AI_API_KEY_2=6a77fe3ca6856170f6618d4f249cfc6a
KIE_AI_API_KEY_3=db092e9551f4631136cab1b141fdfd21
KIE_AI_API_KEY_4=3f06398cf9d8dc02a243f2dd5f2f9489
KIE_AI_API_KEY_5=c982688b5c6938943dd721ed1d576edb
KIE_AI_EDGE_BASE=https://api.kie.ai/api/v1
KIE_AI_USER_ID=j2983236233@gmail.com
NEXT_PUBLIC_APP_URL=https://2kawaii.com
NODE_ENV=production
```

### 3. KV 命名空间绑定
需要在 Cloudflare Pages 控制台中设置：
```
变量名称: SHARE_DATA_KV
KV 命名空间: SHARE_DATA_KV
```

### 4. 安全头配置
已在 `wrangler.pages.toml` 中配置：
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 5. 重定向配置
已在 `_redirects` 文件中配置：
```
/* /index.html 200
```

## 恢复步骤

### 步骤 1: 更新项目配置
✅ 已完成 - 配置文件已更新为匹配存档点状态

### 步骤 2: 在 Cloudflare Pages 控制台中恢复设置

1. **访问 Cloudflare Dashboard**
   - 登录到 Cloudflare Dashboard
   - 选择项目 `kemono-shares-api`

2. **设置构建配置**
   - 构建命令: `npm run build:pages:static`
   - 构建输出目录: `out`
   - 根目录: 留空 (默认)
   - 构建系统版本: 选择 v3

3. **配置环境变量**
   - 进入 Settings > Environment variables
   - 逐一添加上述所有环境变量

4. **设置 KV 绑定**
   - 进入 Settings > Functions
   - 在 KV namespace bindings 部分添加:
     - Variable name: `SHARE_DATA_KV`
     - KV namespace: 选择或创建 `SHARE_DATA_KV`

5. **验证 R2 绑定**
   - 进入 Settings > Functions
   - 确认 R2 bucket bindings 正确设置:
     - `UPLOAD_BUCKET` -> `kemono-uploadimage`
     - `AFTERIMAGE_BUCKET` -> `kemono-afterimage`

### 步骤 3: 重新部署
1. 触发重新部署以应用所有设置
2. 确认部署使用正确的构建命令和输出目录
3. 验证所有环境变量和绑定都已应用

### 步骤 4: 验证部署
- 访问 https://2kawaii.com 确认网站正常运行
- 测试图片生成功能
- 确认分享功能正常（如果需要）

## 故障排除

### 如果构建失败
```bash
# 本地测试构建
npm install
npm run build:pages:static
```

### 如果绑定不工作
1. 检查 KV 命名空间是否正确创建和绑定
2. 确认 R2 存储桶访问权限
3. 验证环境变量拼写和值的正确性

### 如果页面无法访问
1. 检查 `_redirects` 文件是否正确生成
2. 确认 `out` 目录结构正确
3. 验证安全头配置

## 注意事项
- 所有敏感信息（API密钥等）应通过 Cloudflare Pages 控制台设置，不要提交到代码库
- 确保 KV 命名空间 `SHARE_DATA_KV` 已创建并正确绑定
- R2 存储桶需要有正确的公共访问配置

## 联系支持
如果遇到无法解决的问题，可以：
1. 检查 Cloudflare Pages 部署日志
2. 验证所有配置是否与此文档一致
3. 确认 GitHub 代码已正确回滚到存档点状态
