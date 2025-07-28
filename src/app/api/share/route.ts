import { NextRequest, NextResponse } from 'next/server'
import { processImageUrl } from '@/lib/image-download-to-r2'
import { shareKVStore, initializeSampleData, ShareData } from '@/lib/share-store-kv'
import { clearShareCache } from '@/lib/share-cache'
import { monitor } from '@/lib/share-monitor'

// 用于检测重复请求的缓存
const requestCache = new Map<string, { timestamp: number, shareId: string }>()
const DUPLICATE_REQUEST_THRESHOLD = 5000 // 5秒内的重复请求阈值

export async function POST(request: NextRequest) {
  try {
    // 初始化示例数据
    initializeSampleData()
    
    const body = await request.json()
    const { generatedUrl, originalUrl, prompt, style, timestamp } = body

    console.log('🔄 开始处理分享请求:', { generatedUrl, style, originalUrl })
    
    // 注意：文生图时originalUrl应该为空或null，图生图时应该有值
    // 这个字段用于在share父页面过滤，只显示文生图生成的图片
    // 确保文生图时originalUrl为null，图生图时为有效URL

    // 检测重复请求
    const requestKey = `${generatedUrl}-${style}-${timestamp}`
    const now = Date.now()
    const existingRequest = requestCache.get(requestKey)
    
    if (existingRequest && (now - existingRequest.timestamp) < DUPLICATE_REQUEST_THRESHOLD) {
      console.log('⚠️ 检测到重复请求，返回现有分享ID:', existingRequest.shareId)
      const existingShareData = await shareKVStore.get(existingRequest.shareId)
      if (existingShareData) {
        const shareUrl = `https://2kawaii.com/share/${existingRequest.shareId}`
        return NextResponse.json({
          success: true,
          shareId: existingRequest.shareId,
          shareUrl,
          data: existingShareData,
          isDuplicate: true
        })
      }
    }

    // 处理生成的图片URL：如果是KIE AI临时URL则下载到R2
    let processedGeneratedUrl = generatedUrl
    let isR2Stored = false
    
    console.log('🔍 开始处理图片URL:', generatedUrl)
    
    try {
      processedGeneratedUrl = await processImageUrl(generatedUrl, `share-${style}-${timestamp}.png`)
      isR2Stored = true
      console.log('✅ 图片已处理并存储到R2:', processedGeneratedUrl)
    } catch (error) {
      console.error('❌ 图片处理失败，详细错误:', error)
      console.warn('⚠️ 使用原始URL作为备用:', generatedUrl)
      // 如果处理失败，继续使用原始URL
    }

    // 生成唯一的分享ID
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 存储分享数据
    // 确保文生图时originalUrl为null，图生图时为有效URL
    // 修复：更严格的originalUrl规范化
    let normalizedOriginalUrl = null
    if (originalUrl && 
        typeof originalUrl === 'string' && 
        originalUrl.trim() !== '' && 
        !originalUrl.startsWith('data:image/') && 
        !originalUrl.includes('placeholder.com') &&
        !originalUrl.includes('Text+to+Image') &&
        originalUrl.length <= 1000 && // 排除很长的base64数据
        !originalUrl.includes('base64')) { // 排除所有base64数据
      normalizedOriginalUrl = originalUrl
    }
    
    const shareData: ShareData = {
      id: shareId,
      generatedUrl: processedGeneratedUrl,
      originalUrl: normalizedOriginalUrl,
      prompt,
      style,
      timestamp,
      createdAt: new Date().toISOString(),
      isR2Stored,
      isTextToImage: !normalizedOriginalUrl
    }
    
    console.log('💾 存储分享数据:', { 
      shareId, 
      style, 
      originalUrl: normalizedOriginalUrl, 
      isTextToImage: !normalizedOriginalUrl 
    })
    
    await shareKVStore.set(shareId, shareData)
    
    // 缓存请求信息，用于检测重复请求
    requestCache.set(requestKey, { timestamp: now, shareId })
    
    // 清理过期的缓存（超过1小时的请求）
    const oneHourAgo = now - (60 * 60 * 1000)
    for (const [key, value] of requestCache.entries()) {
      if (value.timestamp < oneHourAgo) {
        requestCache.delete(key)
      }
    }

    // 清除相关缓存
    clearShareCache()
    
    // 监控分享创建
    monitor.shareCreated(shareId, { style, isR2Stored, timestamp })
    
    // 返回分享链接
    const shareUrl = `https://2kawaii.com/share/${shareId}`
    
    console.log('✅ 分享创建成功:', { shareId, shareUrl, isR2Stored })
    
    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
      data: shareData
    })
  } catch (error) {
    console.error('分享创建失败:', error)
    monitor.error(error, 'share-create-api')
    return NextResponse.json(
      { success: false, error: '分享の作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 初始化示例数据
    initializeSampleData()
    
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('id')
    
    if (!shareId) {
      return NextResponse.json(
        { success: false, error: 'シェアIDが必要です' },
        { status: 400 }
      )
    }

    const shareData = await shareKVStore.get(shareId)
    
    if (!shareData) {
      return NextResponse.json(
        { success: false, error: 'シェアデータが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: shareData
    })
  } catch (error) {
    console.error('分享数据获取失败:', error)
    return NextResponse.json(
      { success: false, error: 'シェアデータの取得に失敗しました' },
      { status: 500 }
    )
  }
} 