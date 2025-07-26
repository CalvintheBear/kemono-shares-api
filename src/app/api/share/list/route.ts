import { NextRequest, NextResponse } from 'next/server'
import { shareDataStore, initializeSampleData } from '@/lib/share-store'

interface ShareListItem {
  id: string
  title: string
  style: string
  timestamp: string
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // 初始化示例数据
    initializeSampleData()
    
    // 从存储中获取所有数据
    const allShares = Array.from(shareDataStore.values())
    
    // 按创建时间排序（最新的在前）
    const sortedShares = allShares.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    // 转换为列表项格式
    const shareList: ShareListItem[] = sortedShares.map(share => ({
      id: share.id,
      title: `${share.style}変換`,
      style: share.style,
      timestamp: new Date(share.timestamp).toLocaleDateString('ja-JP'),
      createdAt: share.createdAt
    }))
    
    // 分页处理
    const paginatedList = shareList.slice(offset, offset + limit)
    
    return NextResponse.json({
      success: true,
      data: {
        items: paginatedList,
        total: shareList.length,
        limit,
        offset,
        hasMore: offset + limit < shareList.length
      }
    })
  } catch (error) {
    console.error('分享列表获取失败:', error)
    return NextResponse.json(
      { success: false, error: 'シェアリストの取得に失敗しました' },
      { status: 500 }
    )
  }
} 