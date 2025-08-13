// Cloudflare Pages Functions - Flux Kontext callback handler
// POST /api/callback/flux-kontext

export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = await request.json();
    // 官方：{ code, msg, data }，成功 code=200
    const code = body?.code;
    const data = body?.data || {};
    const msg = body?.msg || '';

    if (code !== 200) {
      return new Response(JSON.stringify({ error: '回调失败', code, msg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const taskId = data?.taskId;
    const status = data?.status;
    const resp = data?.response || {};
    const urls: string[] = resp?.resultUrls || resp?.result_urls || (resp?.resultImageUrl ? [resp.resultImageUrl] : []);

    if (status === 'SUCCESS' && Array.isArray(urls) && urls.length > 0) {
      // 将每个 URL 交给现有下载+上传 API，转存为 R2 永久 URL
      const tasks = urls.map(async (u: string, idx: number) => {
        try {
          const r = await fetch('https://'+request.headers.get('host')+'/api/download-and-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: u, taskId, fileName: `generated_${taskId}_${idx}.png` })
          });
          // 忽略错误，避免阻塞回调响应
          await r.text().catch(() => {});
        } catch {}
      });
      await Promise.allSettled(tasks);
    }

    return new Response(JSON.stringify({ success: true, message: '回调处理完成' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '回调处理异常', message: error instanceof Error ? error.message : '未知错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


