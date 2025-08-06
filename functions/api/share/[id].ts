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
    
    // 从全局存储中获取分享数据
    let shareData = null;
    
    if (typeof globalThis !== 'undefined' && (globalThis as any).shareDataStore) {
      shareData = (globalThis as any).shareDataStore.get(id);
      console.log(`🔍 查找分享数据: ${id}, 找到: ${!!shareData}`);
    }
    
    if (!shareData) {
      console.log(`❌ 未找到分享数据: ${id}`);
      return new Response(JSON.stringify({ 
        error: '分享不存在',
        message: `找不到ID为 ${id} 的分享`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
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