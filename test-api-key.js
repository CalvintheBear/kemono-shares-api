// 测试API密钥是否有效
const https = require('https');

const apiKey = '2800cbec975bf014d815f4e5353c826a';
const userId = 'j2983236233@gmail.com';

const data = JSON.stringify({
  prompt: 'test',
  model: 'gpt-4o-image',
  userId: userId
});

const options = {
  hostname: 'api.kie.ai',
  port: 443,
  path: '/api/v1/gpt4o-image/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔍 测试API密钥...');
console.log('API Key:', apiKey.substring(0, 8) + '...');
console.log('User ID:', userId);
console.log('Endpoint:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  console.log('📡 响应状态:', res.statusCode);
  console.log('📡 响应头:', res.headers);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 响应内容:', responseBody);
    
    if (res.statusCode === 401) {
      console.error('❌ API密钥无效或已过期');
    } else if (res.statusCode === 403) {
      console.error('❌ 权限不足');
    } else if (res.statusCode === 200) {
      console.log('✅ API密钥有效');
    } else {
      console.log('📊 状态码:', res.statusCode);
    }
  });
});

req.on('error', (error) => {
  console.error('💥 网络错误:', error.message);
  if (error.code === 'ECONNRESET') {
    console.error('🔗 连接被重置 - 可能是网络限制或防火墙');
  } else if (error.code === 'ENOTFOUND') {
    console.error('🔍 域名解析失败');
  } else if (error.code === 'ETIMEDOUT') {
    console.error('⏱️ 连接超时');
  }
});

req.write(data);
req.end();