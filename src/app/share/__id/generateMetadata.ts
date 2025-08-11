import type { Metadata, ResolvingMetadata } from 'next'

interface ShareData {
  id: string
  generatedUrl: string
  originalUrl: string | null
  prompt: string
  style: string
  timestamp: number
  createdAt: string
  seoTags?: string[]
}

export default async function generateMetadata(
  { params }: { params: { id: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  let data: ShareData | null = null

  try {
    // 直接请求同域 API（运行在Edge/Node，需确保可访问）
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/api/share/${id}`
    const res = await fetch(apiUrl, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) data = json.data as ShareData
    }
  } catch {}

  const titleBase = 'AI画像生成 無料 | 作品詳細・AI プロンプト付き - 2kawaii'
  const descBase = 'GPT-4oで生成されたAI画像の詳細ページ。AI プロンプト付きで学べるギャラリー。'

  if (!data) {
    return {
      title: titleBase,
      description: descBase,
      openGraph: {
        title: titleBase,
        description: descBase,
        type: 'article',
      },
    }
  }

  const shortPrompt = data.prompt?.slice(0, 50) || ''
  const title = `${data.style} | チャットGPT・ai プロンプト | ${shortPrompt}`
  const description = `チャットGPT・AI プロンプト: ${data.prompt?.slice(0, 140) || ''}`.slice(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: data.generatedUrl ? [{ url: data.generatedUrl, width: 1200, height: 630, alt: 'AI生成画像' }] : undefined,
      url: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/share/${id}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/share/${id}`,
      languages: {
        ja: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/share/${id}`,
        'x-default': `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/share/${id}`,
      },
    },
    robots: { index: true, follow: true },
  }
}


