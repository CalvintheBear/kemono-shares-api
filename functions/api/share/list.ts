// 导入 KV 存储库
import { ShareStoreWorkers } from '../../../src/lib/share-store-workers.js';

// Cloudflare Pages Functions 版本的 share/list API
// 用于获取分享列表，支持分页
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    // 1. 检查KV绑定是否存在（允许 REST 回退）
    const hasBinding = !!env.SHARE_DATA_KV;
    const canRest = !!(env.CLOUDFLARE_API_TOKEN && (env.CLOUDFLARE_ACCOUNT_ID || env.CLOUDFLARE_R2_ACCOUNT_ID) && (env.SHARE_KV_NAMESPACE_ID || env.SHARE_DATA_KV_NAMESPACE_ID));
    if (!hasBinding && !canRest) {
      console.error('❌ GET List: KV存储绑定未配置，且缺少 REST 回退所需变量');
      return new Response(JSON.stringify({ 
        success: false, 
        error: '服务器配置错误: 存储服务不可用' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const style = url.searchParams.get('style') || ''
    const model = url.searchParams.get('model') || ''
    const tag = url.searchParams.get('tag') || ''
    const cursorParam = url.searchParams.get('cursor')
    const cursor = cursorParam ? Math.max(0, parseInt(cursorParam)) : 0
    // 提高默认时间预算，避免每次只返回1-2张；允许前端覆盖
    const timeBudgetMs = Math.min(800, Math.max(100, parseInt(url.searchParams.get('tb') || '400')))
    
    console.log(`🔍 获取分享列表: limit=${limit}, offset=${offset}`);

    // 2. 初始化KV存储
    const shareStore = new ShareStoreWorkers(hasBinding ? env.SHARE_DATA_KV : env);
    
    // 3. 支持基于样式/模型/标签的索引过滤（任取其一）。
    //    默认仅展示“已发布”的分享（移除文生图限定）。
    let result: any = null
    if (style || model || tag) {
      console.log('📊 采用索引过滤: ', { style, model, tag })
      let indexKey = ''
      if (style) indexKey = shareStore.getStyleIndexKey(style)
      else if (model) indexKey = shareStore.getModelIndexKey(model)
      else if (tag) indexKey = shareStore.getTagIndexKey(tag)
      const raw = indexKey ? await shareStore._kvGet(indexKey) : null
      const idList: string[] = raw ? JSON.parse(raw) : []
      const total = idList.length
      const slice = idList.slice(offset, offset + limit)
      const items: any[] = []
      for (const id of slice) {
        const share = await shareStore.getShare(id)
        if (!share) continue
        items.push({
          id: share.id,
          title: `${share.style}変換`,
          style: share.style,
          timestamp: share.timestamp,
          createdAt: share.createdAt,
          generatedUrl: share.generatedUrl,
          originalUrl: share.originalUrl || ''
        })
      }
      result = { items, total, limit, offset, hasMore: offset + items.length < total }
    } else {
      // 优先从“已发布轻量列表”直接分页（零 N+1）
      try {
        const rawSimple = await shareStore._kvGet?.(shareStore.getPublishedSimpleKey())
        const simpleList: any[] = rawSimple ? JSON.parse(rawSimple) : []
        if (Array.isArray(simpleList) && simpleList.length > 0) {
          const total = simpleList.length
          const start = cursorParam ? Math.max(0, parseInt(cursorParam)) : offset
          const slice: any[] = simpleList.slice(start, start + limit)
          const nextCursor = start + slice.length
          const hasMore = nextCursor < total
          result = { items: slice, total, limit, offset: start, hasMore, cursor: hasMore ? nextCursor : undefined }
        }
      } catch {}

      // 次优先：从“已发布索引”按 id 分页（仍可能产生 N 次 getShare）
      if (!result) try {
        const raw = await shareStore._kvGet?.(shareStore.getPublishedIndexKey())
        const idList: string[] = raw ? JSON.parse(raw) : []
        if (Array.isArray(idList) && idList.length > 0) {
          const total = idList.length
          const start = cursorParam ? Math.max(0, parseInt(cursorParam)) : offset
          const slice = idList.slice(start, start + limit)
          const items: any[] = []
          const used = new Set<string>()
          for (const id of slice) {
            const share = await shareStore.getShare(id)
            if (!share) continue
            used.add(id)
            items.push({
              id: share.id,
              title: `${share.style}変換`,
              style: share.style,
              timestamp: share.timestamp,
              createdAt: share.createdAt,
              generatedUrl: share.generatedUrl,
              originalUrl: share.originalUrl || ''
            })
          }
          const nextCursor = start + items.length
          const hasMore = nextCursor < total
          result = { items, total, limit, offset: start, hasMore, cursor: hasMore ? nextCursor : undefined }
        }
      } catch {}

      // 不再兼容旧索引与全表扫描（你已不关心旧数据，且为避免重复）

      // 无可用索引则返回空列表
      if (!result) {
        result = { items: [], total: 0, limit, offset, hasMore: false }
      }
    }

    if (!result || !result.items) {
      console.log('⚠️ 未从KV中获取到分享项目。');
      result.items = [];
      result.total = 0;
      result.hasMore = false;
    }

    console.log(`✅ 返回 ${result.items.length} 个分享项目，总共 ${result.total} 个，hasMore: ${result.hasMore}`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        items: result.items,
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore,
        cursor: result.cursor,
        filter: style ? `style:${style}` : model ? `model:${model}` : tag ? `tag:${tag}` : 'all'
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, max-age=60, stale-while-revalidate=120'
      }
    });

  } catch (error) {
    console.error('❌ 获取分享列表失败:', error);
    return new Response(JSON.stringify({ 
      error: '获取分享列表失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
