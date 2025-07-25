// 测试文生图模式的API调用
const testTextToImage = async () => {
  console.log('🧪 测试文生图模式...')
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '可愛い猫耳少女、ピンクの髪、笑顔、背景に桜、アニメ風',
        enhancePrompt: true,
        size: '1:1'
        // 注意：没有传递 fileUrl 参数，这是文生图模式
      })
    })

    console.log('📡 响应状态:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ API错误:', errorData)
      return
    }

    const data = await response.json()
    console.log('✅ 文生图成功:', {
      success: data.success,
      url: data.url,
      urls: data.urls,
      taskId: data.taskId,
      generation_count: data.generation_count
    })
    
  } catch (error) {
    console.error('💥 测试失败:', error)
  }
}

// 如果直接运行此文件
if (typeof window === 'undefined') {
  testTextToImage()
}

module.exports = { testTextToImage } 