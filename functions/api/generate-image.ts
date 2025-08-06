// Cloudflare Pages Functions 版本的 generate-image API
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const { prompt, style, size = '1024x1024', mode = 'template', fileUrl, enhancePrompt } = body;
    
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
    
    // 处理尺寸格式 - 将比例转换为具体像素尺寸
    let processedSize = size;
    if (size === '1:1') {
      processedSize = '1024x1024';
    } else if (size === '3:2') {
      processedSize = '1024x683';
    } else if (size === '2:3') {
      processedSize = '683x1024';
    } else if (size === '16:9') {
      processedSize = '1024x576';
    } else if (size === '9:16') {
      processedSize = '576x1024';
    }
    
    // 构建请求体
    const requestBody: any = {
      prompt: enhancePrompt ? `anime style, high quality, detailed, kawaii, ${prompt}` : prompt,
      size: processedSize,
      style: style || 'default',
      mode: mode,
      callBackUrl: `${env.NEXT_PUBLIC_APP_URL || 'https://2kawaii.com'}/api/callback/image-generated`
    };
    
    // 如果是image-to-image模式，添加图片URL
    if (mode === 'image-to-image' && fileUrl) {
      requestBody.imageUrl = fileUrl;
      console.log(`📸 添加参考图片URL: ${fileUrl}`);
    }
    
    // 如果是template模式且有fileUrl，也添加图片URL
    if (mode === 'template' && fileUrl) {
      requestBody.imageUrl = fileUrl;
      console.log(`📸 模板模式添加参考图片URL: ${fileUrl}`);
    }
    
    // 如果是text-to-image模式，确保不传递imageUrl
    if (mode === 'text-to-image') {
      delete requestBody.imageUrl;
      console.log(`📝 文本生成模式，不传递图片URL`);
    }
    
    console.log('📤 发送请求到 Kie.ai:', requestBody);
    
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