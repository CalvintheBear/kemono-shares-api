import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MobileBottomNav from '@/components/MobileBottomNav'

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

async function getShareData(id: string): Promise<ShareData | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/api/share/${id}`
    const res = await fetch(apiUrl, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) return json.data as ShareData
    }
  } catch (error) {
    console.error('Failed to fetch share data:', error)
  }
  return null
}


export default async function ShareDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const data = await getShareData(id)

  if (!data) {
    notFound()
  }

  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const generationProcess = (() => {
    const m = (data as any).model
    if (m === 'flux-kontext-pro' || m === 'flux-kontext-max') return 'Flux Kontext automatic optimization'
    if (m === 'gpt4o-image') return 'GPT-4o Image automatic prompt optimization'
    return 'GPT-4o / Flux Kontext automatic optimization'
  })()

  const modelLabel = (() => {
    const m = (data as any).model
    if (m === 'flux-kontext-pro') return 'Flux Kontext Pro'
    if (m === 'flux-kontext-max') return 'Flux Kontext Max'
    if (m === 'gpt4o-image') return 'GPT-4o Image'
    return 'GPT-4o / Flux Kontext'
  })()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <head>
        <link rel="canonical" href={`https://2kawaii.com/en/share/${id}`} />
        <link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${id}`} />
        <link rel="alternate" hrefLang="ja" href={`https://2kawaii.com/share/${id}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${id}`} />
              {/* 移除未发布作品的SEO限制 */}
      </head>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: `AI Generated ${data.style} Style Image`,
            description: data.prompt,
            image: data.generatedUrl,
            dateCreated: data.createdAt,
            creator: {
              '@type': 'Organization',
              name: '2kawaii AI Image Generation',
              url: 'https://2kawaii.com'
            },
            url: `https://2kawaii.com/en/share/${id}`,
            inLanguage: 'en'
          })
        }}
      />

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Hero Section: unify with JP version */}
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 lg:p-8 text-center">
            <h1 className="text-2xl lg:text-3xl font-bold font-cute">AI Image Conversion Result · Prompt</h1>
            <p className="opacity-90 mt-2 font-cute">Finished in {data.style} style!</p>
            <p className="opacity-75 mt-1 text-sm font-cute">Share ID: {data.id}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Section */}
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl overflow-hidden">
                <Image
                  src={data.generatedUrl}
                  alt={`AI Generated ${data.style} Style Image`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              {data.originalUrl && (
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <Image
                    src={data.originalUrl}
                    alt="Original Image"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-text mb-2 font-cute">
                  {data.style} Style AI Generation
                </h1>
                <p className="text-text-muted font-cute">Created on {formattedDate}</p>
              </div>

              {/* JP-like chips row (style/date/model) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white/70 text-text px-3 py-1 rounded-full text-sm font-cute border border-white/60">{data.style}</span>
                <span className="text-text-muted text-sm font-cute">{formattedDate}</span>
                <span className="bg-white/70 text-text px-3 py-1 rounded-full text-sm font-cute border border-white/60">{modelLabel}</span>
              </div>

              {/* AI Prompt Section */}
              <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-text mb-3 font-cute">🤖 AI Prompt</h2>
                <div className="bg-white/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-text mb-1 font-cute">Prompt:</h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-cute whitespace-pre-wrap">
                    {data.prompt}
                  </p>
                </div>
              </div>

              {/* Highlights (mirroring JP detail, always show with fallbacks) */}
              <div className="bg-white/60 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-text mb-3 font-cute">Work Highlights</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted font-cute">
                  <li>Style: {data.style || 'Custom'}</li>
                  <li>Theme: {(data.prompt || 'N/A').slice(0, 60)}{(data.prompt || '').length > 60 ? '...' : ''}</li>
                  <li>Generation process: {generationProcess}</li>
                </ul>
              </div>

              {/* Style Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-xl p-4">
                  <h3 className="font-semibold text-text mb-1 font-cute">Style</h3>
                  <p className="text-sm text-text-muted font-cute">{data.style}</p>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <h3 className="font-semibold text-text mb-1 font-cute">Created</h3>
                  <p className="text-sm text-text-muted font-cute">{formattedDate}</p>
                </div>
              </div>

              {/* Tags (fallback to JA or legacy seoTags) */}
              {(() => {
                const seo: any = (data as any).seo || {}
                const tags: string[] = (seo.keywordsEn && seo.keywordsEn.length > 0)
                  ? seo.keywordsEn
                  : (seo.keywordsJa && seo.keywordsJa.length > 0)
                    ? seo.keywordsJa
                    : (data.seoTags || [])
                return tags && tags.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-text mb-2 font-cute">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-800 px-3 py-1 rounded-full text-xs font-cute"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              })()}

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={data.generatedUrl}
                  download
                  className="block w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  📥 Download
                </a>
                <Link
                  href="/en/workspace"
                  className="block w-full bg-white/50 text-text text-center py-3 rounded-full font-bold hover:bg-white/70 transition-all border border-white/50"
                >
                  Try This Style Yourself
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link href="/en" className="bg-white/70 text-text text-center py-3 rounded-xl font-semibold hover:bg-white transition border border-white/60">🏠 Home</Link>
                  <Link href="/en/share" className="bg-white/70 text-text text-center py-3 rounded-xl font-semibold hover:bg-white transition border border-white/60">🖼️ Gallery</Link>
                  <Link href="/en/workspace" className="bg-white/70 text-text text-center py-3 rounded-xl font-semibold hover:bg-white transition border border-white/60">✨ Workspace</Link>
                </div>
              </div>

              {/* Language Alternatives */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted mb-2 font-cute">Language:</p>
                <div className="flex gap-3">
                  <Link href={`/share/${id}`} prefetch className="text-sm text-pink-600 hover:text-pink-800 font-cute">Japanese</Link>
                  <span className="text-sm text-text-muted">•</span>
                  <span className="text-sm text-text font-cute">English</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-6 text-center font-cute">
            More AI Creations
          </h2>
          <div className="text-center">
            <Link
              href="/en/share"
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 font-semibold text-text hover:bg-white/90 transition-all"
            >
              <span>🎨</span>
              <span>Explore Gallery</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}