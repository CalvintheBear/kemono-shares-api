// Cloudflare Pages Functions 版本的 task-status API
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
    
    // 这里可以添加任务状态查询逻辑
    // 目前返回模拟响应
    const status = Math.random() > 0.5 ? 'completed' : 'pending';
    
    return new Response(JSON.stringify({
      success: true,
      taskId,
      status,
      message: status === 'completed' ? '任务已完成' : '任务处理中',
      ...(status === 'completed' && {
        result: {
          imageUrl: `https://example.com/generated/${taskId}.jpg`,
          prompt: '生成的图片描述'
        }
      })
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '查询任务状态失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 