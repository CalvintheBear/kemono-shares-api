'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Head from 'next/head'
import LazyImage from '@/components/LazyImage'
import { generateImageSizes, ImageSizes, preloadImage } from '@/lib/image-utils'

interface ShareData {
  generated: string
  original: string
  prompt: string
  style: string
  timestamp: number
}

interface ShareItem {
  id: string
  title: string
  style: string
  timestamp: string
  generatedUrl: string
  originalUrl: string
  imageSizes: ImageSizes
}

interface ApiShareItem {
  id: string
  style: string
  timestamp: string
  generatedUrl: string
  originalUrl: string
}

export default function SharePage() {
  const searchParams = useSearchParams()
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasShareData, setHasShareData] = useState(false)
  const [shareLinks, setShareLinks] = useState<ShareItem[]>([])
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [_totalCount, setTotalCount] = useState(0)
  
  // 响应式图片加载策略
  const [imageQuality, setImageQuality] = useState<'thumbnail' | 'small' | 'medium' | 'large'>('medium')
  
  // 无限滚动相关
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const ITEMS_PER_PAGE = 20 // 每页加载20张图片

  // 根据屏幕尺寸和设备像素比选择合适的图片质量
  useEffect(() => {
    const updateImageQuality = () => {
      const width = window.innerWidth
      const pixelRatio = window.devicePixelRatio || 1
      const effectiveWidth = width * pixelRatio
      
      if (effectiveWidth <= 400) {
        setImageQuality('small')
      } else if (effectiveWidth <= 800) {
        setImageQuality('medium')
      } else if (effectiveWidth <= 1200) {
        setImageQuality('large')
      } else {
        setImageQuality('large')
      }
    }
    
    updateImageQuality()
    window.addEventListener('resize', updateImageQuality)
    
    return () => window.removeEventListener('resize', updateImageQuality)
  }, [])

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

  // 获取分享链接的函数
  const fetchShareLinks = useCallback(async (offset: number = 0, append: boolean = false) => {
    try {
      const response = await fetch(`/api/share/list?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.items) {
          const links = result.data.items.map((item: ApiShareItem) => {
            // 生成多级图片尺寸
            const imageSizes = generateImageSizes(item.generatedUrl)
            
            return {
              id: item.id,
              title: `${item.style}変換`,
              style: item.style,
              timestamp: item.timestamp,
              generatedUrl: item.generatedUrl,
              originalUrl: item.originalUrl,
              imageSizes // 添加多级图片尺寸
            }
          })
          
          if (append) {
            setShareLinks(prev => [...prev, ...links])
          } else {
            setShareLinks(links)
          }
          
          setTotalCount(result.data.total)
          setHasMore(result.data.hasMore)
          setCurrentOffset(offset + ITEMS_PER_PAGE)
          
          // 添加调试信息
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 获取分享链接 - offset: ${offset}, append: ${append}`)
            console.log(`📊 API返回: ${result.data.items.length} 个项目，总数: ${result.data.total}`)
            console.log(`📊 当前状态: hasMore=${result.data.hasMore}, offset=${offset}`)
            console.log(`📊 实际设置: shareLinks.length=${append ? 'prev.length + ' + links.length : links.length}`)
            
            // 检查前几个项目的图片URL
            result.data.items.slice(0, 3).forEach((item: ApiShareItem, index: number) => {
              console.log(`📊 项目 ${index + 1}: ID=${item.id}, Style=${item.style}, GeneratedUrl=${item.generatedUrl}`)
            })
          }
          
          // 智能预加载：根据是否是首次加载和当前图片数量决定预加载数量
          if (!append && links.length > 0) {
            const preloadCount = Math.min(links.length, 12) // 增加到12张
            const preloadPromises = links.slice(0, preloadCount).map((link: ShareItem) => {
              if (link.generatedUrl) {
                // 根据当前图片质量预加载
                const preloadUrls = [
                  link.imageSizes.thumbnail, // 总是预加载缩略图
                  link.imageSizes[imageQuality] // 预加载当前质量的图片
                ]
                
                // 如果当前质量不是最高，也预加载下一级质量
                if (imageQuality === 'small' && link.imageSizes.medium) {
                  preloadUrls.push(link.imageSizes.medium)
                } else if (imageQuality === 'medium' && link.imageSizes.large) {
                  preloadUrls.push(link.imageSizes.large)
                }
                
                return Promise.all(
                  preloadUrls.map(url => preloadImage(url))
                ).catch(() => {
                  // 预加载失败不影响主流程
                })
              }
              return Promise.resolve()
            })
            
            // 并行预加载，但不阻塞UI
            Promise.all(preloadPromises).catch(() => {
              // 预加载失败不影响主流程
            })
          }
        }
      } else {
        console.error('API 请求失败:', response.status)
        if (!append) {
          setShareLinks([])
        }
      }
    } catch (error) {
      console.error('获取分享链接失败:', error)
      if (!append) {
        setShareLinks([])
      }
    } finally {
      setLoadingLinks(false)
      setLoadingMore(false)
    }
  }, [ITEMS_PER_PAGE, imageQuality])

  // 初始加载
  useEffect(() => {
    if (!hasShareData) {
      fetchShareLinks(0, false)
    }
  }, [hasShareData, fetchShareLinks])

  // 无限滚动观察器
  useEffect(() => {
    if (hasShareData) return

    // 清理之前的observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingMore) {
          // 清除之前的超时
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current)
          }
          
          // 添加防抖延迟，避免快速滚动时的重复请求
          loadingTimeoutRef.current = setTimeout(() => {
            setLoadingMore(true)
            fetchShareLinks(currentOffset, true)
          }, 300) // 300ms防抖延迟
        }
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }, [hasMore, loadingMore, currentOffset, fetchShareLinks, hasShareData])

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
          <link rel="preload" href="/api/share/list?limit=20" as="fetch" crossOrigin="anonymous" />
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
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 pt-24">
            {/* Hero Section */}
            <section className="w-full max-w-5xl mx-auto text-center py-8 mb-8">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-700 mb-4 tracking-tight">
                  AI画像変換ギャラリー
                </h1>
              </div>
            </section>

            {/* Gallery Section - Pinterest Style with Infinite Scroll */}
            <section className="w-full px-4 sm:px-6 lg:px-8 mb-8">
              {loadingLinks && shareLinks.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">ギャラリーを読み込み中...</p>
                  </div>
                </div>
              ) : shareLinks.length > 0 ? (
                <>
                  <div className="pinterest-gallery">
                    {shareLinks.map((link, _index) => (
                      <div
                        key={link.id}
                        className="pinterest-item group cursor-pointer"
                        onClick={() => window.location.href = `/share/${link.id}`}
                      >
                        <div className="image-container">
                          {/* 图片容器 - 自适应高度 */}
                          <div className="relative overflow-hidden">
                            {link.generatedUrl ? (
                              <LazyImage
                                src={link.imageSizes[imageQuality]} // 使用中等质量的图片
                                alt={`${link.style}変換結果 - ${link.title}`}
                                className="adaptive-image transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                                placeholder={link.imageSizes.thumbnail} // 使用缩略图作为占位
                                fallback={
                                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center" style={{ minHeight: '200px' }}>
                                    <div className="text-6xl text-amber-400">🎨</div>
                                  </div>
                                }
                              />
                            ) : (
                              <div className="bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center" style={{ minHeight: '200px' }}>
                                <div className="text-6xl text-amber-400">🎨</div>
                              </div>
                            )}
                            
                            {/* 悬停覆盖层 - Pinterest风格 */}
                            <div className="hover-overlay">
                              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm mb-1 truncate">{link.title}</h3>
                                    <p className="text-xs opacity-90 truncate">{link.style}</p>
                                  </div>
                                  <div className="text-right ml-2 flex-shrink-0">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                                      詳細
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* 原图对比提示 - 优化位置 */}
                            {link.originalUrl && (
                              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="flex items-center">
                                  <span className="mr-1">🔄</span>
                                  原图
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* 底部信息 - 紧凑设计 */}
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                                  {link.title}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">{link.style}</p>
                              </div>
                              <div className="text-right ml-2 flex-shrink-0">
                                <p className="text-xs text-gray-400">{link.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 无限滚动加载指示器 */}
                  {hasMore && (
                    <div 
                      ref={loadingRef}
                      className="flex justify-center items-center py-8 mt-8"
                    >
                      {loadingMore ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">さらに読み込み中...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-gray-500">スクロールしてさらに読み込む</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
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