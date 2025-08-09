'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

interface Item { id: string; generatedUrl: string; style?: string }

export default function HomeLatestShares() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

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
        <div className="text-center text-sm text-gray-500 py-10">まだ作品がありません。少し待ってね…</div>
      )
    }
    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {items.slice(0, 12).map((it) => (
          <a key={it.id} href={`/share?id=${encodeURIComponent(it.id)}`} className="block rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition">
            <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
              <Image src={it.generatedUrl} alt={it.style || 'AI生成画像'} fill sizes="(max-width: 640px) 33vw, (min-width:1024px) 25vw, 33vw" className="object-cover" unoptimized />
            </div>
          </a>
        ))}
      </div>
    )
  }, [items, loading])

  return (
    <section className="py-6 lg:py-10 px-3 sm:px-4 lg:px-6 bg-[#fff7ea]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-amber-800 font-cute mb-6">本日の最新作品</h2>
        <p className="text-center text-amber-700 text-sm mb-6">30分ごとに更新・最新12作品</p>
        {content}
      </div>
    </section>
  )
}


