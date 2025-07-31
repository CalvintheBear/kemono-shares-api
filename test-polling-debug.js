// 测试轮询API响应格式
const fetch = require('node-fetch')

async function testPollingAPI() {
  console.log('🧪 测试轮询API响应格式...')
  
  // 使用已知的taskId进行测试
  const taskId = 'test-task-id' // 替换为实际的任务ID
  
  try {
    const response = await fetch(`http://localhost:3000/api/image-details?taskId=${taskId}`)
    const data = await response.json()
    
    console.log('📊 API响应结构:', {
      rawResponse: data,
      dataField: data.data,
      statusField: data.status,
      progressField: data.progress,
      responseField: data.response
    })
    
    // 检查可能的进度字段
    const responseData = data.data || data
    console.log('🔍 进度字段分析:', {
      progress: responseData.progress,
      status: responseData.status,
      resultUrls: responseData.response?.resultUrls,
      resultUrl: responseData.response?.resultUrl
    })
    
    // 测试不同的进度值格式
    const testProgressValues = [
      0.25, // 25%
      0.5,  // 50%
      0.75, // 75%
      25,   // 25 (整数)
      50,   // 50 (整数)
      75    // 75 (整数)
    ]
    
    testProgressValues.forEach(val => {
      let currentProgress = 0
      if (typeof val === 'number') {
        if (val <= 1) {
          currentProgress = Math.round(val * 100)
        } else {
          currentProgress = Math.round(val)
        }
      }
      console.log(`📈 进度值 ${val} -> ${currentProgress}%`)
    })
    
  } catch (error) {
    console.error('❌ 轮询API测试失败:', error.message)
  }
}

// 测试实际的生成流程
async function testActualGeneration() {
  console.log('\n🧪 测试实际生成流程...')
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: '可愛い猫耳少女',
        size: '1:1'
      })
    })
    
    const data = await response.json()
    console.log('📊 生成API响应:', data)
    
    if (data.taskId) {
      console.log('✅ 获得taskId:', data.taskId)
      
      // 开始轮询测试
      await pollTest(data.taskId)
    }
    
  } catch (error) {
    console.error('❌ 生成API测试失败:', error.message)
  }
}

async function pollTest(taskId) {
  console.log('\n🧪 开始轮询测试...')
  
  const startTime = Date.now()
  const maxDuration = 30000 // 30秒
  
  const poll = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/image-details?taskId=${taskId}`)
      const data = await response.json()
      
      console.log('📊 轮询响应:', {
        taskId,
        data: data.data || data,
        timestamp: new Date().toISOString()
      })
      
      const responseData = data.data || data
      const status = responseData.status || 'GENERATING'
      const progress = responseData.progress || 0
      
      console.log(`📈 状态: ${status}, 进度: ${progress}`)
      
      if (status === 'SUCCESS' || status === 'FAILED') {
        console.log('✅ 轮询完成:', status)
        return
      }
      
      if (Date.now() - startTime < maxDuration) {
        setTimeout(poll, 2000)
      } else {
        console.log('⏰ 轮询超时')
      }
      
    } catch (error) {
      console.error('❌ 轮询错误:', error.message)
    }
  }
  
  poll()
}

// 运行测试
if (require.main === module) {
  testPollingAPI()
  // testActualGeneration()
}

module.exports = { testPollingAPI, testActualGeneration }