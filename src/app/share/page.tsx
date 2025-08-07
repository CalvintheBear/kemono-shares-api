'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
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

  // 获取分享ID的备用方案
  useEffect(() => {
    // 首先尝试从useSearchParams获取
    const paramsId = searchParams?.get('id')
    if (paramsId) {
      setShareId(paramsId)
      return
    }

    // 如果useSearchParams失败，从URL中解析
    const urlParams = new URLSearchParams(window.location.search)
    const urlId = urlParams.get('id')
    if (urlId) {
      setShareId(urlId)
      return
    }

    // 如果都没有，尝试从路径中解析
    const pathParts = window.location.pathname.split('/')
    const lastPart = pathParts[pathParts.length - 1]
    if (lastPart && lastPart !== 'share' && lastPart !== '') {
      setShareId(lastPart)
      return
    }

    // 如果都失败了，显示错误
    setError('シェアIDが見つかりません')
    setLoading(false)
  }, [searchParams])

  // 辅助函数：判断是否为有效的图生图（有原图）
  const isValidImageToImage = (originalUrl: string | null): boolean => {
    return !!(originalUrl && 
      typeof originalUrl === 'string' && 
      originalUrl.trim() !== '' &&
      !originalUrl.startsWith('data:image/') &&
      !originalUrl.includes('placeholder.com') &&
      !originalUrl.includes('Text+to+Image') &&
      !originalUrl.includes('base64') && // 排除所有base64数据
      originalUrl.length <= 1000) // 排除很长的base64数据
  }

  useEffect(() => {
    const fetchShareData = async () => {
      if (!shareId) {
        return // 等待shareId设置
      }

      try {
        // 在静态导出模式下，使用完整的API URL
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? `https://2kawaii.com/api/share?id=${shareId}`
          : `/api/share?id=${shareId}`
        
        console.log('正在获取分享数据:', apiUrl)
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('分享数据响应:', data)

        if (data.success && data.data) {
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SparklesIcon className="w-6 h-6" />
              <h1 className="text-3xl font-bold">
                AI画像変換結果・プロンプト生成
              </h1>
              <SparklesIcon className="w-6 h-6" />
            </div>
            <p className="text-lg opacity-90">
              {shareData.style}スタイルでAI変換完了！
            </p>
            <p className="text-sm opacity-75 mt-2">
              シェアID: {shareData.id}
            </p>
          </div>

          {/* Image Display - 隐私保护：所有模式只显示生成图，不显示原图 */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {isValidImageToImage(shareData.originalUrl) ? 'AI画像変換結果' : 'AI画像生成結果'}
              </h2>
              <div className="flex justify-center">
                <Image
                  src={shareData.generatedUrl}
                  alt="AI生成画像"
                  width={600}
                  height={400}
                  unoptimized
                  className="rounded-2xl shadow-lg max-w-full h-auto"
                  onError={(e) => {
                    console.error('图片加载失败:', shareData.generatedUrl)
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Style Information */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              AI画像スタイル・プロンプト情報
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                {shareData.style}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                AI画像
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
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 min-w-[140px]"
              >
                <span>📥</span>
                <span>ダウンロード</span>
              </button>
              <button
                onClick={handleTryNow}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 min-w-[140px]"
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
            <p className="text-gray-600 text-sm">ジブリ風、VTuber、ウマ娘など豊富なスタイルから選択</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">高速処理</h3>
            <p className="text-gray-600 text-sm">GPT-4o Image技術で1-3分で完成</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">完全無料</h3>
            <p className="text-gray-600 text-sm">登録不要、商用利用可能</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">あなたもAI画像変換を体験しませんか？</h2>
          <p className="text-lg opacity-90 mb-6">最新のAI技術で、あなたの写真を美しいアニメ風に変換します</p>
          <button
            onClick={handleTryNow}
            className="bg-white text-amber-600 py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
          >
            <HeartIcon className="w-5 h-5" />
            <span>今すぐ始める</span>
          </button>
        </div>
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