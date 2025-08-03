# 🚀 2kawaii.com 域名部署配置指南

## 📋 问题诊断

根据构建日志，发现以下问题：
1. **next-intl 配置错误**: 找不到请求配置文件
2. **域名配置缺失**: 需要添加 2kawaii.com 域名支持

## ✅ 已修复的问题

### 1. 修复 next-intl 配置
在 `next.config.ts` 中明确指定了请求配置文件路径：
```typescript
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
```

### 2. 添加域名支持
在 `next.config.ts` 中添加了 2kawaii.com 域名支持：
```typescript
{
  protocol: 'https',
  hostname: '2kawaii.com',
  port: '',
  pathname: '/**',
},
{
  protocol: 'https',
  hostname: 'www.2kawaii.com',
  port: '',
  pathname: '/**',
}
```

## 🔧 Cloudflare Pages 环境变量配置

在 Cloudflare Pages 的 **环境变量** 部分添加以下配置：

### 核心配置
```bash
变量名: NEXT_PUBLIC_APP_URL
值: https://2kawaii.com

变量名: NODE_ENV
值: production
```

### KIE AI API 配置
```bash
变量名: KIE_AI_API_KEY
值: 2800cbec975bf014d815f4e5353c826a

变量名: KIE_AI_API_KEY_2
值: 6a77fe3ca6856170f6618d4f249cfc6a

变量名: KIE_AI_API_KEY_3
值: db092e9551f4631136cab1b141fdfd21

变量名: KIE_AI_API_KEY_4
值: 3f06398cf9d8dc02a243f2dd5f2f9489

变量名: KIE_AI_API_KEY_5
值: c982688b5c6938943dd721ed1d576edb

变量名: KIE_AI_4O_BASE_URL
值: https://api.kie.ai

变量名: KIE_AI_USER_ID
值: j2983236233@gmail.com

变量名: KIE_AI_EDGE_BASE
值: https://api.kie.ai/api/v1
```

### ImgBB 配置
```bash
变量名: IMGBB_API_KEY
值: f62c400dfa7cffdbe66ebcdbf6f2d783
```

### Cloudflare R2 配置
```bash
变量名: CLOUDFLARE_R2_ACCOUNT_ID
值: 9a5ff316a26b8abb696af519e515d2de

变量名: CLOUDFLARE_R2_ACCESS_KEY_ID
值: 8072494c2581823ba4eefd7da9e910ca

变量名: CLOUDFLARE_R2_SECRET_ACCESS_KEY
值: ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59

变量名: CLOUDFLARE_R2_BUCKET_NAME
值: kemono-uploadimage

变量名: CLOUDFLARE_R2_PUBLIC_URL
值: https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev

变量名: CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME
值: kemono-afterimage

变量名: CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL
值: https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev

变量名: CLOUDFLARE_API_TOKEN
值: hgBa5xiIRLis-elTtjKI6WZgptO9e20Y8v4SGwnI
```

## 🌐 DNS 配置（Namesilo）

### 在 Namesilo 中配置 DNS 记录

#### 选项 1: 使用 Cloudflare DNS（推荐）
1. 在 Namesilo 中修改名称服务器：
```
ns1.cloudflare.com
ns2.cloudflare.com
```

2. 在 Cloudflare Dashboard 中添加域名：
   - 点击 **Add a Site**
   - 输入域名：`2kawaii.com`
   - 选择免费计划

3. 添加 DNS 记录：
```
Type: CNAME
Name: @
Target: kemono-shares-api.pages.dev
Proxy status: Proxied (橙色云朵)

Type: CNAME
Name: www
Target: kemono-shares-api.pages.dev
Proxy status: Proxied
```

#### 选项 2: 直接在 Namesilo 配置
```
Type: CNAME
Host: @
Value: kemono-shares-api.pages.dev
TTL: 3600

Type: CNAME
Host: www
Value: kemono-shares-api.pages.dev
TTL: 3600
```

## 🔧 构建设置

在 Cloudflare Pages 的 **构建设置** 部分：

1. **框架预设**: 选择 **Next.js**
2. **构建命令**: `npm run build`
3. **构建输出目录**: `.next`
4. **根目录**: 保持勾选，路径设为 `/`
5. **Node.js 版本**: 20

## 🚀 部署步骤

### 1. 推送修复后的代码
```bash
git add .
git commit -m "修复 next-intl 配置，添加 2kawaii.com 域名支持"
git push origin main
```

### 2. 在 Cloudflare Pages 中配置
1. 进入项目设置
2. 添加所有环境变量
3. 配置构建设置
4. 保存并触发部署

### 3. 配置自定义域名
1. 在 Pages 项目中点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入：`2kawaii.com`
4. 配置 DNS 记录

## ✅ 验证部署

### 1. 健康检查
```bash
curl -I https://2kawaii.com
```

### 2. API 测试
```bash
# 测试环境变量配置
curl https://2kawaii.com/api/test-env

# 测试 R2 配置
curl https://2kawaii.com/api/check-r2-config

# 测试分享功能
curl "https://2kawaii.com/api/share/list?limit=5&offset=0"
```

### 3. 功能测试
1. 访问 https://2kawaii.com
2. 测试图像上传功能
3. 测试 AI 生成功能
4. 测试分享功能

## 🚨 常见问题解决

### 问题 1: 构建失败
- ✅ 已修复 next-intl 配置问题
- 确保所有环境变量已正确设置
- 检查 Node.js 版本是否为 20+

### 问题 2: 域名无法访问
- 检查 DNS 记录是否正确配置
- 确认 SSL 证书已自动配置
- 等待 DNS 传播（最多 24 小时）

### 问题 3: 图像无法显示
- 确认 R2 存储桶配置正确
- 检查图像域名是否在 next.config.ts 中配置
- 验证 R2 访问权限

## 📊 预期结果

修复后，您的应用应该能够：
- ✅ 成功构建并部署
- ✅ 通过 https://2kawaii.com 访问
- ✅ 正常显示图像和进行 AI 生成
- ✅ 支持多语言（日语）
- ✅ 分享功能正常工作

## 🎯 下一步

1. 推送修复后的代码到 GitHub
2. 在 Cloudflare Pages 中重新配置环境变量
3. 配置 2kawaii.com 域名
4. 测试所有功能
5. 监控应用性能

---

**修复完成！🎉**

现在您的 FuryCode 应用应该能够成功部署到 2kawaii.com 域名了。 