// Cloudflare Pages Functions 版本的 KIE AI 回调处理 API
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    console.log('📞 收到KIE AI回调:', JSON.stringify(body, null, 2));
    
    const { code, data, msg } = body;
    
    if (code !== 200) {
      console.error('❌ KIE AI回调失败:', msg);
      return new Response(JSON.stringify({ 
        error: '回调处理失败',
        message: msg 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const taskId = data?.taskId;
    const status = data?.status;
    const resultUrls = data?.response?.result_urls || data?.response?.resultUrls || [];
    
    console.log(`✅ KIE AI回调成功 - taskId: ${taskId}, status: ${status}, resultUrls: ${resultUrls.length}`);
    
    if (status === 'SUCCESS' && resultUrls.length > 0) {
      // 处理生成的图片URL
      for (const imageUrl of resultUrls) {
        try {
          console.log(`🔄 处理生成图片: ${imageUrl}`);
          
          // 下载并上传到R2
          const uploadResponse = await fetch(`${env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/download-and-upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              kieImageUrl: imageUrl, 
              taskId,
              fileName: `callback_${taskId}_${Date.now()}.png`
            })
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            console.log(`✅ 回调处理成功，上传到R2: ${uploadData.url}`);
          } else {
            console.error(`❌ 回调处理失败，R2上传失败: ${uploadResponse.status}`);
          }
        } catch (error) {
          console.error(`❌ 处理回调图片失败:`, error);
        }
      }
    }
    
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