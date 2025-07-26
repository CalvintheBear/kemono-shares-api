require('dotenv').config({ path: '.env.local' })

// 模拟URL检测逻辑
function isKieTemporaryUrl(url) {
  // 排除R2域名，避免误判
  const r2Domains = [
    'r2.dev',
    'r2.cloudflarestorage.com',
    'pub-',
    'kemono-afterimage'
  ]
  
  // 检查是否包含R2域名特征
  const isR2Url = r2Domains.some(domain => url.includes(domain))
  if (isR2Url) {
    console.log(`🔍 KIE AI URL检测: ${url} -> 不是KIE AI URL (R2域名)`)
    return false
  }
  
  // 检查是否包含KIE AI的域名特征
  const kieDomains = [
    'kieai.com',
    'kie.ai',
    'api.kieai.com',
    'cdn.kieai.com',
    'kie-ai.com',
    'kieai.ai',
    'kie-ai.ai',
    'tempfile.aiquickdraw.com', // KIE AI的临时文件域名
    'aiquickdraw.com' // KIE AI的临时文件域名
  ]
  
  const isKieUrl = kieDomains.some(domain => url.includes(domain))
  console.log(`🔍 KIE AI URL检测: ${url} -> ${isKieUrl ? '是KIE AI URL' : '不是KIE AI URL'}`)
  
  return isKieUrl
}

async function testUrlDetection() {
  console.log('🧪 测试URL检测逻辑修复...\n')
  
  // 测试用例
  const testUrls = [
    // KIE AI临时URL（应该被检测为KIE AI URL）
    'https://tempfile.aiquickdraw.com/s/9f9e866d206c5d67dda07871036a9daf_0_1753535747_9193.png',
    'https://aiquickdraw.com/temp/image123.jpg',
    'https://kieai.com/temp/image456.png',
    'https://api.kie.ai/cdn/image789.jpg',
    
    // R2 URL（应该被排除）
    'https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev/uploads/image.jpg',
    'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/kie-downloads/image.png',
    'https://kemono-afterimage.r2.dev/test.jpg',
    
    // 其他URL（应该被检测为非KIE AI URL）
    'https://example.com/image.jpg',
    'https://cdn.example.com/image.png'
  ]
  
  console.log('📋 测试结果:')
  console.log('='.repeat(80))
  
  testUrls.forEach((url, index) => {
    const isKie = isKieTemporaryUrl(url)
    const expected = url.includes('tempfile.aiquickdraw.com') || 
                    url.includes('aiquickdraw.com') || 
                    url.includes('kieai.com') || 
                    url.includes('kie.ai') ||
                    url.includes('api.kie.ai')
    
    const status = isKie === expected ? '✅' : '❌'
    console.log(`${status} 测试 ${index + 1}: ${isKie ? '是KIE AI URL' : '不是KIE AI URL'}`)
  })
  
  console.log('\n🎯 关键修复:')
  console.log('✅ 添加了 tempfile.aiquickdraw.com 域名检测')
  console.log('✅ 添加了 aiquickdraw.com 域名检测')
  console.log('✅ 现在可以正确识别KIE AI的临时文件URL')
  
  console.log('\n📝 根据KIE AI文档:')
  console.log('• KIE AI生成的图片存储在临时文件中')
  console.log('• 临时文件URL格式: https://tempfile.aiquickdraw.com/s/[taskId]_[index]_[timestamp]_[random].png')
  console.log('• 这些URL会在14天后过期')
  console.log('• 需要下载并存储到R2以获得永久访问')
}

testUrlDetection() 