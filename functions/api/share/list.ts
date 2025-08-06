// Cloudflare Pages Functions 版本的 share/list API
// 用于获取分享列表，支持分页和过滤

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';
    const filter = url.searchParams.get('filter'); // 'text2img' | 'img2img' | 'template'

    console.log(`🔍 获取分享列表: limit=${limit}, offset=${offset}, sort=${sort}, order=${order}, filter=${filter}`);

    // 从全局存储中获取分享数据
    let shareItems: any[] = [];
    
    if (typeof globalThis !== 'undefined' && (globalThis as any).shareDataStore) {
      shareItems = Array.from((globalThis as any).shareDataStore.values());
      console.log(`📊 从内存中获取到 ${shareItems.length} 个分享数据`);
    } else {
      console.log('📊 当前分享数据为空，需要实际的分享数据写入');
    }

    // 应用过滤器
    let filteredItems = shareItems;
    if (filter) {
      if (filter === 'text2img') {
        filteredItems = shareItems.filter(item => item.generationType === 'text2img');
      } else if (filter === 'img2img') {
        filteredItems = shareItems.filter(item => item.generationType === 'img2img');
      } else if (filter === 'template') {
        filteredItems = shareItems.filter(item => item.generationType === 'template');
      }
    }

    // 排序
    filteredItems.sort((a, b) => {
      const aValue = sort === 'createdAt' ? new Date(a.createdAt).getTime() : a.timestamp;
      const bValue = sort === 'createdAt' ? new Date(b.createdAt).getTime() : b.timestamp;
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // 分页
    const totalItems = filteredItems.length;
    const paginatedItems = filteredItems.slice(offset, offset + limit);
    const hasMore = offset + limit < totalItems;

    console.log(`✅ 返回 ${paginatedItems.length} 个分享项目，总共 ${totalItems} 个，hasMore: ${hasMore}`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        items: paginatedItems,
        total: totalItems,
        limit,
        offset,
        hasMore,
        filter: filter || 'all'
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