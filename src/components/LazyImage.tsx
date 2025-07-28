'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fallback?: React.ReactNode
}

export default function LazyImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallback
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (loading === 'eager') {
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
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [loading])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  if (hasError && fallback) {
    return <>{fallback}</>
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse flex items-center justify-center">
          <div className="text-4xl text-amber-400">🎨</div>
        </div>
      )}
      
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          unoptimized
          className={`w-full h-auto object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
} 