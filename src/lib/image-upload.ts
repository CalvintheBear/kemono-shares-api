import { createR2Client, generateUniqueFileName, validateImageFile, validateR2Config } from './r2-client-cloudflare'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

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

    // 验证R2配置
    if (!validateR2Config()) {
      throw new Error('Cloudflare R2 配置无效');
    }

    // 生成唯一文件名
    const key = generateUniqueFileName(fileName || file.name);
    
    // 转换为ArrayBuffer
    const buffer = await file.arrayBuffer();
    
    console.log(`📤 开始上传到Cloudflare R2: ${key} (${(file.size / 1024).toFixed(2)}KB)`);

    // 创建R2客户端
    const r2Client = createR2Client(null, null, process.env);
    
    // 上传到R2
    const result = await r2Client.uploadToMainBucket(key, buffer, file.type, {
      originalName: fileName || file.name,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size.toString(),
    });

    console.log(`✅ 上传成功: ${result.url}`);
    
    return result;

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