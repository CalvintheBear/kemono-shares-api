const fetch = require('node-fetch');

async function testGalleryFilter() {
  console.log('🔍 开始测试画廊筛选逻辑...\n');
  
  try {
    // 1. 清除缓存
    console.log('1. 清除缓存...');
    const clearResponse = await fetch('http://localhost:3000/api/share/list?clearCache=true');
    const clearResult = await clearResponse.json();
    console.log('清除缓存结果:', clearResult);
    
    // 等待一秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. 获取分享列表
    console.log('\n2. 获取分享列表...');
    const response = await fetch('http://localhost:3000/api/share/list?limit=50&offset=0');
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ API请求失败:', result.error);
      return;
    }
    
    console.log('📊 API返回数据:', {
      total: result.data.total,
      items: result.data.items.length,
      hasMore: result.data.hasMore
    });
    
    // 3. 分析每个分享项
    console.log('\n3. 分析分享项:');
    let textToImageCount = 0;
    let imageToImageCount = 0;
    
    result.data.items.forEach((item, index) => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com') &&
        !item.originalUrl.includes('Text+to+Image') &&
        !item.originalUrl.includes('base64') &&
        item.originalUrl.length <= 1000;
      
      const isTextToImage = !hasOriginalUrl;
      
      if (isTextToImage) {
        textToImageCount++;
      } else {
        imageToImageCount++;
      }
      
      console.log(`${index + 1}. ID: ${item.id}`);
      console.log(`   Style: ${item.style}`);
      console.log(`   OriginalUrl: ${item.originalUrl || 'null'}`);
      console.log(`   HasValidOriginalUrl: ${hasOriginalUrl}`);
      console.log(`   ShouldShowInGallery: ${isTextToImage}`);
      console.log('');
    });
    
    // 4. 统计结果
    console.log('📈 统计结果:');
    console.log(`总分享数: ${result.data.items.length}`);
    console.log(`文生图(画廊显示): ${textToImageCount}`);
    console.log(`图生图(画廊隐藏): ${imageToImageCount}`);
    
    // 5. 检查是否有图生图显示在画廊中
    const imageToImageItems = result.data.items.filter(item => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com') &&
        !item.originalUrl.includes('Text+to+Image') &&
        !item.originalUrl.includes('base64') &&
        item.originalUrl.length <= 1000;
      return hasOriginalUrl;
    });
    
    if (imageToImageItems.length > 0) {
      console.log('\n⚠️ 发现问题：以下图生图项目仍然显示在画廊中:');
      imageToImageItems.forEach(item => {
        console.log(`  - ${item.id}: ${item.style} (OriginalUrl: ${item.originalUrl})`);
      });
    } else {
      console.log('\n✅ 筛选逻辑工作正常，没有图生图显示在画廊中');
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
testGalleryFilter(); 