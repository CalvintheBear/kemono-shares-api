// 导入 KV 存储库
import { ShareStoreWorkers } from '../../../src/lib/share-store-workers.js';

// Cloudflare Pages Functions 版本的 share/list API
// 用于获取分享列表，支持分页
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    // 1. 检查KV绑定是否存在（允许 REST 回退）
    const hasBinding = !!env.SHARE_DATA_KV;
    const canRest = !!(env.CLOUDFLARE_API_TOKEN && (env.CLOUDFLARE_ACCOUNT_ID || env.CLOUDFLARE_R2_ACCOUNT_ID) && (env.SHARE_KV_NAMESPACE_ID || env.SHARE_DATA_KV_NAMESPACE_ID));
    if (!hasBinding && !canRest) {
      console.error('❌ GET List: KV存储绑定未配置，且缺少 REST 回退所需变量');
      return new Response(JSON.stringify({ 
        success: false, 
        error: '服务器配置错误: 存储服务不可用' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    console.log(`🔍 获取分享列表: limit=${limit}, offset=${offset}`);

    // 2. 初始化KV存储
    const shareStore = new ShareStoreWorkers(hasBinding ? env.SHARE_DATA_KV : env);
    
    // 3. 从KV获取分享列表
    console.log('📊 正在从KV获取分享列表...');
    const result = await shareStore.getShareList(limit, offset);

    if (!result || !result.items) {
      console.log('⚠️ 未从KV中获取到分享项目。');
      result.items = [];
      result.total = 0;
      result.hasMore = false;
    }

    console.log(`✅ 返回 ${result.items.length} 个分享项目，总共 ${result.total} 个，hasMore: ${result.hasMore}`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        items: result.items,
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore,
        filter: 'all' // 因为我们移除了过滤，所以总是'all'
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // 确保获取最新数据
      }
    });

  } catch (error) {
    console.error('❌ 获取分享列表失败:', error);
    return new Response(JSON.stringify({ 
      error: '获取分享列表失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
