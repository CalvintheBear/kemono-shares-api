'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ShareGallery from '@/components/ShareGallery'
import Image from 'next/image'

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

function Content() {
  const searchParams = useSearchParams()
  const [shareId, setShareId] = useState<string | null>(null)
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams?.get('id')
    if (id) {
      setShareId(id)
    } else {
      setShareId(null)
      setShareData(null)
      setError(null)
    }
  }, [searchParams])

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
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-text mb-2 font-cute">AI Image Generation Result</h1>
            <p className="text-text-muted">{shareData.style} style</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center">
                <Image
                  src={shareData.generatedUrl}
                  alt={`AI Generated ${shareData.style}`}
                  width={1200}
                  height={800}
                  unoptimized
                  className="rounded-2xl shadow-lg max-w-full h-auto"
                />
              </div>
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


