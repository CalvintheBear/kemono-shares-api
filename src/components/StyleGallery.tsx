'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { styleTypes, getStyleImageUrl, getFallbackImageUrl } from '@/config/images'

export default function StyleGallery() {
  const [selectedStyle, setSelectedStyle] = useState('kemonomimi')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 获取当前样式的图片数组
  const getCurrentImages = () => {
    const currentStyleType = styleTypes.find(s => s.id === selectedStyle)
    return Array.from({ length: currentStyleType?.imageCount || 5 }, (_, index) => ({
      id: index,
      url: getStyleImageUrl(selectedStyle, index),
      fallbackUrl: getFallbackImageUrl(selectedStyle),
      alt: `${currentStyleType?.name} スタイル ${index + 1}`
    }))
  }

  // 切换到下一组图片
  const nextImages = () => {
    const images = getCurrentImages()
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(1, images.length - 2))
  }

  // 切换到上一组图片
  const prevImages = () => {
    const images = getCurrentImages()
    setCurrentImageIndex((prev) => 
      prev === 0 ? Math.max(0, images.length - 3) : prev - 1
    )
  }

  // 获取当前显示的3张图片
  const getVisibleImages = () => {
    const images = getCurrentImages()
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentImageIndex + i) % images.length
      visible.push(images[index])
    }
    return visible
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-text font-cute mb-12">
          選べる変身スタイル
        </h2>
        
        {/* 样式选择按钮 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {styleTypes.map((style) => (
            <button
              key={style.id}
              onClick={() => {
                setSelectedStyle(style.id)
                setCurrentImageIndex(0)
              }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${selectedStyle === style.id 
                  ? 'btn-primary text-white' 
                  : 'bg-surface text-text-muted border border-border hover:bg-surface'
                }
              `}
            >
              <span className="text-lg">{style.emoji}</span>
              <span className="font-cute">{style.name}</span>
            </button>
          ))}
        </div>

        {/* 当前选中样式的描述 */}
        <div className="text-center mb-8">
          <p className="text-lg text-text-muted font-cute">
            {styleTypes.find(s => s.id === selectedStyle)?.description}
          </p>
        </div>

        {/* 图片轮播区域 */}
        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            {/* 左箭头 */}
            <button
              onClick={prevImages}
              className="p-2 rounded-md bg-surface text-text-muted border border-border hover:bg-surface transition-all hover:scale-110"
              aria-label="前の画像"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            {/* 图片展示区域 */}
            <div className="flex gap-4 overflow-hidden">
              {getVisibleImages().map((image, index) => (
                <div
                  key={`${selectedStyle}-${image.id}-${index}`}
                  className="card p-2 hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-surface rounded-lg overflow-hidden relative group inline-block border border-border">
                    {/* 占位背景 */}
                    <div className="w-64 h-64 flex items-center justify-center text-6xl bg-surface border border-border">
                      {styleTypes.find(s => s.id === selectedStyle)?.emoji}
                    </div>
                    
                    {/* 主图片 */}
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 256px"
                      className="w-auto h-auto max-w-64 max-h-64 object-contain transition-opacity duration-500"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src = image.fallbackUrl
                      }}
                    />
                    
                    {/* 悬停遮罩效果 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    
                    {/* 图片标签 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                      <p className="text-white text-sm font-medium">
                        サンプル {image.id + 1}
                      </p>
                    </div>
                    
                    {/* 放大镜图标 (悬停时显示) */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 rounded-full p-2">
                        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 右箭头 */}
            <button
              onClick={nextImages}
              className="p-2 rounded-md bg-surface text-text-muted border border-border hover:bg-surface transition-all hover:scale-110"
              aria-label="次の画像"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>

          {/* 指示器 */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.max(1, getCurrentImages().length - 2) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${currentImageIndex === index 
                    ? 'bg-brand w-6' 
                    : 'bg-border hover:bg-text-muted'
                  }
                `}
                aria-label={`画像グループ ${index + 1} に移動`}
              />
            ))}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-muted">
            ← → ボタンまたは下の点をクリックして他のサンプルを見る
          </p>
        </div>
      </div>
    </div>
  )
} 