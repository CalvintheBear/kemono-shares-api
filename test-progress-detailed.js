// 详细测试进度条状态更新问题
console.log('🔍 开始详细调试进度条状态更新问题...')

// 模拟React状态和组件
let generationProgress = null
let generationStatusText = ''
let isGenerating = false
let currentResult = null

function setGenerationProgress(value) {
  console.log('📊 setGenerationProgress 被调用，新值:', value, '类型:', typeof value)
  generationProgress = value
}

function setGenerationStatusText(value) {
  console.log('📝 setGenerationStatusText 被调用，新值:', value)
  generationStatusText = value
}

function setIsGenerating(value) {
  console.log('🔄 setIsGenerating 被调用，新值:', value)
  isGenerating = value
}

function setCurrentResult(value) {
  console.log('📋 setCurrentResult 被调用，新值:', value ? '有结果' : 'null')
  currentResult = value
}

function setGenerationError(value) {
  console.log('❌ setGenerationError 被调用，新值:', value)
}

// 模拟generateImage函数的开始部分
console.log('\n🧪 模拟generateImage函数开始:')
setIsGenerating(true)
setGenerationProgress(0)
setGenerationStatusText('画像生成中...')
setGenerationError('')
setCurrentResult(null)

console.log('generateImage开始后状态:')
console.log('- isGenerating:', isGenerating)
console.log('- generationProgress:', generationProgress)
console.log('- generationStatusText:', generationStatusText)
console.log('- currentResult:', currentResult)

// 模拟API响应
console.log('\n🧪 模拟API响应处理:')
const mockApiResponse = {
  data: {
    progress: "0.01",
    status: "GENERATING"
  }
}

console.log('模拟API响应:', mockApiResponse)
const responseData = mockApiResponse.data || mockApiResponse
console.log('解析后的响应数据:', responseData)

// 模拟pollProgress中的进度计算
let currentProgress = 0
if (responseData.progress !== undefined && responseData.progress !== null) {
  console.log('检测到API进度数据:', responseData.progress)
  if (typeof responseData.progress === 'number') {
    if (responseData.progress <= 1) {
      currentProgress = Math.round(responseData.progress * 100)
    } else {
      currentProgress = Math.round(responseData.progress)
    }
    console.log('数字类型进度转换:', responseData.progress, '->', currentProgress)
  } else if (typeof responseData.progress === 'string') {
    const parsedProgress = parseFloat(responseData.progress)
    if (!isNaN(parsedProgress)) {
      if (parsedProgress <= 1) {
        currentProgress = Math.round(parsedProgress * 100)
      } else {
        currentProgress = Math.round(parsedProgress)
      }
      console.log('字符串类型进度转换:', responseData.progress, '->', parsedProgress, '->', currentProgress)
    }
  }
}

// 确保进度在合理范围内
currentProgress = Math.max(0, Math.min(currentProgress, 99))
console.log('最终计算进度:', currentProgress, '%')

// 模拟状态更新
console.log('\n🧪 模拟状态更新:')
console.log('更新前状态 - generationProgress:', generationProgress)
setGenerationProgress(currentProgress)
setGenerationStatusText(`処理中... ${currentProgress}%`)
console.log('更新后状态 - generationProgress:', generationProgress)
console.log('更新后状态 - generationStatusText:', generationStatusText)

// 测试渲染条件
console.log('\n🧪 测试渲染条件:')
const shouldRender = generationProgress !== null && generationProgress >= 0
console.log('generationProgress !== null:', generationProgress !== null)
console.log('generationProgress >= 0:', generationProgress >= 0)
console.log('shouldRender:', shouldRender)

// 模拟重置按钮
console.log('\n🧪 模拟重置按钮:')
console.log('重置前状态 - generationProgress:', generationProgress)
setGenerationProgress(0)
setGenerationStatusText('リセット完了')
console.log('重置后状态 - generationProgress:', generationProgress)
console.log('重置后状态 - generationStatusText:', generationStatusText)

// 再次测试渲染条件
console.log('\n🧪 重置后测试渲染条件:')
const shouldRenderAfterReset = generationProgress !== null && generationProgress >= 0
console.log('generationProgress !== null:', generationProgress !== null)
console.log('generationProgress >= 0:', generationProgress >= 0)
console.log('shouldRenderAfterReset:', shouldRenderAfterReset)

console.log('\n✅ 详细调试完成')

// 检查可能的问题
console.log('\n🔍 问题诊断:')
console.log('1. 状态更新是否正常:', generationProgress === 0 ? '✅ 正常' : '❌ 异常')
console.log('2. 渲染条件是否满足:', shouldRenderAfterReset ? '✅ 满足' : '❌ 不满足')
console.log('3. 状态文本是否正确:', generationStatusText === 'リセット完了' ? '✅ 正确' : '❌ 错误') 