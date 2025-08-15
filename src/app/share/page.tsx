"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
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
  model?: string
}

function SharePageContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [shareId, setShareId] = useState<string | null>(null)
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 支持通过 query 参数或路径段渲染详情
  // 注意：在 Cloudflare Pages 的 200 重写下，Next 的 usePathname 可能返回 '/share'，
  // 因此先用 window.location.pathname 兜底提取 id
  // 修复: 从详情返回到 /share 时需要清空 shareId，否则会停留在详情页
  useEffect(() => {
    let id = searchParams?.get('id') || null
    if (!id && typeof window !== 'undefined') {
      const rawPath = window.location.pathname || ''
      const m = rawPath.match(/^\/share\/([^\/?#]+)/)
      if (m && m[1]) id = decodeURIComponent(m[1])
    }
    if (!id && typeof pathname === 'string') {
      const m = pathname.match(/^\/share\/([^\/?#]+)/)
      if (m && m[1]) id = decodeURIComponent(m[1])
    }
    if (id) {
      setShareId(id)
      // 保持地址栏为 /share/<id>?id=<id> 形式（避免被客户端路由替换成 /share?id=...）
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath === '/share' || currentPath === '/share/') {
          const newUrl = `/share/${encodeURIComponent(id)}${searchParams?.get('id') ? `?id=${encodeURIComponent(id)}` : ''}`
          try { window.history.replaceState(null, '', newUrl) } catch {}
        }
      }
    } else {
      setShareId(null)
      setShareData(null)
      setError(null)
      setLoading(false)
    }
  }, [searchParams, pathname])

  const isDetailMode = !!shareId

  // 获取详情数据
  useEffect(() => {
    const fetchShareData = async () => {
      if (!isDetailMode || !shareId) {
        setLoading(false)
        return
      }
      try {
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? `https://2kawaii.com/api/share/${shareId}`
          : `/api/share/${shareId}`
        const res = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (json.success && json.data) {
          setShareData(json.data)
          setError(null)
        } else {
          setError(json.error || 'シェアデータの取得に失敗しました')
        }
      } catch (e) {
        setError('シェアデータの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchShareData()
  }, [isDetailMode, shareId])

  const handleTryNow = () => {
    window.location.href = 'https://2kawaii.com'
  }

  const navToHome = () => (window.location.href = '/')
  const navToGallery = () => (window.location.href = '/share')
  const navToWorkspace = () => (window.location.href = '/workspace')

  const handleDownload = () => {
    if (shareData) {
      const link = document.createElement('a')
      link.href = shareData.generatedUrl
      link.download = `2kawaii-${shareData.style}-${Date.now()}.png`
      link.click()
    }
  }

  const renderSeoTags = () => {
    const seo = (shareData as any)?.seo
    const tags: string[] = (seo?.keywordsJa || (shareData as any)?.seoTags) || []
    if (!tags || tags.length === 0) return null
    // 仅展示日文标签，减少中文/英文对检索的影响
    const jaTags = tags.filter(t => /[\u3040-\u30FF\u4E00-\u9FFF]/.test(t)).slice(0, 10)
    if (jaTags.length === 0) return null
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {jaTags.map((t, i) => (
          <span key={i} className="text-xs bg-surface text-text px-2 py-1 rounded-full border border-border">#{t}</span>
        ))}
      </div>
    )
  }

  // 详情模式渲染（已弃用）
  if (isDetailMode) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
            <p className="mt-4 text-text-muted">読み込み中...</p>
            <p className="mt-2 text-sm text-text-muted">シェアID: {shareId}</p>
          </div>
        </div>
      )
    }
    if (error || !shareData) {
      return (
        <div className="min-h-screen">
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-6xl mb-4">😔</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h1>
                <p className="text-gray-600 mb-2">{error || 'シェアデータが見つかりません'}</p>
                <p className="text-sm text-gray-500 mb-6">シェアID: {shareId}</p>
                <button
                  onClick={handleTryNow}
                  className="btn-primary text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  2kawaiiを試す
                </button>
              </div>
            </div>
          </div>
          <Footer />
          <MobileBottomNav />
        </div>
      )
    }
    // 动态SEO：为 /share?id=... 注入基础头部元信息
    const seoTitle = shareData
      ? (() => {
          const shortPrompt = (shareData.prompt || '').slice(0, 32)
          const modelLabel = (shareData as any)?.seo?.modelLabel || (shareData?.model === 'gpt4o-image' ? 'GPT-4o Image' : shareData?.model === 'flux-kontext-pro' ? 'Flux Kontext Pro' : shareData?.model === 'flux-kontext-max' ? 'Flux Kontext Max' : 'GPT-4o / Flux Kontext')
          return `${shareData.style} | ${modelLabel} | AI プロンプト | ${shortPrompt}`
        })()
      : 'AI画像生成 無料 | GPT-4o 画像変換 - 2kawaii'
    const seoDesc = shareData
      ? (() => {
          const modelLabel = (shareData as any)?.seo?.modelLabel || (shareData?.model === 'gpt4o-image' ? 'GPT-4o Image' : shareData?.model === 'flux-kontext-pro' ? 'Flux Kontext Pro' : shareData?.model === 'flux-kontext-max' ? 'Flux Kontext Max' : 'GPT-4o / Flux Kontext')
          return `${modelLabel} — AI プロンプト: ${(shareData.prompt || '').slice(0, 120)}`
        })()
      : 'AI画像生成 ギャラリー | GPT-4oで写真をアニメ風に変換。プロンプト付き。'

    return (
      <div className="min-h-screen">
        <Header />
        <head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDesc} />
          {/* 统一信号：规范化到 /share/<id>，但允许索引以整合权重 */}
          {shareId && (
            <>
              <link rel="canonical" href={`https://2kawaii.com/share/${shareId}`} />
              <meta property="og:url" content={`https://2kawaii.com/share/${shareId}`} />
              <link rel="alternate" hrefLang="ja" href={`https://2kawaii.com/share/${shareId}`} />
              <link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${shareId}`} />
              <link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${shareId}`} />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CreativeWork',
                    name: `${shareData?.style || ''} | AI 画像生成`,
                    description: shareData?.prompt || '',
                    image: shareData?.generatedUrl || undefined,
                    url: `https://2kawaii.com/share/${shareId}`,
                    dateCreated: shareData?.createdAt || undefined,
                    inLanguage: 'ja'
                  })
                }}
              />
            </>
          )}
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDesc} />
          {shareData?.generatedUrl && (
            <meta property="og:image" content={shareData.generatedUrl} />
          )}
          {/* 统一 canonical 指向 /share/<id>，避免参数与路径重复 */}
          {shareId && (
            <>
              <link rel="canonical" href={`https://2kawaii.com/share/${shareId}`} />
              <link rel="alternate" hrefLang="ja" href={`https://2kawaii.com/share/${shareId}`} />
              <link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${shareId}`} />
              <link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${shareId}`} />
            </>
          )}
        </head>
        {/* 详情页动态SEO已迁移到 /share/[id]/generateMetadata */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-brand bg-[#0096fa] text-white p-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <h1 className="text-3xl font-bold">AI画像変換 結果（数秒で完了）</h1>
              </div>
              <p className="text-lg opacity-90">{shareData.style}スタイルでAI変換完了！</p>
              <p className="text-sm opacity-75 mt-2">シェアID: {shareData.id}</p>
            </div>
            <div className="p-8">
          {((shareData as any)?.isPublished === false) ? (
            <div className="text-center text-text-muted py-6">この作品はまだ作者が公開していません。</div>
          ) : (
            <div className="flex justify-center">
              <Image
                src={`/api/img?u=${encodeURIComponent(shareData.generatedUrl)}&w=1200&q=85&fm=webp`}
                alt={`${shareData.style} | ${(shareData.prompt || '').slice(0, 60)}`}
                width={1200}
                height={800}
                unoptimized
                className="rounded-2xl shadow-lg max-w-full h-auto"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
            </div>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-surface text-text px-3 py-1 rounded-full text-sm font-medium border border-border">{shareData.style}</span>
                <span className="text-gray-500 text-sm">{new Date(shareData.timestamp).toLocaleDateString('ja-JP')}</span>
              </div>
            <h3 className="text-sm font-semibold text-text mt-2 mb-1">プロンプト：</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{shareData.prompt}</p>
            {shareData.prompt && (
              <div className="mt-4 text-gray-700 text-sm leading-relaxed">
                <h2 className="text-base font-semibold mb-2">作品のポイント</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>スタイル: {shareData.style}</li>
                  <li>テーマ: {(shareData.prompt || '').slice(0, 40)}...</li>
                  <li>
                    生成プロセス: {(() => {
                      const m: any = (shareData as any)?.model
                      if (m === 'flux-kontext-pro' || m === 'flux-kontext-max') return 'Flux Kontext による自動最適化'
                      if (m === 'gpt4o-image') return 'GPT-4o Image による自動プロンプト最適化'
                      return 'GPT-4o / Flux Kontext による自動最適化'
                    })()}
                  </li>
                </ul>
              </div>
            )}
              {renderSeoTags()}
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <button onClick={handleDownload} className="w-full sm:w-auto btn-primary text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 min-w-[140px]">📥 ダウンロード</button>
                <button onClick={handleTryNow} className="w-full sm:w-auto btn-primary text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 min-w-[140px]">✨ 自分も試してみる</button>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={navToHome} className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🏠 ホームへ</button>
                <button onClick={navToGallery} className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🖼️ ギャラリーへ</button>
                <button onClick={navToWorkspace} className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">✨ ワークスペースへ</button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  // 画廊模式渲染（详情页已迁移到 /share/[id]）
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
        <main className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text font-cute">
            AI画像ギャラリー（GPT‑4o / Flux Kontext 対応）
          </h1>
          <p className="text-gray-700 mt-2 text-sm">
            AI プロンプトで作られた最新のチャットGPT 画像生成作例を毎日更新。AI画像生成 サイト 無料・登録不要、数秒で完成。
          </p>
        </div>
        <ShareGallery />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-text-muted">読み込み中...</p>
        </div>
      </div>
    }>
      <SharePageContent />
    </Suspense>
  )
}