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

    // 刷新最新12个
    const list = await shareStore.getShareList(12, 0)
    let items = Array.isArray(list?.items) ? list.items.slice(0, 12) : []

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


