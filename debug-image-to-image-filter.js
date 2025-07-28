const fetch = require('node-fetch');

async function debugImageToImageFilter() {
  console.log('🔍 调试图生图过滤问题...\n');

  try {
    // 1. 获取所有分享列表
    console.log('1. 获取分享列表...');
    const response = await fetch('http://localhost:3000/api/share/list?limit=100&offset=0');
    const data = await response.json();
    
    if (!data.success) {
      console.log('❌ API请求失败:', data.error);
      return;
    }

    console.log(`✅ 画廊显示 ${data.data.items.length} 个分享`);
    console.log(`📊 总数: ${data.data.total}\n`);

    // 2. 检查每个分享的详细信息
    console.log('2. 检查每个分享的详细信息...\n');
    
    let imageToImageCount = 0;
    let templateModeCount = 0;
    let textToImageCount = 0;
    let suspiciousShares = [];

    for (let i = 0; i < Math.min(data.data.items.length, 20); i++) {
      const share = data.data.items[i];
      console.log(`${i + 1}. ${share.id} - ${share.style}`);
      console.log(`   OriginalUrl: ${share.originalUrl ? '有原图' : '无原图'}`);
      
      if (share.originalUrl) {
        console.log(`   OriginalUrl长度: ${share.originalUrl.length}`);
        console.log(`   OriginalUrl内容: ${share.originalUrl.substring(0, 100)}...`);
        
        if (share.originalUrl.includes('template-mode-placeholder.com')) {
          templateModeCount++;
          console.log(`   ❌ 模板模式不应该在画廊中显示！`);
        } else if (share.originalUrl.length > 1000) {
          imageToImageCount++;
          suspiciousShares.push(share);
          console.log(`   ❌ 图生图（URL长度>1000）不应该在画廊中显示！`);
        } else {
          imageToImageCount++;
          console.log(`   ❌ 图生图不应该在画廊中显示！`);
        }
      } else {
        textToImageCount++;
        console.log(`   ✅ 文生图应该在画廊中显示`);
      }
      console.log('');
    }

    // 3. 总结
    console.log('📊 总结:');
    console.log(`   文生图: ${textToImageCount} 个 ✅`);
    console.log(`   模板模式: ${templateModeCount} 个 ${templateModeCount > 0 ? '❌' : '✅'}`);
    console.log(`   图生图: ${imageToImageCount} 个 ${imageToImageCount > 0 ? '❌' : '✅'}`);

    if (suspiciousShares.length > 0) {
      console.log('\n🔍 可疑的图生图分享（URL长度>1000）:');
      suspiciousShares.forEach((share, index) => {
        console.log(`${index + 1}. ${share.id} - ${share.style}`);
        console.log(`   URL长度: ${share.originalUrl.length}`);
        console.log(`   URL: ${share.originalUrl}`);
      });
    }

    if (templateModeCount === 0 && imageToImageCount === 0) {
      console.log('\n🎉 完美！只有文生图在画廊中显示');
    } else {
      console.log('\n❌ 还有问题需要修复');
    }

  } catch (error) {
    console.error('❌ 调试失败:', error);
  }
}

debugImageToImageFilter(); 