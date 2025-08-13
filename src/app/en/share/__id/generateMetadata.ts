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
  model?: string
}

export default async function generateMetadata(
  { params }: { params: { id: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  let data: ShareData | null = null

  try {
    // Direct request to same-domain API (runs on Edge/Node, ensure accessibility)
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/api/share/${id}`
    const res = await fetch(apiUrl, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) data = json.data as ShareData
    }
  } catch {}

  const titleBase = 'AI Image Generation Free | Work Details with AI Prompt - 2kawaii'
  const descBase = 'Detail page for AI-generated images using GPT-4o Image and Flux Kontext. Gallery with AI prompts for learning.'

  if (!data) {
    return {
      title: titleBase,
      description: descBase,
      robots: { index: false, follow: false },
      openGraph: {
        title: titleBase,
        description: descBase,
        type: 'article',
        locale: 'en_US',
      },
    }
  }

  const shortPrompt = data.prompt?.slice(0, 50) || ''
  const modelLabel = (() => {
    const m = (data as any).model
    if (m === 'flux-kontext-pro' || m === 'flux-kontext-max') return 'Flux Kontext'
    if (m === 'gpt4o-image') return 'GPT-4o Image'
    return 'GPT-4o / Flux Kontext'
  })()
  const title = `${data.style} | ${modelLabel} | ChatGPT AI Prompt | ${shortPrompt}`
  const description = `${modelLabel} — ChatGPT AI Prompt: ${data.prompt?.slice(0, 140) || ''}`.slice(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: data.generatedUrl ? [{ url: data.generatedUrl, width: 1200, height: 630, alt: 'AI Generated Image' }] : undefined,
      url: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/en/share/${id}`,
      locale: 'en_US',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/en/share/${id}`,
      languages: {
        ja: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/share/${id}`,
        en: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/en/share/${id}`,
        'x-default': `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/share/${id}`,
      },
    },
    robots: { index: true, follow: true },
  }
}