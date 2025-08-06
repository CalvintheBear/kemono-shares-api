// Cloudflare Pages Functions 版本的 generate-image API
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const { prompt, style, size = '1024x1024', mode = 'template' } = body;
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少提示词' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🎨 开始生成图片: ${prompt}, style: ${style}, size: ${size}, mode: ${mode}`);
    
    // 获取 Kie.ai API 密钥
    const kieApiKey = env.KIE_AI_API_KEY;
    if (!kieApiKey) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 根据 https://old-docs.kie.ai/4o-image-api/generate-4-o-image 文档构建请求
    const requestBody = {
      prompt: prompt,
      size: size,
      style: style || 'default',
      mode: mode,
      // 可以添加回调 URL
      callBackUrl: `${env.NEXT_PUBLIC_APP_URL}/api/callback/image-generated`
    };
    
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
    
    return new Response(JSON.stringify({
      success: true,
      taskId: data.taskId || `task_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
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