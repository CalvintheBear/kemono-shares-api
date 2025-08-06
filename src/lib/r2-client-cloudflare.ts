// Cloudflare R2 类型定义
interface R2Bucket {
  put(key: string, value: ArrayBuffer, options?: any): Promise<void>;
  get(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

// Cloudflare Pages Functions 环境下的 R2 客户端
export function createR2Client(r2Bucket: R2Bucket, r2AfterimageBucket: R2Bucket, env: any) {
  return {
    // 上传到主存储桶
    async uploadToMainBucket(key: string, data: ArrayBuffer, contentType: string, metadata?: Record<string, string>) {
      try {
        await r2Bucket.put(key, data, {
          httpMetadata: {
            contentType,
          },
          customMetadata: metadata,
        });
        
        // 构建公共URL - 使用环境变量中的正确域名
        // 注意：您的配置中已经包含了完整的公共URL，不需要再添加桶名
        const publicUrl = env.CLOUDFLARE_R2_PUBLIC_URL 
          ? `${env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
          : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${env.CLOUDFLARE_R2_BUCKET_NAME}/${key}`;
        
        return {
          url: publicUrl,
          key,
          success: true
        };
      } catch (error) {
        console.error('❌ 上传到主存储桶失败:', error);
        throw new Error(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 上传到 afterimage 存储桶
    async uploadToAfterimageBucket(key: string, data: ArrayBuffer, contentType: string, metadata?: Record<string, string>) {
      try {
        await r2AfterimageBucket.put(key, data, {
          httpMetadata: {
            contentType,
          },
          customMetadata: metadata,
        });
        
        // 构建公共URL - 使用环境变量中的正确域名
        // 注意：您的配置中已经包含了完整的公共URL，不需要再添加桶名
        const publicUrl = env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL 
          ? `${env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL}/${key}`
          : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME}/${key}`;
        
        return {
          url: publicUrl,
          key,
          success: true
        };
      } catch (error) {
        console.error('❌ 上传到 afterimage 存储桶失败:', error);
        throw new Error(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 从主存储桶获取文件
    async getFromMainBucket(key: string) {
      try {
        const object = await r2Bucket.get(key);
        return object;
      } catch (error) {
        console.error('❌ 从主存储桶获取文件失败:', error);
        throw new Error(`获取失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 从 afterimage 存储桶获取文件
    async getFromAfterimageBucket(key: string) {
      try {
        const object = await r2AfterimageBucket.get(key);
        return object;
      } catch (error) {
        console.error('❌ 从 afterimage 存储桶获取文件失败:', error);
        throw new Error(`获取失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 删除主存储桶中的文件
    async deleteFromMainBucket(key: string) {
      try {
        await r2Bucket.delete(key);
        return { success: true };
      } catch (error) {
        console.error('❌ 删除主存储桶文件失败:', error);
        throw new Error(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    },

    // 删除 afterimage 存储桶中的文件
    async deleteFromAfterimageBucket(key: string) {
      try {
        await r2AfterimageBucket.delete(key);
        return { success: true };
      } catch (error) {
        console.error('❌ 删除 afterimage 存储桶文件失败:', error);
        throw new Error(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  };
}

// 生成唯一的文件名
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'jpg';
  return `uploads/${timestamp}-${random}.${extension}`;
}

// 文件类型验证
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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