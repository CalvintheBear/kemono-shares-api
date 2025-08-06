// Cloudflare Pages Functions 版本的 download-url API
// 用于获取KIE AI图片的直接下载URL
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const { url, taskId } = body;
    
    if (!url) {
      return new Response(JSON.stringify({ error: '缺少图片URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔗 获取下载URL: ${url}, taskId: ${taskId}`);
    
    // 获取 Kie.ai API 密钥
    const kieApiKey = env.KIE_AI_API_KEY;
    if (!kieApiKey) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查是否是KIE AI的临时URL
    if (!url.includes('tempfile.aiquickdraw.com')) {
      console.log(`⚠️ 不是KIE AI临时URL，直接返回: ${url}`);
      return new Response(JSON.stringify({
        success: true,
        downloadUrl: url,
        isDirectUrl: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 调用 KIE AI 下载URL API
    const response = await fetch('https://api.kie.ai/api/v1/gpt4o-image/download-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kieApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl: url
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ KIE AI 下载URL API 调用失败: ${response.status} ${response.statusText}`, errorText);
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
    console.log(`✅ KIE AI 下载URL API 响应:`, data);
    
    const downloadUrl = data.data?.downloadUrl || data.downloadUrl;
    
    if (!downloadUrl) {
      console.error('❌ 无法获取下载URL:', data);
      return new Response(JSON.stringify({ 
        error: '无法获取下载URL',
        response: data
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`✅ 获取到下载URL: ${downloadUrl}`);
    
    return new Response(JSON.stringify({
      success: true,
      downloadUrl: downloadUrl,
      originalUrl: url,
      taskId: taskId
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