import fs from 'fs'

// 创建一个简单的测试图片（1x1像素的红色PNG）
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

async function testUpload() {
  console.log('🧪 测试上传功能...')
  
  // 将base64转换为Buffer，然后创建FormData
  const buffer = Buffer.from(testImageBase64, 'base64')
  
  // Node.js环境下创建File对象
  const file = new File([buffer], 'test.png', { type: 'image/png' })
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ 上传成功!')
      console.log('📸 文件URL:', result.fileUrl)
      console.log('📊 文件信息:', {
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType
      })
      
      // 测试生成功能
      if (result.fileUrl.startsWith('https://i.ibb.co/')) {
        console.log('\n🎨 测试图片生成...')
        await testGenerate(result.fileUrl)
      } else {
        console.log('⚠️ 警告: 文件URL不是ImgBB链接，跳过生成测试')
      }
    } else {
      console.error('❌ 上传失败:', result)
    }
  } catch (error) {
    console.error('💥 上传请求错误:', error.message)
  }
}

async function testGenerate(fileUrl) {
  try {
    const response = await fetch('http://localhost:3000/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileUrl: fileUrl,
        prompt: '测试图片生成',
        ratio: '1:1',
        generation_count: 1,
        enhance_prompt: false
      })
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ 生成请求成功!')
      console.log('🎯 任务ID:', result.taskId)
      console.log('🖼️ 生成的图片URL:', result.url || result.urls)
    } else {
      console.error('❌ 生成失败:', result)
      if (result.error?.includes('401')) {
        console.log('💡 提示: 检查Kie.ai控制台的4o-image权限和白名单设置')
      }
    }
  } catch (error) {
    console.error('💥 生成请求错误:', error.message)
  }
}

// 运行测试
testUpload() 