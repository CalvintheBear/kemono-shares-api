const fs = require('fs')
const path = require('path')

// 测试本地存储数据
console.log('🔍 检查本地存储数据...')
const sharesPath = path.join(__dirname, 'local-storage', 'shares-dev.json')

if (fs.existsSync(sharesPath)) {
  const sharesData = JSON.parse(fs.readFileSync(sharesPath, 'utf8'))
  console.log('📊 本地存储数据统计:')
  console.log(`- 总分享数: ${Object.keys(sharesData).length}`)
  
  let textToImageCount = 0
  let imageToImageCount = 0
  let invalidCount = 0
  
  Object.values(sharesData).forEach(share => {
    const originalUrl = share.originalUrl
    
    // 判断是否为有效的图生图
    const isValidImageToImage = !!(originalUrl && 
      typeof originalUrl === 'string' && 
      originalUrl.trim() !== '' &&
      !originalUrl.startsWith('data:image/') &&
      !originalUrl.includes('placeholder.com') &&
      !originalUrl.includes('Text+to+Image') &&
      !originalUrl.includes('base64') &&
      originalUrl.length <= 1000)
    
    if (isValidImageToImage) {
      imageToImageCount++
    } else if (!originalUrl || originalUrl === null) {
      textToImageCount++
    } else {
      invalidCount++
    }
  })
  
  console.log(`- 文生图: ${textToImageCount}个`)
  console.log(`- 图生图: ${imageToImageCount}个`)
  console.log(`- 无效数据: ${invalidCount}个`)
  
  // 测试过滤逻辑
  console.log('\n🔍 测试过滤逻辑...')
  const filteredShares = Object.values(sharesData).filter(share => {
    const isTextToImage = !share.originalUrl ||
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
    return isTextToImage
  })
  
  console.log(`- 过滤后文生图数量: ${filteredShares.length}个`)
  
  if (filteredShares.length > 0) {
    console.log('\n✅ 修复成功！画廊应该能正常显示文生图了')
    console.log('📝 示例文生图数据:')
    console.log(`- ID: ${filteredShares[0].id}`)
    console.log(`- 风格: ${filteredShares[0].style}`)
    console.log(`- 原图URL: ${filteredShares[0].originalUrl}`)
  } else {
    console.log('\n❌ 修复失败！没有找到有效的文生图数据')
  }
} else {
  console.log('❌ 本地存储文件不存在')
}

// 测试API端点
console.log('\n🌐 测试API端点...')
const http = require('http')

function testAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/share/list?limit=10&offset=0',
      method: 'GET'
    }
    
    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          resolve(response)
        } catch (error) {
          reject(error)
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.end()
  })
}

// 如果服务器正在运行，测试API
setTimeout(async () => {
  try {
    const response = await testAPI()
    console.log('📊 API响应:')
    console.log(`- 成功: ${response.success}`)
    console.log(`- 总数: ${response.data?.total || 0}`)
    console.log(`- 项目数: ${response.data?.items?.length || 0}`)
    
    if (response.data?.items?.length > 0) {
      console.log('✅ API正常工作，画廊应该能显示数据')
    } else {
      console.log('⚠️ API返回空数据，可能需要重新生成测试数据')
    }
  } catch (error) {
    console.log('⚠️ 无法连接到API服务器，请确保开发服务器正在运行')
  }
}, 2000) 