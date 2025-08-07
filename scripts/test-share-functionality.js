const fs = require('fs');
const path = require('path');

console.log('🧪 测试分享功能...');

// 模拟分享数据
const testShareData = {
  generatedUrl: 'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/test-image.jpg',
  originalUrl: null,
  prompt: '测试AI画像生成',
  style: 'ジブリ風',
  timestamp: Date.now(),
  isR2Stored: true
};

async function testShareAPI() {
  try {
    console.log('📡 测试分享API...');
    
    const response = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testShareData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ 分享API测试成功:', data);
      
      if (data.success && data.shareId) {
        console.log('🔗 分享链接:', data.shareUrl);
        
        // 测试获取分享数据
        const getResponse = await fetch(`http://localhost:3000/api/share/${data.shareId}`);
        if (getResponse.ok) {
          const shareData = await getResponse.json();
          console.log('✅ 获取分享数据成功:', shareData);
        } else {
          console.error('❌ 获取分享数据失败:', getResponse.status);
        }
      }
    } else {
      console.error('❌ 分享API测试失败:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ 分享API测试错误:', error.message);
  }
}

async function testKVStorage() {
  try {
    console.log('💾 测试KV存储...');
    
    // 这里可以添加KV存储的测试逻辑
    console.log('ℹ️  KV存储测试需要在实际部署环境中进行');
    
  } catch (error) {
    console.error('❌ KV存储测试错误:', error.message);
  }
}

async function runTests() {
  console.log('🚀 开始分享功能测试...');
  
  // 检查必要的文件
  const requiredFiles = [
    'functions/api/share.ts',
    'functions/api/share/[id].ts',
    'src/lib/share-store-workers.js'
  ];

  console.log('📄 检查必要文件...');
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.warn(`⚠️  ${file} 不存在`);
    }
  }

  // 检查wrangler配置
  console.log('🔧 检查wrangler配置...');
  if (fs.existsSync('wrangler.toml')) {
    const wranglerContent = fs.readFileSync('wrangler.toml', 'utf8');
    if (wranglerContent.includes('SHARE_DATA_KV')) {
      console.log('✅ KV存储配置存在');
    } else {
      console.warn('⚠️  KV存储配置缺失');
    }
  }

  // 运行API测试
  await testShareAPI();
  
  // 运行KV存储测试
  await testKVStorage();

  console.log('✅ 分享功能测试完成');
}

runTests().catch(console.error);
