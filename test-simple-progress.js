// 简单测试进度条问题
console.log('🔍 简单测试进度条问题...')

// 模拟状态
let generationProgress = null
let generationStatusText = ''

// 模拟setState函数
function setGenerationProgress(value) {
  console.log('📊 setGenerationProgress:', value)
  generationProgress = value
}

function setGenerationStatusText(value) {
  console.log('📝 setGenerationStatusText:', value)
  generationStatusText = value
}

// 测试重置按钮
console.log('\n🧪 测试重置按钮:')
console.log('重置前:', { generationProgress, generationStatusText })

setGenerationProgress(0)
setGenerationStatusText('リセット完了')

console.log('重置后:', { generationProgress, generationStatusText })

// 测试渲染条件
const shouldRender = generationProgress !== null && generationProgress >= 0
console.log('渲染条件:', shouldRender)

// 测试进度更新
console.log('\n🧪 测试进度更新:')
setGenerationProgress(50)
setGenerationStatusText('処理中... 50%')

console.log('更新后:', { generationProgress, generationStatusText })

// 再次测试渲染条件
const shouldRender2 = generationProgress !== null && generationProgress >= 0
console.log('更新后渲染条件:', shouldRender2)

console.log('\n✅ 测试完成') 