const fetch = require('node-fetch');

async function clearCacheAndTest() {
  console.log('🧹 清除缓存并重新测试过滤逻辑...\n');

  try {
    // 1. 清除缓存 - 通过创建一个新的分享来触发缓存清除
    console.log('1. 触发缓存清除...');
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
      console.log('✅ 缓存清除触发成功');
    } else {
      console.log('⚠️ 缓存清除触发失败，但继续测试');
    }

    // 等待一下让缓存清除生效
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. 重新获取分享列表
    console.log('\n2. 重新获取分享列表...');
    const listResponse = await fetch('http://localhost:3000/api/share/list?limit=100&offset=0');
    const listData = await listResponse.json();
    
    if (!listData.success) {
      console.log('❌ 获取分享列表失败:', listData.error);
      return;
    }

    console.log(`✅ 获取到 ${listData.data.items.length} 个分享（画廊显示）`);
    console.log(`📊 总数: ${listData.data.total}`);

    // 3. 检查每个分享的详细信息
    console.log('\n3. 检查每个分享的详细信息...');
    
    const shareDetails = [];
    for (let i = 0; i < listData.data.items.length; i++) {
      const share = listData.data.items[i];
      console.log(`\n${i + 1}. 检查分享: ${share.id}`);
      
      // 获取详细信息
      const detailResponse = await fetch(`http://localhost:3000/api/share?id=${share.id}`);
      const detailData = await detailResponse.json();
      
      if (detailData.success) {
        const shareData = detailData.data;
        const isTextToImage = !shareData.originalUrl ||
          shareData.originalUrl === null ||
          shareData.originalUrl === undefined ||
          (typeof shareData.originalUrl === 'string' && (
            shareData.originalUrl.trim() === '' ||
            shareData.originalUrl.startsWith('data:image/') ||
            shareData.originalUrl.includes('placeholder.com') ||
            shareData.originalUrl.includes('Text+to+Image') ||
            shareData.originalUrl.includes('base64') ||
            shareData.originalUrl.length > 1000
          ));
        
        const shareInfo = {
          id: shareData.id,
          style: shareData.style,
          originalUrl: shareData.originalUrl,
          isTextToImage: isTextToImage,
          shouldBeInGallery: isTextToImage,
          isInGallery: true
        };
        
        shareDetails.push(shareInfo);
        
        console.log(`   Style: ${shareData.style}`);
        console.log(`   OriginalUrl: ${shareData.originalUrl ? '有值' : 'null/undefined'}`);
        console.log(`   IsTextToImage: ${isTextToImage}`);
        console.log(`   ShouldBeInGallery: ${isTextToImage}`);
        console.log(`   IsInGallery: true`);
        
        if (!isTextToImage) {
          console.log(`   ⚠️ 问题：这个分享不应该在画廊中显示！`);
        }
      } else {
        console.log(`   ❌ 获取详情失败: ${detailData.error}`);
      }
    }

    // 4. 统计结果
    console.log('\n4. 统计结果...');
    const correctShares = shareDetails.filter(s => s.shouldBeInGallery === s.isInGallery);
    const incorrectShares = shareDetails.filter(s => s.shouldBeInGallery !== s.isInGallery);
    
    console.log(`✅ 正确显示的分享: ${correctShares.length} 个`);
    console.log(`❌ 错误显示的分享: ${incorrectShares.length} 个`);
    
    if (incorrectShares.length > 0) {
      console.log('\n❌ 错误显示的分享详情:');
      incorrectShares.forEach(share => {
        console.log(`   - ${share.id} (${share.style}): originalUrl=${share.originalUrl ? '有值' : 'null'}`);
      });
    } else {
      console.log('\n🎉 所有分享都正确显示！');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
clearCacheAndTest(); 