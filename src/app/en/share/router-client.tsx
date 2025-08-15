'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import ShareGallery from '@/components/ShareGallery'
import Image from 'next/image'
import Link from 'next/link'

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

function Content() {
  const searchParams = useSearchParams()
  const [shareId, setShareId] = useState<string | null>(null)
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    let id = searchParams?.get('id') || null
    if (!id && typeof window !== 'undefined') {
      const rawPath = window.location.pathname || ''
      const m = rawPath.match(/^\/en\/share\/([^\/?#]+)/)
      if (m && m[1]) id = decodeURIComponent(m[1])
    }
    if (!id && typeof pathname === 'string') {
      const m = pathname.match(/^\/en\/share\/([^\/?#]+)/)
      if (m && m[1]) id = decodeURIComponent(m[1])
    }
    if (id) {
      setShareId(id)
      // 将地址规范化为 /en/share/<id>?id=<id>
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath === '/en/share' || currentPath === '/en/share/') {
          const newUrl = `/en/share/${encodeURIComponent(id)}${searchParams?.get('id') ? `?id=${encodeURIComponent(id)}` : ''}`
          try { window.history.replaceState(null, '', newUrl) } catch {}
        }
      }
    } else {
      setShareId(null)
      setShareData(null)
      setError(null)
    }
  }, [searchParams, pathname])

  const isDetailMode = !!shareId

  useEffect(() => {
    const fetchShareData = async () => {
      if (!isDetailMode || !shareId) return
      setLoading(true)
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/api/share/${shareId}`
        const res = await fetch(apiUrl, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (json.success && json.data) {
          setShareData(json.data)
          setError(null)
        } else {
          setError(json.error || 'Failed to load share data')
        }
      } catch (e) {
        setError('Failed to load share data')
      } finally {
        setLoading(false)
      }
    }
    fetchShareData()
  }, [isDetailMode, shareId])

  const seoTitle = useMemo(() => {
    if (!shareData) return 'AI Image Generation Gallery | 2kawaii'
    const shortPrompt = shareData.prompt?.slice(0, 32) || ''
    return `${shareData.style} | AI Image Prompt | ${shortPrompt}`
  }, [shareData])
  const seoDesc = useMemo(() => {
    if (!shareData) return 'Gallery of AI-generated anime images. Convert photos to anime style with GPT-4o.'
    return `AI Prompt: ${shareData.prompt?.slice(0, 120) || ''}`
  }, [shareData])

  if (isDetailMode) {
    if (loading) {
      return (
        <main className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
            <p className="mt-4 text-text-muted">Loading...</p>
          </div>
        </main>
      )
    }
    if (error || !shareData) {
      return (
        <main className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-bold text-text mb-4">An error occurred</h1>
              <p className="text-text-muted">{error || 'Share not found'}</p>
            </div>
          </div>
        </main>
      )
    }
    // Derived display data
    const formattedDate = new Date(shareData.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const generationProcess = (() => {
      const m: any = (shareData as any).model
      if (m === 'flux-kontext-pro' || m === 'flux-kontext-max') return 'Flux Kontext automatic optimization'
      if (m === 'gpt4o-image') return 'GPT-4o Image automatic prompt optimization'
      return 'GPT-4o / Flux Kontext automatic optimization'
    })()
    const modelLabel = (() => {
      const m: any = (shareData as any).model
      if (m === 'flux-kontext-pro') return 'Flux Kontext Pro'
      if (m === 'flux-kontext-max') return 'Flux Kontext Max'
      if (m === 'gpt4o-image') return 'GPT-4o Image'
      return 'GPT-4o / Flux Kontext'
    })()
    const tags: string[] = (() => {
      const seo: any = (shareData as any).seo || {}
      if (seo.keywordsEn && seo.keywordsEn.length > 0) return seo.keywordsEn
      if (seo.keywordsJa && seo.keywordsJa.length > 0) return seo.keywordsJa
      return shareData.seoTags || []
    })()

    return (
      <>
        <head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDesc} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDesc} />
          {shareData?.generatedUrl && (
            <meta property="og:image" content={shareData.generatedUrl} />
          )}
          {shareId && (
            <>
              <link rel="canonical" href={`https://2kawaii.com/en/share/${shareId}`} />
              <link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${shareId}`} />
              <link rel="alternate" hrefLang="ja" href={`https://2kawaii.com/share/${shareId}`} />
              <link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${shareId}`} />
            </>
          )}
        </head>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Hero Section */}
            <div className="bg-brand bg-[#0096fa] text-white p-6 lg:p-8 text-center">
              <h1 className="text-2xl lg:text-3xl font-bold font-cute">AI Image Conversion Result · Prompt</h1>
              <p className="opacity-90 mt-2 font-cute">Finished in {shareData.style} style!</p>
              <p className="opacity-75 mt-1 text-sm font-cute">Share ID: {shareData.id}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Image Column */}
              <div className="space-y-6">
                {((shareData as any)?.isPublished === false) ? (
                  <div className="text-center text-text-muted py-6">This work has not been made public by the author yet.</div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                    <Image
                      src={shareData.generatedUrl}
                      alt={`AI Generated ${shareData.style} Style Image`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                )}
                {((shareData as any)?.isPublished !== false) && shareData.originalUrl && (
                  <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                    <Image
                      src={shareData.originalUrl}
                      alt="Original Image"
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Details Column */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-text mb-2 font-cute">
                    {shareData.style} Style AI Generation
                  </h1>
                  <p className="text-text-muted font-cute">Created on {formattedDate}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-white text-text px-3 py-1 rounded-full text-sm font-cute border border-gray-200">{shareData.style}</span>
                  <span className="text-text-muted text-sm font-cute">{formattedDate}</span>
                  <span className="bg-white text-text px-3 py-1 rounded-full text-sm font-cute border border-gray-200">{modelLabel}</span>
                </div>

                {/* Prompt */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-text mb-3 font-cute">🤖 AI Prompt</h2>
                  <div className="bg-white/50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-text mb-1 font-cute">Prompt:</h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-cute whitespace-pre-wrap">
                      {shareData.prompt}
                    </p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-text mb-3 font-cute">Work Highlights</h2>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted font-cute">
                    <li>Style: {shareData.style || 'Custom'}</li>
                    <li>Theme: {(shareData.prompt || 'N/A').slice(0, 60)}{(shareData.prompt || '').length > 60 ? '...' : ''}</li>
                    <li>Generation process: {generationProcess}</li>
                  </ul>
                </div>

                {/* Style Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-text mb-1 font-cute">Style</h3>
                    <p className="text-sm text-text-muted font-cute">{shareData.style}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-text mb-1 font-cute">Created</h3>
                    <p className="text-sm text-text-muted font-cute">{formattedDate}</p>
                  </div>
                </div>

                {/* Tags */}
                {tags && tags.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-text mb-2 font-cute">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-surface text-text px-3 py-1 rounded-full text-xs font-cute border border-border">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="space-y-3">
                  <a
                    href={shareData.generatedUrl}
                    download
                    className="inline-flex items-center justify-center w-full bg-[#0096fa] hover:bg-[#0085e0] text-white py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    📥 Download
                  </a>
                  <Link
                    href="/en/workspace"
                    className="inline-flex items-center justify-center w-full bg-[#0096fa] hover:bg-[#0085e0] text-white py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Try This Style Yourself
                  </Link>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link href="/en" className="inline-flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🏠 Home</Link>
                    <Link href="/en/share" className="inline-flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🖼️ Gallery</Link>
                    <Link href="/en/workspace" className="inline-flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">✨ Workspace</Link>
                  </div>
                </div>

                {/* Language Alternatives */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-text-muted mb-2 font-cute">Language:</p>
                  <div className="flex gap-3">
                    <Link href={`/share/${shareId}`} prefetch className="text-sm text-pink-600 hover:text-pink-800 font-cute">Japanese</Link>
                    <span className="text-sm text-text-muted">•</span>
                    <span className="text-sm text-text font-cute">English</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related CTA */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text mb-6 text-center font-cute">More AI Creations</h2>
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
      </>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-text mb-4 font-cute">AI Image Generation Gallery</h1>
        <p className="text-lg text-text-muted font-cute max-w-2xl mx-auto">Browse our gallery of AI-generated anime images. Get inspired for your own creations!</p>
      </div>
      <ShareGallery />
    </main>
  )
}

export default function EnShareClientRouter() {
  return (
    <Suspense fallback={
      <main className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading...</p>
        </div>
      </main>
    }>
      <Content />
    </Suspense>
  )
}


