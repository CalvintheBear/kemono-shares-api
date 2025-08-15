'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
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

export default function ShareDetailPage() {
  const params = useParams()
  const shareId = params?.id as string
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShareData = async () => {
      if (!shareId) return
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
  }, [shareId])

  const seoTitle = useMemo(() => {
    if (!shareData) return 'AI画像生成 無料 | GPT-4o 画像変換 - 2kawaii'
    const shortPrompt = shareData.prompt?.slice(0, 32) || ''
    const seoTitleFromData = (shareData as any)?.seo?.titleJa
    if (seoTitleFromData) return seoTitleFromData
    const modelLabel = (shareData as any)?.seo?.modelLabel || (shareData?.model === 'gpt4o-image' ? 'GPT-4o Image' : shareData?.model === 'flux-kontext-pro' ? 'Flux Kontext Pro' : shareData?.model === 'flux-kontext-max' ? 'Flux Kontext Max' : 'GPT-4o / Flux Kontext')
    return `${shareData.style} | ${modelLabel} | AI プロンプト | ${shortPrompt}`
  }, [shareData])
  const seoDesc = useMemo(() => {
    if (!shareData) return 'AI画像生成 ギャラリー | GPT-4oで写真をアニメ风に変換。プロンプト付き。'
    const seoDescFromData = (shareData as any)?.seo?.descJa
    if (seoDescFromData) return seoDescFromData
    const modelLabel = (shareData as any)?.seo?.modelLabel || (shareData?.model === 'gpt4o-image' ? 'GPT-4o Image' : shareData?.model === 'flux-kontext-pro' ? 'Flux Kontext Pro' : shareData?.model === 'flux-kontext-max' ? 'Flux Kontext Max' : 'GPT-4o / Flux Kontext')
    return `${modelLabel} — AI プロンプト: ${shareData.prompt?.slice(0, 120) || ''}`
  }, [shareData])

  const handleTryNow = () => (window.location.href = '/')
  const navToHome = () => (window.location.href = '/')
  const navToGallery = () => (window.location.href = '/share')
  const navToWorkspace = () => (window.location.href = '/workspace')
  const handleDownload = () => {
    if (!shareData) return
    const a = document.createElement('a')
    a.href = shareData.generatedUrl
    a.download = `2kawaii-${shareData.style}-${Date.now()}.png`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-text-muted">読み込み中...</p>
          <p className="mt-2 text-sm text-gray-500">シェアID: {shareId}</p>
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
              <button onClick={handleTryNow} className="btn-primary text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105">2kawaiiを試す</button>
            </div>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  // UI 复刻英文版风格（两栏、完整信息区块 + 原图展示）
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <Header />
      <head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {((shareData as any)?.isPublished === false) && (
          <meta name="robots" content="noindex, nofollow" />
        )}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {(shareData as any)?.isPublished !== false && shareData.generatedUrl && <meta property="og:image" content={shareData.generatedUrl} />}
        <link rel="alternate" hrefLang="ja" href={`https://2kawaii.com/share/${shareId}`} />
        <link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${shareId}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${shareId}`} />
      </head>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 lg:p-8 text-center">
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
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl overflow-hidden">
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
                <p className="text-text-muted font-cute">作成日 {new Date(shareData.createdAt).toLocaleDateString('ja-JP')}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white/70 text-text px-3 py-1 rounded-full text-sm font-cute border border-white/60">{shareData.style}</span>
                <span className="text-text-muted text-sm font-cute">{new Date(shareData.createdAt).toLocaleDateString('ja-JP')}</span>
                <span className="bg-white/70 text-text px-3 py-1 rounded-full text-sm font-cute border border-white/60">{(() => {
                  const m: any = (shareData as any).model
                  if (m === 'flux-kontext-pro') return 'Flux Kontext Pro'
                  if (m === 'flux-kontext-max') return 'Flux Kontext Max'
                  if (m === 'gpt4o-image') return 'GPT-4o Image'
                  return 'GPT-4o / Flux Kontext'
                })()}</span>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-text mb-3 font-cute">🤖 プロンプト</h2>
                <div className="bg-white/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-text mb-1 font-cute">Prompt：</h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-cute whitespace-pre-wrap">{shareData.prompt}</p>
                </div>
              </div>
              <div className="bg-white/60 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-text mb-3 font-cute">作品のポイント</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted font-cute">
                  <li>スタイル: {shareData.style || 'Custom'}</li>
                  <li>テーマ: {(shareData.prompt || 'N/A').slice(0, 60)}{(shareData.prompt || '').length > 60 ? '...' : ''}</li>
                  <li>生成プロセス: {(() => {
                    const m: any = (shareData as any).model
                    if (m === 'flux-kontext-pro' || m === 'flux-kontext-max') return 'Flux Kontext による自動最適化'
                    if (m === 'gpt4o-image') return 'GPT-4o Image による自動プロンプト最適化'
                    return 'GPT-4o / Flux Kontext による自動最適化'
                  })()}</li>
                </ul>
              </div>
              {/* タグ：日文优先，其次英/旧字段 */}
              {(() => {
                const seo: any = (shareData as any).seo || {}
                const tags: string[] = (seo.keywordsJa && seo.keywordsJa.length > 0)
                  ? seo.keywordsJa
                  : (seo.keywordsEn && seo.keywordsEn.length > 0)
                    ? seo.keywordsEn
                    : (shareData.seoTags || [])
                return tags && tags.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-text mb-2 font-cute">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-800 px-3 py-1 rounded-full text-xs font-cute">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              })()}
              {/* アクション */}
              <div className="space-y-3">
                <a href={shareData.generatedUrl} download className="block w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105">📥 ダウンロード</a>
                <Link href="/workspace" className="block w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105">自分も試してみる</Link>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={navToHome} className="bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🏠 ホームへ</button>
                  <button onClick={navToGallery} className="bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">🖼️ ギャラリーへ</button>
                  <button onClick={navToWorkspace} className="bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:shadow transition">✨ ワークスペースへ</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Related CTA */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-6 text-center font-cute">他のAI作品を見る</h2>
          <div className="text-center">
            <Link href="/share" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 font-semibold text-text hover:bg-white/90 transition-all">
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

// 为静态导出提供空参数，避免 next export 报错（Cloudflare Pages 使用 _redirects 处理该路由）
// 移除 generateStaticParams，转移到独立文件，避免与 'use client' 冲突


