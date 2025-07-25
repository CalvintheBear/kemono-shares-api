const https = require('https');
const http = require('http');

// 测试基本网络连接
async function testConnection(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      console.log(`✅ ${url} - 状态码: ${res.statusCode}`);
      resolve({ status: res.statusCode, headers: res.headers });
    });
    
    req.on('error', (error) => {
      console.error(`❌ ${url} - 连接失败:`, error.message);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      console.error(`⏰ ${url} - 连接超时`);
      req.destroy();
      reject(new Error('连接超时'));
    });
  });
}

// 测试DNS解析
async function testDNS(hostname) {
  return new Promise((resolve, reject) => {
    const dns = require('dns');
    dns.lookup(hostname, (err, address, family) => {
      if (err) {
        console.error(`❌ DNS解析失败 ${hostname}:`, err.message);
        reject(err);
      } else {
        console.log(`✅ DNS解析成功 ${hostname} -> ${address} (IPv${family})`);
        resolve({ address, family });
      }
    });
  });
}

async function runTests() {
  console.log('🔍 开始网络连接诊断...\n');
  
  const testUrls = [
    'https://api.kie.ai',
    'https://api.kie.ai/api/v1/gpt4o-image/generate',
    'https://httpbin.org/get', // 测试基本HTTPS连接
    'https://google.com' // 测试互联网连接
  ];
  
  try {
    // 测试DNS解析
    console.log('📡 测试DNS解析...');
    await testDNS('api.kie.ai');
    await testDNS('httpbin.org');
    console.log('');
    
    // 测试网络连接
    console.log('🌐 测试网络连接...');
    for (const url of testUrls) {
      try {
        await testConnection(url);
      } catch (error) {
        console.error(`❌ 连接失败: ${url}`);
      }
    }
    
  } catch (error) {
    console.error('💥 测试过程中发生错误:', error);
  }
  
  console.log('\n📋 诊断完成');
}

runTests(); 