'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fallback?: React.ReactNode
  priority?: boolean
}

export default function LazyImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallback,
  priority = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // 如果是优先加载或eager模式，立即显示
    if (priority || loading === 'eager') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px 0px', // 提前100px开始加载
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [loading, priority])

  const handleLoad = () => {
    setIsLoaded(true)
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  // 如果出错且有fallback，显示fallback
  if (hasError && fallback) {
    return <>{fallback}</>
  }

  // 如果出错且没有fallback，显示默认错误状态
  if (hasError) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-4xl text-gray-400 mb-2">🖼️</div>
          <p className="text-xs text-gray-500">画像読み込みエラー</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 加载状态 */}
      {isLoading && isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <div className="text-2xl text-amber-400">🎨</div>
          </div>
        </div>
      )}
      
      {/* 占位符（未进入视口时） */}
      {!isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-2xl text-gray-400">📷</div>
        </div>
      )}
      
      {/* 实际图片 */}
      {isInView && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          width={0}
          height={0}
          unoptimized
          priority={priority}
          className={`w-full h-auto object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        />
      )}
    </div>
  )
} 