// 动态分享详情页站点地图：/api/sitemap-share
import { ShareStoreWorkers } from '../../src/lib/share-store-workers.js'

export async function onRequestGet({ env }: { env: any }) {
  try {
    const hasBinding = !!env.SHARE_DATA_KV
    const canRest = !!(env.CLOUDFLARE_API_TOKEN && (env.CLOUDFLARE_ACCOUNT_ID || env.CLOUDFLARE_R2_ACCOUNT_ID) && (env.SHARE_KV_NAMESPACE_ID || env.SHARE_DATA_KV_NAMESPACE_ID))
    if (!hasBinding && !canRest) {
      return new Response('Service Unavailable', { status: 503 })
    }

    const shareStore = new ShareStoreWorkers(hasBinding ? env.SHARE_DATA_KV : env)
    const list = await shareStore.getShareList(200, 0)
    const items = Array.isArray(list?.items) ? list.items : []
    const origin = env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'

    const urls = items.map((it: any) => `  <url><loc>${origin}/share/${it.id}</loc><changefreq>daily</changefreq><priority>0.5</priority></url>`).join('\n')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
    return new Response(xml, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
  } catch {
    return new Response('Error', { status: 500 })
  }
}


