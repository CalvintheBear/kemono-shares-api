'use client'

import React from 'react'
import Image from 'next/image'

interface PinterestItem {
  id: string
  title: string
  style: string
  timestamp: string
  generatedUrl: string
  originalUrl: string
}

interface PinterestWaterfallProps {
  items: PinterestItem[]
  onLoadMore?: () => Promise<void>
  hasMore: boolean
  loading?: boolean
}

export default function PinterestWaterfall({ 
  items, 
  onLoadMore: _onLoadMore, 
  hasMore: _hasMore, 
  loading: _loading 
}: PinterestWaterfallProps) {
  // 使用CSS columns实现瀑布流布局
  return (
    <>
      <div className="pinterest-gallery">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="pinterest-item group cursor-pointer mb-4"
            onClick={() => {
              const isEnglish = location.pathname === '/en' || location.pathname.startsWith('/en/')
              const target = isEnglish ? `/en/share/${item.id}` : `/share/${item.id}`
              window.location.href = target
            }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <Image
                  src={item.generatedUrl}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 375px) 33vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  loading={index < 12 ? "eager" : "lazy"}
                  priority={index < 8}
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE1MCA5NSA1NSAxMDAgNTUgMTAwQzU1IDEwNSAxNTAgMTAwIDE1MCAxMDBaIiBmaWxsPSIjRTBFMEUwIi8+Cjwvc3ZnPgo="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-bold text-sm mb-1 truncate">{item.title}</h3>
                    <p className="text-xs opacity-90 truncate">{item.style}</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 mb-1 truncate">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.style}</p>
                <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}