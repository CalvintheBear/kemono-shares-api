import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2AfterimageClient, getAfterimagePublicUrl, validateAfterimageR2Config } from './r2-afterimage-client'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * 验证图片文件
 */
export function validateAfterimageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: '文件不存在' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `不支持的文件类型: ${file.type}` }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `文件大小超过限制: ${(file.size / 1024 / 1024).toFixed(2)}MB` }
  }

  return { valid: true }
}

/**
 * 生成唯一的文件名
 */
function _generateAfterimageFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop() || 'png'
  return `afterimages/${timestamp}-${randomId}.${extension}`
}

/**
 * 上传生成图片到kemono-afterimage桶
 */
export async function uploadAfterimageToR2(
  buffer: Buffer,
  key: string,
  contentType: string = 'image/png'
): Promise<{ url: string; key: string; size: number }> {
  if (!validateAfterimageR2Config()) {
    throw new Error('Cloudflare R2 afterimage 配置无效')
  }
  const bucketName = process.env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME!
  console.log(`📤 开始上传生成图片到kemono-afterimage桶: ${key} (${(buffer.length / 1024).toFixed(2)}KB)`)
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000', // 1年缓存
    })
    await r2AfterimageClient.send(command)
    const url = getAfterimagePublicUrl(key)
    console.log(`✅ 生成图片上传成功: ${url}`)
    return { url, key, size: buffer.length }
  } catch (error) {
    console.error('❌ 生成图片上传失败:', error)
    throw new Error(`生成图片上传失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 批量上传生成图片
 */
export async function batchUploadAfterimages(buffers: Buffer[]): Promise<Array<{ url: string; key: string; size: number }>> {
  const results = []
  
  for (let i = 0; i < buffers.length; i++) {
    try {
      const result = await uploadAfterimageToR2(buffers[i], `batch-${i + 1}.png`, 'image/png')
      results.push(result)
      console.log(`✅ 批量上传 ${i + 1}/${buffers.length} 完成`)
    } catch (error) {
      console.error(`❌ 批量上传 ${i + 1}/${buffers.length} 失败:`, error)
      throw error
    }
  }
  
  return results
}

/**
 * 获取上传统计信息
 */
export function getAfterimageUploadStats() {
  return {
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_TYPES,
    bucketName: process.env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME,
    isConfigured: validateAfterimageR2Config()
  }
} 