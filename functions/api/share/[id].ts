// Cloudflare Pages Functions 版本的 share/[id] API
import { ShareStoreWorkers } from '../../../src/lib/share-store-workers.js';

export async function onRequestGet({ 
  request, 
  params,
  env 
}: { 
  request: Request; 
  params: { id: string };
  env: any;
}) {
  try {
    const { id } = params;
    
    console.log(`🔍 [分享获取] 开始处理请求，分享ID: ${id}`);
    console.log(`🔍 [分享获取] 环境变量检查:`, {
      hasKV: !!env.SHARE_DATA_KV,
      kvType: typeof env.SHARE_DATA_KV,
      envKeys: Object.keys(env || {})
    });
    
    if (!id) {
      console.error('❌ [分享获取] 缺少分享ID');
      return new Response(JSON.stringify({ error: '缺少分享ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查KV绑定是否存在
    if (!env.SHARE_DATA_KV) {
      console.error('❌ [分享获取] KV存储绑定 (SHARE_DATA_KV) 未配置！');
      return new Response(JSON.stringify({ 
        success: false, 
        error: '服务器配置错误: 存储服务不可用' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔍 [分享获取] 查询分享ID: ${id}`);
    
    // 初始化KV存储并获取分享数据
    const shareStore = new ShareStoreWorkers(env.SHARE_DATA_KV);
    
    // 测试KV连接
    console.log(`🔍 [分享获取] 测试KV连接...`);
    try {
      const testKey = shareStore.getShareKey(id);
      console.log(`🔍 [分享获取] 生成的键名: ${testKey}`);
      
      // 直接测试KV获取
      const testData = await env.SHARE_DATA_KV.get(testKey);
      console.log(`🔍 [分享获取] 直接KV获取结果:`, testData ? '有数据' : '无数据');
      
      if (testData) {
        console.log(`🔍 [分享获取] 直接KV数据:`, testData.substring(0, 100) + '...');
      }
    } catch (kvError) {
      console.error('❌ [分享获取] KV连接测试失败:', kvError);
    }
    
    const shareData = await shareStore.getShare(id);
    console.log(`🔍 [分享获取] ShareStore获取结果:`, shareData ? '有数据' : '无数据');
      
    if (shareData) {
      console.log(`✅ [分享获取] 找到分享数据:`, {
        id: shareData.id,
        style: shareData.style,
        generatedUrl: shareData.generatedUrl?.substring(0, 50) + '...',
        timestamp: shareData.timestamp
      });
      return new Response(JSON.stringify({
        success: true,
        data: shareData
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`❌ [分享获取] 未找到分享ID: ${id}`);
    
    // 尝试列出所有键来调试
    try {
      console.log(`🔍 [分享获取] 尝试列出所有KV键...`);
      const listResult = await env.SHARE_DATA_KV.list({ prefix: 'share:' });
      console.log(`🔍 [分享获取] KV键列表:`, listResult);
    } catch (listError) {
      console.error('❌ [分享获取] 列出KV键失败:', listError);
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: '分享不存在或已过期',
      debug: {
        requestedId: id,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ [分享获取] 处理失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '获取分享数据失败',
      debug: {
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPut({ 
  request, 
  params 
}: { 
  request: Request; 
  params: { id: string } 
}) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少分享ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 这里可以添加分享更新逻辑
    return new Response(JSON.stringify({
      success: true,
      message: `分享 ${id} 更新成功`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '更新分享失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete({ 
  params 
}: { 
  params: { id: string } 
}) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少分享ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 这里可以添加分享删除逻辑
    return new Response(JSON.stringify({
      success: true,
      message: `分享 ${id} 删除成功`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '删除分享失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 