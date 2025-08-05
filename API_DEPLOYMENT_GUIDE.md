# API路由部署指南

## 问题诊断

根据控制台错误信息，主要问题是：

1. **405 Method Not Allowed** - API路由被配置为静态导出模式，无法处理POST请求
2. **SyntaxError: Unexpected end of JSON input** - 响应格式错误
3. **workspace.uploadSection.uploadFailed** - 国际化消息缺失

## 解决方案

### 1. 修改Next.js配置

已修改 `next.config.ts`，移除静态导出配置以支持API路由：

```typescript
// 移除静态导出配置，支持API路由
const shouldUseStaticExport = false; // 强制禁用静态导出以支持API

const nextConfig: NextConfig = {
  // 移除静态导出配置
  // output: shouldUseStaticExport ? 'export' : undefined,
  
  // 移除静态导出优化
  trailingSlash: false,
  skipTrailingSlashRedirect: false,
  
  // 图片配置 - 支持API路由
  images: {
    unoptimized: false, // 启用图片优化
    // ...
  },
  // ...
};
```

### 2. 修复API路由

已重新实现 `src/app/api/upload-image/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToR2 } from '@/lib/image-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // 验证文件
    if (!file) {
      return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    }

    // 上传到Cloudflare R2
    const result = await uploadImageToR2(file, file.name);
    
    return NextResponse.json({
      fileUrl: result.url,
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      key: result.key,
      message: `✅ 上传到Cloudflare R2成功，文件URL: ${result.url}`
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('文件上传错误:', errorMessage);
    return NextResponse.json(
      { error: `文件上传失败: ${errorMessage}` },
      { status: 500 }
    );
  }
}
```

### 3. 修复前端上传逻辑

已修改 `src/components/Workspace.tsx`，使用API路由而不是直接调用服务器端函数：

```typescript
// 上传到 Cloudflare R2 (优先) - 使用API路由
const uploadToR2 = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `上传失败: ${response.status}`)
    }

    const data = await response.json()
    if (data.success && data.fileUrl) {
      return data.fileUrl
    } else {
      throw new Error(data.error || '上传响应格式错误')
    }
  } catch (error) {
    console.warn('R2上传失败，尝试其他方式:', error)
    throw error
  }
}
```

## 环境变量配置

### 必需的环境变量

```bash
# Cloudflare R2 配置
CLOUDFLARE_R2_ACCOUNT_ID=9a5ff316a26b8abb696af519e515d2de
CLOUDFLARE_R2_ACCESS_KEY_ID=8072494c2581823ba4eefd7da9e910ca
CLOUDFLARE_R2_SECRET_ACCESS_KEY=ee959470338a6f01c1f25fcf877e17fd3dfcca623ae6b94f6bfc8a3425b06b59

# Cloudflare R2 配置 - 上传图片存储桶
CLOUDFLARE_R2_BUCKET_NAME=kemono-uploadimage
CLOUDFLARE_R2_PUBLIC_URL=https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev

# Cloudflare R2 配置 - 生成图片存储桶
CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev

# 禁用静态导出以支持API路由
STATIC_EXPORT=false
CF_PAGES=false
```

## 部署步骤

### 1. 验证环境变量

```bash
npm run validate:env
```

### 2. 构建支持API的版本

```bash
npm run build:api
```

### 3. 部署

根据您的部署平台选择相应的命令：

#### Cloudflare Pages (支持API)
```bash
npm run deploy:api
```

#### Railway
```bash
npm run build:railway
```

#### Vercel
```bash
vercel --prod
```

## 验证部署

### 1. 检查API路由

访问以下端点验证API是否正常工作：

- `GET /api/upload-image` - 应该返回405错误（不支持GET）
- `POST /api/upload-image` - 应该返回400错误（缺少文件）

### 2. 测试图片上传

1. 打开网站
2. 尝试上传图片
3. 检查控制台是否有错误
4. 验证图片是否成功上传到R2

### 3. 检查R2存储桶

1. 登录Cloudflare控制台
2. 检查R2存储桶中是否有新上传的文件
3. 验证文件URL是否可以正常访问

## 故障排除

### 常见问题

1. **405 Method Not Allowed**
   - 确保已禁用静态导出模式
   - 检查API路由是否正确实现

2. **环境变量未找到**
   - 运行 `npm run validate:env` 检查配置
   - 确保在生产环境中设置了所有必需的环境变量

3. **R2上传失败**
   - 检查R2存储桶权限
   - 验证API密钥是否正确
   - 确认存储桶已启用公共访问

4. **CORS错误**
   - API路由已包含CORS支持
   - 检查浏览器控制台的具体错误信息

### 调试命令

```bash
# 验证环境变量
npm run validate:env

# 测试R2配置
npm run test:r2-config

# 测试上传功能
npm run test:upload

# 检查生产配置
npm run check:production
```

## 性能优化

1. **图片优化**
   - 启用Next.js图片优化
   - 使用适当的图片格式（WebP）
   - 实现懒加载

2. **API优化**
   - 添加请求缓存
   - 实现文件大小限制
   - 添加错误重试机制

3. **R2优化**
   - 使用CDN缓存
   - 实现文件压缩
   - 添加访问日志

## 安全考虑

1. **文件验证**
   - 验证文件类型
   - 限制文件大小
   - 扫描恶意文件

2. **访问控制**
   - 实现用户认证
   - 添加速率限制
   - 记录访问日志

3. **数据保护**
   - 加密敏感数据
   - 定期备份
   - 监控异常访问 