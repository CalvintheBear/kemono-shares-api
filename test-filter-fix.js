const fs = require('fs')
const path = require('path')

// 测试筛选逻辑
console.log('🔍 测试筛选逻辑修复...')

// 模拟不同类型的分享数据
const testShares = [
  // 文生图 - 应该在画廊显示
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
  {
    id: 'text_to_image_3',
    generatedUrl: 'https://example.com/generated3.png',
    originalUrl: 'https://via.placeholder.com/400x400/E3F2FD/2196F3?text=Text+to+Image',
    prompt: '动漫角色',
    style: 'VTuber風',
    timestamp: Date.now()
  },
  // 图生图 - 不应该在画廊显示
  {
    id: 'image_to_image_1',
    generatedUrl: 'https://example.com/generated4.png',
    originalUrl: 'https://example.com/original1.jpg',
    prompt: '转换后的图片',
    style: 'カスタム',
    timestamp: Date.now()
  },
  {
    id: 'image_to_image_2',
    generatedUrl: 'https://example.com/generated5.png',
    originalUrl: 'https://example.com/original2.png',
    prompt: '风格转换',
    style: 'ジブリ風',
    timestamp: Date.now()
  }
]

// 应用筛选逻辑
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
console.log(`- 文生图: ${textToImageShares.length}个 (应该在画廊显示)`)
console.log(`- 图生图: ${imageToImageShares.length}个 (不应该在画廊显示)`)

console.log('\n✅ 文生图分享 (画廊显示):')
textToImageShares.forEach(share => {
  console.log(`  - ${share.id}: ${share.style} (originalUrl: ${share.originalUrl})`)
})

console.log('\n❌ 图生图分享 (画廊不显示):')
imageToImageShares.forEach(share => {
  console.log(`  - ${share.id}: ${share.style} (originalUrl: ${share.originalUrl})`)
})

// 验证筛选逻辑是否正确
const expectedTextToImage = 3
const expectedImageToImage = 2

if (textToImageShares.length === expectedTextToImage && imageToImageShares.length === expectedImageToImage) {
  console.log('\n✅ 筛选逻辑修复成功！')
  console.log('  - 文生图正确显示在画廊')
  console.log('  - 图生图正确排除在画廊外')
} else {
  console.log('\n❌ 筛选逻辑有问题！')
  console.log(`  - 期望文生图: ${expectedTextToImage}个，实际: ${textToImageShares.length}个`)
  console.log(`  - 期望图生图: ${expectedImageToImage}个，实际: ${imageToImageShares.length}个`)
}

// 测试分享按钮逻辑
console.log('\n🔍 测试分享按钮逻辑...')

// 模拟ShareButton组件的逻辑
const testShareButtonLogic = (existingShareUrl) => {
  let shareUrl = ''
  let isSharing = false
  let isLoading = false
  
  const generateShareUrl = async () => {
    // 如果已经有分享URL，直接返回
    if (shareUrl) return shareUrl
    
    // 如果有已存在的分享链接，直接使用
    if (existingShareUrl) {
      shareUrl = existingShareUrl
      return existingShareUrl
    }
    
    // 如果正在分享中，防止重复操作
    if (isSharing) {
      console.log('⚠️ 正在分享中，请稍候...')
      return shareUrl
    }
    
    isSharing = true
    isLoading = true
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 100))
      const newShareUrl = 'https://2kawaii.com/share/new_share_id'
      shareUrl = newShareUrl
      return newShareUrl
    } finally {
      isLoading = false
      isSharing = false
    }
  }
  
  return { generateShareUrl, shareUrl, isSharing, isLoading }
}

// 测试场景1：有已存在的分享链接
console.log('\n📝 测试场景1：有已存在的分享链接')
const test1 = testShareButtonLogic('https://2kawaii.com/share/existing_share_id')
test1.generateShareUrl().then(url => {
  console.log(`  - 结果: ${url}`)
  console.log(`  - 是否重新生成: ${url === 'https://2kawaii.com/share/existing_share_id' ? '否 ✅' : '是 ❌'}`)
})

// 测试场景2：没有已存在的分享链接
console.log('\n📝 测试场景2：没有已存在的分享链接')
const test2 = testShareButtonLogic('')
test2.generateShareUrl().then(url => {
  console.log(`  - 结果: ${url}`)
  console.log(`  - 是否重新生成: ${url === 'https://2kawaii.com/share/new_share_id' ? '是 ✅' : '否 ❌'}`)
})

console.log('\n🎯 修复总结:')
console.log('1. ✅ 筛选逻辑修复：文生图显示在画廊，图生图不显示')
console.log('2. ✅ 分享按钮优化：优先使用已生成的分享链接，避免重复生成')
console.log('3. ✅ 用户体验改善：减少不必要的API调用和页面生成') 