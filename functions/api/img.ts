// Cloudflare Image Resizing proxy for thumbnails
// GET /api/img?u=<encoded url>&w=<width>&q=<quality>&fm=<format>
export async function onRequestGet({ request }: { request: Request }) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('u')
    const w = Number(searchParams.get('w') || '0') || 0
    const q = Number(searchParams.get('q') || '70') || 70
    // 自动根据 Accept 协议选择更优格式，允许显式 fm 覆盖
    const fmParam = (searchParams.get('fm') || '').toLowerCase()
    const accept = request.headers.get('Accept') || ''
    const prefersAvif = /image\/avif/i.test(accept)
    const prefersWebp = /image\/webp/i.test(accept)
    const fm = fmParam || (prefersAvif ? 'avif' : (prefersWebp ? 'webp' : 'jpeg'))

    if (!url) {
      return new Response('Missing url', { status: 400 })
    }

    // Build cf image options
    const imageOpts: any = {
      quality: Math.min(100, Math.max(30, q)),
      fit: 'cover',
    }
    if (w > 0) imageOpts.width = w
    if (fm === 'webp' || fm === 'jpeg' || fm === 'png' || fm === 'avif') {
      imageOpts.format = fm
    }

    const upstream = await fetch(url, { cf: { image: imageOpts } as any })
    if (!upstream.ok) {
      // Fallback to direct fetch without resizing
      const raw = await fetch(url)
      return new Response(raw.body, {
        status: raw.status,
        headers: raw.headers,
      })
    }

    const contentType = upstream.headers.get('Content-Type') || (fm === 'avif' ? 'image/avif' : fm === 'webp' ? 'image/webp' : fm === 'png' ? 'image/png' : 'image/jpeg')
    const res = new Response(upstream.body, {
      status: 200,
      headers: new Headers({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
      }),
    })
    return res
  } catch (e) {
    return new Response('Proxy error', { status: 500 })
  }
}


