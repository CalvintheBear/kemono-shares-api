import { NextRequest, NextResponse } from 'next/server'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'
import { getApiKeyRotation } from '@/lib/api-key-rotation'

// 专为Cloudflare Workers优化的轮询端点
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taskId = searchParams.get('taskId')
    const baseUrl = 'https://api.kie.ai/api/v1/gpt4o-image'

    if (!taskId) {
      return NextResponse.json(
        { error: '缺少必要参数：taskId' },
        { status: 400 }
      )
    }

    const rotation = getApiKeyRotation()
    const keyInfo = rotation.getNextKey()

    if (!keyInfo) {
      return NextResponse.json(
        { error: 'No API keys available' },
        { status: 500 }
      )
    }

    const { key: apiKey, userId: defaultUserId } = keyInfo

    // 构建查询URL
    const query = new URLSearchParams({ taskId: taskId })
    if (defaultUserId) query.append('userId', defaultUserId)
    
    const statusUrl = `${baseUrl}/record-info?${query.toString()}`

    // 查询任务状态
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({
        error: '查询失败',
        status: response.status
      }, { status: response.status })
    }

    const data = await response.json()
    const responseData = data.data || data
    
    // 解析结果
    let resultUrls = []
    let status = 'PENDING'
    let progress = 0

    if (responseData.status === 'SUCCESS' || responseData.finished === true) {
      status = 'SUCCESS'
      progress = 100
      
      // 提取结果URL
      if (responseData.response?.resultUrls) {
        resultUrls = Array.isArray(responseData.response.resultUrls) 
          ? responseData.response.resultUrls 
          : [responseData.response.resultUrls]
      } else if (responseData.imageUrls || responseData.urls) {
        resultUrls = responseData.imageUrls || responseData.urls
      } else if (responseData.imageUrl) {
        resultUrls = [responseData.imageUrl]
      }
      
      resultUrls = resultUrls.filter(Boolean)
      
    } else if (responseData.status === 'FAILED' || responseData.status === 'ERROR') {
      status = 'FAILED'
      progress = 0
    } else {
      // 计算进度
      status = responseData.status || 'PENDING'
      progress = responseData.progress || Math.min(responseData.attempts * 10, 95)
    }

    return NextResponse.json({
      success: true,
      taskId: taskId,
      status: status,
      progress: progress,
      urls: resultUrls,
      error: responseData.errorMessage || responseData.error,
      updatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('轮询错误:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : '轮询失败',
      status: 'ERROR'
    }, { status: 500 })
  }
}