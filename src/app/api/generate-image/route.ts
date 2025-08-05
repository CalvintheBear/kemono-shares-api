import { NextRequest, NextResponse } from 'next/server'
import { getApiKeyRotation } from '@/lib/api-key-rotation'

// 针对生产环境的优化：使用 Railway 部署
export const runtime = 'nodejs'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileUrl, prompt, enhancePrompt, size } = body

    // 可配置的API端点
    const baseUrl = process.env.KIE_AI_BASE_URL || 'https://api.kie.ai'
    const generateEndpoint = `${baseUrl}/api/v1/gpt4o-image/generate`

    // Initialize API key rotation
    const rotation = getApiKeyRotation()
    const keyInfo = rotation.getNextKey()

    if (!keyInfo) {
      return NextResponse.json(
        { error: 'No available API keys found. Please check your environment variables.' },
        { status: 500 }
      )
    }

    const { key: apiKey, userId: defaultUserId } = keyInfo

    if (!prompt) {
      return NextResponse.json(
        { error: '缺少必要参数：prompt' },
        { status: 400 }
      )
    }

    // 增强提示词处理
    let finalPrompt = prompt
    if (enhancePrompt) {
      finalPrompt = `anime style, high quality, detailed, kawaii, ${prompt}`
    }

    // 组装请求体
    interface GenerateRequestData {
      prompt: string
      model: string
      userId: string
      size?: string
      filesUrl?: string[]
    }

    const requestData: GenerateRequestData = {
      prompt: finalPrompt,
      model: 'gpt-4o-image',
      userId: defaultUserId,
      size: size || '1:1',
      filesUrl: undefined // 初始化为undefined
    }

    // 图生图模式添加文件URL
    if (fileUrl && fileUrl !== 'undefined' && !fileUrl.startsWith('data:')) {
      requestData.filesUrl = [fileUrl]
    }

    console.log('🚀 创建生成任务...', { 
      mode: fileUrl ? 'image-to-image' : 'text-to-image',
      promptLength: finalPrompt.length,
      hasFileUrl: !!fileUrl 
    })

    const generateResponse = await fetch(generateEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text()
      console.error('❌ KIE API 错误:', {
        status: generateResponse.status,
        statusText: generateResponse.statusText,
        response: errorText.substring(0, 200)
      })
      
      return NextResponse.json({
        error: `API错误: ${generateResponse.status}`,
        details: errorText,
        status: generateResponse.status
      }, { status: generateResponse.status })
    }

    const generateData = await generateResponse.json()
    const taskId = generateData.taskId || generateData.data?.taskId || generateData.id

    if (!taskId) {
      console.error('❌ 无法获取任务ID:', generateData)
      return NextResponse.json({
        error: '无法获取任务ID',
        response: generateData
      }, { status: 500 })
    }

    console.log('✅ 任务创建成功:', taskId)

    // 立即返回任务ID，避免超时
    return NextResponse.json({
      success: true,
      taskId: taskId,
      mode: fileUrl ? 'image-to-image' : 'text-to-image',
      prompt: finalPrompt,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 创建任务失败:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : '任务创建失败',
      type: error?.constructor?.name || 'UnknownError'
    }, { status: 500 })
  }
}