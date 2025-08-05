import { NextRequest, NextResponse } from 'next/server'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'
import { getApiKeyRotation } from '@/lib/api-key-rotation'

// Edge Runtime 兼容
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const recordId = searchParams.get('taskId')
    const baseUrl = 'https://api.kie.ai/api/v1/gpt4o-image'

    // Use API key rotation for consistency
    const rotation = getApiKeyRotation()
    const keyInfo = rotation.getNextKey()

    if (!keyInfo) {
      return NextResponse.json(
        { error: 'No available API keys found' },
        { status: 500 }
      )
    }

    const { key: apiKey, userId: defaultUserId } = keyInfo

    if (!recordId) {
      return NextResponse.json(
        { error: '缺少必要参数：taskId' },
        { status: 400 }
      )
    }

    console.log('获取图片详情，taskId:', recordId, '使用API密钥:', apiKey.substring(0, 8) + '...')

    // 构建查询参数，根据KIE AI官方文档使用正确的参数名
    const query = new URLSearchParams({ taskId: recordId })
    if (defaultUserId) query.append('userId', defaultUserId)

    // 调用Kie.ai 4o Image API获取详情
    const response = await fetch(`${baseUrl}/record-info?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Kie.ai 4o Image 详情API 错误:', errorData)
      return NextResponse.json(
        { error: '获取图片详情失败', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('图片详情响应:', data)

    return NextResponse.json(data)

  } catch (error) {
    console.error('图片详情API路由错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 