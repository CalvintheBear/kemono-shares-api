const https = require('https');
const API_KEY = '2800cbec975bf014d815f4e5353c826';

// 测试请求数据
const testData = {
  filesUrl: [
    "https://example.com/image1.png",
    "https://example.com/image2.png"
  ],
  prompt: "A beautiful sunset over the mountains",
  size: "1:1",
  callBackUrl: "https://your-callback-url.com/callback",
  isEnhance: false,
  uploadCn: false,
  nVariants: 1,
  enableFallback: false,
  fallbackModel: "FLUX_MAX"
};

// 请求选项
const options = {
  hostname: 'api.kie.ai',
  port: 443,
  path: '/api/v1/gpt4o-image/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json'
  }
};

console.log('🔧 测试Kie.ai API Key...');
console.log('📡 请求URL:', `https://${options.hostname}${options.path}`);
console.log('🔑 API Key:', API_KEY.substring(0,8) + '...');
console.log('📊 请求数据:', JSON.stringify(testData, null,2));

const req = https.request(options, (res) => {
  console.log('📡 响应状态:', res.statusCode);
  console.log('📡 响应头:', res.headers);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📄 响应内容:', data);

    if (res.statusCode === 200) {
      console.log('✅ API Key 验证成功！');
    } else if (res.statusCode === 401) {
      console.log('❌API Key 验证失败 - 401 Unauthorized');
      console.log('💡 可能的原因:');
      console.log('1. API Key 不正确');
      console.log('2. API Key 已过期');
      console.log('3. 权限不足');
      console.log('4. IP地址未在白名单中');
    } else {
      console.log(`❌ 请求失败 - ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('💥 请求错误:', error.message);

  if (error.code === 'ECONNRESET') {
    console.log('💡 网络连接重置，可能的原因:');
    console.log('1. 网络不稳定');
    console.log('2. 被墙阻止');
    console.log('3. DNS解析问题');
    console.log('4. 代理设置问题');
  }
});

// 发送请求
req.write(JSON.stringify(testData));
req.end();