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
    const { generatedUrl, originalUrl, prompt, style, timestamp, isR2Stored } = body;
    
    // 判断生成类型
    let generationType: 'text2img' | 'img2img' | 'template' = 'text2img';
    if (originalUrl && originalUrl !== null && !originalUrl.includes('placeholder.com')) {
      if (style && style.startsWith('template_')) {
        generationType = 'template';
      } else {
        generationType = 'img2img';
      }
    }
    
    // 验证图片URL
    if (!generatedUrl || generatedUrl.trim() === '') {
      return new Response(JSON.stringify({
        success: false,
        error: '图片URL不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查URL类型并记录
    const isR2Url = generatedUrl.includes('pub-d00e7b41917848d1a8403c984cb62880.r2.dev') || 
                   generatedUrl.includes('.r2.dev') || 
                   generatedUrl.includes('.r2.cloudflarestorage.com');
    
    const isTempUrl = generatedUrl.includes('tempfile.aiquickdraw.com');
    
    console.log(`[分享创建] URL类型分析:`, {
      url: generatedUrl,
      isR2Url,
      isTempUrl,
      isR2StoredParam: isR2Stored
    });
    
    // 创建分享数据
    const shareData = {
      id: `share_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      title: prompt ? prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '') : '生成的图片',
      generatedUrl,
      originalUrl: originalUrl || null,
      prompt: prompt || '',
      style: style || 'default',
      timestamp: timestamp || Date.now(),
      createdAt: new Date().toISOString(),
      width: 800, // 默认宽度
      height: 800, // 默认高度
      generationType,
      isR2Stored: isR2Stored || isR2Url, // 标记是否使用R2永久存储
      urlType: isR2Url ? 'r2_permanent' : (isTempUrl ? 'kie_temporary' : 'unknown')
    };
    
    console.log(`✅ 创建分享: ${shareData.id}, 类型: ${generationType}, 标题: ${shareData.title}`);
    
    // 在实际应用中，这里应该保存到 Cloudflare KV 或数据库
    // 目前将数据存储到全局变量中（仅用于演示）
    if (typeof globalThis !== 'undefined') {
      if (!(globalThis as any).shareDataStore) {
        (globalThis as any).shareDataStore = new Map();
      }
      (globalThis as any).shareDataStore.set(shareData.id, shareData);
      console.log(`💾 分享数据已存储到内存，当前存储数量: ${(globalThis as any).shareDataStore.size}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      shareId: shareData.id,
      shareUrl: `https://2kawaii.com/share/${shareData.id}`,  // 添加完整域名
      generationType,
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