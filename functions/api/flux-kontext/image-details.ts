// Cloudflare Pages Functions - Flux Kontext record-info proxy
// GET /api/flux-kontext/image-details?taskId=...

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    if (!taskId) {
      return new Response(JSON.stringify({ error: '缺少 taskId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    let response: Response | null = null;
    let lastErrText = '';
    for (let i = 0; i < keyPool.length; i++) {
      const key = keyPool[(start + i) % keyPool.length];
      try {
        response = await fetch(`https://api.kie.ai/api/v1/flux/kontext/record-info?taskId=${encodeURIComponent(taskId)}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${key}` }
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
      return new Response(JSON.stringify({ error: '查询失败', details: lastErrText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: '查询失败', status: response.status, message: response.statusText, details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    // 统一结构：status/resultUrls/errorMessage
    const raw = data?.data || data;
    const successFlag = raw?.successFlag;
    const codeStatus = raw?.status;
    const errorMessage = raw?.errorMessage || raw?.error || '';
    const resp = raw?.response || {};
    const urls = resp?.resultUrls || resp?.result_urls || (resp?.resultImageUrl ? [resp.resultImageUrl] : []);

    let statusUnified: 'GENERATING' | 'SUCCESS' | 'FAILED' = 'GENERATING';
    if (successFlag === 1 || codeStatus === 1 || codeStatus === 'SUCCESS') statusUnified = 'SUCCESS';
    if (successFlag === 2 || successFlag === 3 || codeStatus === 2 || codeStatus === 3 || codeStatus === 'FAILED') statusUnified = 'FAILED';

    return new Response(JSON.stringify({
      success: true,
      data: {
        status: statusUnified,
        resultUrls: Array.isArray(urls) ? urls : [],
        errorMessage,
        raw,
      }
    }), {
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


