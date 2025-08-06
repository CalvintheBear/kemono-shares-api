# 🔧 R2存储桶公共访问权限修复指南

## 问题描述

您的R2存储桶返回401错误，表示存储桶没有启用公共访问权限，导致：
1. 上传的图片无法被外部服务（如KIE AI）访问
2. 图生图模式无法正常工作
3. 生成的图片无法正常显示

## 解决方案

### 步骤1：启用存储桶公共访问权限

#### 对于 `kemono-uploadimage` 存储桶：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **R2 Object Storage**
3. 找到并点击存储桶 `kemono-uploadimage`
4. 点击 **Settings** 标签
5. 找到 **Public bucket** 选项
6. 点击 **Enable** 启用公共访问
7. 确认更改

#### 对于 `kemono-afterimage` 存储桶：

1. 重复上述步骤，但选择存储桶 `kemono-afterimage`
2. 同样启用 **Public bucket**

### 步骤2：配置CORS策略（可选）

如果需要跨域访问，可以配置CORS策略：

1. 在存储桶设置中找到 **CORS** 选项
2. 添加以下CORS规则：

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### 步骤3：验证配置

运行验证脚本：

```bash
node scripts/fix-r2-bucket-config.js
```

### 步骤4：测试图生图功能

1. 上传一张图片
2. 选择图生图模式
3. 输入提示词
4. 生成图片
5. 验证生成的图片是否基于上传的图片

## 环境变量配置

确保您的环境变量配置正确：

```env
# 上传图片存储桶
CLOUDFLARE_R2_BUCKET_NAME=kemono-uploadimage
CLOUDFLARE_R2_PUBLIC_URL=https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev

# 生成图片存储桶
CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev
```

## 预期结果

修复后，您应该能够：

1. ✅ 正常访问上传的图片URL
2. ✅ 图生图模式正常工作
3. ✅ 生成的图片正确显示
4. ✅ 不再出现401错误

## 故障排除

如果问题仍然存在：

1. **检查存储桶名称**：确保绑定名称与存储桶名称一致
2. **验证权限**：确保API密钥有足够的权限
3. **检查网络**：确保没有网络连接问题
4. **查看日志**：检查Cloudflare Pages函数日志

## 相关文件

- `src/lib/r2-client-cloudflare.ts` - R2客户端配置
- `functions/api/upload-image.ts` - 图片上传API
- `functions/api/generate-image.ts` - 图片生成API
- `scripts/fix-r2-bucket-config.js` - 配置验证脚本 