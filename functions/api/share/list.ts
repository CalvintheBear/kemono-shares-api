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

    // 在实际应用中，这里应该从 Cloudflare KV 或数据库中获取数据
    // 目前使用模拟数据进行演示
    
    const mockShareItems = [
      {
        id: 'share_1703123456789_abc123',
        title: '可爱的动漫少女',
        style: 'kawaii',
        timestamp: '2023-12-21T10:30:45.789Z',
        generatedUrl: 'https://pub-6b0b5d2c7c7d4c8a9b0c1d2e3f4g5h6i.r2.dev/after/generated_task_4o_abc123.png',
        originalUrl: null, // 文生图没有原图
        width: 800,
        height: 1200,
        generationType: 'text2img',
        prompt: '可爱的动漫少女，粉色头发，大眼睛，kawaii风格',
        createdAt: '2023-12-21T10:30:45.789Z'
      },
      {
        id: 'share_1703123456790_def456',
        title: '动漫风格转换',
        style: 'anime',
        timestamp: '2023-12-21T10:25:30.456Z',
        generatedUrl: 'https://pub-6b0b5d2c7c7d4c8a9b0c1d2e3f4g5h6i.r2.dev/after/generated_task_4o_def456.png',
        originalUrl: 'https://pub-6b0b5d2c7c7d4c8a9b0c1d2e3f4g5h6i.r2.dev/before/upload_def456.jpg',
        width: 800,
        height: 600,
        generationType: 'img2img',
        prompt: '将人物转换为动漫风格',
        createdAt: '2023-12-21T10:25:30.456Z'
      },
      {
        id: 'share_1703123456791_ghi789',
        title: '赛博朋克少女',
        style: 'cyberpunk',
        timestamp: '2023-12-21T10:20:15.123Z',
        generatedUrl: 'https://pub-6b0b5d2c7c7d4c8a9b0c1d2e3f4g5h6i.r2.dev/after/generated_task_4o_ghi789.png',
        originalUrl: null,
        width: 800,
        height: 800,
        generationType: 'text2img',
        prompt: '赛博朋克风格的动漫少女，霓虹灯背景',
        createdAt: '2023-12-21T10:20:15.123Z'
      },
      {
        id: 'share_1703123456792_jkl012',
        title: '模板生成',
        style: 'template_kawaii',
        timestamp: '2023-12-21T10:15:00.789Z',
        generatedUrl: 'https://pub-6b0b5d2c7c7d4c8a9b0c1d2e3f4g5h6i.r2.dev/after/generated_task_4o_jkl012.png',
        originalUrl: 'https://pub-6b0b5d2c7c7d4c8a9b0c1d2e3f4g5h6i.r2.dev/before/upload_jkl012.jpg',
        width: 800,
        height: 1000,
        generationType: 'template',
        prompt: '使用kawaii模板生成可爱角色',
        createdAt: '2023-12-21T10:15:00.789Z'
      }
    ];

    // 应用过滤器
    let filteredItems = mockShareItems;
    if (filter) {
      if (filter === 'text2img') {
        filteredItems = mockShareItems.filter(item => item.generationType === 'text2img');
      } else if (filter === 'img2img') {
        filteredItems = mockShareItems.filter(item => item.generationType === 'img2img');
      } else if (filter === 'template') {
        filteredItems = mockShareItems.filter(item => item.generationType === 'template');
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