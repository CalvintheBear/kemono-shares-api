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
  generationType: 'text2img' | 'img2img' | 'template'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const clearCache = searchParams.get('clearCache') === 'true'
    const debug = searchParams.get('debug') === 'cache'
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    
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
    
    // 按指定字段和顺序排序
    const sortedShares = [...allShares].sort((a, b) => {
      const aValue = a[sort as keyof typeof a]
      const bValue = b[sort as keyof typeof b]
      
      // 处理可能的null/undefined值
      const aVal = aValue ?? ''
      const bVal = bValue ?? ''
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    
    // 过滤：只显示文生图生成的图片在画廊中
    const textToImageShares = sortedShares.filter(share => {
      // 优先使用 isTextToImage 字段
      if (typeof share.isTextToImage === 'boolean') {
        return share.isTextToImage
      }
      
      // 文生图检测：originalUrl 为空或无效
      const hasValidOriginalUrl = share.originalUrl && 
        typeof share.originalUrl === 'string' && 
        share.originalUrl.trim() !== '' &&
        share.originalUrl !== 'null' &&
        share.originalUrl !== null &&
        share.originalUrl !== undefined
      
      return !hasValidOriginalUrl
    })
    
    console.log(`📊 过滤结果: 总共${sortedShares.length}个分享，文生图${textToImageShares.length}个（画廊显示）`)
    
    // 调试：列出所有被过滤掉的分享
    const filteredOut = sortedShares.filter(share => {
      if (typeof share.isTextToImage === 'boolean') return !share.isTextToImage;
      const hasValidOriginalUrl = share.originalUrl && 
        typeof share.originalUrl === 'string' && 
        share.originalUrl.trim() !== '' &&
        !share.originalUrl.startsWith('data:image/') &&
        !share.originalUrl.includes('placeholder.com') &&
        !share.originalUrl.includes('Text+to+Image') &&
        !share.originalUrl.includes('base64') &&
        share.originalUrl.length <= 1000;
      return hasValidOriginalUrl;
    });
    
    console.log(`🚫 被过滤掉的分享: ${filteredOut.length}个`);
    filteredOut.forEach(share => {
      console.log(`   - ${share.id}: ${share.style}, originalUrl: ${share.originalUrl}, isTextToImage: ${share.isTextToImage}`);
    });
    
    // 转换为列表项格式
    const shareList: ShareListItem[] = textToImageShares.map(share => ({
      id: share.id,
      title: `${share.style}変換`,
      style: share.style,
      timestamp: new Date(share.timestamp).toLocaleDateString('ja-JP'),
      createdAt: share.createdAt,
      generatedUrl: share.generatedUrl,
      originalUrl: share.originalUrl,
      generationType: share.isTextToImage ? 'text2img' : 
                     (share.originalUrl && share.originalUrl !== 'null' && share.originalUrl.trim() !== '') ? 
                     'img2img' : 'template'
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