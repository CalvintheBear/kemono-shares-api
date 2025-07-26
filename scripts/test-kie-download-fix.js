// 使用Node.js内置fetch
require('dotenv').config({ path: '.env.local' })

async function testKieDownloadLogic() {
  console.log('🧪 测试KIE图片下载逻辑修复...')
  
  // 检查环境变量
  const kieApiKey = process.env.KIE_AI_API_KEY
  console.log('🔑 KIE_AI_API_KEY:', kieApiKey ? '✅ 已配置' : '❌ 未配置')
  
  if (!kieApiKey) {
    console.error('❌ 请先配置 KIE_AI_API_KEY 环境变量')
    return
  }
  
  // 模拟KIE AI图片URL
  const mockKieUrl = 'https://kieai.com/temp/image123.jpg'
  
  try {
    console.log('🌐 测试KIE直链API调用...')
    
    const apiUrl = 'https://api.kie.ai/api/v1/gpt4o-image/download-url'
    const body = { url: mockKieUrl }
    
    console.log('📤 请求数据:', body)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kieApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    console.log('📡 响应状态:', response.status)
    
    if (!response.ok) {
      const text = await response.text()
      console.error('❌ API请求失败:', text)
      return
    }
    
    const data = await response.json()
    console.log('📊 响应数据:', JSON.stringify(data, null, 2))
    
    if (data.code === 200 && data.data) {
      console.log('✅ KIE直链获取成功:', data.data)
    } else {
      console.error('❌ KIE直链获取失败:', data)
    }
    
  } catch (error) {
    console.error('💥 测试失败:', error.message)
  }
}

// 运行测试
testKieDownloadLogic() 