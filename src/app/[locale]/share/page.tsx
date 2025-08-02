'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import ShareGallery from '@/components/ShareGallery'
import ShareDetail from '@/components/ShareDetail'

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
    return <ShareDetail shareData={shareData} />
  }

  // 显示画廊页面
  return (
    <div className="min-h-screen bg-[#fff7ea] flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 pt-24">
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto text-center py-8 mb-8">
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-700 mb-3 tracking-tight">
              みんなの作品ギャラリー
            </h1>
            <p className="text-lg sm:text-xl text-amber-600 max-w-2xl mx-auto">
              他の人たちのAI変換作品をチェック！
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mb-8">
          <ShareGallery />
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}