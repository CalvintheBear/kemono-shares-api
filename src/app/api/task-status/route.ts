import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const apiKey = process.env.KIE_AI_API_KEY
    const defaultUserId = process.env.KIE_AI_USER_ID

    if (!taskId) {
      return NextResponse.json(
        { error: '缺少taskId参数' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      )
    }

    console.log(`查询任务状态: ${taskId}`)

    // 直接查询Kie.ai官方API
    const baseUrl = process.env.KIE_AI_BASE_URL || 'https://api.kie.ai'
    const recordEndpoint = `${baseUrl}/api/v1/gpt4o-image/record-info`
    
    const response = await fetch(`${recordEndpoint}?taskId=${taskId}${defaultUserId ? `&userId=${encodeURIComponent(defaultUserId)}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Kie.ai API错误:', response.status, errorText)
      return NextResponse.json(
        { error: '查询任务状态失败', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(`任务 ${taskId} 状态:`, data)

    // 直接返回官方API的响应格式
    return NextResponse.json(data)

  } catch (error) {
    console.error('查询任务状态失败:', error)
    
    return NextResponse.json({
      error: '查询任务状态失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 