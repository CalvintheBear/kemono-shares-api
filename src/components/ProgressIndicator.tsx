'use client'

import { useTranslations } from 'next-intl'

interface ProgressStep {
  id: string
  titleKey: string
  descriptionKey: string
  icon: string
}

interface ProgressIndicatorProps {
  currentStep: number
  isActive: boolean
}

export default function ProgressIndicator({ currentStep, isActive }: ProgressIndicatorProps) {
  const t = useTranslations('workspace.progress')

  const steps: ProgressStep[] = [
    {
      id: 'upload',
      titleKey: 'upload.title',
      descriptionKey: 'upload.description',
      icon: '📤'
    },
    {
      id: 'process',
      titleKey: 'process.title', 
      descriptionKey: 'process.description',
      icon: '🎨'
    },
    {
      id: 'enhance',
      titleKey: 'enhance.title',
      descriptionKey: 'enhance.description', 
      icon: '✨'
    },
    {
      id: 'complete',
      titleKey: 'complete.title',
      descriptionKey: 'complete.description',
      icon: '🎉'
    }
  ]

  if (!isActive) return null

  return (
    <div className="card-kawaii p-6 mb-8 animate-scale-in progress-indicator">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gradient font-cute mb-2">
          {t('title')}
        </h3>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* 进度条 */}
      <div className="relative mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* 步骤圆圈 */}
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500
                ${index <= currentStep 
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg scale-110' 
                  : 'bg-gray-200 text-gray-400'
                }
                ${index === currentStep ? 'animate-pulse' : ''}
              `}>
                {step.icon}
              </div>
              
              {/* 步骤标题 */}
              <div className="mt-3 text-center">
                <h4 className={`
                  font-cute font-bold text-sm
                  ${index <= currentStep ? 'text-pink-600' : 'text-gray-400'}
                `}>
                  {t(step.titleKey)}
                </h4>
                <p className={`
                  text-xs mt-1 max-w-20
                  ${index <= currentStep ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {t(step.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 连接线 */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 当前步骤详情 */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-full">
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
          <span className="text-pink-700 font-medium">
            {t(steps[currentStep]?.titleKey || 'processing')}
          </span>
        </div>
      </div>
    </div>
  )
} 