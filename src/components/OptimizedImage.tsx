'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  priority?: boolean
}

// 检查是否在Cloudflare Pages环境
const isCloudflarePages = typeof window !== 'undefined' && 
  (window.location.hostname.includes('pages.dev') || 
   window.location.hostname.includes('2kawaii.com'))

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  onClick,
  priority = false
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 如果是Cloudflare Pages环境或图片加载失败，使用原生img标签
  if (isCloudflarePages || imageError) {
    return (
      <div className={`relative ${className}`} style={style} onClick={onClick}>
        {isLoading && (
          <div 
            className="absolute inset-0 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center"
            style={{ width: width || 'auto', height: height || 'auto' }}
          >
            <div className="text-gray-400 text-sm">画像読み込み中...</div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={style}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true)
            setIsLoading(false)
            console.error('图片加载失败:', src)
          }}
        />
      </div>
    )
  }

  // 其他环境使用Next.js的Image组件
  return (
    <div className="relative">
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center z-10"
          style={{ width: width || 'auto', height: height || 'auto' }}
        >
          <div className="text-gray-400 text-sm">画像読み込み中...</div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width || 400}
        height={height || 400}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={style}
        onClick={onClick}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
          console.error('Next.js Image组件加载失败，回退到原生img:', src)
        }}
      />
    </div>
  )
}

export default OptimizedImage
