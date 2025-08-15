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

    // 新逻辑：并行聚合“已发布轻量列表”和“常规列表”，去重后取最新的 12 张
    let items: any[] = []
    try {
      const [rawSimple, listRes] = await Promise.all([
        shareStore._kvGet?.(shareStore.getPublishedSimpleKey()),
        shareStore.getShareList(24, 0)
      ])
      const simple = rawSimple ? JSON.parse(rawSimple) : []
      const listItems = Array.isArray(listRes?.items) ? listRes.items : []
      const merged = [...(Array.isArray(simple) ? simple : []), ...listItems]
      const dedupMap = new Map<string, any>()
      for (const it of merged) {
        const id = it?.id
        if (!id) continue
        // 以时间戳排序，后续再截断
        if (!dedupMap.has(id)) dedupMap.set(id, it)
      }
      const deduped = Array.from(dedupMap.values()).sort((a: any, b: any) => (b?.timestamp || 0) - (a?.timestamp || 0))
      items = deduped.slice(0, 12)
    } catch {}

    // 重要：校验这些 id 是否仍然存在（避免删除后首页仍显示旧图）
    try {
      const checked: any[] = []
      for (const it of items) {
        const id = it?.id
        if (!id) continue
        const exists = await shareStore.getShare(id)
        if (exists && exists.published !== false) checked.push(it)
      }
      items = checked
    } catch {}

    // 若不足12张，可尝试用缓存补齐，但同样校验存在性
    if (Array.isArray(cached?.items) && items.length < 12) {
      const existingIds = new Set((items || []).map((it: any) => it.id))
      for (const it of cached.items) {
        if (items.length >= 12) break
        if (!it?.id || existingIds.has(it.id)) continue
        try {
          const exists = await shareStore.getShare(it.id)
          if (exists && exists.published !== false) {
            items.push(it)
            existingIds.add(it.id)
          }
        } catch {}
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


