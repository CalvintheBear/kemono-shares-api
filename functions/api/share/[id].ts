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
    
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少分享ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
    
    console.log(`[分享获取] 查询分享ID: ${id}`);
    
    // 初始化KV存储并获取分享数据
    const shareStore = new ShareStoreWorkers(env.SHARE_DATA_KV);
    const shareData = await shareStore.getShare(id);
      
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
    
    console.log(`[分享获取] 未找到分享ID: ${id}`);
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