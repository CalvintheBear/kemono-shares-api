const https = require('https');

// 尝试不同的TLS配置
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // 临时禁用SSL验证进行测试

const data = JSON.stringify({
  "prompt": "测试连接",
  "size": "1:1"
});

const options = {
  hostname: 'api.kie.ai',
  port: 443,
  path: '/api/v1/gpt4o-image/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c982688b8fee1c72c50863de77eae6e635a49a518a7cf7c1',
    'Content-Length': data.length,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  // 添加TLS选项
  secureProtocol: 'TLSv1_2_method',
  rejectUnauthorized: false,
  timeout: 30000
};

console.log('开始测试API连接 (带TLS配置)...');

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头:`, res.headers);

  let responseData = '';
  res.on('data', (d) => {
    responseData += d;
  });

  res.on('end', () => {
    console.log('响应数据:', responseData);
  });
});

req.on('error', (e) => {
  console.error('请求错误:', e);
});

req.on('timeout', () => {
  console.log('请求超时');
  req.destroy();
});

req.setTimeout(30000);
req.write(data);
req.end(); 