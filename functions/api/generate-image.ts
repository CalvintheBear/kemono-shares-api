// Cloudflare Pages Functions 版本的 generate-image API
export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { prompt, style, size = '1024x1024' } = body;
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少提示词' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 这里可以添加图片生成逻辑
    // 目前返回模拟响应
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    return new Response(JSON.stringify({
      success: true,
      taskId,
      message: '图片生成任务已创建',
      status: 'pending'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '图片生成失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 