// 测试API修复的脚本
const https = require('https');

// 测试配置
const BASE_URL = 'https://2kawaii.com';
const TEST_TASK_ID = 'test_task_123';

// 测试函数
async function testAPI(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// 运行测试
async function runTests() {
  console.log('🧪 开始测试API修复...\n');

  try {
    // 测试1: image-details API
    console.log('1. 测试 image-details API...');
    const imageDetailsResult = await testAPI(`/api/image-details?taskId=${TEST_TASK_ID}`);
    console.log(`   状态码: ${imageDetailsResult.status}`);
    console.log(`   响应: ${JSON.stringify(imageDetailsResult.data, null, 2)}`);
    console.log('');

    // 测试2: download-url API
    console.log('2. 测试 download-url API...');
    const downloadUrlResult = await testAPI('/api/download-url', 'POST', {
      url: 'https://example.com/test-image.jpg'
    });
    console.log(`   状态码: ${downloadUrlResult.status}`);
    console.log(`   响应: ${JSON.stringify(downloadUrlResult.data, null, 2)}`);
    console.log('');

    // 测试3: generate-image API
    console.log('3. 测试 generate-image API...');
    const generateImageResult = await testAPI('/api/generate-image', 'POST', {
      prompt: '测试图片生成',
      style: 'default',
      size: '1024x1024',
      mode: 'template'
    });
    console.log(`   状态码: ${generateImageResult.status}`);
    console.log(`   响应: ${JSON.stringify(generateImageResult.data, null, 2)}`);
    console.log('');

    console.log('✅ 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
runTests(); 