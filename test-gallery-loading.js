// 测试画廊加载情况的脚本
console.log('🧪 开始测试画廊加载情况...')

// 1. 检查API数据
async function testAPIData() {
  console.log('\n📊 测试API数据...')
  try {
    const response = await fetch('/api/share/list?limit=10&offset=0')
    const data = await response.json()
    console.log('✅ API响应:', {
      items: data.items?.length || 0,
      total: data.total || 0,
      hasMore: data.hasMore || false
    })
    return data
  } catch (error) {
    console.error('❌ API请求失败:', error)
    return null
  }
}

// 2. 检查DOM中的图片元素
function checkGalleryImages() {
  console.log('\n🖼️ 检查DOM中的图片元素...')
  
  // 检查画廊容器
  const galleryContainer = document.querySelector('[class*="grid"]') || 
                          document.querySelector('[class*="columns"]')
  console.log('📦 画廊容器:', galleryContainer ? '找到' : '未找到')
  
  // 检查图片项
  const imageItems = document.querySelectorAll('[class*="relative overflow-hidden"]')
  console.log('🖼️ 图片项数量:', imageItems.length)
  
  // 检查LazyImage组件
  const lazyImages = document.querySelectorAll('img[loading="lazy"]')
  console.log('😴 懒加载图片数量:', lazyImages.length)
  
  // 检查已加载的图片
  const loadedImages = document.querySelectorAll('img[src]')
  console.log('✅ 已加载图片数量:', loadedImages.length)
  
  // 检查图片URL
  const imageUrls = Array.from(loadedImages).map(img => img.src)
  console.log('🔗 图片URL列表:', imageUrls.slice(0, 5)) // 只显示前5个
  
  return {
    container: galleryContainer,
    items: imageItems.length,
    lazyImages: lazyImages.length,
    loadedImages: loadedImages.length,
    urls: imageUrls
  }
}

// 3. 检查CSS布局
function checkLayout() {
  console.log('\n🎨 检查CSS布局...')
  
  const galleryContainer = document.querySelector('[class*="grid"]') || 
                          document.querySelector('[class*="columns"]')
  
  if (galleryContainer) {
    const styles = window.getComputedStyle(galleryContainer)
    console.log('📐 布局样式:', {
      display: styles.display,
      gridTemplateColumns: styles.gridTemplateColumns,
      columnCount: styles.columnCount,
      gap: styles.gap
    })
  }
  
  // 检查图片容器的最小高度
  const imageContainers = document.querySelectorAll('[class*="relative overflow-hidden"]')
  if (imageContainers.length > 0) {
    const firstContainer = imageContainers[0]
    const styles = window.getComputedStyle(firstContainer)
    console.log('📏 图片容器样式:', {
      minHeight: styles.minHeight,
      height: styles.height,
      display: styles.display
    })
  }
}

// 4. 检查滚动和无限加载
function checkInfiniteScroll() {
  console.log('\n🔄 检查无限滚动...')
  
  // 检查是否有加载指示器
  const loadingIndicator = document.querySelector('[class*="loading"]') || 
                          document.querySelector('[class*="spinner"]')
  console.log('⏳ 加载指示器:', loadingIndicator ? '找到' : '未找到')
  
  // 检查是否有"加载更多"按钮或区域
  const loadMoreArea = document.querySelector('[class*="load-more"]') || 
                      document.querySelector('[class*="intersection"]')
  console.log('📄 加载更多区域:', loadMoreArea ? '找到' : '未找到')
  
  // 检查页面高度
  const pageHeight = document.documentElement.scrollHeight
  const viewportHeight = window.innerHeight
  console.log('📏 页面尺寸:', {
    pageHeight,
    viewportHeight,
    hasScroll: pageHeight > viewportHeight
  })
}

// 5. 模拟滚动测试
function simulateScroll() {
  console.log('\n🖱️ 模拟滚动测试...')
  
  // 滚动到页面底部
  window.scrollTo(0, document.body.scrollHeight)
  
  // 等待一段时间后检查是否有新内容加载
  setTimeout(() => {
    const newImageItems = document.querySelectorAll('[class*="relative overflow-hidden"]')
    console.log('🆕 滚动后图片项数量:', newImageItems.length)
    
    // 检查是否有新的图片加载
    const newImages = document.querySelectorAll('img[src]')
    console.log('🆕 滚动后已加载图片数量:', newImages.length)
  }, 2000)
}

// 6. 主测试函数
async function runGalleryTest() {
  console.log('🚀 开始画廊加载测试...')
  
  // 等待页面完全加载
  if (document.readyState !== 'complete') {
    await new Promise(resolve => {
      window.addEventListener('load', resolve)
    })
  }
  
  // 等待一段时间让React组件渲染完成
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 执行各项测试
  await testAPIData()
  const imageData = checkGalleryImages()
  checkLayout()
  checkInfiniteScroll()
  
  // 如果图片数量少于预期，进行滚动测试
  if (imageData.items < 20) {
    console.log('\n⚠️ 图片数量少于预期，进行滚动测试...')
    simulateScroll()
  }
  
  console.log('\n✅ 测试完成！')
  console.log('📋 测试总结:', {
    'API数据': '已检查',
    'DOM图片': imageData.items,
    '懒加载': imageData.lazyImages,
    '已加载': imageData.loadedImages,
    '布局': '已检查',
    '无限滚动': '已检查'
  })
}

// 7. 自动运行测试
if (typeof window !== 'undefined') {
  // 在浏览器环境中自动运行
  runGalleryTest()
} else {
  // 在Node.js环境中导出函数
  module.exports = {
    runGalleryTest,
    testAPIData,
    checkGalleryImages,
    checkLayout,
    checkInfiniteScroll,
    simulateScroll
  }
}

// 8. 提供手动测试函数
window.testGalleryLoading = runGalleryTest
console.log('💡 可以在控制台运行 testGalleryLoading() 来手动测试') 