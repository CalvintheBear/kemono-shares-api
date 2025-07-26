import { uploadAfterimageToR2 } from './afterimage-upload'

/**
 * 获取KIE图片直链
 */
async function getKieDirectUrl(kieImageUrl: string, taskId?: string): Promise<string> {
  const apiKey = process.env.KIE_AI_API_KEY
  if (!apiKey) throw new Error('KIE_AI_API_KEY 未配置')

  const apiUrl = 'https://api.kie.ai/api/v1/gpt4o-image/download-url'
  const body: { url: string; taskId?: string } = { url: kieImageUrl }
  if (taskId) body.taskId = taskId

  console.log('🌐 请求KIE直链API:', apiUrl, body)

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`KIE直链API请求失败: ${res.status} ${text}`)
  }

  const data = await res.json()
  if (data.code !== 200 || !data.data) {
    // 如果没有taskId，直接返回原始URL
    if (data.code === 422 && data.msg?.includes('任务id不能为空')) {
      console.log('⚠️ KIE API需要taskId，使用原始URL:', kieImageUrl)
      return kieImageUrl
    }
    throw new Error(`KIE直链API响应异常: ${JSON.stringify(data)}`)
  }
  console.log('✅ KIE直链获取成功:', data.data)
  return data.data
}

/**
 * 从KIE AI下载图片并上传到R2
 * @param kieImageUrl KIE AI的图片URL
 * @param fileName 文件名（可选）
 * @param taskId 任务ID（可选）
 * @returns R2的永久URL
 */
export async function downloadAndUploadToR2(kieImageUrl: string, fileName?: string, taskId?: string): Promise<string> {
  try {
    let downloadUrl = kieImageUrl
    // 检测KIE AI URL
    if (isKieTemporaryUrl(kieImageUrl)) {
      // 1. 先换直链
      downloadUrl = await getKieDirectUrl(kieImageUrl, taskId)
    }
    console.log('📥 开始下载图片:', downloadUrl)
    // 2. 下载图片
    const response = await fetch(downloadUrl)
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`)
    }
    // 获取图片数据为Buffer
    const imageBuffer = Buffer.from(await response.arrayBuffer())
    // 生成文件名
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const defaultFileName = `kie-download-${timestamp}-${randomId}.png`
    const finalFileName = fileName || defaultFileName
    console.log('📤 开始上传到R2:', finalFileName)
    // 上传到R2生成图片存储桶
    const result = await uploadAfterimageToR2(imageBuffer, `kie-downloads/${finalFileName}`, 'image/png')
    console.log('✅ 成功上传到R2:', result.url)
    return result.url;
  } catch (error) {
    console.error('❌ 下载并上传到R2失败:', error)
    throw new Error(`下载并上传失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 批量下载并上传图片到R2
 * @param imageUrls KIE AI图片URL数组
 * @returns R2 URL数组
 */
export async function batchDownloadAndUploadToR2(imageUrls: string[]): Promise<string[]> {
  const results: string[] = []
  
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      // 这里也要传递contentType
      const r2Url = await downloadAndUploadToR2(imageUrls[i], `batch-${i + 1}.png`, undefined)
      results.push(r2Url)
      console.log(`✅ 批量处理 ${i + 1}/${imageUrls.length} 完成`)
    } catch (error) {
      console.error(`❌ 批量处理 ${i + 1}/${imageUrls.length} 失败:`, error)
      // 如果下载失败，保留原始URL作为备用
      results.push(imageUrls[i])
    }
  }
  
  return results
}

/**
 * 检查URL是否为KIE AI的临时URL
 * @param url 图片URL
 * @returns 是否为KIE AI URL
 */
export function isKieTemporaryUrl(url: string): boolean {
  // 排除R2域名，避免误判
  const r2Domains = [
    'r2.dev',
    'r2.cloudflarestorage.com',
    'pub-',
    'kemono-afterimage'
  ]
  
  // 检查是否包含R2域名特征
  const isR2Url = r2Domains.some(domain => url.includes(domain))
  if (isR2Url) {
    console.log(`🔍 KIE AI URL检测: ${url} -> 不是KIE AI URL (R2域名)`)
    return false
  }
  
  // 检查是否包含KIE AI的域名特征
  const kieDomains = [
    'kieai.com',
    'kie.ai',
    'api.kieai.com',
    'cdn.kieai.com',
    'kie-ai.com',
    'kieai.ai',
    'kie-ai.ai',
    'tempfile.aiquickdraw.com', // KIE AI的临时文件域名
    'aiquickdraw.com' // KIE AI的临时文件域名
  ]
  
  const isKieUrl = kieDomains.some(domain => url.includes(domain))
  console.log(`🔍 KIE AI URL检测: ${url} -> ${isKieUrl ? '是KIE AI URL' : '不是KIE AI URL'}`)
  
  return isKieUrl
}

/**
 * 智能处理图片URL：如果是KIE AI临时URL则下载到R2，否则直接返回
 * @param imageUrl 图片URL
 * @param fileName 文件名（可选）
 * @returns 永久URL
 */
export async function processImageUrl(imageUrl: string, fileName?: string): Promise<string> {
  if (isKieTemporaryUrl(imageUrl)) {
    console.log('🔄 检测到KIE AI临时URL，开始下载到R2')
    return await downloadAndUploadToR2(imageUrl, fileName)
  } else {
    console.log('✅ 检测到永久URL，直接使用')
    return imageUrl
  }
} 