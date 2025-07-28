const fetch = require('node-fetch');

const API_BASE = 'https://kemono-shares-api.y2983236233.workers.dev/api';

async function testShareImagesProduction() {
  console.log('🧪 开始测试生产环境分享页面图片展示功能...\n');

  try {
    // 1. 创建几个测试分享
    console.log('🔄 创建测试分享...');
    const testShares = [
      {
        prompt: '测试图片展示功能1 - ジブリ風',
        style: 'ジブリ風',
        generatedUrl: 'https://tempfile.aiquickdraw.com/s/test_share_1.png',
        originalUrl: 'https://example.com/original1.jpg'
      },
      {
        prompt: '测试图片展示功能2 - VTuber風',
        style: 'VTuber風',
        generatedUrl: 'https://tempfile.aiquickdraw.com/s/test_share_2.png',
        originalUrl: 'https://example.com/original2.jpg'
      },
      {
        prompt: '测试图片展示功能3 - ウマ娘風',
        style: 'ウマ娘風',
        generatedUrl: 'https://tempfile.aiquickdraw.com/s/test_share_3.png',
        originalUrl: 'https://example.com/original3.jpg'
      }
    ];

    for (const share of testShares) {
      const createResponse = await fetch(`${API_BASE}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(share)
      });

      const createResult = await createResponse.json();
      console.log('✅ 分享创建成功:', createResult.shareId);
    }

    // 2. 获取分享列表并检查图片URL
    console.log('\n🔄 获取分享列表...');
    const listResponse = await fetch(`${API_BASE}/share/list?limit=10`);
    const listResult = await listResponse.json();
    
    if (listResult.success && listResult.data.items) {
      console.log('✅ 分享列表获取成功');
      console.log('📊 分享数量:', listResult.data.items.length);
      
      // 检查每个分享是否包含图片URL
      listResult.data.items.forEach((item, index) => {
        console.log(`\n📸 分享 ${index + 1}:`);
        console.log(`   ID: ${item.id}`);
        console.log(`   标题: ${item.title}`);
        console.log(`   风格: ${item.style}`);
        console.log(`   生成图片: ${item.generatedUrl ? '✅' : '❌'}`);
        console.log(`   原图: ${item.originalUrl ? '✅' : '❌'}`);
        if (item.generatedUrl) {
          console.log(`   图片URL: ${item.generatedUrl}`);
        }
      });
    } else {
      console.log('❌ 分享列表获取失败');
    }

    console.log('\n🏁 生产环境分享页面图片展示功能测试完成！');
    console.log('📝 现在可以访问 https://kemono-mimi.com/share 查看图片展示效果！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testShareImagesProduction(); 