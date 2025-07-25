const https = require('https');

const data = JSON.stringify({
  "prompt": "测试连接",
  "size": "1:1",
  "isEnhance": false,
  "uploadCn": false,
  "nVariants": 1,
  "enableFallback": false,
  "fallbackModel": "FLUX_MAX"
});

const options = {
  hostname: 'api.kie.ai',
  port: 443,
  path: '/api/v1/gpt4o-image/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c982688b8fee1c72c50863de77eae6e635a49a518a7cf7c1',
    'Content-Length': data.length
  }
};

console.log('开始测试API连接...');
console.log('请求数据:', data);

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

req.write(data);
req.end(); 