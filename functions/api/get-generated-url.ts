// Cloudflare Pages Functions 版本的获取已生成图片URL API
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
    
    console.log(`🔗 查询已生成图片URL: ${taskId}`);
    
    // 检查 R2 afterimage 桶中是否存在生成的图片
    if (!env.AFTERIMAGE_BUCKET) {
      console.error('❌ AFTERIMAGE_BUCKET 未配置');
      return new Response(JSON.stringify({ 
        error: '存储配置错误',
        found: false 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 可能的文件名格式
    const possibleKeys = [
      `generated/${taskId}_1.jpg`,
      `generated/${taskId}_1.png`,
      `generated/${taskId}.jpg`,
      `generated/${taskId}.png`,
      `${taskId}_1.jpg`,
      `${taskId}_1.png`,
      `${taskId}.jpg`,
      `${taskId}.png`
    ];
    
    let foundUrl = null;
    let foundKey = null;
    
    // 尝试查找存在的文件
    for (const key of possibleKeys) {
      try {
        const object = await env.AFTERIMAGE_BUCKET.get(key);
        if (object) {
          foundKey = key;
          // 构建公网URL
          const bucketUrl = env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL || `https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev`;
          foundUrl = `${bucketUrl}/${key}`;
          console.log(`✅ 找到已生成图片: ${key} -> ${foundUrl}`);
          break;
        }
      } catch (error) {
        console.warn(`⚠️ 检查 ${key} 时出错:`, error);
        continue;
      }
    }
    
    if (foundUrl) {
      return new Response(JSON.stringify({
        success: true,
        found: true,
        url: foundUrl,
        key: foundKey,
        taskId: taskId
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.log(`❌ 未找到任务 ${taskId} 的生成图片`);
      return new Response(JSON.stringify({
        success: true,
        found: false,
        taskId: taskId,
        message: '图片尚未生成或上传完成'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('❌ 查询已生成图片URL失败:', error);
    return new Response(JSON.stringify({ 
      error: '查询失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}