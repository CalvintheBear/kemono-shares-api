// 测试画廊筛选逻辑
const testGalleryFilter = () => {
  console.log('🧪 测试画廊筛选逻辑...')
  
  // 模拟不同类型的分享数据
  const testShares = [
    // 文生图 - 应该显示在画廊中
    {
      id: 'share_1',
      style: 'ジブリ風',
      originalUrl: null,
      generatedUrl: 'https://example.com/generated1.jpg'
    },
    {
      id: 'share_2', 
      style: 'VTuber',
      originalUrl: '',
      generatedUrl: 'https://example.com/generated2.jpg'
    },
    {
      id: 'share_3',
      style: 'ウマ娘',
      originalUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
      generatedUrl: 'https://example.com/generated3.jpg'
    },
    {
      id: 'share_4',
      style: 'カスタム',
      originalUrl: 'https://placeholder.com/image.jpg',
      generatedUrl: 'https://example.com/generated4.jpg'
    },
    
    // 图生图 - 不应该显示在画廊中
    {
      id: 'share_5',
      style: 'ジブリ風',
      originalUrl: 'https://example.com/original1.jpg',
      generatedUrl: 'https://example.com/generated5.jpg'
    },
    {
      id: 'share_6',
      style: 'VTuber', 
      originalUrl: 'https://tempfile.aiquickdraw.com/image.jpg',
      generatedUrl: 'https://example.com/generated6.jpg'
    },
    
    // 模板模式 - 不应该显示在画廊中
    {
      id: 'share_7',
      style: 'ジブリ風',
      originalUrl: 'https://example.com/template-before.jpg',
      generatedUrl: 'https://example.com/generated7.jpg'
    }
  ]
  
  // 应用筛选逻辑
  const textToImageShares = testShares.filter(share => {
    // 更严格的筛选：任何有originalUrl的都应该被排除
    const hasValidOriginalUrl = share.originalUrl && 
      typeof share.originalUrl === 'string' && 
      share.originalUrl.trim() !== '' &&
      !share.originalUrl.startsWith('data:image/') &&
      !share.originalUrl.includes('placeholder.com') &&
      !share.originalUrl.includes('Text+to+Image') &&
      !share.originalUrl.includes('base64') &&
      share.originalUrl.length <= 1000
    
    // 只有完全没有originalUrl或originalUrl无效的才显示在画廊中
    const isTextToImage = !hasValidOriginalUrl
    
    console.log(`🔍 筛选检查 - ID: ${share.id}, Style: ${share.style}, OriginalUrl: ${share.originalUrl}, IsTextToImage: ${isTextToImage}`)
    
    return isTextToImage
  })
  
  console.log('\n📊 筛选结果:')
  console.log(`总共 ${testShares.length} 个分享`)
  console.log(`文生图 ${textToImageShares.length} 个（画廊显示）`)
  console.log(`图生图/模板 ${testShares.length - textToImageShares.length} 个（画廊隐藏）`)
  
  console.log('\n✅ 画廊中显示的分享:')
  textToImageShares.forEach(share => {
    console.log(`  - ${share.id}: ${share.style}`)
  })
  
  console.log('\n❌ 画廊中隐藏的分享:')
  testShares.filter(share => !textToImageShares.includes(share)).forEach(share => {
    console.log(`  - ${share.id}: ${share.style} (原因: 有originalUrl)`)
  })
  
  // 验证结果
  const expectedTextToImage = ['share_1', 'share_2', 'share_3', 'share_4']
  const actualTextToImage = textToImageShares.map(s => s.id)
  
  console.log('\n🎯 验证结果:')
  console.log('期望的文生图:', expectedTextToImage)
  console.log('实际的文生图:', actualTextToImage)
  
  const isCorrect = expectedTextToImage.every(id => actualTextToImage.includes(id)) &&
                   actualTextToImage.every(id => expectedTextToImage.includes(id))
  
  console.log(`\n${isCorrect ? '✅ 筛选逻辑正确' : '❌ 筛选逻辑有问题'}`)
  
  return isCorrect
}

// 运行测试
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.testGalleryFilter = testGalleryFilter
  console.log('🧪 测试函数已加载，运行 window.testGalleryFilter() 来测试')
} else {
  // Node.js 环境
  testGalleryFilter()
} 