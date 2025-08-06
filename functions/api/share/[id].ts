// Cloudflare Pages Functions 版本的 share/[id] API
export async function onRequestGet({ 
  request, 
  params 
}: { 
  request: Request; 
  params: { id: string } 
}) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少分享ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 这里可以添加分享数据获取逻辑
    // 目前返回模拟响应
    const shareData = {
      id,
      title: `分享 ${id}`,
      description: '这是一个示例分享',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      share: shareData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '获取分享数据失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPut({ 
  request, 
  params 
}: { 
  request: Request; 
  params: { id: string } 
}) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少分享ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 这里可以添加分享更新逻辑
    return new Response(JSON.stringify({
      success: true,
      message: `分享 ${id} 更新成功`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '更新分享失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete({ 
  params 
}: { 
  params: { id: string } 
}) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: '缺少分享ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 这里可以添加分享删除逻辑
    return new Response(JSON.stringify({
      success: true,
      message: `分享 ${id} 删除成功`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: '删除分享失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 