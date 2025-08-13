// Cloudflare Image Resizing proxy for thumbnails
// GET /api/img?u=<encoded url>&w=<width>&q=<quality>&fm=<format>
export async function onRequestGet({ request }: { request: Request }) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('u')
    const w = Number(searchParams.get('w') || '0') || 0
    const q = Number(searchParams.get('q') || '70') || 70
    const fm = (searchParams.get('fm') || 'webp').toLowerCase()

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

    const res = new Response(upstream.body, {
      status: 200,
      headers: new Headers({
        'Content-Type': upstream.headers.get('Content-Type') || 'image/webp',
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
      }),
    })
    return res
  } catch (e) {
    return new Response('Proxy error', { status: 500 })
  }
}


