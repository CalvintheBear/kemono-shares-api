// Cloudflare Pages Functions 版本的 download-url API
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return new Response(JSON.stringify({ error: '缺少图片URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔗 获取下载URL: ${url}`);
    
    // 获取 Kie.ai API 密钥
    const kieApiKey = env.KIE_AI_API_KEY;
    if (!kieApiKey) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 根据 Kie.ai 文档，使用正确的API端点
    // POST https://api.kie.ai/api/v1/gpt4o-image/download-url
    const response = await fetch('https://api.kie.ai/api/v1/gpt4o-image/download-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kieApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Kie.ai 下载URL获取失败: ${response.status} ${response.statusText}`, errorText);
      return new Response(JSON.stringify({ 
        error: '获取下载URL失败',
        status: response.status,
        message: response.statusText,
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    console.log(`✅ 下载URL获取成功:`, data);
    
    return new Response(JSON.stringify({
      success: true,
      downloadUrl: data.data?.downloadUrl || data.downloadUrl || url,
      data: data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ 获取下载URL失败:', error);
    return new Response(JSON.stringify({ 
      error: '获取下载URL失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 