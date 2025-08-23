// Cloudflare Pages Functions - Flux Kontext generate API proxy
// POST /api/flux-kontext/generate

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const {
      prompt,
      aspectRatio = '16:9',
      inputImage,
      model = 'flux-kontext-pro',
      enableTranslation = true,
      outputFormat = 'png',
      promptUpsampling = false,
    } = body || {};

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: '缺少提示词 prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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

    // 组装 Flux Kontext 请求体（严格遵循官方文档）
    const requestBody: Record<string, any> = {
      prompt,
      aspectRatio,
      model,
      enableTranslation,
      outputFormat,
      promptUpsampling,
    };
    if (inputImage && typeof inputImage === 'string' && inputImage.trim() !== '') {
      requestBody.inputImage = inputImage;
    }

    // 注入回调（统一由服务端设置，避免前端拼接）
    if (env.NEXT_PUBLIC_APP_URL) {
      requestBody.callBackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/callback/flux-kontext`;
    }

    let response: Response | null = null;
    let lastErrText = '';
    for (let i = 0; i < keyPool.length; i++) {
      const key = keyPool[(start + i) % keyPool.length];
      try {
        response = await fetch('https://api.kie.ai/api/v1/flux/kontext/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        if (response.ok) {
          break;
        } else {
          lastErrText = await response.text();
        }
      } catch (e) {
        lastErrText = e instanceof Error ? e.message : String(e);
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
      return new Response(JSON.stringify({ error: '创建任务失败', status: response.status, message: response.statusText, details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    // 官方响应：{ code: 200, msg: 'success', data: { taskId: '...' } }
    const taskId = data?.data?.taskId || data?.taskId;
    if (!taskId) {
      return new Response(JSON.stringify({ error: '未获取到任务ID', raw: data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, taskId, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '请求处理失败', message: error instanceof Error ? error.message : '未知错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
