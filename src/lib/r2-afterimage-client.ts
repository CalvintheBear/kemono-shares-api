import { S3Client } from '@aws-sdk/client-s3'

// 专门用于生成图片存储桶的R2客户端
export const r2AfterimageClient = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

/**
 * 验证生成图片R2配置
 */
export function validateAfterimageR2Config(): boolean {
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME',
    'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ 生成图片R2配置缺失:', missingVars)
    return false
  }

  return true
}

/**
 * 获取生成图片R2配置信息
 */
export function getAfterimageR2ConfigInfo() {
  return {
    accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
    bucketName: process.env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME,
    publicUrl: process.env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL,
    isConfigured: validateAfterimageR2Config()
  }
}

/**
 * 获取生成图片的完整URL
 */
export function getAfterimagePublicUrl(key: string): string {
  const publicUrl = process.env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL
  if (!publicUrl) {
    throw new Error('CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL 未配置')
  }
  
  // 确保URL以/结尾
  const baseUrl = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`
  return `${baseUrl}${key}`
} 