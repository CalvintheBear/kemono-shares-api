'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import PinterestWaterfall from '@/components/PinterestWaterfall'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'
import Image from 'next/image'

interface ShareData {
  generated: string
  original: string
  prompt: string
  style: string
  timestamp: number
}

interface PinterestItem {
  id: string
  title: string
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
  const [shareItems, setShareItems] = useState<PinterestItem[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentOffset, setCurrentOffset] = useState(0)

  const ITEMS_PER_PAGE = 12 // 移动端优化：减少首屏加载量
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 获取分享数据
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

  // 获取分享列表
  const fetchShareItems = useCallback(async (offset: number = 0, append: boolean = false) => {
    try {
      const response = await fetch(`/api/share/list?limit=${ITEMS_PER_PAGE}&offset=${offset}&sort=createdAt&order=desc`)
      if (response.ok) {
        const result = await response.json()
        console.log('API响应:', result)
        if (result.success && result.data.items) {
          console.log('获取到图片:', result.data.items.length, '个')
          const items = result.data.items.map((item: { id: string; style: string; timestamp: string; generatedUrl: string; originalUrl: string }) => {
            console.log('图片URL:', item.generatedUrl)
            return {
              id: item.id,
              title: `${item.style}変換`,
              style: item.style,
              timestamp: item.timestamp,
              generatedUrl: item.generatedUrl,
              originalUrl: item.originalUrl
            }
          })

          if (append) {
            setShareItems(prev => [...prev, ...items])
          } else {
            setShareItems(items)
          }

          setHasMore(result.data.hasMore)
          setCurrentOffset(offset + ITEMS_PER_PAGE)
        } else {
          console.log('没有获取到items:', result)
        }
      } else {
        console.error('API响应错误:', response.status)
      }
    } catch (error) {
      console.error('获取分享项目失败:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [ITEMS_PER_PAGE])

  // 初始加载
  useEffect(() => {
    if (!hasShareData) {
      fetchShareItems(0, false)
    }
  }, [hasShareData, fetchShareItems])

  // 加载更多
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return
    setLoadingMore(true)
    await fetchShareItems(currentOffset, true)
  }, [hasMore, loadingMore, currentOffset, fetchShareItems])

  // 移动端优化的Intersection Observer配置
  useEffect(() => {
    if (!hasShareData && hasMore && !loadingMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleLoadMore()
          }
        },
        {
          root: null,
          rootMargin: '200px', // 提前加载，减少等待时间
          threshold: 0.1
        }
      )

      const currentRef = loadMoreRef.current
      if (currentRef) {
        observer.observe(currentRef)
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }
  }, [hasShareData, hasMore, loadingMore, handleLoadMore])

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
      <div className="min-h-screen bg-[#fff7ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-amber-700">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 如果有分享数据，显示分享详情
  if (hasShareData) {
    return (
      <div className="min-h-screen bg-[#fff7ea]">
        <MobileBottomNav />
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 text-center">
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
                <div className="flex justify-center">
                  <Image
                    src={shareData?.generated || ''}
                    alt="変身結果"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-lg max-w-full h-auto"
                  />
                </div>
              </div>

              {/* Style Information */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-3">変換スタイル</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {shareData?.style}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {shareData ? new Date(shareData.timestamp).toLocaleDateString('ja-JP') : ''}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {shareData?.prompt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  📥 ダウンロード
                </button>
                <button
                  onClick={handleTryNow}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  ✨ 自分も試してみる
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 显示画廊页面
  return (
    <>
      <Head>
        <title>AI画像変換ギャラリー | プロンプト生成・美しいアニメ風変換作品集 | 2kawaii</title>
        <meta name="description" content="AI画像変換の美しい作品ギャラリー。プロンプト自動生成でジブリ風、VTuber、ウマ娘など20+スタイルの変換結果をご覧ください。無料で写真をアニメ風に変換できます。" />
        <meta name="keywords" content="AI画像変換,プロンプト生成,アニメ風変換,ジブリ風,VTuber,ウマ娘,写真変換,無料AI,画像ギャラリー,AIプロンプト" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="2kawaii" />
      </Head>

      <div className="min-h-screen bg-[#fff7ea] flex flex-col">
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

          {/* Gallery Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 mb-8">
            {shareItems && shareItems.length > 0 ? (
              <>
                <PinterestWaterfall
                  items={shareItems}
                  hasMore={hasMore}
                  loading={loadingMore}
                />
                {/* 移动端优化的无限滚动触发器 */}
                {hasMore && (
                  <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
                    <div className="text-center">
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">さらに読み込み中...</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 animate-pulse">
                          スクロールしてさらに見る
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🎨</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">まだ変換結果がありません</h3>
                <p className="text-gray-600 mb-8">最初のAI画像変換を体験してみませんか？</p>
                <button
                  onClick={() => window.location.href = 'https://2kawaii.com'}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  今すぐ始める
                </button>
              </div>
            )}
          </section>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}