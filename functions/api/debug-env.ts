// 调试环境变量和绑定的 API
export async function onRequestGet({ env }: { env: any }) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      envKeys: Object.keys(env),
      r2BucketExists: !!env.R2_BUCKET,
      r2AfterimageBucketExists: !!env.R2_AFTERIMAGE_BUCKET,
      nodeEnv: env.NODE_ENV,
      appUrl: env.NEXT_PUBLIC_APP_URL,
      kieApiKeyExists: !!env.KIE_AI_API_KEY,
      // 不要暴露实际的 API 密钥值
      kieApiKeyLength: env.KIE_AI_API_KEY ? env.KIE_AI_API_KEY.length : 0
    };
    
    return new Response(JSON.stringify({
      success: true,
      debug: debugInfo,
      message: '环境变量调试信息'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '调试失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 