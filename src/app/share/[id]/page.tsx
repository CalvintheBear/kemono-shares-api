'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
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
    return `${shareData.style} | チャットGPT 画像生成 プロンプト | ${shortPrompt}`
  }, [shareData])
  const seoDesc = useMemo(() => {
    if (!shareData) return 'AI画像生成 ギャラリー | GPT-4oで写真をアニメ風に変換。プロンプト付き。'
    return `チャットGPT 画像生成 プロンプト: ${shareData.prompt?.slice(0, 120) || ''}`
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
      <div className="min-h-screen bg-[#fff7ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-amber-700">読み込み中...</p>
          <p className="mt-2 text-sm text-amber-600">シェアID: {shareId}</p>
        </div>
      </div>
    )
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-[#fff7ea]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h1>
              <p className="text-gray-600 mb-2">{error || 'シェアデータが見つかりません'}</p>
              <p className="text-sm text-gray-500 mb-6">シェアID: {shareId}</p>
              <button onClick={handleTryNow} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105">2kawaiiを試す</button>
            </div>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />
      {/* 动态SEO（客户端补充）：仅为兼容静态导出；SSR metadata 在 generateMetadata 实现 */}
      <head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {shareData.generatedUrl && <meta property="og:image" content={shareData.generatedUrl} />}
      </head>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 text-center">
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
                alt="AI生成画像"
                width={1200}
                height={800}
                unoptimized
                className="rounded-2xl shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">{shareData.style}</span>
              <span className="text-gray-500 text-sm">{new Date(shareData.timestamp).toLocaleDateString('ja-JP')}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{shareData.prompt}</p>
            {Array.isArray(shareData.seoTags) && shareData.seoTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {shareData.seoTags.slice(0, 10).map((t, i) => (
                  <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">#{t}</span>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button onClick={handleDownload} className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 min-w-[140px]">📥 ダウンロード</button>
              <button onClick={handleTryNow} className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 min-w-[140px]">✨ 自分も試してみる</button>
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

// 为静态导出提供空参数，避免 next export 报错（Cloudflare Pages 使用 _redirects 处理该路由）
// 移除 generateStaticParams，转移到独立文件，避免与 'use client' 冲突


