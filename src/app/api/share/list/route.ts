import { NextRequest, NextResponse } from 'next/server'

// 这里需要导入你的 shareDataStore
// 由于 shareDataStore 在另一个文件中，我们需要创建一个共享的存储
// 暂时使用模拟数据，你可以根据需要修改

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
    
    // 这里应该从你的数据库中获取数据
    // 暂时返回模拟数据
    const mockShareList: ShareListItem[] = [
      {
        id: 'share_1732540800000_abc123def',
        title: 'ジブリ風変換',
        style: 'ジブリ風',
        timestamp: '2024-07-26',
        createdAt: '2024-07-26T10:00:00.000Z'
      },
      {
        id: 'share_1732454400000_xyz789ghi',
        title: 'VTuber風変換',
        style: 'VTuber風',
        timestamp: '2024-07-25',
        createdAt: '2024-07-25T15:30:00.000Z'
      },
      {
        id: 'share_1732368000000_mno456pqr',
        title: 'ウマ娘風変換',
        style: 'ウマ娘風',
        timestamp: '2024-07-24',
        createdAt: '2024-07-24T12:15:00.000Z'
      },
      {
        id: 'share_1732281600000_stu123vwx',
        title: 'アニメ風変換',
        style: 'アニメ風',
        timestamp: '2024-07-23',
        createdAt: '2024-07-23T09:45:00.000Z'
      },
      {
        id: 'share_1732195200000_yz123abc',
        title: 'ファンタジー風変換',
        style: 'ファンタジー風',
        timestamp: '2024-07-22',
        createdAt: '2024-07-22T16:20:00.000Z'
      }
    ]

    // 分页处理
    const paginatedList = mockShareList.slice(offset, offset + limit)
    
    return NextResponse.json({
      success: true,
      data: {
        items: paginatedList,
        total: mockShareList.length,
        limit,
        offset,
        hasMore: offset + limit < mockShareList.length
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