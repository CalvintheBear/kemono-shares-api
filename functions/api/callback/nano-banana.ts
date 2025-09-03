// Cloudflare Pages Functions - Nano Banana callback handler
// POST /api/callback/nano-banana

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    console.log(`📞 [Nano Banana Callback] 收到回调:`, body);
    
    const { code, data, msg } = body;
    
    if (!data || !data.taskId) {
      console.error(`❌ [Nano Banana Callback] 无效回调数据:`, body);
      return new Response(JSON.stringify({ error: '无效回调数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { taskId, state, resultJson, failCode, failMsg } = data;
    
    console.log(`📊 [Nano Banana Callback] 任务状态: ${taskId} -> ${state}`);
    
    if (state === 'success' && resultJson) {
      try {
        const resultData = JSON.parse(resultJson);
        const resultUrls = resultData.resultUrls || [];
        console.log(`✅ [Nano Banana Callback] 生成成功，URL数量: ${resultUrls.length}`, resultUrls);
        
        // 这里可以添加后续处理逻辑，比如：
        // 1. 上传到R2永久存储
        // 2. 更新数据库状态
        // 3. 发送通知等
        
      } catch (parseError) {
        console.error(`❌ [Nano Banana Callback] 解析结果失败:`, parseError);
      }
    } else if (state === 'fail') {
      console.error(`❌ [Nano Banana Callback] 任务失败: ${failCode} - ${failMsg}`);
    }
    
    // 返回200表示回调接收成功
    return new Response(JSON.stringify({ 
      success: true, 
      message: '回调处理完成',
      taskId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error(`❌ [Nano Banana Callback] 处理失败:`, error);
    return new Response(JSON.stringify({ 
      error: '回调处理失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}