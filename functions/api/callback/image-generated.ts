// Cloudflare Pages Functions 版本的 image-generated 回调处理 API
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    console.log('📞 收到 Kie.ai 回调:', body);
    
    // 验证回调数据 - 适配KIE AI的回调格式
    const taskId = body.taskId || body.data?.taskId;
    const status = body.status || (body.code === 200 ? 'SUCCESS' : 'FAILED');
    const response = body.response || body.data?.info;
    const errorMessage = body.errorMessage || body.msg;
    
    console.log('📞 解析回调数据:', { taskId, status, response, errorMessage });
    
    if (!taskId) {
      console.error('❌ 回调缺少 taskId');
      return new Response(JSON.stringify({ error: '缺少任务ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 处理不同的状态
    if (status === 'SUCCESS' && response?.result_urls) {
      console.log(`✅ 任务 ${taskId} 生成成功，图片URLs:`, response.result_urls);
      
      // 这里可以添加额外的处理逻辑，比如：
      // 1. 将图片保存到 R2 afterimage 桶
      // 2. 更新数据库中的任务状态
      // 3. 发送通知给用户
      
      // 示例：保存到 R2 afterimage 桶
      if (env.AFTERIMAGE_BUCKET && response.result_urls.length > 0) {
        try {
          const { createR2Client } = await import('../../../src/lib/r2-client-cloudflare');
          const r2Client = createR2Client(env.UPLOAD_BUCKET, env.AFTERIMAGE_BUCKET);
          
          for (let i = 0; i < response.result_urls.length; i++) {
            const imageUrl = response.result_urls[i];
            const key = `generated/${taskId}_${i + 1}.jpg`;
            
            // 下载图片并上传到 R2
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
              const imageBuffer = await imageResponse.arrayBuffer();
              await r2Client.uploadToAfterimageBucket(
                key,
                imageBuffer,
                'image/jpeg',
                {
                  taskId,
                  originalUrl: imageUrl,
                  generatedAt: new Date().toISOString(),
                  index: (i + 1).toString()
                }
              );
              console.log(`✅ 图片已保存到 R2: ${key}`);
            }
          }
        } catch (error) {
          console.error('❌ 保存到 R2 失败:', error);
        }
      }
      
    } else if (status === 'FAILED') {
      console.error(`❌ 任务 ${taskId} 生成失败:`, errorMessage);
    } else {
      console.log(`⏳ 任务 ${taskId} 状态更新:`, status);
    }
    
    // 返回成功响应给 Kie.ai
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