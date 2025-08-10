'use client'

interface ProgressStep {
  id: string
  title: string
  description: string
  icon: string
}

interface ProgressIndicatorProps {
  currentStep: number
  isActive: boolean
}

export default function ProgressIndicator({ currentStep, isActive }: ProgressIndicatorProps) {
  const steps: ProgressStep[] = [
    {
      id: 'upload',
      title: '画像アップロード',
      description: '画像を選択してアップロード',
      icon: '📤'
    },
    {
      id: 'process',
      title: '処理中', 
      description: 'AIが処理中です',
      icon: '🎨'
    },
    {
      id: 'enhance',
      title: '画質向上',
      description: '画像品質を向上中', 
      icon: '✨'
    },
    {
      id: 'complete',
      title: '完了',
      description: '処理完了',
      icon: '🎉'
    }
  ]

  if (!isActive) return null

  return (
    <div className="card p-6 mb-8 animate-scale-in progress-indicator">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-text font-cute mb-2">
          処理の進捗
        </h3>
        <p className="text-gray-600">
          画像を処理中です。しばらくお待ちください...
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
                  ? 'btn-primary text-white shadow-lg scale-110' 
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
                  ${index <= currentStep ? 'text-text' : 'text-gray-400'}
                `}>
                  {step.title}
                </h4>
                <p className={`
                  text-xs mt-1 max-w-20
                  ${index <= currentStep ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 连接线 */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-brand rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 当前步骤详情 */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-surface px-4 py-2 rounded-full border border-border">
          <div className="w-3 h-3 bg-brand rounded-full animate-pulse"></div>
          <span className="text-text font-medium">
            {steps[currentStep]?.title || '処理中'}
          </span>
        </div>
      </div>
    </div>
  )
} 