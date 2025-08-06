// Cloudflare Pages Functions 版本的回调 API
export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = await request.json();
    
    console.log('📞 收到 Kie.ai 回调:', body);
    
    // 处理 Kie.ai 的图片生成完成回调
    // 这里可以添加数据库存储、通知用户等逻辑
    
    return new Response(JSON.stringify({
      success: true,
      message: '回调处理成功'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ 回调处理失败:', error);
    return new Response(JSON.stringify({ 
      error: '回调处理失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 