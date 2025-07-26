'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import { ArrowLeftIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Head from 'next/head'

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
  const [hasShareData, setHasShareData] = useState(false)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const decodedData = atob(dataParam)
        const parsedData = JSON.parse(decodedData) as ShareData
        setShareData(parsedData)
        setHasShareData(true)
      } catch (err) {
        console.error('分享数据解析失败:', err)
        setHasShareData(false)
      }
    } else {
      setHasShareData(false)
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

  // 如果没有分享数据，显示展示页面
  if (!hasShareData) {
    return (
      <>
        <Head>
          <title>AI画像変換 | 無料アニメ風変換 | kemono-mimi - 写真を可愛いキャラクターに</title>
          <meta name="description" content="AIで写真をアニメ風に無料変換！ジブリ風、VTuber、ウマ娘など20+スタイル。商用利用可、登録不要、1-3分で完成。kemono-mimiで今すぐ体験！" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="AI画像変換 | 無料アニメ風変換 | kemono-mimi" />
          <meta property="og:description" content="AIで写真をアニメ風に無料変換！ジブリ風、VTuber、ウマ娘など20+スタイル。商用利用可、登録不要、1-3分で完成。kemono-mimiで今すぐ体験！" />
          <meta property="og:image" content="/logo.png" />
          <meta property="og:url" content="https://kemono-mimi.com/share" />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://kemono-mimi.com/share" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 pt-24">
            {/* Hero Section */}
            <section className="w-full max-w-4xl mx-auto text-center py-20 mb-16">
              <h1 className="text-5xl md:text-6xl font-extrabold text-amber-700 mb-8 tracking-tight drop-shadow">
                AI画像変換の世界へようこそ
              </h1>
              <p className="text-2xl md:text-3xl text-amber-800 mb-10 leading-relaxed font-semibold">
                最新AI技術で、あなたの写真を美しいアニメ風に無料変換！<br />
                <span className="text-orange-500">20+スタイル・商用利用可・登録不要</span>
              </p>
              <button
                onClick={handleTryNow}
                className="bg-gradient-to-r from-orange-400 to-amber-500 text-white py-5 px-16 rounded-full font-bold text-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                今すぐ体験する
              </button>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl mb-20">
              <div className="bg-white/95 rounded-3xl shadow-lg p-8 text-center border border-amber-200 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold text-amber-700 mb-4">20+ スタイル</h2>
                <p className="text-gray-600 leading-relaxed">ジブリ風、VTuber、ウマ娘など豊富なスタイルから選択</p>
              </div>
              <div className="bg-white/95 rounded-3xl shadow-lg p-8 text-center border border-amber-200 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="text-2xl font-bold text-amber-700 mb-4">高速処理</h2>
                <p className="text-gray-600 leading-relaxed">GPT-4o Image技術で1-3分で完成</p>
              </div>
              <div className="bg-white/95 rounded-3xl shadow-lg p-8 text-center border border-amber-200 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">💝</div>
                <h2 className="text-2xl font-bold text-amber-700 mb-4">完全無料</h2>
                <p className="text-gray-600 leading-relaxed">登録不要、商用利用可能</p>
              </div>
            </section>

            {/* How it works Section */}
            <section className="w-full max-w-4xl bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl shadow-lg p-12 mb-16">
              <h2 className="text-3xl font-bold text-amber-700 mb-10 text-center">使い方はとても簡単！</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">📸</div>
                  <h3 className="text-xl font-bold text-amber-700 mb-3">1. 写真をアップロード</h3>
                  <p className="text-gray-600 leading-relaxed">あなたの写真をアップロードしてください</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-amber-700 mb-3">2. スタイルを選択</h3>
                  <p className="text-gray-600 leading-relaxed">お好みのアニメスタイルを選択してください</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-amber-700 mb-3">3. AI変換完了</h3>
                  <p className="text-gray-600 leading-relaxed">数分で美しいアニメ風画像が完成します</p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="w-full max-w-3xl bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl shadow-xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6">あなたもAI画像変換を体験しませんか？</h2>
              <p className="text-xl opacity-95 mb-8 leading-relaxed">
                最新のAI技術で、あなたの写真を美しいアニメ風に変換します
              </p>
              <button
                onClick={handleTryNow}
                className="bg-white text-orange-500 py-4 px-12 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                今すぐ始める
              </button>
            </section>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  // 如果有分享数据，显示分享内容
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
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
              {shareData?.style}スタイルで変身完了！
            </p>
          </div>

          {/* Image Comparison */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                変身前後の比較
              </h2>
              {shareData && (
                <BeforeAfterSlider
                  beforeImage={shareData.original}
                  afterImage={shareData.generated}
                  beforeAlt="変身前"
                  afterAlt="変身后"
                />
              )}
            </div>

            {/* Style Information */}
            {shareData && (
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
            )}

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