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
    
    // 获取 Kie.ai API 密钥池（最多5个）并做并发分流（随机挑选），遇到失败再顺序回退
    const keyPool = [
      env.KIE_AI_API_KEY,
      env.KIE_AI_API_KEY_2,
      env.KIE_AI_API_KEY_3,
      env.KIE_AI_API_KEY_4,
      env.KIE_AI_API_KEY_5,
    ].filter((k: string | undefined) => !!k) as string[];
    if (keyPool.length === 0) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // 随机起点，提升并发分流效果
    let start = Math.floor(Math.random() * keyPool.length);
    
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
    // 支持前端的 template-mode 模式
    const imageBasedModes = ['image-to-image', 'template', 'template-mode'];
    if (fileUrl && imageBasedModes.includes(mode)) {
      requestBody.filesUrl = [fileUrl];
      console.log(`📸 ${mode}模式添加参考图片URL: ${fileUrl}`);
    } else if (mode === 'text-to-image') {
      console.log(`📝 文本生成模式，不传递图片URL`);
    } else if (fileUrl) {
      // 如果有fileUrl但模式不匹配，仍然添加filesUrl以确保参考图片被使用
      requestBody.filesUrl = [fileUrl];
      console.log(`📸 检测到图片URL，强制添加到请求中: ${fileUrl}`);
    }
    
    // 添加回调URL（可选）
    if (env.NEXT_PUBLIC_APP_URL) {
      requestBody.callBackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/callback/image-generated`;
      console.log(`📞 设置回调URL: ${requestBody.callBackUrl}`);
    }
    
    console.log('📤 发送请求到 Kie.ai:', JSON.stringify(requestBody, null, 2));
    
    // 调用 Kie.ai 4o Image API（带密钥池回退）
    let response: Response | null = null;
    let lastErrText = '';
    for (let i = 0; i < keyPool.length; i++) {
      const key = keyPool[(start + i) % keyPool.length];
      try {
        response = await fetch('https://api.kie.ai/api/v1/gpt4o-image/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        if (response.ok) {
          console.log(`[KEY OK] 使用密钥#${(start + i) % keyPool.length + 1}`);
          break;
        } else {
          lastErrText = await response.text();
          console.warn(`[KEY FAIL] 密钥#${(start + i) % keyPool.length + 1} 响应 ${response.status} ${response.statusText}`);
        }
      } catch (e) {
        lastErrText = e instanceof Error ? e.message : String(e);
        console.warn(`[KEY ERROR] 密钥#${(start + i) % keyPool.length + 1} 调用异常:`, lastErrText);
      }
    }
    if (!response) {
      return new Response(JSON.stringify({ error: '图片生成失败', details: lastErrText }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
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

// 明确 GET 不支持，避免被搜索引擎误抓取报 404
export async function onRequestGet() {
  return new Response(JSON.stringify({
    error: 'Method Not Allowed',
    message: 'Use POST /api/generate-image instead.'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  })
}