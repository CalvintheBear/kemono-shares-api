const fetch = require('node-fetch');

async function testImageToImageFilter() {
  console.log('🧪 测试图生图过滤逻辑...\n');

  try {
    // 1. 测试分享列表API
    console.log('1. 获取分享列表...');
    const listResponse = await fetch('http://localhost:3000/api/share/list?limit=20');
    const listData = await listResponse.json();
    
    if (listData.success) {
      console.log(`✅ 分享列表获取成功，共${listData.data.total}个分享`);
      
      // 分析每个分享的类型
      const shares = listData.data.items;
      let textToImageCount = 0;
      let imageToImageCount = 0;
      
      shares.forEach(share => {
        const isTextToImage = !share.originalUrl || 
          share.originalUrl === null || 
          share.originalUrl === undefined ||
          (typeof share.originalUrl === 'string' && (
            share.originalUrl.trim() === '' ||
            share.originalUrl.startsWith('data:image/') ||
            share.originalUrl.includes('placeholder.com') ||
            share.originalUrl.includes('Text+to+Image') ||
            share.originalUrl.includes('base64') ||
            share.originalUrl.length > 1000
          ));
        
        if (isTextToImage) {
          textToImageCount++;
        } else {
          imageToImageCount++;
        }
        
        console.log(`  - ${share.id}: ${share.style} (${isTextToImage ? '文生图' : '图生图'})`);
      });
      
      console.log(`\n📊 统计结果:`);
      console.log(`  - 文生图: ${textToImageCount}个`);
      console.log(`  - 图生图: ${imageToImageCount}个`);
      console.log(`  - 画廊显示: ${textToImageCount}个 (应该只显示文生图)`);
      
      // 检查是否有图生图出现在画廊中
      if (imageToImageCount > 0) {
        console.log(`\n❌ 问题发现: 有${imageToImageCount}个图生图出现在画廊中，应该被过滤掉！`);
        return false;
      } else {
        console.log(`\n✅ 过滤逻辑正常: 画廊中只显示文生图`);
      }
    } else {
      console.log('❌ 分享列表获取失败:', listData.error);
      return false;
    }

    // 2. 测试创建图生图分享
    console.log('\n2. 测试创建图生图分享...');
    const imageToImageShareData = {
      generatedUrl: 'https://example.com/generated-image.png',
      originalUrl: 'https://example.com/original-image.jpg', // 有原图，应该是图生图
      prompt: '测试图生图',
      style: '测试风格',
      timestamp: Date.now()
    };
    
    const createResponse = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageToImageShareData)
    });
    
    const createData = await createResponse.json();
    
    if (createData.success) {
      console.log('✅ 图生图分享创建成功:', createData.shareId);
      
      // 3. 验证图生图分享是否在列表中
      console.log('\n3. 验证图生图分享是否在列表中...');
      const newListResponse = await fetch('http://localhost:3000/api/share/list?limit=20');
      const newListData = await newListResponse.json();
      
      if (newListData.success) {
        const newShares = newListData.data.items;
        const newShare = newShares.find(s => s.id === createData.shareId);
        
        if (newShare) {
          console.log('❌ 问题: 图生图分享出现在画廊中，应该被过滤掉！');
          console.log('  分享详情:', {
            id: newShare.id,
            originalUrl: newShare.originalUrl,
            isTextToImage: !newShare.originalUrl
          });
          return false;
        } else {
          console.log('✅ 正确: 图生图分享被正确过滤，未出现在画廊中');
        }
      }
    } else {
      console.log('❌ 图生图分享创建失败:', createData.error);
      return false;
    }

    // 4. 测试创建文生图分享
    console.log('\n4. 测试创建文生图分享...');
    const textToImageShareData = {
      generatedUrl: 'https://example.com/generated-text-image.png',
      originalUrl: null, // 无原图，应该是文生图
      prompt: '测试文生图',
      style: '测试风格',
      timestamp: Date.now()
    };
    
    const createTextResponse = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(textToImageShareData)
    });
    
    const createTextData = await createTextResponse.json();
    
    if (createTextData.success) {
      console.log('✅ 文生图分享创建成功:', createTextData.shareId);
      
      // 5. 验证文生图分享是否在列表中
      console.log('\n5. 验证文生图分享是否在列表中...');
      const finalListResponse = await fetch('http://localhost:3000/api/share/list?limit=20');
      const finalListData = await finalListResponse.json();
      
      if (finalListData.success) {
        const finalShares = finalListData.data.items;
        const finalShare = finalShares.find(s => s.id === createTextData.shareId);
        
        if (finalShare) {
          console.log('✅ 正确: 文生图分享出现在画廊中');
          console.log('  分享详情:', {
            id: finalShare.id,
            originalUrl: finalShare.originalUrl,
            isTextToImage: !finalShare.originalUrl
          });
        } else {
          console.log('❌ 问题: 文生图分享未出现在画廊中，应该显示！');
          return false;
        }
      }
    } else {
      console.log('❌ 文生图分享创建失败:', createTextData.error);
      return false;
    }

    console.log('\n🎉 所有测试通过！图生图过滤逻辑正常工作。');
    return true;

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    return false;
  }
}

// 运行测试
testImageToImageFilter().then(success => {
  if (success) {
    console.log('\n✅ 测试完成: 图生图过滤功能正常');
    process.exit(0);
  } else {
    console.log('\n❌ 测试完成: 图生图过滤功能有问题');
    process.exit(1);
  }
}).catch(error => {
  console.error('\n💥 测试执行失败:', error);
  process.exit(1);
}); 