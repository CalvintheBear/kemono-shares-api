// 获取首页“今日最新作品” - 带KV缓存（30分钟）
import { ShareStoreWorkers } from '../../../src/lib/share-store-workers.js'

const CACHE_KEY = 'share:cache:latest:12'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30分钟

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
          'Cache-Control': 'public, s-maxage=1800, max-age=300, stale-while-revalidate=120'
        }
      })
    }

    // 刷新最新12个
    const list = await shareStore.getShareList(12, 0)
    const items = Array.isArray(list?.items) ? list.items.slice(0, 12) : []

    // 写入缓存
    try {
      await shareStore._kvPut?.(CACHE_KEY, JSON.stringify({ items, updatedAt: now }), 60 * 60 * 24)
    } catch {}

    return new Response(JSON.stringify({ success: true, data: { items } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=1800, max-age=300, stale-while-revalidate=120'
      }
    })
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'latest取得失敗' }), { status: 500 })
  }
}


