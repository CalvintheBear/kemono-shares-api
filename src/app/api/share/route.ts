import { NextRequest, NextResponse } from 'next/server'

interface ShareData {
  id: string
  generatedUrl: string
  originalUrl: string
  prompt: string
  style: string
  timestamp: number
  createdAt: string
}

// 简单的内存存储（在生产环境中应该使用数据库）
const shareDataStore = new Map<string, ShareData>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { generatedUrl, originalUrl, prompt, style, timestamp } = body

    // 生成唯一的分享ID
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 存储分享数据
    const shareData: ShareData = {
      id: shareId,
      generatedUrl,
      originalUrl,
      prompt,
      style,
      timestamp,
      createdAt: new Date().toISOString()
    }
    
    shareDataStore.set(shareId, shareData)

    // 返回分享链接
    const shareUrl = `https://kemono-mimi.com/share/${shareId}`
    
    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
      data: shareData
    })
  } catch (error) {
    console.error('分享创建失败:', error)
    return NextResponse.json(
      { success: false, error: '分享の作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('id')
    
    if (!shareId) {
      return NextResponse.json(
        { success: false, error: 'シェアIDが必要です' },
        { status: 400 }
      )
    }

    const shareData = shareDataStore.get(shareId)
    
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