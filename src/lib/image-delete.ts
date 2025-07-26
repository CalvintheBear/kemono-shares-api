import { DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from './r2-client';

// 从URL中提取对象键
function extractKeyFromUrl(imageUrl: string): string | null {
  try {
    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
    if (!publicUrl || !imageUrl.startsWith(publicUrl)) {
      return null;
    }
    
    return imageUrl.replace(publicUrl + '/', '');
  } catch (_error) {
    console.error('提取对象键失败:', _error);
    return null;
  }
}

// 检查文件是否存在
export async function checkImageExists(imageUrl: string): Promise<boolean> {
  try {
    const key = extractKeyFromUrl(imageUrl);
    if (!key) {
      return false;
    }

    await r2Client.send(new HeadObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    }));

    return true;
  } catch (_error) {
    console.log(`文件不存在或无法访问: ${imageUrl}`);
    return false;
  }
}

// 删除图片
export async function deleteImageFromR2(imageUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    const key = extractKeyFromUrl(imageUrl);
    if (!key) {
      return {
        success: false,
        message: '无效的图片URL格式'
      };
    }

    console.log(`🗑️ 开始删除图片: ${key}`);

    // 检查文件是否存在
    const exists = await checkImageExists(imageUrl);
    if (!exists) {
      return {
        success: false,
        message: '文件不存在或已被删除'
      };
    }

    // 删除文件
    await r2Client.send(new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    }));

    console.log(`✅ 图片删除成功: ${key}`);

    return {
      success: true,
      message: '图片删除成功'
    };

  } catch (_error) {
    console.error('❌ 删除图片失败:', _error);
    return {
      success: false,
      message: `删除失败: ${_error instanceof Error ? _error.message : '未知错误'}`
    };
  }
}

// 批量删除图片
export async function batchDeleteImages(imageUrls: string[]): Promise<Array<{ url: string; success: boolean; message: string }>> {
  console.log(`🗑️ 开始批量删除 ${imageUrls.length} 个图片`);
  
  const deletePromises = imageUrls.map(async (url) => {
    try {
      const result = await deleteImageFromR2(url);
      return {
        url,
        success: result.success,
        message: result.message
      };
    } catch (_error) {
      return {
        url,
        success: false,
        message: `删除失败: ${_error instanceof Error ? _error.message : '未知错误'}`
      };
    }
  });

  return Promise.all(deletePromises);
}

// 清理过期图片（可选功能）
export async function cleanupExpiredImages(expirationDays: number = 30): Promise<{ deleted: number; errors: number }> {
  // 这个功能需要实现列表对象和检查修改时间的逻辑
  // 由于R2 API的限制，这里只是框架代码
  console.log(`🧹 清理过期图片功能待实现 (${expirationDays}天)`);
  
  return {
    deleted: 0,
    errors: 0
  };
} 