// Cloudflare Pages Functions 版本的 check-r2-config API
export async function onRequestGet({ env }: { env: any }) {
  try {
    // 检查 R2 配置
    const r2Config = {
      bucketConfigured: !!env.R2_BUCKET,
      afterimageBucketConfigured: !!env.R2_AFTERIMAGE_BUCKET,
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      r2Config,
      message: 'R2 配置检查完成'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'R2 配置检查失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 