'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ShareData {
  generated: string
  original: string
  prompt: string
  style: string
  timestamp: number
}

interface ShareDetailProps {
  shareData: ShareData | null
}

export default function ShareDetail({ shareData }: ShareDetailProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!shareData) return
    
    setIsDownloading(true)
    try {
      const response = await fetch(shareData.generated)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `2kawaii-${shareData.style}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleTryNow = () => {
    window.location.href = '/workspace'
  }

  if (!shareData) return null

  return (
    <div className="min-h-screen">
      <MobileBottomNav />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-brand text-white p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SparklesIcon className="w-6 h-6" />
              <h1 className="text-3xl font-bold">変換完了！</h1>
              <SparklesIcon className="w-6 h-6" />
            </div>
            <p className="text-lg opacity-90">
              {shareData.style}スタイルで変身完了！
            </p>
          </div>

          {/* Image Comparison */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-4 text-center">
                変身前後の比較
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm text-[var(--text-muted)] mb-2">変身前</p>
                  <Image
                    src={shareData.original}
                    alt="Original"
                    width={300}
                    height={300}
                    className="rounded-lg shadow-lg mx-auto"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-[var(--text-muted)] mb-2">変身后</p>
                  <Image
                    src={shareData.generated}
                    alt="Generated"
                    width={300}
                    height={300}
                    className="rounded-lg shadow-lg mx-auto"
                  />
                </div>
              </div>
            </div>

            {/* Style Information */}
            <div className="bg-[var(--surface)] rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-[var(--text)] mb-3">変換スタイル</h3>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-[var(--surface)] text-[var(--text)] px-3 py-1 rounded-full text-sm font-medium border border-[var(--border)]">
                  {shareData.style}
                </span>
                <span className="text-[var(--text-muted)] text-sm">
                  {new Date(shareData.timestamp).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <p className="text-[var(--text)] text-sm leading-relaxed">
                {shareData.prompt}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="btn-primary py-3 px-8 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? 'ダウンロード中...' : '📥 ダウンロード'}
              </button>
              <button
                onClick={handleTryNow}
                className="btn-primary py-3 px-8 font-bold"
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