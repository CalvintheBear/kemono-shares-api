// Cloudflare Pages Functions - Nano Banana image details API proxy
// GET /api/nano-banana/image-details

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
    
    console.log(`🔍 [Nano Banana] 查询任务详情: ${taskId}`);
    
    // 密钥池回退
    const keyPool = [
      env.KIE_AI_API_KEY, 
      env.KIE_AI_API_KEY_2, 
      env.KIE_AI_API_KEY_3, 
      env.KIE_AI_API_KEY_4, 
      env.KIE_AI_API_KEY_5
    ].filter((k: string | undefined) => !!k) as string[];
    
    if (keyPool.length === 0) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let response: Response | null = null;
    const start = Math.floor(Math.random() * keyPool.length);
    for (let i = 0; i < keyPool.length; i++) {
      const key = keyPool[(start + i) % keyPool.length];
      try {
        console.log(`🔑 [Nano Banana] 查询密钥 #${(start + i) % keyPool.length + 1}`);
        response = await fetch(`https://api.kie.ai/api/v1/playground/recordInfo?taskId=${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          console.log(`✅ [Nano Banana] 查询密钥 #${(start + i) % keyPool.length + 1} 成功`);
          break;
        } else {
          console.warn(`❌ [Nano Banana] 查询密钥 #${(start + i) % keyPool.length + 1} 失败: ${response.status}`);
        }
      } catch (e) {
        console.warn(`❌ [Nano Banana] 查询密钥 #${(start + i) % keyPool.length + 1} 异常:`, e);
      }
    }
    
    if (!response) {
      return new Response(JSON.stringify({ error: '查询任务状态失败' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    if (!response.ok) {
      console.error(`❌ [Nano Banana] API查询失败: ${response.status} ${response.statusText}`);
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
    console.log(`✅ [Nano Banana] 查询成功:`, data);
    
    // 处理响应数据，解析resultJson
    if (data.data && data.data.resultJson) {
      try {
        const resultData = JSON.parse(data.data.resultJson);
        data.data.resultUrls = resultData.resultUrls || [];
        console.log(`🔗 [Nano Banana] 解析到结果URL:`, data.data.resultUrls);
      } catch (parseError) {
        console.warn(`⚠️ [Nano Banana] 解析resultJson失败:`, parseError);
        data.data.resultUrls = [];
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error(`❌ [Nano Banana] 查询详情失败:`, error);
    return new Response(JSON.stringify({ 
      error: '查询任务详情失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}