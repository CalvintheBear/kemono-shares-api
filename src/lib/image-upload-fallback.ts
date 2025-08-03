import { uploadImageToR2 } from './image-upload'

// ImgBB 上传回退
async function uploadImageToImgBB(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('image', file)
  
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    throw new Error('IMGBB_API_KEY 未配置')
  }

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error(`ImgBB 上传失败: ${response.status}`)
  }

  const data = await response.json()
  if (data.success) {
    return { url: data.data.url }
  } else {
    throw new Error(data.error?.message || 'ImgBB 上传失败')
  }
}

// 检测当前运行环境
function getRuntimeEnvironment() {
  return {
    isCloudflareWorkers: typeof globalThis !== 'undefined' && !!(globalThis as any).CF_PAGES,
    isRailway: !!process.env.RAILWAY_SERVICE_ID,
    isDevelopment: process.env.NODE_ENV === 'development',
    isEdgeRuntime: process.env.NEXT_RUNTIME === 'edge'
  }
}

// 智能上传选择器
export async function uploadImageWithFallback(file: File): Promise<{ url: string; key?: string; source: string }> {
  const env = getRuntimeEnvironment()
  console.log('📊 运行环境检测:', env)
  
  try {
    // 优先尝试 R2 (仅 Node.js 环境)
    if (!env.isEdgeRuntime && !env.isCloudflareWorkers) {
      try {
        const result = await uploadImageToR2(file)
        console.log('✅ R2 上传成功:', result.url)
        return { ...result, source: 'r2' }
      } catch (r2Error) {
        console.warn('⚠️ R2 失败，回退到 ImgBB:', r2Error)
      }
    }
    
    // Edge Runtime 或 Cloudflare Workers 使用 ImgBB
    const result = await uploadImageToImgBB(file)
    console.log('✅ ImgBB 上传成功:', result.url)
    return { ...result, source: 'imgbb' }
    
  } catch (error) {
    console.error('❌ 所有上传方式失败:', error)
    throw new Error(`图片上传失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

// 批量上传
export async function batchUploadWithFallback(files: File[]): Promise<Array<{ url: string; key?: string; source: string }>> {
  console.log(`📦 开始批量上传 ${files.length} 个文件`)
  
  const results = await Promise.allSettled(
    files.map(async (file, index) => {
      try {
        const result = await uploadImageWithFallback(file)
        console.log(`✅ 文件 ${index + 1}/${files.length} 上传成功 (${result.source})`)
        return result
      } catch (error) {
        console.error(`❌ 文件 ${index + 1}/${files.length} 上传失败:`, error)
        throw error
      }
    })
  )
  
  // 过滤成功结果
  const successful = results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value)
  
  const failed = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map(result => result.reason)
  
  if (failed.length > 0) {
    console.warn(`⚠️ 批量上传: ${successful.length} 成功, ${failed.length} 失败`)
  }
  
  return successful
}

// 上传统计信息
export function getUploadCapabilities() {
  const env = getRuntimeEnvironment()
  
  return {
    primary: env.isEdgeRuntime || env.isCloudflareWorkers ? 'imgbb' : 'r2',
    fallback: 'imgbb',
    environment: env,
    capabilities: {
      r2: !env.isEdgeRuntime && !env.isCloudflareWorkers,
      imgbb: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    }
  }
}