'use client'

import { useState } from 'react'
import ShareButton from '../../ShareButton'
import { GenerationResult, Template } from '../types'

interface ResultActionsProps {
  result: GenerationResult
  selectedTemplate: Template | null
  selectedModel: string
  autoShareUrl: string
  publishState: 'idle' | 'publishing' | 'published'
  onContribute: () => void
  isEnglish?: boolean
}

export default function ResultActions({
  result,
  selectedTemplate,
  selectedModel,
  autoShareUrl,
  publishState,
  onContribute,
  isEnglish = false
}: ResultActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(result.generated_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `anime-magic-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      // 如果下载失败，直接打开新窗口
      window.open(result.generated_url, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full sm:w-auto btn-primary py-3 px-6 flex items-center justify-center gap-2 disabled:opacity-60"
        aria-label={isEnglish ? 'Download' : 'ダウンロード'}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {isEnglish ? 'Downloading...' : 'ダウンロード中...'}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isEnglish ? 'Download' : 'ダウンロード'}
          </>
        )}
      </button>
      
      <button
        onClick={onContribute}
        disabled={publishState !== 'idle'}
        className="w-full sm:w-auto btn-primary py-3 px-6 flex items-center justify-center gap-2 disabled:opacity-60"
        aria-label={isEnglish ? 'Contribute' : '公開する'}
      >
        {publishState === 'publishing' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {isEnglish ? 'Publishing…' : '公開中…'}
          </>
        ) : publishState === 'published' ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {isEnglish ? 'Contributed' : '公開済み'}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            {isEnglish ? 'Contribute' : '公開する'}
          </>
        )}
      </button>
      
      <ShareButton
        generatedImageUrl={result.generated_url}
        originalImageUrl={result.original_url}
        prompt={result.prompt}
        style={selectedTemplate?.name || 'カスタム'}
        existingShareUrl={autoShareUrl}
      />
    </div>
  )
}
