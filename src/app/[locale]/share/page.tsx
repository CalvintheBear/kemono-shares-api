'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Head from 'next/head'
import LazyImage from '@/components/LazyImage'

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
  const [shareLinks, setShareLinks] = useState<Array<{id: string, title: string, style: string, timestamp: string, generatedUrl: string, originalUrl: string}>>([])
  const [loadingLinks, setLoadingLinks] = useState(true)

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

  // 获取所有分享链接
  useEffect(() => {
    const fetchShareLinks = async () => {
      try {
        const response = await fetch('/api/share/list?limit=12')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data.items) {
            const links = result.data.items.map((item: {id: string, style: string, timestamp: string, generatedUrl: string, originalUrl: string}) => ({
              id: item.id,
              title: `${item.style}変換`,
              style: item.style,
              timestamp: item.timestamp,
              generatedUrl: item.generatedUrl,
              originalUrl: item.originalUrl
            }))
            setShareLinks(links)
            
            // 预加载前8张图片
            links.slice(0, 8).forEach((link: {generatedUrl: string}) => {
              if (link.generatedUrl) {
                const img = new Image()
                img.src = link.generatedUrl
              }
            })
          }
        } else {
          console.error('API 请求失败:', response.status)
          setShareLinks([])
        }
      } catch (error) {
        console.error('获取分享链接失败:', error)
        setShareLinks([])
      } finally {
        setLoadingLinks(false)
      }
    }

    fetchShareLinks()
  }, [])

  const handleTryNow = () => {
            window.location.href = 'https://2kawaii.com'
  }

  const handleDownload = () => {
    if (shareData) {
      const link = document.createElement('a')
      link.href = shareData.generated
              link.download = `2kawaii-${shareData.style}-${Date.now()}.png`
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
          <title>AI画像変換ギャラリー | プロンプト生成・美しいアニメ風変換作品集 | 2kawaii</title>
          <meta name="description" content="AI画像変換の美しい作品ギャラリー。プロンプト自動生成でジブリ風、VTuber、ウマ娘など20+スタイルの変換結果をご覧ください。無料で写真をアニメ風に変換できます。" />
          <meta name="keywords" content="AI画像変換,プロンプト生成,アニメ風変換,ジブリ風,VTuber,ウマ娘,写真変換,無料AI,画像ギャラリー,AIプロンプト" />
          <meta name="robots" content="index, follow, max-image-preview:large" />
                      <meta name="author" content="2kawaii" />
          
          {/* Open Graph */}
                      <meta property="og:title" content="AI画像変換ギャラリー | プロンプト生成・美しいアニメ風変換作品集 | 2kawaii" />
          <meta property="og:description" content="AI画像変換の美しい作品ギャラリー。プロンプト自動生成でジブリ風、VTuber、ウマ娘など20+スタイルの変換結果をご覧ください。" />
          <meta property="og:image" content="https://2kawaii.com/og-share-gallery.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="https://2kawaii.com/share" />
          <meta property="og:type" content="website" />
                      <meta property="og:site_name" content="2kawaii" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AI画像変換ギャラリー | プロンプト生成・美しいアニメ風変換作品集" />
          <meta name="twitter:description" content="AI画像変換の美しい作品ギャラリー。プロンプト自動生成でジブリ風、VTuber、ウマ娘など20+スタイルの変換結果をご覧ください。" />
          <meta name="twitter:image" content="https://2kawaii.com/og-share-gallery.jpg" />
          
          {/* Canonical */}
          <link rel="canonical" href="https://2kawaii.com/share" />
          
          {/* Preload critical resources */}
          <link rel="preload" href="/api/share/list?limit=12" as="fetch" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//tempfile.aiquickdraw.com" />
          <link rel="dns-prefetch" href="//pub-d00e7b41917848d1a8403c984cb62880.r2.dev" />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              "name": "AI画像変換ギャラリー",
              "description": "AI画像変換の美しい作品ギャラリー。プロンプト自動生成でジブリ風、VTuber、ウマ娘など20+スタイルの変換結果をご覧ください。",
                      "url": "https://2kawaii.com/share",
        "image": "https://2kawaii.com/og-share-gallery.jpg",
              "publisher": {
                "@type": "Organization",
                "name": "2kawaii",
                "url": "https://2kawaii.com"
              }
            })}
          </script>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 pt-24">
            {/* Hero Section */}
            <section className="w-full max-w-5xl mx-auto text-center py-16 mb-12">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-700 mb-6 tracking-tight">
                  AI画像変換
                  <span className="block text-3xl md:text-4xl lg:text-5xl text-orange-500 font-medium mt-2">
                    ギャラリー
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-amber-600 max-w-3xl mx-auto leading-relaxed">
                  プロンプト自動生成による美しいアニメ風変換作品のコレクション
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleTryNow}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center"
                >
                  <span className="mr-2">✨</span>
                  今すぐ体験する
                </button>
                <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
                  <span className="font-medium">20+スタイル</span> • <span className="font-medium">完全無料</span> • <span className="font-medium">商用利用可</span>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="w-full max-w-4xl mx-auto mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-100 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">20+ スタイル</h3>
                  <p className="text-sm text-gray-600">ジブリ風、VTuber、ウマ娘など</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-100 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">高速処理</h3>
                  <p className="text-sm text-gray-600">GPT-4o Image技術で1-3分</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-amber-100 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-3">💝</div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">完全無料</h3>
                  <p className="text-sm text-gray-600">登録不要、商用利用可能</p>
                </div>
              </div>
            </section>



            {/* Gallery Section - Pinterest Style */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-amber-700 mb-4">
                  AI画像変換ギャラリー
                </h2>
                <p className="text-xl text-amber-600 max-w-3xl mx-auto">
                  プロンプト技術で生成された美しいアニメ風変換作品をお楽しみください
                </p>
              </div>
              
              {loadingLinks ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">ギャラリーを読み込み中...</p>
                  </div>
                </div>
              ) : shareLinks.length > 0 ? (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                  {shareLinks.map((link, index) => (
                    <div
                      key={link.id}
                      className="break-inside-avoid group cursor-pointer"
                      onClick={() => window.location.href = `/share/${link.id}`}
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1">
                        {/* 图片容器 */}
                        <div className="relative overflow-hidden">
                          {link.generatedUrl ? (
                            <LazyImage
                              src={link.generatedUrl}
                              alt={`${link.style}変換結果 - ${link.title}`}
                              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                              loading={index < 8 ? "eager" : "lazy"}
                              fallback={
                                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                  <div className="text-6xl text-amber-400">🎨</div>
                                </div>
                              }
                            />
                          ) : (
                            <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                              <div className="text-6xl text-amber-400">🎨</div>
                            </div>
                          )}
                          
                          {/* 悬停覆盖层 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">{link.title}</h3>
                                  <p className="text-sm opacity-90">{link.style}</p>
                                </div>
                                <div className="text-right">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                                    詳細を見る
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 原图对比提示 */}
                          {link.originalUrl && (
                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="flex items-center">
                                <span className="mr-1">🔄</span>
                                原图あり
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* 底部信息 */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                                {link.title}
                              </h3>
                              <p className="text-xs text-gray-500">{link.style}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">{link.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-8xl mb-6">🎨</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">まだ変換結果がありません</h3>
                  <p className="text-gray-600 mb-8">最初のAI画像変換を体験してみませんか？</p>
                  <button
                    onClick={handleTryNow}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    今すぐ始める
                  </button>
                </div>
              )}
            </section>

            {/* CTA Section */}
            <section className="w-full max-w-4xl mx-auto text-center py-12">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">あなたもAI画像変換を体験しませんか？</h2>
                <p className="text-lg opacity-95 mb-6 max-w-2xl mx-auto">
                  最新のAI技術で、あなたの写真を美しいアニメ風に変換します
                </p>
                <button
                  onClick={handleTryNow}
                  className="bg-white text-amber-600 py-3 px-8 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  ✨ 今すぐ始める
                </button>
              </div>
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