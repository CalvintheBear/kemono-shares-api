const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testLocalStorage() {
  console.log('🧪 开始测试本地存储功能...\n');

  try {
    // 1. 创建分享
    console.log('🔄 创建分享...');
    const createResponse = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '测试本地存储',
        style: '本地测试风格',
        generatedUrl: 'https://example.com/test-image.jpg',
        originalUrl: 'https://example.com/original.jpg'
      })
    });

    const createResult = await createResponse.json();
    console.log('✅ 分享创建成功:', createResult);

    // 2. 获取分享列表
    console.log('\n🔄 获取分享列表...');
    const listResponse = await fetch(`${API_BASE}/share/list?limit=10`);
    const listResult = await listResponse.json();
    console.log('✅ 分享列表获取成功:', {
      total: listResult.data.total,
      items: listResult.data.items.length
    });

    // 3. 检查本地文件
    console.log('\n🔄 检查本地存储文件...');
    const fs = require('fs');
    const path = require('path');
    const filePath = path.resolve('./local-storage/shares.json');
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const shares = JSON.parse(fileContent);
      console.log('✅ 本地存储文件存在，包含', shares.length, '个分享');
      console.log('📄 文件内容预览:', shares.slice(0, 2));
    } else {
      console.log('❌ 本地存储文件不存在');
    }

    console.log('\n🏁 本地存储测试完成！');
    console.log('📝 现在重启服务器，数据应该会保持持久化！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testLocalStorage(); 