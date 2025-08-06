export async function onRequestPost(context: any) {
  try {
    const { request } = context;
    
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const body = await request.json();
    const { prompt, style } = body;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: '缺少提示词' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // 这里应该调用您的AI图片生成服务
    // 暂时返回模拟响应
    const mockResult = {
      success: true,
      imageUrl: `https://example.com/generated/${Date.now()}.jpg`,
      prompt,
      style,
      message: 'AI图片生成功能正在开发中'
    };
    
    return new Response(
      JSON.stringify(mockResult),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('AI图片生成错误:', errorMessage);
    
    return new Response(
      JSON.stringify({ error: `AI图片生成失败: ${errorMessage}` }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// 支持OPTIONS请求（CORS预检）
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 