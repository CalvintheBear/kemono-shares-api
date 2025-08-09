// Cloudflare Pages Functions 版本的 image-details API
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    
    if (!taskId) {
      return new Response(JSON.stringify({ error: '缺少任务ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔍 查询图片详情: ${taskId}`);
    
    // 密钥池回退
    const keyPool = [env.KIE_AI_API_KEY, env.KIE_AI_API_KEY_2, env.KIE_AI_API_KEY_3, env.KIE_AI_API_KEY_4, env.KIE_AI_API_KEY_5].filter((k: string | undefined) => !!k) as string[]
    if (keyPool.length === 0) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 根据 Kie.ai 文档，使用正确的API端点
    // GET https://api.kie.ai/api/v1/gpt4o-image/record-info?taskId=xxx
    let response: Response | null = null
    const start = Math.floor(Math.random() * keyPool.length)
    for (let i = 0; i < keyPool.length; i++) {
      const key = keyPool[(start + i) % keyPool.length]
      try {
        response = await fetch(`https://api.kie.ai/api/v1/gpt4o-image/record-info?taskId=${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) break
      } catch {}
    }
    if (!response) {
      return new Response(JSON.stringify({ error: '查询任务状态失败' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
    
    if (!response.ok) {
      console.error(`❌ Kie.ai API 查询失败: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        error: '查询任务状态失败',
        status: response.status,
        message: response.statusText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    console.log(`✅ 查询成功:`, data);
    
    return new Response(JSON.stringify({
      success: true,
      data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ 查询图片详情失败:', error);
    return new Response(JSON.stringify({ 
      error: '查询图片详情失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 