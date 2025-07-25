// 测试代理配置
require('dotenv').config()
const { HttpsProxyAgent } = require('https-proxy-agent')

console.log('🔍 环境变量检查:')
console.log('HTTP_PROXY:', process.env.HTTP_PROXY)
console.log('HTTPS_PROXY:', process.env.HTTPS_PROXY)
console.log('KIE_AI_API_KEY:', process.env.KIE_AI_API_KEY?.substring(0, 8) + '...')

const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY
console.log('代理URL:', proxyUrl)

if (proxyUrl) {
  const agent = new HttpsProxyAgent(proxyUrl)
  console.log('✅ 代理agent创建成功')
  
  // 测试代理连接
  const https = require('https')
  const options = {
    hostname: 'api.kie.ai',
    port: 443,
    path: '/api/v1/gpt4o-image/generate',
    method: 'POST',
    agent: agent,
    timeout: 10000
  }
  
  console.log('🌐 测试代理连接...')
  const req = https.request(options, (res) => {
    console.log('✅ 代理连接成功! 状态:', res.statusCode)
    res.on('data', (chunk) => {
      console.log('响应:', chunk.toString())
    })
  })
  
  req.on('error', (err) => {
    console.error('❌ 代理连接失败:', err.message)
  })
  
  req.write(JSON.stringify({
    prompt: 'test',
    model: 'gpt-4o-image',
    userId: 'test@example.com'
  }))
  req.end()
} else {
  console.log('❌ 未找到代理配置')
}