"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
}

function SharePageContent() {
  const searchParams = useSearchParams()
  const [shareId, setShareId] = useState<string | null>(null)
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 支持通过 query 参数 id 渲染详情（用于静态导出回退 /share.html?id=...）
  // 修复: 从详情返回到 /share 时需要清空 shareId，否则会停留在详情页
  useEffect(() => {
    const id = searchParams?.get('id')
    if (id) {
      setShareId(id)
    } else {
      setShareId(null)
      setShareData(null)
      setError(null)
      setLoading(false)
    }
  }, [searchParams])

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
    const tags: string[] = (shareData as any)?.seoTags || []
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
      ? `${shareData.style} | チャットGPT 画像生成 プロンプト | ${(shareData.prompt || '').slice(0, 32)}`
      : 'AI画像生成 無料 | GPT-4o 画像変換 - 2kawaii'
    const seoDesc = shareData
      ? `チャットGPT 画像生成 プロンプト: ${(shareData.prompt || '').slice(0, 120)}`
      : 'AI画像生成 ギャラリー | GPT-4oで写真をアニメ風に変換。プロンプト付き。'

    return (
      <div className="min-h-screen">
        <Header />
        <head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDesc} />
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
              <link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${shareId}`} />
            </>
          )}
        </head>
        {/* 详情页动态SEO已迁移到 /share/[id]/generateMetadata */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-brand bg-[#0096fa] text-white p-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <h1 className="text-3xl font-bold">AI画像変換結果・プロンプト生成</h1>
              </div>
              <p className="text-lg opacity-90">{shareData.style}スタイルでAI変換完了！</p>
              <p className="text-sm opacity-75 mt-2">シェアID: {shareData.id}</p>
            </div>
            <div className="p-8">
          <div className="flex justify-center">
            <Image
              src={shareData.generatedUrl}
              alt={`${shareData.style} | ${(shareData.prompt || '').slice(0, 60)}`}
              width={1200}
              height={800}
              unoptimized
              className="rounded-2xl shadow-lg max-w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-surface text-text px-3 py-1 rounded-full text-sm font-medium border border-border">{shareData.style}</span>
                <span className="text-gray-500 text-sm">{new Date(shareData.timestamp).toLocaleDateString('ja-JP')}</span>
              </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{shareData.prompt}</p>
            {shareData.prompt && (
              <div className="mt-4 text-gray-700 text-sm leading-relaxed">
                <h2 className="text-base font-semibold mb-2">作品のポイント</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>スタイル: {shareData.style}</li>
                  <li>テーマ: {(shareData.prompt || '').slice(0, 40)}...</li>
                  <li>生成プロセス: GPT-4o Image による自動プロンプト最適化</li>
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
            AI画像生成 お題一覧 | チャットGPT・ai プロンプト ギャラリー
          </h1>
          <p className="text-gray-700 mt-2 text-sm">
            AI プロンプトで作られた最新のチャットGPT 画像生成作例を毎日更新。AI画像生成 サイト 無料・登録不要、2-5分で完成。
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