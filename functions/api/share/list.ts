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
    //    同时优先使用“文生图索引”加速首页/画廊列表的首次加载。
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
      // 优先从“文生图索引”直接分页，避免扫描全表
      try {
        const raw = await shareStore._kvGet?.(shareStore.getTextIndexKey())
        const idList: string[] = raw ? JSON.parse(raw) : []
        if (Array.isArray(idList) && idList.length > 0) {
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
        }
      } catch {}

      // 回退兜底（逐步扫描，按时间预算提前返回，并提供cursor继续扫描）
      if (!result) {
        console.log('📊 采用回退扫描路径: 支持按时间预算提前返回');
        const listRaw = await shareStore._kvGet?.(shareStore.getListKey())
        const shareIds: string[] = listRaw ? JSON.parse(listRaw) : []
        const totalIds = shareIds.length
        const startTime = Date.now()
        let nextCursor = cursor
        let scanned = 0
        let matchedCount = 0
        const items: any[] = []
        // 当携带 cursor 时，将 offset 视为相对该游标的偏移（置 0），避免重复跳过
        const effectiveOffset = cursorParam ? 0 : offset

        const minBatch = Math.min(6, limit)
        for (let i = cursor; i < totalIds; i++) {
          const id = shareIds[i]
          const share = await shareStore.getShare(id)
          nextCursor = i + 1
          scanned++
          if (!share) continue
          if (share.originalUrl && share.originalUrl !== '') continue
          // 匹配到文生图
          matchedCount++
          if (matchedCount <= effectiveOffset) {
            // 跳过到offset
            continue
          }
          if (items.length < limit) {
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
          // 满足数量即返回
          if (items.length >= limit) break
          // 时间预算到达且已有部分结果，先返回以加速首屏
          if (Date.now() - startTime > timeBudgetMs && items.length >= minBatch) break
        }

        const hasMore = nextCursor < totalIds
        result = {
          items,
          total: undefined,
          limit,
          offset,
          hasMore: hasMore || (items.length >= limit),
          cursor: hasMore ? nextCursor : undefined
        }
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
