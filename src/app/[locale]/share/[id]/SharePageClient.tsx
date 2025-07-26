'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface ShareData {
  id: string
  generatedUrl: string
  originalUrl: string
  prompt: string
  style: string
  timestamp: number
  createdAt: string
}

interface SharePageClientProps {
  shareId: string
}

export default function SharePageClient({ shareId }: SharePageClientProps) {
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShareData = async () => {
      if (!shareId) {
        setError('シェアIDが見つかりません')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/share?id=${shareId}`)
        const data = await response.json()

        if (data.success) {
          setShareData(data.data)
        } else {
          setError(data.error || 'シェアデータの取得に失敗しました')
        }
      } catch (err) {
        console.error('分享数据获取失败:', err)
        setError('シェアデータの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchShareData()
  }, [shareId])

  const handleTryNow = () => {
    window.location.href = 'https://kemono-mimi.com'
  }

  const handleDownload = () => {
    if (shareData) {
      const link = document.createElement('a')
      link.href = shareData.generatedUrl
      link.download = `kemono-mimi-${shareData.style}-${Date.now()}.png`
      link.click()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-amber-700">読み込み中...</p>
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
              <p className="text-gray-600 mb-6">{error || 'シェアデータが見つかりません'}</p>
              <button
                onClick={handleTryNow}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
              >
                kemono-mimiを試す
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SparklesIcon className="w-6 h-6" />
              <h1 className="text-3xl font-bold">AI画像変換結果</h1>
              <SparklesIcon className="w-6 h-6" />
            </div>
            <p className="text-lg opacity-90">
              {shareData.style}スタイルで変身完了！
            </p>
            <p className="text-sm opacity-75 mt-2">
              シェアID: {shareData.id}
            </p>
          </div>

          {/* Image Display */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                変身後の画像
              </h2>
              <div className="flex justify-center">
                <img
                  src={shareData.generatedUrl}
                  alt="変身後のAI画像"
                  className="rounded-2xl shadow-lg max-w-full h-auto"
                  style={{ maxHeight: 400 }}
                />
              </div>
            </div>

            {/* Style Information */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">変換スタイル</h3>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                  {shareData.style}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(shareData.timestamp).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {shareData.prompt}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>📥</span>
                <span>ダウンロード</span>
              </button>
              
              <button
                onClick={handleTryNow}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>✨</span>
                <span>自分も試してみる</span>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">20+ スタイル</h3>
            <p className="text-gray-600 text-sm">
              ジブリ風、VTuber、ウマ娘など豊富なスタイルから選択
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">高速処理</h3>
            <p className="text-gray-600 text-sm">
              GPT-4o Image技術で1-3分で完成
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">完全無料</h3>
            <p className="text-gray-600 text-sm">
              登録不要、商用利用可能
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">あなたもAI画像変換を体験しませんか？</h2>
          <p className="text-lg opacity-90 mb-6">
            最新のAI技術で、あなたの写真を美しいアニメ風に変換します
          </p>
          <button
            onClick={handleTryNow}
            className="bg-white text-pink-600 py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
          >
            <HeartIcon className="w-5 h-5" />
            <span>今すぐ始める</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
} 