'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import { ArrowLeftIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface ShareData {
  generated: string
  original: string
  prompt: string
  style: string
  timestamp: number
}

export default function SharePage() {
  const searchParams = useSearchParams()
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const decodedData = atob(dataParam)
        const parsedData = JSON.parse(decodedData) as ShareData
        setShareData(parsedData)
      } catch (err) {
        console.error('分享数据解析失败:', err)
        setError('シェアデータの解析に失敗しました')
      }
    } else {
      setError('シェアデータが見つかりません')
    }
    setLoading(false)
  }, [searchParams])

  const handleTryNow = () => {
    window.location.href = 'https://kemono-mimi.com'
  }

  const handleDownload = () => {
    if (shareData) {
      const link = document.createElement('a')
      link.href = shareData.generated
      link.download = `kemono-mimi-${shareData.style}-${Date.now()}.png`
      link.click()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-purple-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>戻る</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">kemono-mimi</h1>
              <p className="text-sm text-gray-600">AI画像変換サービス</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          </div>

          {/* Image Comparison */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                変身前後の比較
              </h2>
              <BeforeAfterSlider
                beforeImage={shareData.original}
                afterImage={shareData.generated}
                beforeAlt="変身前"
                afterAlt="変身后"
              />
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-bold mb-2">kemono-mimi</p>
          <p className="text-gray-400 text-sm">
            AI画像変換サービス - あなたの写真を美しいアニメ風に変換
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="https://kemono-mimi.com" className="text-gray-400 hover:text-white transition-colors">
              ホーム
            </a>
            <a href="https://kemono-mimi.com/privacy" className="text-gray-400 hover:text-white transition-colors">
              プライバシー
            </a>
            <a href="https://kemono-mimi.com/terms" className="text-gray-400 hover:text-white transition-colors">
              利用規約
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
} 