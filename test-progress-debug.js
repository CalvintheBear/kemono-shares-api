// 测试进度条状态更新问题
console.log('🔍 开始调试进度条状态更新问题...')

// 模拟React状态更新
let generationProgress = null
let generationStatusText = ''

function setGenerationProgress(value) {
  console.log('📊 setGenerationProgress 被调用，新值:', value, '类型:', typeof value)
  generationProgress = value
}

function setGenerationStatusText(value) {
  console.log('📝 setGenerationStatusText 被调用，新值:', value)
  generationStatusText = value
}

// 测试重置按钮逻辑
console.log('\n🧪 测试重置按钮逻辑:')
console.log('当前状态 - generationProgress:', generationProgress, 'generationStatusText:', generationStatusText)

setGenerationProgress(0)
setGenerationStatusText('リセット完了')

console.log('重置后状态 - generationProgress:', generationProgress, 'generationStatusText:', generationStatusText)

// 测试进度更新逻辑
console.log('\n🧪 测试进度更新逻辑:')
const currentProgress = generationProgress || 0
const testProgress = Math.min(currentProgress + 10, 100)
console.log('计算的新进度:', testProgress)

setGenerationProgress(testProgress)
setGenerationStatusText(`テスト中... ${testProgress}%`)

console.log('更新后状态 - generationProgress:', generationProgress, 'generationStatusText:', generationStatusText)

// 测试渲染条件
console.log('\n🧪 测试渲染条件:')
const shouldRender = generationProgress !== null && generationProgress >= 0
console.log('generationProgress !== null:', generationProgress !== null)
console.log('generationProgress >= 0:', generationProgress >= 0)
console.log('shouldRender:', shouldRender)

// 测试API响应解析
console.log('\n🧪 测试API响应解析:')
const mockApiResponse = {
  data: {
    progress: "0.01",
    status: "GENERATING"
  }
}

console.log('模拟API响应:', mockApiResponse)
const responseData = mockApiResponse.data || mockApiResponse
console.log('解析后的响应数据:', responseData)
console.log('进度字段值:', responseData.progress, '类型:', typeof responseData.progress)

let currentProgress2 = 0
if (responseData.progress !== undefined && responseData.progress !== null) {
  console.log('检测到API进度数据:', responseData.progress)
  if (typeof responseData.progress === 'number') {
    if (responseData.progress <= 1) {
      currentProgress2 = Math.round(responseData.progress * 100)
    } else {
      currentProgress2 = Math.round(responseData.progress)
    }
    console.log('数字类型进度转换:', responseData.progress, '->', currentProgress2)
  } else if (typeof responseData.progress === 'string') {
    const parsedProgress = parseFloat(responseData.progress)
    if (!isNaN(parsedProgress)) {
      if (parsedProgress <= 1) {
        currentProgress2 = Math.round(parsedProgress * 100)
      } else {
        currentProgress2 = Math.round(parsedProgress)
      }
      console.log('字符串类型进度转换:', responseData.progress, '->', parsedProgress, '->', currentProgress2)
    }
  }
}

console.log('最终计算进度:', currentProgress2, '%')

console.log('\n✅ 调试完成') 