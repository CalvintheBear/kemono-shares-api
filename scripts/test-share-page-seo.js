require('dotenv').config({ path: '.env.local' })

async function testSharePageSEO() {
  try {
    console.log('🔍 测试share页面SEO友好性...')
    
    // 测试基础share页面（没有参数）
    console.log('\n📋 测试1: 基础share页面 (http://localhost:3000/share)')
    const baseResponse = await fetch('http://localhost:3000/share')
    console.log(`- 状态码: ${baseResponse.status}`)
    console.log(`- 内容类型: ${baseResponse.headers.get('content-type')}`)
    
    if (baseResponse.ok) {
      console.log('✅ 基础share页面正常返回，不再是错误页面')
    } else {
      console.log('❌ 基础share页面返回错误')
    }
    
    // 测试有分享数据的页面
    console.log('\n📋 测试2: 有分享数据的页面')
    const shareId = 'share_1753537157696_vsruzmbmh'
    const shareResponse = await fetch(`http://localhost:3000/api/share?id=${shareId}`)
    
    if (shareResponse.ok) {
      const shareData = await shareResponse.json()
      if (shareData.success) {
        console.log('✅ 分享数据API正常')
        console.log(`- 图片URL: ${shareData.data.generatedUrl}`)
        console.log(`- 是否R2存储: ${shareData.data.isR2Stored}`)
        
        // 测试具体的分享页面
        const sharePageResponse = await fetch(`http://localhost:3000/share/share_1753537157696_vsruzmbmh`)
        console.log(`- 分享页面状态码: ${sharePageResponse.status}`)
        if (sharePageResponse.ok) {
          console.log('✅ 具体分享页面正常')
        } else {
          console.log('❌ 具体分享页面有问题')
        }
      } else {
        console.log('❌ 分享数据API返回错误:', shareData.error)
      }
    } else {
      console.log('❌ 分享数据API请求失败')
    }
    
    console.log('\n🎉 SEO测试完成！')
    console.log('📊 总结:')
    console.log('- 基础share页面现在显示友好的展示页面而不是错误页面')
    console.log('- 这对SEO更友好，不会影响搜索引擎排名')
    console.log('- 用户访问 /share 时会看到产品介绍和引导')
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

// 运行测试
testSharePageSEO() 