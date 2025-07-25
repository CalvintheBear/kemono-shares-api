const https = require('https')

// 从.env.local读取API密钥
require('dotenv').config({ path: '.env.local' })

const apiKey = process.env.KIE_AI_API_KEY
const userId = process.env.KIE_AI_USER_ID

console.log('🔧 测试 Kie.ai 4o-image API 连接')
console.log('API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : '未设置')
console.log('User ID:', userId || '未设置')

if (!apiKey || !userId) {
  console.error('❌ 环境变量缺失')
  process.exit(1)
}

// 测试数据
const testData = {
  prompt: '一只可爱的小猫',
  model: 'gpt-4o-image',
  ratio: '1:1',
  userId: userId
}

// 测试方式1：使用Node.js内置https模块
console.log('\n🌐 方式1：使用Node.js内置https模块测试连接...')

const postData = JSON.stringify(testData)
const options = {
  hostname: 'api.kie.ai',
  port: 443,
  path: '/api/v1/gpt4o-image/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 10000
}

const req = https.request(options, (res) => {
  console.log('✅ 连接成功！')
  console.log('状态码:', res.statusCode)
  console.log('响应头:', res.headers)
  
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    console.log('响应数据:', data)
    testWithFetch()
  })
})

req.on('error', (err) => {
  console.error('❌ https模块连接失败:', err.code, err.message)
  testWithFetch()
})

req.on('timeout', () => {
  console.error('❌ https模块连接超时')
  req.destroy()
  testWithFetch()
})

req.write(postData)
req.end()

// 测试方式2：使用fetch
async function testWithFetch() {
  console.log('\n🌐 方式2：使用fetch测试连接...')
  
  try {
    const response = await fetch('https://api.kie.ai/api/v1/gpt4o-image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    console.log('✅ fetch连接成功！')
    console.log('状态码:', response.status)
    console.log('状态文本:', response.statusText)
    
    const responseText = await response.text()
    console.log('响应数据:', responseText)
    
  } catch (fetchError) {
    console.error('❌ fetch连接失败:', fetchError.code, fetchError.message)
    console.error('错误详情:', fetchError)
    
    // 测试基本网络连接
    testBasicConnection()
  }
}

// 测试方式3：基本连接测试
function testBasicConnection() {
  console.log('\n🌐 方式3：测试基本网络连接...')
  
  const testOptions = {
    hostname: 'api.kie.ai',
    port: 443,
    path: '/',
    method: 'GET',
    timeout: 5000
  }
  
  const testReq = https.request(testOptions, (res) => {
    console.log('✅ 基本连接成功！状态码:', res.statusCode)
    res.on('data', () => {}) // 忽略数据
    res.on('end', () => {
      console.log('✅ 基本连接测试完成')
    })
  })
  
  testReq.on('error', (err) => {
    console.error('❌ 基本连接失败:', err.code, err.message)
    console.error('这可能是网络、防火墙或DNS问题')
  })
  
  testReq.on('timeout', () => {
    console.error('❌ 基本连接超时')
    testReq.destroy()
  })
  
  testReq.end()
} 