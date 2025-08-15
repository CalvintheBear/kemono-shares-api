// 获取首页“今日最新作品” - 带KV缓存（10分钟）
import { ShareStoreWorkers } from '../../../src/lib/share-store-workers.js'

const CACHE_KEY = 'share:cache:latest:12'
const CACHE_TTL_MS = 10 * 60 * 1000 // 10分钟

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const hasBinding = !!env.SHARE_DATA_KV
    const canRest = !!(env.CLOUDFLARE_API_TOKEN && (env.CLOUDFLARE_ACCOUNT_ID || env.CLOUDFLARE_R2_ACCOUNT_ID) && (env.SHARE_KV_NAMESPACE_ID || env.SHARE_DATA_KV_NAMESPACE_ID))
    if (!hasBinding && !canRest) {
      return new Response(JSON.stringify({ success: false, error: 'ストレージ未設定' }), { status: 500 })
    }

    const shareStore = new ShareStoreWorkers(hasBinding ? env.SHARE_DATA_KV : env)

    // 读取缓存
    let cached: any = null
    try {
      const raw = await shareStore._kvGet ? await shareStore._kvGet(CACHE_KEY) : null
      if (raw) cached = JSON.parse(raw)
    } catch {}

    const now = Date.now()
    if (cached && cached.updatedAt && now - cached.updatedAt < CACHE_TTL_MS && Array.isArray(cached.items)) {
      return new Response(JSON.stringify({ success: true, data: { items: cached.items } }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // 边缘缓存10分钟，浏览器缓存5分钟，可陈旧复用2分钟
          'Cache-Control': 'public, s-maxage=600, max-age=300, stale-while-revalidate=120'
        }
      })
    }

    // 优先读取“已发布”的精简最新索引，避免逐条查询
    let items: any[] = []
    try {
      const rawLatest = await shareStore._kvGet?.(shareStore.getPublishedLatestKey())
      const simpleList = rawLatest ? JSON.parse(rawLatest) : []
      if (Array.isArray(simpleList) && simpleList.length > 0) {
        items = simpleList.slice(0, 12)
      }
    } catch {}

    // 回退：从常规列表获取
    if (!items || items.length === 0) {
      const list = await shareStore.getShareList(12, 0)
      items = Array.isArray(list?.items) ? list.items.slice(0, 12) : []
    }

    // 若没有取到新数据，则保持KV中已有的12个，避免清空
    if ((!items || items.length === 0) && Array.isArray(cached?.items)) {
      items = cached.items
    }

    // 若不足12张，尝试用缓存补齐到12张（按去重合并）
    if (Array.isArray(cached?.items) && items.length < 12) {
      const existingIds = new Set((items || []).map((it: any) => it.id))
      for (const it of cached.items) {
        if (!existingIds.has(it.id)) {
          items.push(it)
          existingIds.add(it.id)
          if (items.length >= 12) break
        }
      }
    }
    items = items.slice(0, 12)

    // 预温：并发小批量预取这些 id，填充 Workers 内存缓存（限制时间预算，避免阻塞响应过久）
    try {
      const ids = (items || []).map((it: any) => it?.id).filter(Boolean)
      if (ids.length > 0) {
        const concurrency = Math.min(4, ids.length)
        let idx = 0
        const worker = async () => {
          while (idx < ids.length) {
            const id = ids[idx++]
            try { await shareStore.getShare(id) } catch {}
          }
        }
        const runners = Array.from({ length: concurrency }, () => worker())
        // 限时预热：最多等待 ~120ms，其后继续返回响应
        await Promise.race([
          Promise.allSettled(runners),
          new Promise(resolve => setTimeout(resolve, 120))
        ])
      }
    } catch {}

    // 写入缓存
    try {
      await shareStore._kvPut?.(CACHE_KEY, JSON.stringify({ items, updatedAt: now }), 60 * 60 * 24)
    } catch {}

    return new Response(JSON.stringify({ success: true, data: { items } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=600, max-age=300, stale-while-revalidate=120'
      }
    })
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'latest取得失敗' }), { status: 500 })
  }
}


