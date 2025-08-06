'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { LinkIcon } from '@heroicons/react/24/outline'

interface ShareButtonProps {
  generatedImageUrl: string
  originalImageUrl: string
  prompt: string
  style: string
  existingShareUrl?: string
}

export default function ShareButton({ generatedImageUrl, originalImageUrl, prompt, style, existingShareUrl }: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [shareUrl, setShareUrl] = useState('') // 始终重置为空，强制创建新分享
  
  // 使用existingShareUrl如果有值，否则创建新分享
  useEffect(() => {
    if (existingShareUrl) {
      setShareUrl(existingShareUrl)
    } else {
      setShareUrl('')
    }
  }, [generatedImageUrl, existingShareUrl])
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSharing, setIsSharing] = useState(false) // 防止重复分享
  const [error, setError] = useState<string>('') // 错误状态
  
  // 分享链接是否已就绪（强制启用，确保每次都能创建新分享）
  const isShareReady = true
  const [menuPosition, setMenuPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left')
  const buttonRef = useRef<HTMLDivElement>(null)
  const shareRequestRef = useRef<Promise<string> | null>(null) // 防止重复请求

  // 计算菜单位置
  const calculateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return 'top-left'
    
    const buttonRect = buttonRef.current.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    // 检查各个方向的可用空间
    const spaceAbove = buttonRect.top
    const spaceBelow = windowHeight - buttonRect.bottom
    const spaceLeft = buttonRect.left
    const spaceRight = windowWidth - buttonRect.right
    
    // 菜单的预估尺寸
    const menuWidth = 280 // 预估宽度
    const menuHeight = 300 // 预估高度
    
    // 优先选择空间最大的方向
    if (spaceAbove > menuHeight && spaceLeft > menuWidth) {
      return 'top-left'
    } else if (spaceAbove > menuHeight && spaceRight > menuWidth) {
      return 'top-right'
    } else if (spaceBelow > menuHeight && spaceLeft > menuWidth) {
      return 'bottom-left'
    } else if (spaceBelow > menuHeight && spaceRight > menuWidth) {
      return 'bottom-right'
    } else if (spaceAbove > menuHeight) {
      return spaceLeft > spaceRight ? 'top-left' : 'top-right'
    } else if (spaceBelow > menuHeight) {
      return spaceLeft > spaceRight ? 'bottom-left' : 'bottom-right'
    } else {
      return 'top-left' // 默认位置
    }
  }, [])

  // 获取菜单位置样式
  const getMenuPositionStyle = useCallback(() => {
    switch (menuPosition) {
      case 'top-left':
        return 'absolute bottom-full right-0 mb-2'
      case 'top-right':
        return 'absolute bottom-full left-0 mb-2'
      case 'bottom-left':
        return 'absolute top-full right-0 mt-2'
      case 'bottom-right':
        return 'absolute top-full left-0 mt-2'
      default:
        return 'absolute bottom-full right-0 mb-2'
    }
  }, [menuPosition])

  // 生成分享链接
  const generateShareUrl = useCallback(async () => {
    // 验证图片URL是否有效
    if (!generatedImageUrl || generatedImageUrl.trim() === '') {
      console.error('❌ 无效的图片URL，无法创建分享')
      setError('图片URL无效，无法创建分享')
      return null
    }
    
    // 检查是否是R2永久URL（推荐）
    const isR2Url = generatedImageUrl.includes('pub-d00e7b41917848d1a8403c984cb62880.r2.dev') || 
                   generatedImageUrl.includes('.r2.dev') || 
                   generatedImageUrl.includes('.r2.cloudflarestorage.com')
    
    if (!isR2Url && generatedImageUrl.includes('tempfile.aiquickdraw.com')) {
      console.warn('⚠️ 检测到临时URL，建议等待R2永久URL生成后再分享')
      console.warn('当前URL:', generatedImageUrl)
      // 可以选择继续或警告用户
    }
    
    // 每次生成都创建新分享，不复用旧链接
    if (shareUrl) {
      console.log('🔄 创建新的分享链接，不复用旧链接')
    }
    
    // 如果正在请求中，等待现有请求完成
    if (shareRequestRef.current) {
      console.log('🔄 检测到重复请求，等待现有请求完成...')
      return await shareRequestRef.current
    }
    
    // 如果正在分享中，防止重复操作
    if (isSharing) {
      console.log('⚠️ 正在分享中，请稍候...')
      return shareUrl
    }
    
    setIsSharing(true)
    setIsLoading(true)
    setError('') // 清除之前的错误
    
    try {
      // 创建新的请求Promise
      const requestPromise = (async () => {
        console.log('[ShareButton] 创建分享，使用URL:', generatedImageUrl)
        console.log('[ShareButton] URL类型:', isR2Url ? 'R2永久URL' : '临时URL')
        
        const response = await fetch('/api/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            generatedUrl: generatedImageUrl,
            originalUrl: originalImageUrl,
            prompt: prompt,
            style: style,
            timestamp: Date.now(),
            isR2Stored: isR2Url // 标记是否使用R2永久URL
          })
        })

        const data = await response.json()
        
        if (data.success) {
          const newShareUrl = data.shareUrl
          setShareUrl(newShareUrl)
          console.log('✅ 分享链接生成成功:', newShareUrl)
          console.log('✅ 分享数据:', data.data)
          return newShareUrl
        } else {
          throw new Error(data.error || '分享创建失败')
        }
      })()
      
      // 保存请求引用
      shareRequestRef.current = requestPromise
      
      // 等待请求完成
      const result = await requestPromise
      
      // 清理请求引用
      shareRequestRef.current = null
      
      return result
    } catch (error) {
      console.error('分享链接生成失败:', error)
      setError(error instanceof Error ? error.message : '分享链接生成失败')
      // 清理请求引用
      shareRequestRef.current = null
      
      // 备用方案：使用URL参数
      const shareData = {
        generated: generatedImageUrl,
        original: originalImageUrl,
        prompt: prompt,
        style: style,
        timestamp: Date.now()
      }
      
      const encodedData = btoa(JSON.stringify(shareData))
      const fallbackUrl = `https://2kawaii.com/share?data=${encodedData}`
      setShareUrl(fallbackUrl)
      return fallbackUrl
    } finally {
      setIsLoading(false)
      setIsSharing(false)
    }
  }, [shareUrl, generatedImageUrl, originalImageUrl, prompt, style, isSharing])

  // 复制分享链接 - 如果有现有URL直接复制，不重新生成
  const copyShareUrl = useCallback(async () => {
    // 防止重复点击
    if (isSharing || isLoading) {
      console.log('⚠️ 正在处理中，请稍候...')
      return
    }
    
    let url = shareUrl
    
    // 如果没有URL，才重新生成
    if (!url) {
      console.log('🔄 没有现有URL，创建新的分享链接')
      url = await generateShareUrl()
    } else {
      console.log('📋 使用现有URL直接复制:', url)
    }
    
    if (!url) {
      console.error('❌ 没有可用的分享URL')
      return
    }
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      console.log('✅ 链接已复制到剪贴板:', url)
    } catch (error) {
      console.error('复制失败:', error)
      // 备用方案
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      console.log('✅ 链接已复制到剪贴板（备用方案）')
    }
  }, [generateShareUrl, isSharing, isLoading, shareUrl])

  // 处理分享到社交媒体
  const handleSocialShare = useCallback(async (platform: string) => {
    // 防止重复点击
    if (isSharing || isLoading) {
      console.log('⚠️ 正在处理中，请稍候...')
      return
    }
    
    const url = await generateShareUrl()
    let shareUrl = ''
    const text = `✨ 2kawaiiでAI画像変換を体験しました！${style}スタイルで変身完了！🎉`
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'line':
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
        break
      case 'instagram':
        // Instagram直接复制链接
        await copyShareUrl()
        return
      default:
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      console.log(`✅ 已打开${platform}分享页面`)
    }
  }, [generateShareUrl, style, copyShareUrl, isSharing, isLoading])

  // 处理按钮点击
  const handleButtonClick = useCallback(() => {
    if (!showShareMenu) {
      // 打开菜单时计算位置
      const position = calculateMenuPosition()
      setMenuPosition(position)
    }
    setShowShareMenu(!showShareMenu)
  }, [showShareMenu, calculateMenuPosition])

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (showShareMenu) {
        const position = calculateMenuPosition()
        setMenuPosition(position)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showShareMenu, calculateMenuPosition])

  return (
    <div className="relative inline-block" ref={buttonRef}>
      <button
        onClick={handleButtonClick}
        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95"
        type="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={showShareMenu}
        disabled={isLoading || isSharing || !isShareReady}
      >
        <span>✨</span>
        <span>{isLoading || isSharing ? '生成中...' : (!isShareReady ? '準備中...' : '自分も試してみる')}</span>
      </button>

      {/* 分享菜单 */}
      {showShareMenu && (
        <>
          {/* 透明遮罩层，点击关闭弹窗 */}
          <div
            className="fixed inset-0 z-[9998] bg-transparent cursor-pointer"
            onClick={() => {
              console.log('遮罩层被点击，关闭弹窗')
              setShowShareMenu(false)
            }}
            aria-label="关闭分享菜单"
          />
          
          {/* 弹窗内容 */}
          <div className={`${getMenuPositionStyle()} bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-64 z-[9999] animate-fade-in`}>
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 mb-3">シェア方法を選択</h3>
              
              {/* 社交媒体分享链接 */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-105 text-blue-700 hover:text-blue-800 active:scale-95"
                >
                  <span className="text-blue-500">🐦</span>
                  <span className="text-sm">Twitter</span>
                </button>
                
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-105 text-blue-700 hover:text-blue-800 active:scale-95"
                >
                  <span className="text-blue-500">📘</span>
                  <span className="text-sm">Facebook</span>
                </button>
                
                <button
                  onClick={() => handleSocialShare('line')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200 hover:scale-105 text-green-700 hover:text-green-800 active:scale-95"
                >
                  <span className="text-green-500">💬</span>
                  <span className="text-sm">LINE</span>
                </button>
                
                <button
                  onClick={() => handleSocialShare('instagram')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-all duration-200 hover:scale-105 text-pink-700 hover:text-pink-800 active:scale-95"
                >
                  <span className="text-pink-500">📷</span>
                  <span className="text-sm">Instagram</span>
                </button>
              </div>

              <div className="border-t pt-3">
                {/* 复制分享链接 */}
                <button
                  onClick={copyShareUrl}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {copied ? 'コピー完了！' : 'リンクをコピー'}
                  </span>
                </button>
              </div>

              {/* 错误显示 */}
              {error && (
                <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* 分享链接预览 */}
              {shareUrl && !error && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">シェアリンク:</p>
                  <p className="text-xs text-gray-800 break-all">{shareUrl}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
} 