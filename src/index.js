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

async function handleApiRequest(request, env, _ctx) {
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
  
  // 根据路径处理不同的API端点
  const path = url.pathname;
  
  if (path === '/api/share' && request.method === 'POST') {
    return handleShareCreate(request, env);
  } else if (path === '/api/share' && request.method === 'GET') {
    return handleShareGet(request, env);
  } else if (path.startsWith('/api/share/list')) {
    return handleShareList(request, env);
  } else if (path.startsWith('/api/share/monitor')) {
    return handleShareMonitor(request, env);
  }
  
  // 默认API响应
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

// 处理分享创建
async function handleShareCreate(request, _env) {
  try {
    const body = await request.json();
    const { generatedUrl, originalUrl, prompt, style, timestamp } = body;
    
    // 这里应该调用我们的KV存储逻辑
    // 暂时返回成功响应
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareUrl = `https://kemono-mimi.com/share/${shareId}`;
    
    return new Response(JSON.stringify({
      success: true,
      shareId,
      shareUrl,
      data: {
        id: shareId,
        generatedUrl,
        originalUrl,
        prompt,
        style,
        timestamp,
        createdAt: new Date().toISOString(),
        isR2Stored: false
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (_error) {
    return new Response(JSON.stringify({
      success: false,
      error: '分享创建失败'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// 处理分享获取
async function handleShareGet(request, _env) {
  const url = new URL(request.url);
  const shareId = url.searchParams.get('id');
  
  if (!shareId) {
    return new Response(JSON.stringify({
      success: false,
      error: '分享ID是必需的'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  
  // 这里应该从KV存储获取数据
  // 暂时返回模拟数据
  return new Response(JSON.stringify({
    success: true,
    data: {
      id: shareId,
      generatedUrl: 'https://example.com/generated.jpg',
      originalUrl: 'https://example.com/original.jpg',
      prompt: '测试提示词',
      style: '测试风格',
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      isR2Stored: true
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// 处理分享列表
async function handleShareList(request, _env) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  // 这里应该从KV存储获取列表
  // 暂时返回模拟数据
  const mockItems = [
    {
      id: 'share_1234567890_test1',
      title: '测试风格変換',
      style: '测试风格',
      timestamp: '2025-07-28',
      createdAt: new Date().toISOString()
    }
  ];
  
  return new Response(JSON.stringify({
    success: true,
    data: {
      items: mockItems,
      total: 1,
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

// 处理分享监控
async function handleShareMonitor(request, _env) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  if (action === 'storage') {
    return new Response(JSON.stringify({
      success: true,
      data: {
        totalShares: 1,
        r2StoredCount: 1,
        storageSize: 1,
        lastUpdated: new Date().toISOString()
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  
  return new Response(JSON.stringify({
    success: true,
    data: {
      message: '监控端点工作正常'
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export default worker; 