// 测试分享API功能
const testShareAPI = async () => {
  console.log('🧪 开始测试分享API...')

  // 测试数据
  const testData = {
    generatedUrl: 'https://example.com/generated-image.jpg',
    originalUrl: 'https://example.com/original-image.jpg',
    prompt: 'テスト用のプロンプト',
    style: 'テストスタイル',
    timestamp: Date.now()
  }

  try {
    // 测试创建分享
    console.log('📤 创建分享...')
    const createResponse = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const createResult = await createResponse.json()
    console.log('创建结果:', createResult)

    if (createResult.success) {
      console.log('✅ 分享创建成功')
      console.log('分享ID:', createResult.shareId)
      console.log('分享URL:', createResult.shareUrl)

      // 测试获取分享数据
      console.log('📥 获取分享数据...')
      const getResponse = await fetch(`http://localhost:3000/api/share?id=${createResult.shareId}`)
      const getResult = await getResponse.json()
      console.log('获取结果:', getResult)

      if (getResult.success) {
        console.log('✅ 分享数据获取成功')
        console.log('分享数据:', getResult.data)
      } else {
        console.log('❌ 分享数据获取失败:', getResult.error)
      }
    } else {
      console.log('❌ 分享创建失败:', createResult.error)
    }
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  testShareAPI()
}

module.exports = { testShareAPI } 