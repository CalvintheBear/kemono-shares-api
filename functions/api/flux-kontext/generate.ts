// Cloudflare Pages Functions - Flux Kontext generate API
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const {
      prompt,
      aspectRatio = '16:9',
      inputImage,
      model = 'flux-kontext-pro',
      enableTranslation = true,
      outputFormat = 'jpeg',
      promptUpsampling = false,
    } = body || {};

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: '缺少提示词 prompt' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const keyPool = [env.KIE_AI_API_KEY, env.KIE_AI_API_KEY_2, env.KIE_AI_API_KEY_3, env.KIE_AI_API_KEY_4, env.KIE_AI_API_KEY_5].filter((k: string | undefined) => !!k) as string[];
    if (keyPool.length === 0) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const requestBody: any = {
      prompt,
      aspectRatio,
      model,
      enableTranslation: !!enableTranslation,
      outputFormat,
      promptUpsampling: !!promptUpsampling,
    };

    if (inputImage && typeof inputImage === 'string') {
      requestBody.inputImage = inputImage;
    }

    if (env.NEXT_PUBLIC_APP_URL) {
      requestBody.callBackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/callback/flux-kontext`;
    }

    let response: Response | null = null;
    let lastErrText = '';
    const start = Math.floor(Math.random() * keyPool.length);
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
        if (response.ok) break;
        lastErrText = await response.text();
      } catch (e) {
        lastErrText = e instanceof Error ? e.message : String(e);
      }
    }

    if (!response) {
      return new Response(JSON.stringify({ error: '图片生成失败', details: lastErrText }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const data = await response.json();
    if (data?.code !== 200) {
      return new Response(JSON.stringify({ error: '生成失败', data }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, taskId: data.data?.taskId, data }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: '请求失败', message: error instanceof Error ? error.message : '未知错误' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


