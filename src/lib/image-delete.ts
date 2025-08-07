import { createR2Client, validateR2Config } from './r2-client-cloudflare'

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

    if (!validateR2Config()) {
      return false;
    }

    // 使用 HEAD 请求检查文件是否存在
    const endpoint = `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const url = `${endpoint}/${bucketName}/${key}`;

    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
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

    if (!validateR2Config()) {
      return {
        success: false,
        message: 'R2配置无效'
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

    // 使用 DELETE 请求删除文件
    const endpoint = `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const url = `${endpoint}/${bucketName}/${key}`;

    const response = await fetch(url, { method: 'DELETE' });
    
    if (!response.ok) {
      throw new Error(`删除失败: ${response.status} ${response.statusText}`);
    }

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

// 清理过期图片（简化版本，不依赖AWS SDK）
export async function cleanupExpiredImages(expirationDays: number = 30): Promise<{ deleted: number; errors: number }> {
  console.log(`🧹 开始清理过期图片（${expirationDays}天前）`);
  
  // 注意：这个功能在 Cloudflare Workers 环境中需要更复杂的实现
  // 由于无法直接列出所有文件，这里只是占位符
  console.log('⚠️ 清理过期图片功能在 Cloudflare Workers 环境中需要特殊实现');
  
  return {
    deleted: 0,
    errors: 0
  };
} 