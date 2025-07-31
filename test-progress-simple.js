// 简化的进度更新测试
console.log('Testing progress update logic...')

// 模拟API响应数据
const mockResponses = [
  { progress: '0.1', status: 'GENERATING' },
  { progress: '0.5', status: 'GENERATING' },
  { progress: 0.75, status: 'GENERATING' },
  { progress: 50, status: 'GENERATING' },
  { progress: null, status: 'GENERATING' },
  { progress: 'invalid', status: 'GENERATING' }
]

// 进度解析逻辑
function parseProgress(apiProgress, startTime = Date.now()) {
  console.log('Parsing progress:', apiProgress, 'type:', typeof apiProgress)
  
  let currentProgress = 0
  
  // 尝试使用API返回的进度数据
  if (apiProgress !== undefined && apiProgress !== null) {
    if (typeof apiProgress === 'number') {
      if (apiProgress <= 1) {
        currentProgress = Math.round(apiProgress * 100)
      } else {
        currentProgress = Math.round(apiProgress)
      }
      console.log('Number progress conversion:', apiProgress, '->', currentProgress)
    } else if (typeof apiProgress === 'string') {
      const parsedProgress = parseFloat(apiProgress)
      if (!isNaN(parsedProgress)) {
        if (parsedProgress <= 1) {
          currentProgress = Math.round(parsedProgress * 100)
        } else {
          currentProgress = Math.round(parsedProgress)
        }
        console.log('String progress conversion:', apiProgress, '->', parsedProgress, '->', currentProgress)
      } else {
        console.log('String progress parsing failed, using estimated progress')
      }
    }
  }
  
  // 如果没有有效进度数据，使用时间估算
  if (currentProgress === 0) {
    console.log('No valid API progress data, using time-based estimation')
    const elapsedTime = Date.now() - startTime
    const estimatedTotalTime = 120000 // 2 minutes
    currentProgress = Math.min(Math.round((elapsedTime / estimatedTotalTime) * 90), 90)
  }
  
  // 确保进度在合理范围内
  currentProgress = Math.max(1, Math.min(currentProgress, 99))
  
  console.log('Final calculated progress:', currentProgress, '%')
  return currentProgress
}

// 测试每个响应
console.log('\n=== Testing various progress formats ===\n')
mockResponses.forEach((response, index) => {
  console.log(`\nTest response ${index + 1}:`, response)
  const progress = parseProgress(response.progress)
  console.log(`Final progress: ${progress}%`)
  console.log('-'.repeat(50))
})

// 测试时间估算
console.log('\n=== Testing time-based estimation ===\n')
const testStartTime = Date.now() - 30000 // 30 seconds ago
console.log('Simulating task started 30 seconds ago')
const timeBasedProgress = parseProgress(null, testStartTime)
console.log(`Time-based estimated progress: ${timeBasedProgress}%`)

console.log('\nTest completed') 