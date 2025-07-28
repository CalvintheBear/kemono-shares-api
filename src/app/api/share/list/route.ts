import { NextRequest, NextResponse } from 'next/server'
import { shareKVStore, initializeSampleData } from '@/lib/share-store-kv'
import { getShareListCache, setShareListCache } from '@/lib/share-cache'
import { monitor } from '@/lib/share-monitor'

interface ShareListItem {
  id: string
  title: string
  style: string
  timestamp: string
  createdAt: string
  generatedUrl: string
  originalUrl: string | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const clearCache = searchParams.get('clearCache') === 'true'
    const debug = searchParams.get('debug') === 'cache'
    
    const startTime = Date.now()
    
    // 清除缓存
    if (clearCache) {
      const { clearShareCache } = await import('@/lib/share-cache')
      clearShareCache()
      console.log('🧹 缓存已清除')
      return NextResponse.json({ success: true, message: '缓存已清除' })
    }
    
    // 检查缓存
    const cachedData = getShareListCache(limit, offset)
    if (cachedData && !debug) {
      monitor.cacheHit(`share-list-${limit}-${offset}`)
      console.log('📦 从缓存返回分享列表数据')
      return NextResponse.json(cachedData)
    }
    
    monitor.cacheMiss(`share-list-${limit}-${offset}`)
    
    // 初始化存储
    initializeSampleData()
    
    // 从存储中获取所有数据
    const allShares = await shareKVStore.getAll()
    
    // 数据已经按时间排序，直接使用
    const sortedShares = allShares
    
    // 过滤：只显示文生图生成的图片在画廊中
    // 文生图：originalUrl为null、undefined、空字符串、base64数据或占位符
    // 图生图和模板模式：有有效的originalUrl，不在画廊显示
    const textToImageShares = sortedShares.filter(share => {
      // 更严格的筛选：任何有originalUrl的都应该被排除
      const hasValidOriginalUrl = share.originalUrl && 
        typeof share.originalUrl === 'string' && 
        share.originalUrl.trim() !== '' &&
        !share.originalUrl.startsWith('data:image/') &&
        !share.originalUrl.includes('placeholder.com') &&
        !share.originalUrl.includes('Text+to+Image') &&
        !share.originalUrl.includes('base64') &&
        share.originalUrl.length <= 1000
      
      // 只有完全没有originalUrl或originalUrl无效的才显示在画廊中
      const isTextToImage = !hasValidOriginalUrl
      
      // 添加调试日志
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 筛选检查 - ID: ${share.id}, Style: ${share.style}, OriginalUrl: ${share.originalUrl}, IsTextToImage: ${isTextToImage}`)
      }
      
      return isTextToImage
    })
    
    console.log(`📊 过滤结果: 总共${sortedShares.length}个分享，文生图${textToImageShares.length}个（画廊显示）`)
    
    // 转换为列表项格式
    const shareList: ShareListItem[] = textToImageShares.map(share => ({
      id: share.id,
      title: `${share.style}変換`,
      style: share.style,
      timestamp: new Date(share.timestamp).toLocaleDateString('ja-JP'),
      createdAt: share.createdAt,
      generatedUrl: share.generatedUrl,
      originalUrl: share.originalUrl
    }))
    
    // 分页处理
    const paginatedList = shareList.slice(offset, offset + limit)
    
    const responseData = {
      success: true,
      data: {
        items: paginatedList,
        total: shareList.length,
        limit,
        offset,
        hasMore: offset + limit < shareList.length
      }
    }
    
    // 设置缓存
    setShareListCache(responseData, limit, offset)
    console.log('💾 分享列表数据已缓存')
    
    // 记录处理时间
    const processingTime = Date.now() - startTime
    monitor.processingTime(processingTime)
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('分享列表获取失败:', error)
    monitor.error(error, 'share-list-api')
    return NextResponse.json(
      { success: false, error: 'シェアリストの取得に失敗しました' },
      { status: 500 }
    )
  }
} 