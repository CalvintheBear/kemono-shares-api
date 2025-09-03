// Cloudflare Pages Functions - Nano Banana generate API proxy
// POST /api/nano-banana/generate

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const {
      model,
      prompt,
      imageUrls,
      outputFormat = 'png',
      enableTranslation = true,
    } = body || {};

    // 验证模型
    if (!model || !['google/nano-banana', 'google/nano-banana-edit'].includes(model)) {
      return new Response(JSON.stringify({ error: '不支持的模型，请使用 google/nano-banana 或 google/nano-banana-edit' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证提示词
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: '缺少提示词 prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (prompt.length > 5000) {
      return new Response(JSON.stringify({ error: '提示词长度不能超过5000字符' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // nano-banana-edit 需要图片URL
    if (model === 'google/nano-banana-edit') {
      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return new Response(JSON.stringify({ error: 'nano-banana-edit模型需要提供图片URL' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (imageUrls.length > 5) {
        return new Response(JSON.stringify({ error: '图片数量不能超过5张' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 准备密钥池（与现有实现一致）
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

    let start = Math.floor(Math.random() * keyPool.length);

    // 组装 Nano Banana 请求体（严格遵循官方文档）
    const requestBody: Record<string, any> = {
      model,
      input: {
        prompt,
        output_format: outputFormat,
        enable_translation: enableTranslation,
        image_size: 'auto'
      }
    };

    // nano-banana-edit 需要添加图片URL
    if (model === 'google/nano-banana-edit' && imageUrls && imageUrls.length > 0) {
      requestBody.input.image_urls = imageUrls;
    }

    // 注入回调（统一由服务端设置，避免前端拼接）
    if (env.NEXT_PUBLIC_APP_URL) {
      requestBody.callBackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/callback/nano-banana`;
    }

    console.log(`🍌 [Nano Banana] 开始生成，模型: ${model}`, requestBody);

    let response: Response | null = null;
    let lastErrText = '';
    for (let i = 0; i < keyPool.length; i++) {
      const key = keyPool[(start + i) % keyPool.length];
      try {
        console.log(`🔑 [Nano Banana] 尝试密钥 #${(start + i) % keyPool.length + 1}`);
        response = await fetch('https://api.kie.ai/api/v1/playground/createTask', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        if (response.ok) {
          console.log(`✅ [Nano Banana] 密钥 #${(start + i) % keyPool.length + 1} 调用成功`);
          break;
        } else {
          lastErrText = await response.text();
          console.warn(`❌ [Nano Banana] 密钥 #${(start + i) % keyPool.length + 1} 失败: ${response.status}`);
        }
      } catch (e) {
        lastErrText = e instanceof Error ? e.message : String(e);
        console.warn(`❌ [Nano Banana] 密钥 #${(start + i) % keyPool.length + 1} 异常:`, lastErrText);
      }
    }
    
    if (!response) {
      return new Response(JSON.stringify({ error: '创建任务失败', details: lastErrText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [Nano Banana] API调用失败: ${response.status} ${response.statusText}`, errorText);
      return new Response(JSON.stringify({ 
        error: '创建任务失败', 
        status: response.status, 
        message: response.statusText, 
        details: errorText 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    console.log(`✅ [Nano Banana] API响应:`, data);
    
    // 官方响应：{ code: 200, message: 'success', data: { taskId: '...' } }
    const taskId = data?.data?.taskId;
    if (!taskId) {
      console.error(`❌ [Nano Banana] 未获取到任务ID:`, data);
      return new Response(JSON.stringify({ error: '未获取到任务ID', raw: data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      taskId, 
      model,
      message: '任务创建成功',
      data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(`❌ [Nano Banana] 请求处理失败:`, error);
    return new Response(JSON.stringify({ 
      error: '请求处理失败', 
      message: error instanceof Error ? error.message : '未知错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}