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
    const urlObj = new URL((env as any).request?.url || 'https://2kawaii.com')
    const page = parseInt(urlObj.searchParams.get('page') || '1')
    const pageSize = 500
    const offset = (page - 1) * pageSize
    const list = await shareStore.getShareList(pageSize, offset)
    const items = (Array.isArray(list?.items) ? list.items : []).filter((it: any) => it && it.id)
    const origin = env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'

    const urls = items.map((it: any) => {
      const locJa = `${origin}/share/${it.id}?id=${encodeURIComponent(it.id)}`
      const locEn = `${origin}/en/share/${it.id}?id=${encodeURIComponent(it.id)}`
      const lastmod = new Date(it.createdAt || it.timestamp || Date.now()).toISOString()
      return `  <url>
    <loc>${locJa}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="ja" href="${locJa}" />
    <xhtml:link rel="alternate" hreflang="en" href="${locEn}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${locJa}" />
  </url>`
    }).join('\n')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`
    return new Response(xml, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
  } catch {
    return new Response('Error', { status: 500 })
  }
}


