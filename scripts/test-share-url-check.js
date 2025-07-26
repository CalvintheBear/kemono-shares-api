require('dotenv').config({ path: '.env.local' })

async function checkShareUrl() {
  const shareId = 'share_1753537157696_vsruzmbmh' // 从日志中获取的shareId
  
  try {
    console.log('🔍 检查share页面URL...')
    console.log(`📋 Share ID: ${shareId}`)
    
    const response = await fetch(`http://localhost:3000/api/share?id=${shareId}`)
    const data = await response.json()
    
    if (data.success) {
      const shareData = data.data
      console.log('\n📊 Share数据:')
      console.log(`- 图片URL: ${shareData.generatedUrl}`)
      console.log(`- 是否R2存储: ${shareData.isR2Stored}`)
      console.log(`- 样式: ${shareData.style}`)
      console.log(`- 时间戳: ${shareData.timestamp}`)
      
      // 判断URL类型
      const isR2Url = shareData.generatedUrl.includes('pub-d00e7b41917848d1a8403c984cb62880.r2.dev')
      const isKieUrl = shareData.generatedUrl.includes('tempfile.aiquickdraw.com') || 
                      shareData.generatedUrl.includes('aiquickdraw.com')
      
      console.log('\n🔍 URL分析:')
      console.log(`- 是R2 URL: ${isR2Url ? '✅ 是' : '❌ 否'}`)
      console.log(`- 是KIE URL: ${isKieUrl ? '❌ 是' : '✅ 否'}`)
      
      if (isR2Url && !isKieUrl) {
        console.log('\n🎉 成功！Share页面使用的是R2永久URL！')
      } else if (isKieUrl) {
        console.log('\n⚠️ 警告！Share页面仍在使用KIE临时URL！')
      } else {
        console.log('\n❓ 未知URL类型')
      }
      
      // 测试图片是否可访问
      console.log('\n🌐 测试图片可访问性...')
      try {
        const imgResponse = await fetch(shareData.generatedUrl)
        if (imgResponse.ok) {
          console.log('✅ 图片可以正常访问')
        } else {
          console.log(`❌ 图片访问失败: ${imgResponse.status}`)
        }
      } catch (imgError) {
        console.log(`❌ 图片访问出错: ${imgError.message}`)
      }
      
    } else {
      console.log('❌ 获取share数据失败:', data.error)
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message)
  }
}

// 运行检查
checkShareUrl() 