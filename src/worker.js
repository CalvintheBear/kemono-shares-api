// Cloudflare Workers 入口点
// 简化的API路由处理器

const worker = {
  async fetch(request, env, _ctx) {
    try {
      const url = new URL(request.url);
      
      // 处理API路由
      if (url.pathname.startsWith('/api/')) {
        // 根据路径分发到不同的API处理器
        const apiPath = url.pathname.replace('/api/', '');
        
        switch (apiPath) {
          case 'test-env':
            return handleTestEnv(request, env);
          case 'test-kie-connection':
            return handleTestKieConnection(request, env);
          case 'share/monitor':
            return handleShareMonitor(request, env);
          case 'share/list':
            return handleShareList(request, env);
          case 'generate-image':
            return handleGenerateImage(request, env);
          case 'upload-image':
            return handleUploadImage(request, env);
          default:
            return new Response(JSON.stringify({
              message: 'API endpoint',
              path: url.pathname,
              method: request.method,
              timestamp: new Date().toISOString(),
              available: [
                '/api/test-env',
                '/api/test-kie-connection',
                '/api/share/monitor',
                '/api/share/list',
                '/api/generate-image',
                '/api/upload-image'
              ]
            }), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            });
        }
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
            <h2>Available API Endpoints:</h2>
            <ul>
              <li><a href="/api/test-env">/api/test-env</a></li>
              <li><a href="/api/test-kie-connection">/api/test-kie-connection</a></li>
              <li><a href="/api/share/monitor">/api/share/monitor</a></li>
              <li><a href="/api/share/list">/api/share/list</a></li>
            </ul>
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

// API处理器函数
async function handleTestEnv(request, env) {
  return new Response(JSON.stringify({
    success: true,
    message: 'Workers环境测试',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
      KIE_AI_40_BASE_URL: env.KIE_AI_40_BASE_URL,
      KIE_AI_USER_ID: env.KIE_AI_USER_ID,
      CLOUDFLARE_R2_BUCKET_NAME: env.CLOUDFLARE_R2_BUCKET_NAME,
      CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME: env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function handleTestKieConnection(request, env) {
  try {
    const response = await fetch(`${env.KIE_AI_40_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'KIE连接测试',
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'KIE连接测试失败',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleShareMonitor(request, env) {
  try {
    // 检查KV存储
    const kv = env.SHARE_DATA_KV;
    if (!kv) {
      return new Response(JSON.stringify({
        success: false,
        message: 'KV存储不可用',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 测试KV读写
    const testKey = `monitor_test_${Date.now()}`;
    await kv.put(testKey, JSON.stringify({
      id: testKey,
      timestamp: Date.now(),
      test: true
    }));
    
    const testValue = await kv.get(testKey);
    await kv.delete(testKey);
    
    return new Response(JSON.stringify({
      success: true,
      message: '监控数据',
      timestamp: new Date().toISOString(),
      kv: {
        available: true,
        test: testValue ? 'passed' : 'failed'
      },
      env: {
        NODE_ENV: env.NODE_ENV,
        R2_BUCKET: env.CLOUDFLARE_R2_BUCKET_NAME,
        R2_AFTERIMAGE_BUCKET: env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '监控数据获取失败',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleShareList(request, env) {
  try {
    const kv = env.SHARE_DATA_KV;
    if (!kv) {
      return new Response(JSON.stringify({
        success: false,
        message: 'KV存储不可用',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 获取分享列表（这里简化处理）
    return new Response(JSON.stringify({
      success: true,
      message: '分享列表',
      timestamp: new Date().toISOString(),
      shares: [],
      total: 0
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '获取分享列表失败',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleGenerateImage(_request, _env) {
  return new Response(JSON.stringify({
    success: false,
    message: '图片生成功能暂未在Workers中实现',
    timestamp: new Date().toISOString()
  }), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function handleUploadImage(_request, _env) {
  return new Response(JSON.stringify({
    success: false,
    message: '图片上传功能暂未在Workers中实现',
    timestamp: new Date().toISOString()
  }), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
} 