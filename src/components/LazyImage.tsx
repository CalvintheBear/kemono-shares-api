'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fallback?: React.ReactNode
  priority?: boolean
  placeholder?: string // 低清晰度占位图URL
}

export default function LazyImage({
  src,
  alt,
  className = '',
  loading: _loading = 'lazy',
  fallback,
  priority = false,
  placeholder
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [errorType, setErrorType] = useState<'network' | 'notfound' | 'unknown'>('unknown')
  const [showHighQuality, setShowHighQuality] = useState(false)
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false)
  
  const imgRef = useRef<HTMLImageElement>(null)
  const placeholderRef = useRef<HTMLImageElement>(null)
  const maxRetries = 2

  // 生成低清晰度占位图URL
  const generatePlaceholderUrl = (originalUrl: string) => {
    if (placeholder) return placeholder
    
    // 如果没有提供占位图，尝试生成一个
    // 这里可以根据实际需求调整参数
    try {
      const url = new URL(originalUrl)
      // 添加尺寸参数，生成50px宽的缩略图
      url.searchParams.set('w', '50')
      url.searchParams.set('q', '10') // 低质量
      return url.toString()
    } catch {
      return originalUrl
    }
  }

  const placeholderUrl = generatePlaceholderUrl(src)

  // 加载占位图
  useEffect(() => {
    if (placeholderUrl && placeholderUrl !== src) {
      const img = new window.Image()
      img.onload = () => setPlaceholderLoaded(true)
      img.onerror = () => setPlaceholderLoaded(false)
      img.src = placeholderUrl
    } else {
      setPlaceholderLoaded(true)
    }
  }, [placeholderUrl, src])

  // 简化逻辑：直接显示图片，不依赖Intersection Observer
  useEffect(() => {
    // 如果是优先加载，立即开始加载
    if (priority) {
      setIsLoading(true)
      setShowHighQuality(true)
    } else {
      // 非优先加载的图片也立即开始加载占位图
      setShowHighQuality(true)
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    setIsLoading(false)
    setHasError(false)
    setRetryCount(0)
    
    // 添加调试信息
    if (typeof window !== 'undefined' && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log(`✅ 图片加载成功: ${src}`)
    }
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget
    const error = event.nativeEvent as ErrorEvent
    
    // 判断错误类型
    let type: 'network' | 'notfound' | 'unknown' = 'unknown'
    if (error.message?.includes('404') || img.naturalWidth === 0) {
      type = 'notfound'
    } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
      type = 'network'
    }
    
    setErrorType(type)
    
    // 重试逻辑
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      setIsLoading(true)
      setHasError(false)
      
      // 延迟重试，避免立即重试
      setTimeout(() => {
        if (imgRef.current) {
          imgRef.current.src = src
        }
      }, 1000 * (retryCount + 1)) // 递增延迟
    } else {
      setHasError(true)
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setRetryCount(0)
    setHasError(false)
    setIsLoading(true)
    if (imgRef.current) {
      imgRef.current.src = src
    }
  }

  // 处理图片可见性变化
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !showHighQuality) {
        setShowHighQuality(true)
      }
    })
  }, [showHighQuality])

  // 设置Intersection Observer
  useEffect(() => {
    if (!priority && !showHighQuality) {
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: '200px', // 提前200px开始加载
        threshold: 0.1
      })

      if (imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => observer.disconnect()
    }
  }, [priority, showHighQuality, handleIntersection])

  // 如果出错且有fallback，显示fallback
  if (hasError && fallback) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ minHeight: '200px' }}>
        {fallback}
      </div>
    )
  }

  // 如果出错且没有fallback，显示默认错误状态
  if (hasError) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`} style={{ minHeight: '200px' }}>
        <div className="text-center p-4">
          <div className="text-4xl text-gray-400 mb-2">
            {errorType === 'network' ? '📡' : errorType === 'notfound' ? '🔍' : '🖼️'}
          </div>
          <p className="text-xs text-gray-500 mb-2">
            {errorType === 'network' ? '网络连接失败' : 
             errorType === 'notfound' ? '图片未找到' : '画像読み込みエラー'}
          </p>
          <button
            onClick={handleRetry}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 加载状态 */}
      {isLoading && !placeholderLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <div className="text-2xl text-amber-400">🎨</div>
          </div>
        </div>
      )}

      {/* 低清晰度占位图 - 只在高清晰度图片未加载时显示 */}
      {placeholderLoaded && showHighQuality && !isLoaded && (
        <div className="absolute inset-0 z-5">
          <Image
            ref={placeholderRef}
            src={placeholderUrl}
            alt={`${alt} (placeholder)`}
            width={0}
            height={0}
            unoptimized
            className="w-full h-auto object-cover blur-sm"
            style={{ display: 'block' }}
          />
        </div>
      )}
      
      {/* 高清晰度图片 - 延迟加载 */}
      {showHighQuality && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          width={0}
          height={0}
          unoptimized
          priority={priority}
          className={`w-full h-auto object-cover transition-all duration-700 z-10 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          style={{ display: 'block' }}
        />
      )}
    </div>
  )
} 