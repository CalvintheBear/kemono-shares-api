// Cloudflare Pages Functions 版本的 share API
export async function onRequestGet() {
  return new Response(JSON.stringify({ 
    error: 'API not available in static export mode',
    message: 'This feature requires server-side processing',
    status: 'static_mode'
  }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = await request.json();
    
    // 这里可以添加分享逻辑
    const shareData = {
      id: `share_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      ...body,
      createdAt: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      shareId: shareData.id,
      message: '分享创建成功'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '分享创建失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 