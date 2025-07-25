const https = require('https');
const HttpsProxyAgent = require(https-proxy-agent);// 你的API Key
const API_KEY = 2800cbec97501415f4535326;

// 代理设置（如果你有代理的话）
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || http://127.07890
const agent = new HttpsProxyAgent(proxyUrl);

// 测试请求数据
const testData = {
  filesUrl: [
  https://example.com/image1ng",
  https://example.com/image2.png
  ],
  prompt: "A beautiful sunset over the mountains,
  size:1:1,
  callBackUrl: "https://your-callback-url.com/callback",
  isEnhance: false,
  uploadCn: false,
  nVariants: 1,
  enableFallback: false,
  fallbackModel: FLUX_MAX"
};

// 请求选项
const options = [object Object]  hostname: 'api.kie.ai',
  port: 443,
  path: '/api/v1/gpt4o-image/generate,  method: 'POST,  agent: agent, // 使用代理
  headers: {
   Content-Type':application/json',
    Authorization': `Bearer ${API_KEY}`,
  User-Agent': 'Mozilla/5.0 (Windows NT10 Win64; x64) AppleWebKit/53736,
    ept':application/json },
  timeout: 3030超时
};

console.log('🔧 测试Kie.ai API Key (使用代理)...');
console.log('📡 请求URL:', `https://${options.hostname}${options.path}`);
console.log(🔑API Key:', API_KEY.substring(0,8) + '...');
console.log('🌐 代理地址:', proxyUrl);
console.log('📊 请求数据:', JSON.stringify(testData, null,2));

const req = https.request(options, (res) =>[object Object]
  console.log('📡 响应状态:', res.statusCode);
  console.log('📡 响应头:', res.headers);
  
  let data =
  
  res.on(data', (chunk) => {
    data += chunk;
  });
  
  res.on(end) =>[object Object]
    console.log('📄 响应内容:,data);
    
    if (res.statusCode === 200
      console.log('✅ API Key 验证成功！');
    } else if (res.statusCode === 401
      console.log(❌API Key 验证失败 - 401uthorized');
      console.log('💡 可能的原因:');
      console.log('1I Key 不正确');
      console.log('2I Key 已过期');
      console.log('3. 权限不足');
      console.log(4. IP地址未在白名单中');
    } else {
      console.log(`❌ 请求失败 - ${res.statusCode}`);
    }
  });
});

req.on('error', (error) =>[object Object]
  console.error('💥 请求错误:', error.message);
  
  if (error.code === 'ECONNRESET')[object Object]
    console.log('💡 网络连接重置，可能的原因:');
    console.log('1. 网络不稳定');
    console.log('2. 被墙阻止');
    console.log(3. DNS解析问题');
    console.log(4. 代理设置问题');
  }
});

req.on('timeout', () => [object Object]
  console.log(⏰ 请求超时');
  req.destroy();
});

// 发送请求
req.write(JSON.stringify(testData));
req.end(); 