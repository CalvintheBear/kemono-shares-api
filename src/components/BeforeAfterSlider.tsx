'use client'

import ReactCompareImage from 'react-compare-image'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  onLightboxOpen?: () => void
}

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeAlt = "元画像", 
  afterAlt = "生成結果",
  onLightboxOpen
}: BeforeAfterSliderProps) {

  return (
    <div className="relative group">
      {/* 对比滑块 */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <ReactCompareImage
          leftImage={beforeImage}
          rightImage={afterImage}
          leftImageAlt={beforeAlt}
          rightImageAlt={afterAlt}
          sliderLineColor="#f87171"
          sliderLineWidth={4}
          handleSize={40}
          hover={true}
          skeleton={
            <div className="w-full h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl flex items-center justify-center">
              <div className="text-gray-500">読み込み中...</div>
            </div>
          }
        />
      </div>

      {/* 放大镜按钮 */}
      <button
        onClick={onLightboxOpen}
        className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
        title="拡大表示"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>

      {/* 标签 */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
        <span className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
          {beforeAlt}
        </span>
        <span className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
          {afterAlt}
        </span>
      </div>

      {/* 使用提示 */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">
          <span className="inline-flex items-center space-x-1">
            <span>🔄</span>
            <span>スライダーをドラッグして比較</span>
          </span>
        </p>
      </div>
    </div>
  )
} 