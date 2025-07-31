// 测试进度更新逻辑
console.log('🧪 开始测试进度更新逻辑...')

// 模拟API响应数据 - 包含各种可能的格式
const mockApiResponses = [
  // 测试1: 字符串格式的小数进度 (0-1)
  { progress: '0.1', status: 'GENERATING' },
  { progress: '0.25', status: 'GENERATING' },
  { progress: '0.5', status: 'GENERATING' },
  { progress: '0.75', status: 'GENERATING' },
  { progress: '1.0', status: 'SUCCESS' },
  
  // 测试2: 数字格式的小数进度 (0-1)
  { progress: 0.1, status: 'GENERATING' },
  { progress: 0.5, status: 'GENERATING' },
  { progress: 0.9, status: 'GENERATING' },
  
  // 测试3: 数字格式的百分比进度 (0-100)
  { progress: 10, status: 'GENERATING' },
  { progress: 50, status: 'GENERATING' },
  { progress: 90, status: 'GENERATING' },
  
  // 测试4: 字符串格式的百分比进度
  { progress: '10', status: 'GENERATING' },
  { progress: '50', status: 'GENERATING' },
  { progress: '90', status: 'GENERATING' },
  
  // 测试5: 无进度数据的情况
  { status: 'GENERATING' },
  { progress: null, status: 'GENERATING' },
  { progress: undefined, status: 'GENERATING' },
  
  // 测试6: 无效进度数据
  { progress: 'invalid', status: 'GENERATING' },
  { progress: NaN, status: 'GENERATING' },
  { progress: '', status: 'GENERATING' }
]

// 改进的进度解析逻辑 - 与Workspace.tsx中的逻辑保持一致
function parseProgress(apiProgress, startTime = Date.now()) {
  console.log('📊 解析进度:', apiProgress, '类型:', typeof apiProgress)
  
  let currentProgress = 0
  
  // 首先尝试使用API返回的进度数据
  if (apiProgress !== undefined && apiProgress !== null) {
    console.log('📊 检测到API进度数据:', apiProgress)
    if (typeof apiProgress === 'number') {
      // 如果进度是0-1之间的小数，转换为百分比
      if (apiProgress <= 1) {
        currentProgress = Math.round(apiProgress * 100)
      } else {
        currentProgress = Math.round(apiProgress)
      }
      console.log('📊 数字类型进度转换:', apiProgress, '->', currentProgress)
    } else if (typeof apiProgress === 'string') {
      const parsedProgress = parseFloat(apiProgress)
      if (!isNaN(parsedProgress)) {
        // 如果进度是0-1之间的小数，转换为百分比
        if (parsedProgress <= 1) {
          currentProgress = Math.round(parsedProgress * 100)
        } else {
          currentProgress = Math.round(parsedProgress)
        }
        console.log('📊 字符串类型进度转换:', apiProgress, '->', parsedProgress, '->', currentProgress)
      } else {
        console.log('📊 字符串进度解析失败，使用估算进度')
      }
    }
  }
  
  // 如果API没有提供有效的进度数据，使用基于时间的估算进度
  if (currentProgress === 0) {
    console.log('📊 未检测到有效API进度数据，使用基于时间的估算进度')
    const elapsedTime = Date.now() - startTime
    const estimatedTotalTime = 120000 // 预计2分钟完成
    currentProgress = Math.min(Math.round((elapsedTime / estimatedTotalTime) * 90), 90) // 最多90%
  }
  
  // 确保进度在合理范围内
  currentProgress = Math.max(1, Math.min(currentProgress, 99))
  
  console.log('📊 最终计算进度:', currentProgress, '%')
  return currentProgress
}

// 测试每个响应
console.log('\n=== 开始测试各种进度格式 ===\n')
mockApiResponses.forEach((response, index) => {
  console.log(`\n🔄 测试响应 ${index + 1}:`, response)
  const progress = parseProgress(response.progress)
  console.log(`🔄 最终进度: ${progress}%`)
  console.log('─'.repeat(50))
})

// 测试时间估算逻辑
console.log('\n=== 测试时间估算逻辑 ===\n')
const testStartTime = Date.now() - 30000 // 模拟30秒前开始
console.log('🕐 模拟30秒前开始的任务')
const timeBasedProgress = parseProgress(null, testStartTime)
console.log(`🕐 基于时间的估算进度: ${timeBasedProgress}%`)

console.log('\n✅ 测试完成') 