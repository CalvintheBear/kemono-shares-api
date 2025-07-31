// 测试分享功能
const fetch = require('node-fetch')

async function testShareFunction() {
  console.log('🧪 测试分享功能...')
  
  // 测试1：文生图模式分享（originalUrl应为null）
  console.log('\n📋 测试1：文生图模式分享')
  const txt2imgTest = {
    generatedUrl: 'https://example.com/generated-txt2img.png',
    originalUrl: null,
    prompt: '可愛い猫耳少女',
    style: '文生图',
    timestamp: Date.now()
  }
  
  try {
    const response1 = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txt2imgTest)
    })
    const data1 = await response1.json()
    console.log('✅ 文生图分享结果:', {
      success: data1.success,
      isTextToImage: data1.data?.isTextToImage,
      originalUrl: data1.data?.originalUrl,
      shareUrl: data1.shareUrl
    })
  } catch (error) {
    console.error('❌ 文生图分享失败:', error.message)
  }
  
  // 测试2：图生图模式分享（originalUrl应有值）
  console.log('\n📋 测试2：图生图模式分享')
  const img2imgTest = {
    generatedUrl: 'https://example.com/generated-img2img.png',
    originalUrl: 'https://example.com/original.jpg',
    prompt: 'ギブリ風美少女',
    style: 'ジブリ風',
    timestamp: Date.now()
  }
  
  try {
    const response2 = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(img2imgTest)
    })
    const data2 = await response2.json()
    console.log('✅ 图生图分享结果:', {
      success: data2.success,
      isTextToImage: data2.data?.isTextToImage,
      originalUrl: data2.data?.originalUrl,
      shareUrl: data2.shareUrl
    })
  } catch (error) {
    console.error('❌ 图生图分享失败:', error.message)
  }
  
  // 测试3：验证筛选逻辑 - 获取分享列表
  console.log('\n📋 测试3：验证筛选逻辑')
  try {
    const response3 = await fetch('http://localhost:3000/api/share/list')
    const data3 = await response3.json()
    if (data3.success) {
      const textToImageShares = data3.data.filter(item => item.isTextToImage === true)
      const imageToImageShares = data3.data.filter(item => item.isTextToImage === false && item.originalUrl)
      console.log('📊 分享数据概览:', {
        total: data3.data.length,
        textToImage: textToImageShares.length,
        imageToImage: imageToImageShares.length
      })
    }
  } catch (error) {
    console.error('❌ 获取分享列表失败:', error.message)
  }
}

// 运行测试
if (require.main === module) {
  testShareFunction().catch(console.error)
}

module.exports = { testShareFunction }