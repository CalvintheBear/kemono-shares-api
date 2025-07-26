import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './r2-client';

// 文件类型验证
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `不支持的文件类型: ${file.type}。支持的类型: ${ALLOWED_TYPES.join(', ')}` 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `文件大小超过限制: ${(file.size / 1024 / 1024).toFixed(2)}MB > ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }

  return { valid: true };
}

// 生成唯一的文件名
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'jpg';
  return `uploads/${timestamp}-${random}.${extension}`;
}

// 上传图片到Cloudflare R2
export async function uploadImageToR2(
  file: File,
  fileName?: string
): Promise<{ url: string; key: string; size: number }> {
  try {
    // 验证文件
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 生成唯一文件名
    const key = generateUniqueFileName(fileName || file.name);
    
    // 转换为Buffer
    const buffer = await file.arrayBuffer();
    
    console.log(`📤 开始上传到Cloudflare R2: ${key} (${(file.size / 1024).toFixed(2)}KB)`);

    // 上传到R2
    await r2Client.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      ACL: 'public-read',
      Metadata: {
        originalName: fileName || file.name,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size.toString(),
      },
    }));

    // 构建访问URL
    const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    
    console.log(`✅ 上传成功: ${url}`);
    
    return {
      url,
      key,
      size: file.size
    };

  } catch (error) {
    console.error('❌ 上传到Cloudflare R2失败:', error);
    throw new Error(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 批量上传图片
export async function batchUploadImages(files: File[]): Promise<Array<{ url: string; key: string; size: number }>> {
  console.log(`📦 开始批量上传 ${files.length} 个文件`);
  
  const uploadPromises = files.map(async (file, index) => {
    try {
      const result = await uploadImageToR2(file);
      console.log(`✅ 文件 ${index + 1}/${files.length} 上传成功`);
      return result;
    } catch (error) {
      console.error(`❌ 文件 ${index + 1}/${files.length} 上传失败:`, error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}

// 获取上传统计信息
export function getUploadStats() {
  return {
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_TYPES,
    maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024
  };
} 