# Cloudflare Pages 环境变量配置指南

## 问题诊断

根据调试信息，发现 `kemono-shares-api` 项目缺少以下关键环境变量，导致R2上传失败：

```json
{
  "r2Config": {
    "accountId": "未配置",
    "bucketName": "未配置", 
    "accessKeyId": "未配置",
    "secretAccessKey": "未配置",
    "publicUrl": "未配置",
    "afterimageBucketName": "未配置",
    "afterimagePublicUrl": "未配置"  // 这是导致500错误的主要原因
  }
}
```

## 需要配置的环境变量

请在 Cloudflare Pages 控制台中为 `kemono-shares-api` 项目添加以下环境变量：

### 1. R2 账户配置
```
CLOUDFLARE_R2_ACCOUNT_ID=9a5ff316a26b8abb696af519e515d2de
```

### 2. R2 访问密钥
```
CLOUDFLARE_R2_ACCESS_KEY_ID=8072494c2581823ba4eefd7da9e910ca
CLOUDFLARE_R2_SECRET_ACCESS_KEY=ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59
```

### 3. R2 存储桶配置
```
CLOUDFLARE_R2_BUCKET_NAME=kemono-uploadimage
CLOUDFLARE_R2_PUBLIC_URL=https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev
```

### 4. R2 后处理图片存储桶配置（关键）
```
CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev
```

## 配置步骤

1. 访问 [Cloudflare Pages 控制台](https://dash.cloudflare.com/pages)
2. 选择项目：`kemono-shares-api`
3. 进入 `Settings` > `Environment variables`
4. 点击 `Add variable` 添加上述环境变量
5. 确保选择 `Production` 环境
6. 保存配置

## 验证配置

配置完成后，访问以下URL验证：
```
https://2kawaii.com/api/debug-env
```

应该看到所有R2配置项都显示"已配置"而不是"未配置"。

## 当前状态

✅ **已配置**：
- AFTERIMAGE_BUCKET (R2绑定)
- UPLOAD_BUCKET (R2绑定)  
- SHARE_DATA_KV (KV存储)
- KIE_AI_API_KEY (API密钥)

❌ **缺失**：
- CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL (导致500错误)
- 其他R2相关环境变量

## 修复效果

配置完成后，文生图功能将能够：
1. 成功上传到R2存储
2. 生成永久URL
3. 正确显示生成的图片
4. 创建分享链接
