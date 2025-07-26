import { NextRequest, NextResponse } from 'next/server'
import { processImageUrl } from '@/lib/image-download-to-r2'

interface ShareData {
  id: string
  generatedUrl: string
  originalUrl: string
  prompt: string
  style: string
  timestamp: number
  createdAt: string
  isR2Stored?: boolean // 标记是否已存储到R2
}

// 简单的内存存储（在生产环境中应该使用数据库）
const shareDataStore = new Map<string, ShareData>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { generatedUrl, originalUrl, prompt, style, timestamp } = body

    console.log('🔄 开始处理分享请求:', { generatedUrl, style })

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
    const shareData: ShareData = {
      id: shareId,
      generatedUrl: processedGeneratedUrl,
      originalUrl,
      prompt,
      style,
      timestamp,
      createdAt: new Date().toISOString(),
      isR2Stored
    }
    
    shareDataStore.set(shareId, shareData)

    // 返回分享链接
    const shareUrl = `https://kemono-mimi.com/share/${shareId}`
    
    console.log('✅ 分享创建成功:', { shareId, shareUrl, isR2Stored })
    
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