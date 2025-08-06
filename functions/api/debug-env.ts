// 调试环境变量和绑定的 API
export async function onRequestGet({ env }: { env: any }) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      envKeys: Object.keys(env),
      uploadBucketExists: !!env.UPLOAD_BUCKET,
      afterimageBucketExists: !!env.AFTERIMAGE_BUCKET,
      nodeEnv: env.NODE_ENV,
      appUrl: env.NEXT_PUBLIC_APP_URL,
      kieApiKeyExists: !!env.KIE_AI_API_KEY,
      // R2 环境变量检查
      r2Config: {
        accountId: env.CLOUDFLARE_R2_ACCOUNT_ID || '未配置',
        bucketName: env.CLOUDFLARE_R2_BUCKET_NAME || '未配置',
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID ? '已配置' : '未配置',
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? '已配置' : '未配置',
        publicUrl: env.CLOUDFLARE_R2_PUBLIC_URL || '未配置',
        afterimageBucketName: env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME || '未配置',
        afterimagePublicUrl: env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL || '未配置'
      },
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