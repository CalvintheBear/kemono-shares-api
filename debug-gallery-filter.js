// 调试画廊筛选问题
const debugGalleryFilter = async () => {
  console.log('🔍 开始调试画廊筛选问题...')
  
  try {
    // 1. 直接调用API获取原始数据
    console.log('📡 获取原始分享列表数据...')
    const response = await fetch('/api/share/list?limit=50&offset=0')
    const result = await response.json()
    
    if (!result.success) {
      console.error('❌ API请求失败:', result.error)
      return
    }
    
    console.log('📊 API返回数据:', {
      total: result.data.total,
      items: result.data.items.length,
      hasMore: result.data.hasMore
    })
    
    // 2. 分析每个分享项
    console.log('\n🔍 分析分享项:')
    result.data.items.forEach((item, index) => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com') &&
        !item.originalUrl.includes('Text+to+Image') &&
        !item.originalUrl.includes('base64') &&
        item.originalUrl.length <= 1000
      
      console.log(`${index + 1}. ID: ${item.id}`)
      console.log(`   Style: ${item.style}`)
      console.log(`   OriginalUrl: ${item.originalUrl || 'null'}`)
      console.log(`   HasValidOriginalUrl: ${hasOriginalUrl}`)
      console.log(`   ShouldShowInGallery: ${!hasOriginalUrl}`)
      console.log('')
    })
    
    // 3. 统计结果
    const textToImageCount = result.data.items.filter(item => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com') &&
        !item.originalUrl.includes('Text+to+Image') &&
        !item.originalUrl.includes('base64') &&
        item.originalUrl.length <= 1000
      return !hasOriginalUrl
    }).length
    
    const imageToImageCount = result.data.items.length - textToImageCount
    
    console.log('📈 统计结果:')
    console.log(`总分享数: ${result.data.items.length}`)
    console.log(`文生图(画廊显示): ${textToImageCount}`)
    console.log(`图生图(画廊隐藏): ${imageToImageCount}`)
    
    // 4. 检查是否有图生图显示在画廊中
    const imageToImageItems = result.data.items.filter(item => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com') &&
        !item.originalUrl.includes('Text+to+Image') &&
        !item.originalUrl.includes('base64') &&
        item.originalUrl.length <= 1000
      return hasOriginalUrl
    })
    
    if (imageToImageItems.length > 0) {
      console.log('\n⚠️ 发现问题：以下图生图项目仍然显示在画廊中:')
      imageToImageItems.forEach(item => {
        console.log(`  - ${item.id}: ${item.style} (OriginalUrl: ${item.originalUrl})`)
      })
    } else {
      console.log('\n✅ 筛选逻辑工作正常，没有图生图显示在画廊中')
    }
    
    // 5. 检查缓存状态
    console.log('\n🗄️ 检查缓存状态...')
    try {
      const cacheResponse = await fetch('/api/share/list?limit=20&offset=0&debug=cache')
      const cacheResult = await cacheResponse.json()
      console.log('缓存信息:', cacheResult)
    } catch (error) {
      console.log('无法获取缓存信息:', error.message)
    }
    
  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error)
  }
}

// 清除缓存并重新测试
const clearCacheAndTest = async () => {
  console.log('🧹 清除缓存并重新测试...')
  
  try {
    // 清除缓存
    await fetch('/api/share/list?clearCache=true')
    console.log('✅ 缓存已清除')
    
    // 等待一秒
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重新测试
    await debugGalleryFilter()
  } catch (error) {
    console.error('❌ 清除缓存失败:', error)
  }
}

// 在浏览器环境中使用
if (typeof window !== 'undefined') {
  window.debugGalleryFilter = debugGalleryFilter
  window.clearCacheAndTest = clearCacheAndTest
  console.log('🔍 调试函数已加载:')
  console.log('  - window.debugGalleryFilter() - 调试画廊筛选')
  console.log('  - window.clearCacheAndTest() - 清除缓存并测试')
} 