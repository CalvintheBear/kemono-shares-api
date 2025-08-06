// 导入 KV 存储库
import { ShareStoreWorkers } from '../../src/lib/share-store-workers.js';

// Cloudflare Pages Functions 版本的 share API
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    // 检查KV绑定是否存在
    if (!env.SHARE_DATA_KV) {
      console.error('❌ GET: KV存储绑定 (SHARE_DATA_KV) 未配置！');
      return new Response(JSON.stringify({ 
        success: false, 
        error: '服务器配置错误: 存储服务不可用' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const shareId = url.searchParams.get('id');
    
    if (!shareId) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少分享ID'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`[分享获取] 查询分享ID: ${shareId}`);
    
    // 初始化KV存储并获取分享数据
    const shareStore = new ShareStoreWorkers(env.SHARE_DATA_KV);
    const shareData = await shareStore.getShare(shareId);
      
    if (shareData) {
      console.log(`[分享获取] 找到分享数据:`, shareData);
      return new Response(JSON.stringify({
        success: true,
        data: shareData
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`[分享获取] 未找到分享ID: ${shareId}`);
    return new Response(JSON.stringify({
      success: false,
      error: '分享不存在或已过期'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[分享获取] 处理失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '获取分享数据失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    // 1. 检查KV绑定是否存在
    if (!env.SHARE_DATA_KV) {
      console.error('❌ POST: KV存储绑定 (SHARE_DATA_KV) 未配置！');
      return new Response(JSON.stringify({ 
        error: '服务器配置错误: 存储服务不可用' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { generatedUrl, originalUrl, prompt, style, timestamp, isR2Stored } = body;
    
    // 2. 判断生成类型
    let generationType: 'text2img' | 'img2img' | 'template' = 'text2img';
    if (originalUrl && originalUrl !== null && !originalUrl.includes('placeholder.com')) {
      if (style && style.startsWith('template_')) {
        generationType = 'template';
      } else {
        generationType = 'img2img';
      }
    }
    
    // 3. 验证图片URL
    if (!generatedUrl || generatedUrl.trim() === '') {
      return new Response(JSON.stringify({
        success: false,
        error: '图片URL不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 4. 检查URL类型并记录
    const isR2Url = generatedUrl.startsWith('https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/');
    const isTempUrl = generatedUrl.includes('tempfile.aiquickdraw.com') || generatedUrl.includes('.r2.cloudflarestorage.com');
    
    console.log(`[分享创建] URL类型分析:`, {
      url: generatedUrl,
      isR2Url,
      isTempUrl,
      isR2StoredParam: isR2Stored
    });
    
    // 5. 创建分享数据对象
    const shareDataObject = {
      id: `share_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      title: prompt ? prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '') : '生成的图片',
      generatedUrl,
      originalUrl: originalUrl || null,
      prompt: prompt || '',
      style: style || 'default',
      timestamp: timestamp || Date.now(),
      createdAt: new Date().toISOString(),
      width: 800,
      height: 800,
      generationType,
      isR2Stored: isR2Stored || isR2Url,
      urlType: isR2Url ? 'r2_permanent' : (isTempUrl ? 'kie_temporary' : 'unknown')
    };
    
    console.log(`✅ 创建分享对象: ${shareDataObject.id}, 类型: ${generationType}`);
    
    // 6. 初始化KV存储并创建分享
    console.log('🚀 初始化KV存储...');
    const shareStore = new ShareStoreWorkers(env.SHARE_DATA_KV);
    
    console.log(`💾 正在将分享数据存储到KV...`);
    const createdShare = await shareStore.createShare(shareDataObject);
    
    console.log(`✅ 分享数据已成功存储到KV:`, createdShare);
    
    return new Response(JSON.stringify({
      success: true,
      shareId: createdShare.id,
      shareUrl: `https://2kawaii.com/share/${createdShare.id}`,
      data: createdShare,
      message: '分享创建成功'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ 分享创建失败:', error);
    return new Response(JSON.stringify({ 
      error: '分享创建失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
