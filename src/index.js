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
  
  // 简单的 API 响应
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

export default worker; 