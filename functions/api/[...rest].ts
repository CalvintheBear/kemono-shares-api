export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 处理CORS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // 根据路径返回不同的响应
  switch (path) {
    case '/api/check-r2-config':
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'R2配置检查功能',
          config: {
            bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );

    case '/api/share':
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: '分享功能API',
          shareUrl: `https://2kawaii.com/share/${Date.now()}`
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );

    case '/api/task-status':
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'completed',
          message: '任务状态查询功能'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );

    default:
      return new Response(
        JSON.stringify({ 
          error: 'API端点不存在', 
          path,
          availableEndpoints: [
            '/api/upload-image',
            '/api/generate-image',
            '/api/check-r2-config',
            '/api/share',
            '/api/task-status'
          ]
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
  }
} 