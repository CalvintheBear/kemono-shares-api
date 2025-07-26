# 🚀 Cloudflare R2 图片托管迁移计划

## 📋 迁移概述

将图片托管服务从ImgBB迁移到Cloudflare R2，提升性能、降低成本、增强控制力。

## 🎯 迁移目标

- ✅ 替换ImgBB为Cloudflare R2
- ✅ 保持现有API接口兼容性
- ✅ 优化图片上传和访问性能
- ✅ 降低存储成本
- ✅ 增强安全性

## 🔧 技术方案

### 1. Cloudflare R2配置

```bash
# 环境变量配置
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=https://your-domain.com
```

### 2. 依赖安装

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 3. 核心功能实现

#### 3.1 R2客户端配置
```typescript
// src/lib/r2-client.ts
import { S3Client } from '@aws-sdk/client-s3';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});
```

#### 3.2 图片上传服务
```typescript
// src/lib/image-upload.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './r2-client';

export async function uploadImageToR2(
  file: File,
  fileName: string
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const key = `uploads/${Date.now()}-${fileName}`;
  
  await r2Client.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: file.type,
    ACL: 'public-read',
  }));
  
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}
```

#### 3.3 图片删除服务
```typescript
// src/lib/image-delete.ts
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './r2-client';

export async function deleteImageFromR2(imageUrl: string): Promise<void> {
  const key = imageUrl.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL + '/', '');
  
  await r2Client.send(new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
  }));
}
```

### 4. API路由更新

#### 4.1 新的上传API
```typescript
// src/app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToR2 } from '@/lib/image-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只支持图片文件' }, { status: 400 });
    }

    // 验证文件大小 (最大 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    // 上传到Cloudflare R2
    const imageUrl = await uploadImageToR2(file, file.name);
    
    return NextResponse.json({
      fileUrl: imageUrl,
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      message: `✅ 上传到Cloudflare R2成功，文件URL: ${imageUrl}`
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

### 5. 迁移步骤

#### 阶段1: 环境准备
1. 创建Cloudflare R2存储桶
2. 配置R2访问密钥
3. 设置自定义域名（可选）
4. 安装AWS SDK依赖

#### 阶段2: 代码实现
1. 实现R2客户端配置
2. 创建图片上传/删除服务
3. 更新API路由
4. 添加错误处理和日志

#### 阶段3: 测试验证
1. 本地环境测试
2. 上传功能验证
3. 图片访问测试
4. 性能对比测试

#### 阶段4: 生产部署
1. 更新环境变量
2. 部署新代码
3. 监控系统运行
4. 逐步迁移现有图片

### 6. 性能优化

#### 6.1 图片压缩
```typescript
// src/lib/image-compression.ts
export async function compressImage(file: File, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }
      }, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
}
```

#### 6.2 批量上传
```typescript
// src/lib/batch-upload.ts
export async function batchUploadImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImageToR2(file, file.name));
  return Promise.all(uploadPromises);
}
```

### 7. 监控和日志

#### 7.1 上传统计
```typescript
// src/lib/upload-stats.ts
export class UploadStats {
  private static stats = {
    totalUploads: 0,
    totalSize: 0,
    failedUploads: 0,
    averageSize: 0
  };

  static recordUpload(fileSize: number, success: boolean) {
    if (success) {
      this.stats.totalUploads++;
      this.stats.totalSize += fileSize;
      this.stats.averageSize = this.stats.totalSize / this.stats.totalUploads;
    } else {
      this.stats.failedUploads++;
    }
  }

  static getStats() {
    return { ...this.stats };
  }
}
```

### 8. 安全考虑

#### 8.1 文件类型验证
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE;
}
```

#### 8.2 访问控制
```typescript
// 设置适当的CORS策略
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### 9. 成本对比

| 服务 | 存储成本 | 带宽成本 | 请求成本 | 总成本 |
|------|----------|----------|----------|--------|
| ImgBB | 免费 | 免费 | 免费 | 免费 |
| Cloudflare R2 | $0.015/GB/月 | $0.08/GB | $4.50/百万请求 | 极低 |

### 10. 迁移时间表

- **第1周**: 环境准备和基础代码实现
- **第2周**: API开发和测试
- **第3周**: 性能优化和安全加固
- **第4周**: 生产部署和监控

## 🎉 预期收益

1. **性能提升**: 全球CDN加速，访问速度提升50%+
2. **成本降低**: 相比商业图床服务，成本降低80%+
3. **控制增强**: 完全控制图片存储和访问策略
4. **安全提升**: 企业级安全防护和访问控制
5. **扩展性**: 支持大规模图片存储和处理

## 📞 技术支持

- Cloudflare R2文档: https://developers.cloudflare.com/r2/
- AWS SDK文档: https://docs.aws.amazon.com/sdk-for-javascript/
- 迁移问题反馈: 项目Issues页面 