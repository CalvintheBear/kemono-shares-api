"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
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

  // tags 在详情模式内按 JA -> EN -> 旧字段 回退

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

    // 展示文案、标签与模型等
    const formattedDate = new Date(shareData.createdAt).toLocaleDateString('ja-JP')
    const generationProcess = (() => {
      const m: any = (shareData as any)?.model
      if (m === 'flux-kontext-pro' || m === 'flux-kontext-max') return 'Flux Kontext による自動最適化'
      if (m === 'gpt4o-image') return 'GPT-4o Image による自動プロンプト最適化'
      return 'GPT-4o / Flux Kontext による自動最適化'
    })()
    const modelLabel = (() => {
      const m: any = (shareData as any)?.model
      if (m === 'flux-kontext-pro') return 'Flux Kontext Pro'
      if (m === 'flux-kontext-max') return 'Flux Kontext Max'
      if (m === 'gpt4o-image') return 'GPT-4o Image'
      return 'GPT-4o / Flux Kontext'
    })()
    const tags: string[] = (() => {
      const seo: any = (shareData as any)?.seo || {}
      if (seo.keywordsJa && seo.keywordsJa.length > 0) return seo.keywordsJa
      if (seo.keywordsEn && seo.keywordsEn.length > 0) return seo.keywordsEn
      return (shareData as any)?.seoTags || []
    })()

    return (
      <div className="min-h-screen bg-white">
        <Header />
        <head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDesc} />
          {shareId && (
            <>
              <link rel="canonical" href={`https://2kawaii.com/share/${shareId}`} />
              <link rel="alternate" hrefLang="ja" href={`https://2kawaii.com/share/${shareId}`} />
              <link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${shareId}`} />
              <link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${shareId}`} />
            </>
          )}
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDesc} />
          {shareData?.generatedUrl && <meta property="og:image" content={shareData.generatedUrl} />}
        </head>
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-brand bg-[#0096fa] text-white p-6 lg:p-8 text-center">
              <h1 className="text-2xl lg:text-3xl font-bold font-cute">AI画像変換結果・プロンプト</h1>
              <p className="opacity-90 mt-2 font-cute">{shareData.style} スタイルで完成！</p>
              <p className="opacity-75 mt-1 text-sm font-cute">シェアID: {shareData.id}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* 画像列 */}
              <div className="space-y-6">
                {((shareData as any)?.isPublished === false) ? (
                  <div className="text-center text-text-muted py-6">この作品はまだ作者が公開していません。</div>
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

              {/* 詳細列 */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-text mb-2 font-cute">{shareData.style} スタイル AI 生成</h1>
                  <p className="text-text-muted font-cute">作成日 {formattedDate}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-white text-text px-3 py-1 rounded-full text-sm font-cute border border-gray-200">{shareData.style}</span>
                  <span className="text-text-muted text-sm font-cute">{formattedDate}</span>
                  <span className="bg-white text-text px-3 py-1 rounded-full text-sm font-cute border border-gray-200">{modelLabel}</span>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-text mb-3 font-cute">🤖 プロンプト</h2>
                  <div className="bg-white/50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-text mb-1 font-cute">Prompt：</h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-cute whitespace-pre-wrap">{shareData.prompt}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-text mb-3 font-cute">作品のポイント</h2>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted font-cute">
                    <li>スタイル: {shareData.style || 'Custom'}</li>
                    <li>テーマ: {(shareData.prompt || 'N/A').slice(0, 60)}{(shareData.prompt || '').length > 60 ? '...' : ''}</li>
                    <li>生成プロセス: {generationProcess}</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-text mb-1 font-cute">スタイル</h3>
                    <p className="text-sm text-text-muted font-cute">{shareData.style}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-text mb-1 font-cute">作成日</h3>
                    <p className="text-sm text-text-muted font-cute">{formattedDate}</p>
                  </div>
                </div>

                {tags && tags.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-text mb-2 font-cute">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-surface text-text px-3 py-1 rounded-full text-xs font-cute border border-border">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <a href={shareData.generatedUrl} download className="inline-flex items-center justify-center w-full bg-[#0096fa] hover:bg-[#0085e0] text-white py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105">📥 ダウンロード</a>
                  <Link href="/workspace" className="inline-flex items-center justify-center w-full bg-[#0096fa] hover:bg-[#0085e0] text-white py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105">自分も試してみる</Link>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button onClick={navToHome} className="inline-flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🏠 ホームへ</button>
                    <button onClick={navToGallery} className="inline-flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🖼️ ギャラリーへ</button>
                    <button onClick={navToWorkspace} className="inline-flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">✨ ワークスペースへ</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Related CTA */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text mb-6 text-center font-cute">他のAI作品を見る</h2>
            <div className="text-center">
              <Link href="/share" className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 font-semibold text-text border border-gray-100 hover:shadow transition">
                <span>🎨</span>
                <span>ギャラリーを探索</span>
              </Link>
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