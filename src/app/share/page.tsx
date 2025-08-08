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

  // 解析是否为详情模式
  useEffect(() => {
    const paramsId = searchParams?.get('id')
    if (paramsId) {
      setShareId(paramsId)
      return
    }
    // 路由兜底：从路径解析 /share/:id
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/')
      const lastPart = pathParts[pathParts.length - 1]
      if (lastPart && lastPart !== 'share') {
        setShareId(lastPart)
      } else {
        setShareId(null)
      }
    }
  }, [searchParams])

  const isDetailMode = useMemo(() => !!shareId, [shareId])

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

  const handleDownload = () => {
    if (shareData) {
      const link = document.createElement('a')
      link.href = shareData.generatedUrl
      link.download = `2kawaii-${shareData.style}-${Date.now()}.png`
      link.click()
    }
  }

  // 详情模式渲染
  if (isDetailMode) {
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
                <button
                  onClick={handleTryNow}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
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
    return (
      <div className="min-h-screen bg-[#fff7ea]">
        <Header />
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
                  width={600}
                  height={400}
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
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">{shareData.style}</span>
                <span className="text-gray-500 text-sm">{new Date(shareData.timestamp).toLocaleDateString('ja-JP')}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{shareData.prompt}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <button onClick={handleDownload} className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 min-w-[140px]">📥 ダウンロード</button>
                <button onClick={handleTryNow} className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 min-w-[140px]">✨ 自分も試してみる</button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  // 画廊模式渲染
  return (
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">AI画像生成 ギャラリー</h1>
          <p className="text-gray-600 mt-2">最新の共有作品を表示します</p>
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
      <div className="min-h-screen bg-[#fff7ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-amber-700">読み込み中...</p>
        </div>
      </div>
    }>
      <SharePageContent />
    </Suspense>
  )
}