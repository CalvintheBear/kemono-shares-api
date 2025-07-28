const fetch = require('node-fetch');

async function testTemplateModeFix() {
  console.log('🔧 测试模板模式修复效果...\n');

  try {
    // 1. 获取所有分享列表
    console.log('1. 获取分享列表...');
    const listResponse = await fetch('http://localhost:3000/api/share/list?limit=100&offset=0');
    const listData = await listResponse.json();
    
    if (!listData.success) {
      console.log('❌ 获取分享列表失败:', listData.error);
      return;
    }

    console.log(`✅ 获取到 ${listData.data.items.length} 个分享（画廊显示）`);
    console.log(`📊 总数: ${listData.data.total}`);

    // 2. 检查每个分享的详细信息
    console.log('\n2. 检查每个分享的详细信息...');
    
    let textToImageCount = 0;
    let imageToImageCount = 0;
    let templateModeCount = 0;
    
    for (let i = 0; i < listData.data.items.length; i++) {
      const share = listData.data.items[i];
      console.log(`\n${i + 1}. 检查分享: ${share.id}`);
      
      // 获取详细信息
      const detailResponse = await fetch(`http://localhost:3000/api/share?id=${share.id}`);
      const detailData = await detailResponse.json();
      
      if (detailData.success) {
        const shareData = detailData.data;
        console.log(`   Style: ${shareData.style}`);
        console.log(`   OriginalUrl: ${shareData.originalUrl ? '有原图' : '无原图'}`);
        
        // 判断类型
        if (!shareData.originalUrl) {
          console.log('   Type: 文生图 ✅ (在画廊中显示)');
          textToImageCount++;
        } else if (shareData.originalUrl.includes('template') || shareData.style.includes('アイコン')) {
          console.log('   Type: 模板模式 ❌ (不应该在画廊中显示)');
          templateModeCount++;
        } else {
          console.log('   Type: 图生图 ❌ (不应该在画廊中显示)');
          imageToImageCount++;
        }
      } else {
        console.log('   ❌ 获取详情失败');
      }
    }

    // 3. 总结
    console.log('\n📊 总结:');
    console.log(`   文生图: ${textToImageCount} 个`);
    console.log(`   模板模式: ${templateModeCount} 个`);
    console.log(`   图生图: ${imageToImageCount} 个`);
    
    if (templateModeCount > 0 || imageToImageCount > 0) {
      console.log('\n❌ 问题：模板模式和图生图不应该在画廊中显示！');
      console.log('   需要清除缓存并重新测试...');
      
      // 清除缓存
      console.log('\n4. 清除缓存...');
      const clearResponse = await fetch('http://localhost:3000/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generatedUrl: 'https://test-clear-cache.com/test.jpg',
          originalUrl: null,
          prompt: '测试清除缓存',
          style: 'テスト',
          isR2Stored: false,
          isTextToImage: true
        })
      });
      
      if (clearResponse.ok) {
        console.log('✅ 缓存清除成功');
        console.log('请等待几秒钟后重新运行此脚本...');
      }
    } else {
      console.log('\n✅ 完美！只有文生图在画廊中显示');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testTemplateModeFix(); 