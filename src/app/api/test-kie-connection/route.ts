import { NextRequest, NextResponse } from 'next/server'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'

// 禁用静态生成，确保只在运行时执行
export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    const apiKey = process.env.KIE_AI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API密钥未配置' }, { status: 500 })
    }

    console.log('测试Kie.ai连接...')
    
    // 测试简单的GET请求到Kie.ai
    const testUrl = 'https://api.kie.ai'
    
    console.log(`尝试连接: ${testUrl}`)
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    })

    console.log(`连接状态: ${response.status}`)
    console.log(`响应头:`, Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log(`响应内容: ${responseText.substring(0, 200)}...`)

    return NextResponse.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 500)
    })

  } catch (error) {
    console.error('连接测试失败:', error)
    
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && 'code' in error ? (error as unknown as Record<string, unknown>).code : undefined,
      cause: error instanceof Error && 'cause' in error ? (error as unknown as Record<string, unknown>).cause : undefined
    }

    return NextResponse.json({
      success: false,
      error: errorDetails
    }, { status: 500 })
  }
} 