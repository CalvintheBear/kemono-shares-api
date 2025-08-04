'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ShareDetail from '@/components/ShareDetail'

interface ShareData {
  generated: string
  original: string
  prompt: string
  style: string
  timestamp: number
}

export default function SharePageClient() {
  const searchParams = useSearchParams()
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasShareData, setHasShareData] = useState(false)

  useEffect(() => {
    const dataParam = searchParams?.get('data')
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

  // 如果没有分享数据，返回 null（由父组件处理）
  return null
} 