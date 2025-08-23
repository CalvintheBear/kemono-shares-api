'use client'

import { GenerationResult, Template } from '../types'
import ResultActions from '../ui/ResultActions'
import OptimizedImage from '../../OptimizedImage'

interface ResultDisplaySectionProps {
  result: GenerationResult | null
  selectedTemplate: Template | null
  selectedModel: string
  autoShareUrl: string
  publishState: 'idle' | 'publishing' | 'published'
  onContribute: () => void
  isGenerating: boolean
  isEnglish?: boolean
}

export default function ResultDisplaySection({
  result,
  selectedTemplate,
  selectedModel,
  autoShareUrl,
  publishState,
  onContribute,
  isGenerating,
  isEnglish = false
}: ResultDisplaySectionProps) {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          <div className="relative card max-w-sm mx-auto text-center">
            <span className="relative inline-flex items-center justify-center mb-3">
              <svg
                className="cat-bounce h-10 w-10"
                viewBox="0 0 16 16"
                aria-hidden="true"
                shapeRendering="crispEdges"
              >
                <rect x="3" y="3" width="2" height="2" fill="#F6BBD0" />
                <rect x="11" y="3" width="2" height="2" fill="#F6BBD0" />
                <rect x="4" y="4" width="8" height="8" rx="1" ry="1" fill="#F6BBD0" />
                <rect x="6" y="7" width="1" height="1" fill="#2B2B2B" />
                <rect x="9" y="7" width="1" height="1" fill="#2B2B2B" />
                <rect x="7" y="9" width="2" height="1" fill="#2B2B2B" />
              </svg>

            </span>
            <h3 className="text-lg font-bold text-text mb-2">
              {isEnglish ? 'Generating image...' : '画像生成中...'}
            </h3>
            <p className="text-sm text-text-muted mb-4">
              {isEnglish ? 'AI is generating your image' : 'AIが画像を生成しています'}
            </p>
            <div className="bg-surface rounded-lg p-4">
              <p className="text-sm text-text-muted">
                {isEnglish ? 'Completed in seconds' : '数秒で完了します'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result || !result.generated_url) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative card overflow-hidden max-h-[58vh] sm:max-h-[62vh] overflow-y-auto">
          <div className="pt-4 p-4">
            {(!result.original_url || result.original_url.trim() === '') ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <OptimizedImage
                    src={result.generated_url}
                    alt={isEnglish ? 'Generated image' : '生成された画像'}
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                <div className="mt-4 bg-surface rounded-lg p-4">
                  <h4 className="text-sm font-bold text-text mb-2">
                    {isEnglish ? 'Prompt:' : 'プロンプト：'}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {result.prompt.substring(0, 100)}...
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative inline-block">
                  <OptimizedImage
                    src={result.generated_url}
                    alt={isEnglish ? 'Generated image' : '生成された画像'}
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="mt-4 bg-surface rounded-lg p-4">
                  <h4 className="text-sm font-bold text-text mb-2">
                    {isEnglish ? 'Prompt:' : 'プロンプト：'}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {result.prompt.substring(0, 100)}...
                  </p>
                </div>
              </div>
            )}

            {/* Sticky actions inside the result panel for mobile users */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-border -mx-4 px-4 py-3">
              <ResultActions
                result={result}
                selectedTemplate={selectedTemplate}
                selectedModel={selectedModel}
                autoShareUrl={autoShareUrl}
                publishState={publishState}
                onContribute={onContribute}
                isEnglish={isEnglish}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
