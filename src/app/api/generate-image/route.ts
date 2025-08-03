import { NextRequest, NextResponse } from 'next/server'
import { getApiKeyRotation } from '@/lib/api-key-rotation'

// Cloudflare Pages 需要 Edge Runtime
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileUrl, prompt, enhancePrompt, size } = body

    // 可配置的API端点 - 支持代理和备用域名
    const baseUrl = process.env.KIE_AI_BASE_URL || 'https://api.kie.ai'
    const generateEndpoint = `${baseUrl}/api/v1/gpt4o-image/generate`
    const recordEndpoint = `${baseUrl}/api/v1/gpt4o-image/record-info`

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

    // 调试环境变量加载情况
    console.log('🔧 使用API密钥:', `${apiKey.substring(0, 8)}...`)
    console.log('- 用户ID:', defaultUserId ? '✅ 已设置' : '❌ 未设置')
    console.log('- 生成端点:', generateEndpoint)
    console.log('- 查询端点:', recordEndpoint)

    if (!prompt) {
      return NextResponse.json(
        { error: '缺少必要参数：prompt' },
        { status: 400 }
      )
    }

    // 根据Kie.ai官方文档的API参数
    interface GenerateRequestData {
      prompt: string
      filesUrl?: string[]       // 参考图片URL数组 - 用于图生图
      size?: string             // 图片比例，支持: "1:1", "3:2", "2:3"
      callBackUrl?: string      // 回调URL（可选）
      isEnhance?: boolean       // 是否增强（可选）
      uploadCn?: boolean        // 是否上传到中国服务器（可选）
      nVariants?: number        // 生成变体数量（可选）
      enableFallback?: boolean  // 是否启用备用模型（可选）
      fallbackModel?: string    // 备用模型名称（可选）
    }

    // 增强提示词处理
    let finalPrompt = prompt
    if (enhancePrompt) {
      finalPrompt = `anime style, high quality, detailed, kawaii, ${prompt}`
      console.log('✨ 使用增强提示词:', finalPrompt)
    }

    // 组装官方格式请求体
    const requestData: GenerateRequestData & { model: string; userId: string } = {
      prompt: finalPrompt,
      model: 'gpt-4o-image',
      userId: defaultUserId
    }

    // 根据Kie.ai官方文档设置尺寸比例
    // 支持的比例: "1:1", "3:2", "2:3"
    const supportedSizes = ['1:1', '3:2', '2:3']
    
    if (size && supportedSizes.includes(size)) {
      requestData.size = size
      console.log(`📏 设置图片比例: ${size} (Kie.ai API支持)`)
    } else {
      // 默认比例
      requestData.size = '1:1'
      console.log('📏 使用默认图片比例: 1:1')
    }

    // 如果前端传来图片 URL，则转换为数组格式
    if (fileUrl && fileUrl !== 'undefined' && !fileUrl.startsWith('data:')) {
      requestData.filesUrl = [fileUrl]
      console.log('📎 使用输入图片URL:', fileUrl)
    } else {
      console.log('📝 仅使用文本提示生成图片 (文生图模式)')
    }

    console.log('🚀 发送请求到 Kie.ai 4o-image API...')
    console.log('📊 收到的原始参数:', {
      mode: fileUrl ? 'image-to-image' : 'template-mode',
      prompt: finalPrompt,
      fileUrl: requestData.filesUrl ? `${requestData.filesUrl[0].substring(0, 50)}...` : '无',
      size: requestData.size
    })
    console.log('📊 最终请求数据:', {
      prompt: finalPrompt,
      filesUrl: requestData.filesUrl ? requestData.filesUrl : '无',
      model: 'gpt-4o-image',
      userId: defaultUserId,
      size: requestData.size
    })

// 代理配置检查
    const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY
    console.log('🌐 代理配置:', proxyUrl || '无代理')
    
    // Next.js会自动使用环境变量中的代理配置
    // HTTP_PROXY 和 HTTPS_PROXY 环境变量会被Node.js fetch自动使用
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    }
    
    console.log('🔑 使用 Authorization 头:', `Bearer ${apiKey.substring(0, 8)}...`)
    console.log('🌐 生成端点:', generateEndpoint)
    const generateResponse = await fetch(generateEndpoint, fetchOptions)

    console.log('📡 API响应状态:', generateResponse.status)
    console.log('📡 响应头:', Object.fromEntries(generateResponse.headers.entries()))

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text()
      console.error('❌ Kie.ai 4o-image API错误:', {
        status: generateResponse.status,
        statusText: generateResponse.statusText,
        response: errorText,
        keyUsed: apiKey.substring(0, 8) + '...'
      })
      
      let errorMessage = `Kie.ai 4o-image API错误: ${generateResponse.status}`
      
      if (generateResponse.status === 401) {
        errorMessage = 'API密钥无效或已过期，请检查 KIE_AI_API_KEY 配置'
      } else if (generateResponse.status === 403) {
        errorMessage = 'API密钥权限不足或账户被限制'
      } else if (generateResponse.status === 422) {
        errorMessage = '请求参数错误，请检查尺寸设置或其他参数'
      } else if (generateResponse.status === 429) {
        errorMessage = 'API调用频率超限，请稍后再试'
      }
      
      return NextResponse.json({
        error: errorMessage,
        details: errorText,
        endpoint: generateEndpoint,
        status: generateResponse.status
      }, { status: generateResponse.status })
    }

    const generateData = await generateResponse.json()
    console.log('✅ 任务创建响应:', generateData)
    
    // 解析响应获取任务ID
    const taskId = generateData.taskId || generateData.data?.taskId || generateData.id

    if (!taskId) {
      console.error('❌ 无法获取任务ID，完整响应:', generateData)
      return NextResponse.json({
        error: '无法获取任务ID',
        response: generateData
      }, { status: 500 })
    }

    console.log('🎯 任务ID已获取:', taskId)

    // 第二步：轮询状态直到完成
    const maxAttempts = 60 // 最多5分钟
    let attempts = 0
    
    // 记录生成参数用于轮询日志
    const generationParams = {
      enhancePrompt: enhancePrompt,
      promptLength: finalPrompt.length
    }
    console.log('📊 生成参数:', generationParams)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // 等待5秒
      attempts++

      const statusUrl = `${recordEndpoint}?taskId=${taskId}&userId=${encodeURIComponent(defaultUserId)}`
      const enhanceStatus = enhancePrompt ? '✅已启用' : '❌未启用'
      console.log(`🔍 状态查询 (第${attempts}次) - 增强:${enhanceStatus}:`, statusUrl)

      try {
        const statusResponse = await fetch(statusUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          }
        })

        if (!statusResponse.ok) {
          console.error(`❌ 状态查询失败 (第${attempts}次):`, statusResponse.status, statusResponse.statusText)
          
          if (statusResponse.status === 401 || statusResponse.status === 403) {
            throw new Error(`认证失败: ${statusResponse.status}`)
          }
          
          if (attempts >= maxAttempts) {
            throw new Error(`状态查询失败: ${statusResponse.status}`)
          }
          continue
        }

        const statusData = await statusResponse.json()
        console.log(`📋 状态查询结果 (第${attempts}次):`, statusData)

        if (statusData.code !== 200 && statusData.code !== 0) {
          console.error(`❌ API错误 (第${attempts}次):`, statusData.message || statusData.msg)
          if (attempts >= maxAttempts) {
            throw new Error(`API错误: ${statusData.message || statusData.msg}`)
          }
          continue
        }

        // 检查任务状态
        const taskData = statusData.data || statusData
        
        if (taskData.status === 'SUCCESS' || taskData.status === 'COMPLETED' || taskData.finished === true) {
          const enhanceStatus = enhancePrompt ? '✅已启用' : '❌未启用'
          console.log(`🎉 任务完成 - 增强:${enhanceStatus}，获取结果URLs...`)
          
          // 根据官方API文档解析结果URL
          let resultUrls = []
          
          // 新的API格式：response.resultUrls
          if (taskData.response && taskData.response.resultUrls) {
            resultUrls = Array.isArray(taskData.response.resultUrls) ? taskData.response.resultUrls : [taskData.response.resultUrls]
          }
          // 兼容旧格式
          else if (taskData.imageUrls || taskData.urls || taskData.results) {
            resultUrls = taskData.imageUrls || taskData.urls || taskData.results
          }
          // 单个URL
          else if (taskData.imageUrl) {
            resultUrls = [taskData.imageUrl]
          }
          
          // 确保是数组并过滤空值
          resultUrls = Array.isArray(resultUrls) ? resultUrls.filter(Boolean) : []
          
          if (resultUrls && resultUrls.length > 0) {
            console.log('🖼️ 获取到的结果URLs:', resultUrls)
            
            // Record successful API key usage
            rotation.recordSuccess(apiKey)
            
            return NextResponse.json({
              success: true,
              mode: 'external',
              url: resultUrls[0],
              urls: resultUrls,
              taskId: taskId,
              generation_count: resultUrls.length,
              api_key_used: apiKey.substring(0, 8) + '...'
            })
          } else {
            console.error('❌ 任务完成但未找到结果图片URL，完整数据:', taskData)
            throw new Error('任务完成但未找到结果图片URL')
          }
        } else if (taskData.status === 'FAILED' || taskData.status === 'ERROR' || taskData.status === 'GENERATE_FAILED' || 
                   taskData.successFlag === 3) {
          console.error('❌ 图像生成失败详情:', {
            status: taskData.status,
            successFlag: taskData.successFlag,
            errorCode: taskData.errorCode,
            errorMessage: taskData.errorMessage,
            fullData: taskData
          })
          
          // 检查是否是需要中断轮询的特定错误
          const errorMsg = taskData.errorMessage || taskData.error || ''
          if (errorMsg.includes('Failed to fetch the image') || 
              errorMsg.includes('access limits') || 
              errorMsg.includes('Kindly verify any access limits')) {
            throw new Error(`图像获取失败: ${errorMsg}`)
          }
          
          // 直接返回失败响应，不抛出异常
          return NextResponse.json({
            error: `图像生成失败: ${errorMsg || '未知错误'}`,
            details: `状态: ${taskData.status}, successFlag: ${taskData.successFlag}, 错误码: ${taskData.errorCode}`,
            taskId: taskId,
            api_key_used: apiKey.substring(0, 8) + '...'
          }, { status: 400 })
        }

        // 任务仍在进行中
        const enhanceStatus = enhancePrompt ? '✅已启用' : '❌未启用'
        console.log(`⏳ 任务进行中 - 状态:${taskData.status || '未知'} 增强:${enhanceStatus}`)
        
      } catch (fetchError) {
        console.error(`❌ 状态查询网络错误 (第${attempts}次):`, fetchError)
        
        if (attempts >= maxAttempts) {
          throw new Error(`网络连接失败，已尝试 ${maxAttempts} 次`)
        }
        
        console.log(`⏸️ 网络错误，等待10秒后重试...`)
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    }

    // 如果循环结束还没完成，返回超时错误
    throw new Error('任务处理超时，请稍后重试')

  } catch (error) {
    console.error('💥 API 路由错误:', error)
    
    // Record API key failure if we have the rotation instance
    try {
      const rotation = getApiKeyRotation()
      const currentKeyInfo = rotation.getNextKey()
      if (currentKeyInfo) {
        rotation.recordFailure(currentKeyInfo.key)
        console.log('📊 当前API密钥状态:', rotation.getStats())
      }
    } catch (e) {
      console.error('❌ Failed to record API key failure:', e)
    }
    
    // 网络连接错误的特殊处理
    const errorMessage = error instanceof Error ? error.message : '图像生成失败'
    let userMessage = errorMessage
    let details = error instanceof Error ? error.stack : undefined
    
    if (errorMessage.includes('ECONNRESET') || errorMessage.includes('fetch failed')) {
      userMessage = '网络连接失败，无法连接到Kie.ai服务。'
      details = '请检查：1. 代理服务器是否运行正常 (127.0.0.1:26001) 2. 网络连接 3. 防火墙设置'
    }
    
    // 检查代理配置
    const proxyConfig = process.env.HTTP_PROXY || process.env.HTTPS_PROXY
    console.error('🔍 当前代理配置:', proxyConfig || '未配置代理')
    
    return NextResponse.json({
      error: userMessage,
      details: details,
      networkIssue: errorMessage.includes('ECONNRESET') || errorMessage.includes('fetch failed'),
      proxyConfigured: !!proxyConfig,
      proxyUrl: proxyConfig,
      suggestion: '请确保代理服务器在 127.0.0.1:26001 正常运行'
    }, { status: 500 })
  }
} 