// Cloudflare Workers entry point
const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理 API 路由
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }
    
    // 处理静态文件
    if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/static/')) {
      return env.ASSETS.fetch(request);
    }
    
    // 默认响应
    return new Response('Kemono Shares API is running!', {
      headers: { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
    });
  },
};

async function handleApiRequest(request, _env, _ctx) {
  const url = new URL(request.url);
  
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  // 处理 share API 路由
  if (url.pathname === '/api/share') {
    return handleShareApi(request, url);
  }
  
  // 处理 share list API 路由
  if (url.pathname === '/api/share/list') {
    return handleShareListApi(request, url);
  }
  
  // 默认 API 响应
  return new Response(JSON.stringify({
    message: 'Kemono Shares API',
    endpoint: url.pathname,
    method: request.method,
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// 处理 share API
async function handleShareApi(request, url) {
  const shareId = url.searchParams.get('id');
  
  if (!shareId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'シェアIDが必要です'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  
  // 这里应该从数据库或存储中获取数据
  // 暂时返回模拟数据
  const mockData = {
    id: shareId,
    generatedUrl: 'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/share/sample/style.png',
    originalUrl: 'https://example.com/original.jpg',
    prompt: 'サンプルプロンプト',
    style: 'サンプルスタイル',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    isR2Stored: true
  };
  
  return new Response(JSON.stringify({
    success: true,
    data: mockData
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// 处理 share list API
async function handleShareListApi(request, url) {
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  // 这里应该从数据库或存储中获取数据
  // 暂时返回空列表
  const mockList = [];
  
  return new Response(JSON.stringify({
    success: true,
    data: {
      items: mockList,
      total: 0,
      limit,
      offset,
      hasMore: false
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export default worker; 