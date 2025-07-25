import { NextRequest, NextResponse } from 'next/server'

// KIE AI API 配置
const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY
const KIE_AI_BASE_URL = process.env.KIE_AI_BASE_URL || 'https://api.kie.ai'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: '缺少必需的参数: url' },
        { status: 400 }
      )
    }

    if (!KIE_AI_API_KEY) {
      console.error('❌ KIE AI API密钥未配置')
      return NextResponse.json(
        { error: 'KIE AI API密钥未配置' },
        { status: 500 }
      )
    }

    console.log('🔗 获取直接下载URL，原始URL:', url)

    // 调用KIE AI的下载URL API
    const response = await fetch(`${KIE_AI_BASE_URL}/api/v1/gpt4o-image/download-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_AI_API_KEY}`,
      },
      body: JSON.stringify({ url })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ KIE AI 下载URL API错误:', errorData)
      return NextResponse.json(
        { error: '获取下载URL失败', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ 下载URL获取成功:', data)

    // 根据KIE AI API响应结构返回下载URL
    return NextResponse.json({
      downloadUrl: data.download_url || data.url || url,
      expiresAt: data.expires_at,
      success: true
    })

  } catch (error) {
    console.error('❌ 获取下载URL失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 