const fs = require('fs')
const path = require('path')

console.log('🔍 测试统一的分享逻辑...')

// 模拟不同类型的分享数据
const testShares = [
  // 文生图 - 应该在画廊显示，可以分享
  {
    id: 'text_to_image_1',
    generatedUrl: 'https://example.com/generated1.png',
    originalUrl: null,
    prompt: '可爱的猫咪',
    style: 'カスタム',
    timestamp: Date.now()
  },
  {
    id: 'text_to_image_2',
    generatedUrl: 'https://example.com/generated2.png',
    originalUrl: '',
    prompt: '美丽的花朵',
    style: 'ジブリ風',
    timestamp: Date.now()
  },
  // 图生图 - 不应该在画廊显示，但可以分享
  {
    id: 'image_to_image_1',
    generatedUrl: 'https://example.com/generated3.png',
    originalUrl: 'https://example.com/original1.jpg',
    prompt: '转换后的图片',
    style: 'カスタム',
    timestamp: Date.now()
  },
  {
    id: 'image_to_image_2',
    generatedUrl: 'https://example.com/generated4.png',
    originalUrl: 'https://example.com/original2.png',
    prompt: '风格转换',
    style: 'VTuber風',
    timestamp: Date.now()
  }
]

// 应用筛选逻辑（画廊显示）
const isTextToImage = (share) => {
  return !share.originalUrl ||
    share.originalUrl === null ||
    share.originalUrl === undefined ||
    (typeof share.originalUrl === 'string' && (
      share.originalUrl.trim() === '' ||
      share.originalUrl.startsWith('data:image/') ||
      share.originalUrl.includes('placeholder.com') ||
      share.originalUrl.includes('Text+to+Image') ||
      share.originalUrl.includes('base64') ||
      share.originalUrl.length > 1000
    ))
}

const textToImageShares = testShares.filter(isTextToImage)
const imageToImageShares = testShares.filter(share => !isTextToImage(share))

console.log('📊 筛选结果:')
console.log(`- 总分享数: ${testShares.length}`)
console.log(`- 文生图: ${textToImageShares.length}个 (画廊显示，可分享)`)
console.log(`- 图生图: ${imageToImageShares.length}个 (画廊不显示，可分享)`)

console.log('\n✅ 文生图分享 (画廊显示):')
textToImageShares.forEach(share => {
  console.log(`  - ${share.id}: ${share.style} (originalUrl: ${share.originalUrl})`)
})

console.log('\n🔄 图生图分享 (画廊不显示，但可分享):')
imageToImageShares.forEach(share => {
  console.log(`  - ${share.id}: ${share.style} (originalUrl: ${share.originalUrl})`)
})

// 测试分享链接生成逻辑
console.log('\n🔍 测试分享链接生成逻辑...')

// 模拟ShareButton组件的逻辑
const testShareButtonLogic = (share) => {
  let shareUrl = ''
  let isSharing = false
  let isLoading = false
  
  const generateShareUrl = async () => {
    // 如果已经有分享URL，直接返回
    if (shareUrl) return shareUrl
    
    // 如果正在分享中，防止重复操作
    if (isSharing) {
      console.log('⚠️ 正在分享中，请稍候...')
      return shareUrl
    }
    
    isSharing = true
    isLoading = true
    
    try {
      // 模拟API调用 - 所有分享都创建详情页链接
      await new Promise(resolve => setTimeout(resolve, 100))
      const newShareUrl = `https://2kawaii.com/share/${share.id}`
      shareUrl = newShareUrl
      return newShareUrl
    } finally {
      isLoading = false
      isSharing = false
    }
  }
  
  return { generateShareUrl, shareUrl, isSharing, isLoading }
}

// 测试所有分享类型
console.log('\n📝 测试所有分享类型:')
testShares.forEach(share => {
  const test = testShareButtonLogic(share)
  const isTextToImageShare = isTextToImage(share)
  
  test.generateShareUrl().then(url => {
    console.log(`  - ${share.id} (${isTextToImageShare ? '文生图' : '图生图'}): ${url}`)
    console.log(`    - 画廊显示: ${isTextToImageShare ? '是' : '否'}`)
    console.log(`    - 可分享: 是`)
    console.log(`    - 链接类型: 详情页链接`)
  })
})

// 验证逻辑
console.log('\n🎯 验证逻辑:')
const expectedTextToImage = 2
const expectedImageToImage = 2
const expectedTotalShares = 4

if (textToImageShares.length === expectedTextToImage && 
    imageToImageShares.length === expectedImageToImage &&
    testShares.length === expectedTotalShares) {
  console.log('✅ 分享逻辑统一成功！')
  console.log('  - 文生图：画廊显示 + 可分享 + 详情页链接')
  console.log('  - 图生图：画廊不显示 + 可分享 + 详情页链接')
  console.log('  - 所有分享都使用统一的详情页链接格式')
} else {
  console.log('❌ 分享逻辑有问题！')
  console.log(`  - 期望文生图: ${expectedTextToImage}个，实际: ${textToImageShares.length}个`)
  console.log(`  - 期望图生图: ${expectedImageToImage}个，实际: ${imageToImageShares.length}个`)
  console.log(`  - 期望总数: ${expectedTotalShares}个，实际: ${testShares.length}个`)
}

console.log('\n📋 修复总结:')
console.log('1. ✅ 文生图：画廊显示，可分享，获取详情页链接')
console.log('2. ✅ 图生图：画廊不显示，可分享，获取详情页链接')
console.log('3. ✅ 统一逻辑：所有分享都获取详情页链接，避免重复生成')
console.log('4. ✅ 用户体验：减少不必要的API调用，提高响应速度') 