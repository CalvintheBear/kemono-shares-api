'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

interface Item { id: string; generatedUrl: string; style?: string }

export default function HomeLatestShares() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let alive = true
    const fetchLatest = async () => {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const res = await fetch(`${origin}/api/share/latest`, { cache: 'no-store' })
        const json = await res.json()
        if (!alive) return
        if (json.success && Array.isArray(json.data?.items)) {
          setItems(json.data.items)
        }
      } catch {}
      setLoading(false)
    }
    fetchLatest()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
        </div>
      )
    }
    if (!items || items.length === 0) {
      return (
        <div className={`text-center text-sm text-gray-500 py-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>まだ作品がありません。少し待ってね…</div>
      )
    }
    return (
      <div className={`grid grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {items.slice(0, 12).map((it) => (
          <a key={it.id} href={`/share?id=${encodeURIComponent(it.id)}`} className="block rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition">
            <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
              <Image src={it.generatedUrl} alt={it.style || 'AI生成画像'} fill sizes="(min-width: 1024px) 16.67vw, 25vw" className="object-cover" unoptimized />
            </div>
          </a>
        ))}
      </div>
    )
  }, [items, loading, isVisible])

  return (
    <section className="py-6 lg:py-10 px-3 sm:px-4 lg:px-6 bg-surface animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-center text-text font-cute mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>本日の最新作品</h2>
        <p className={`text-center text-text-muted text-sm mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>30分ごとに更新</p>
        {content}
        <div className={`mt-6 flex justify-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="/share"
            className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold shadow hover:shadow-md transition-colors bg-surface text-text hover:bg-surface-hover"
          >
            お題一覧 🖼️
          </a>
        </div>
      </div>
    </section>
  )
}


