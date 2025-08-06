// Cloudflare Pages Functions 版本的 image-details API
export async function onRequestGet({ request }: { request: Request }) {
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
    
    // 这里应该调用 Kie.ai API 查询任务状态
    // 根据 https://old-docs.kie.ai/4o-image-api/generate-4-o-image 文档
    const kieApiKey = process.env.KIE_AI_API_KEY;
    if (!kieApiKey) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 调用 Kie.ai API 查询任务状态
    const response = await fetch(`https://api.kie.ai/api/v1/gpt4o-image/details?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${kieApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
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