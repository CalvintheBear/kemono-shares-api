// Cloudflare Pages Functions 版本的 generate-image API
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const { prompt, style, size = '1:1', mode = 'template', fileUrl, enhancePrompt } = body;
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少提示词' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🎨 开始生成图片: ${prompt}, style: ${style}, size: ${size}, mode: ${mode}, fileUrl: ${fileUrl}`);
    
    // 获取 Kie.ai API 密钥
    const kieApiKey = env.KIE_AI_API_KEY;
    if (!kieApiKey) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 验证尺寸格式 - KIE AI API 只支持比例格式
    const supportedSizes = ['1:1', '3:2', '2:3'];
    let processedSize = size;
    
    // 如果传入的是像素格式，转换为比例格式
    if (size.includes('x')) {
      if (size === '1024x1024') {
        processedSize = '1:1';
      } else if (size === '1024x683') {
        processedSize = '3:2';
      } else if (size === '683x1024') {
        processedSize = '2:3';
      } else if (size === '1024x576') {
        processedSize = '16:9';
      } else if (size === '576x1024') {
        processedSize = '9:16';
      } else {
        // 默认使用1:1
        processedSize = '1:1';
      }
    }
    
    // 确保尺寸格式在支持范围内
    if (!supportedSizes.includes(processedSize)) {
      processedSize = '1:1';
    }
    
    console.log(`📏 尺寸转换: ${size} → ${processedSize}`);
    
    // 构建请求体 - 根据KIE AI官方示例代码
    const requestBody: any = {
      prompt: enhancePrompt ? `anime style, high quality, detailed, kawaii, ${prompt}` : prompt,
      size: processedSize,
      nVariants: 1,
      isEnhance: enhancePrompt || false,
      enableFallback: true,
      fallbackModel: "FLUX_MAX"
    };
    
    // 根据模式添加图片URL - 使用filesUrl而不是已废弃的fileUrl
    if (fileUrl && (mode === 'image-to-image' || mode === 'template')) {
      requestBody.filesUrl = [fileUrl];
      console.log(`📸 ${mode}模式添加参考图片URL: ${fileUrl}`);
    } else if (mode === 'text-to-image') {
      console.log(`📝 文本生成模式，不传递图片URL`);
    }
    
    // 添加回调URL（可选）
    if (env.NEXT_PUBLIC_APP_URL) {
      requestBody.callBackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/callback/image-generated`;
      console.log(`📞 设置回调URL: ${requestBody.callBackUrl}`);
    }
    
    console.log('📤 发送请求到 Kie.ai:', JSON.stringify(requestBody, null, 2));
    
    // 调用 Kie.ai 4o Image API
    const response = await fetch('https://api.kie.ai/api/v1/gpt4o-image/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kieApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Kie.ai API 调用失败: ${response.status} ${response.statusText}`, errorText);
      return new Response(JSON.stringify({ 
        error: '图片生成失败',
        status: response.status,
        message: response.statusText,
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    console.log(`✅ Kie.ai API 响应:`, data);
    
    // 使用Kie.ai返回的真实taskId
    const taskId = data.data?.taskId || data.taskId;
    
    if (!taskId) {
      console.error('❌ 无法获取taskId:', data);
      return new Response(JSON.stringify({ 
        error: '无法获取任务ID',
        response: data
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      taskId: taskId,
      message: '图片生成任务已创建',
      status: data.status || 'pending',
      data: data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ 图片生成失败:', error);
    return new Response(JSON.stringify({ 
      error: '图片生成失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 