// Workers兼容的入口点
// 这个文件将处理Next.js的API路由

const worker = {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // 处理API路由
      if (url.pathname.startsWith('/api/')) {
        // 这里可以添加具体的API处理逻辑
        return new Response(JSON.stringify({
          message: 'API endpoint',
          path: url.pathname,
          method: request.method,
          timestamp: new Date().toISOString()
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        });
      }
      
      // 处理静态文件请求
      if (url.pathname.startsWith('/_next/')) {
        return new Response('Static files not available in Workers', { status: 404 });
      }
      
      // 处理其他请求
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Kemono Shares API - Workers</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <h1>Kemono Shares API</h1>
            <p>This is a Cloudflare Workers deployment.</p>
            <p>Path: ${url.pathname}</p>
            <p>Method: ${request.method}</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
};

export default worker; 