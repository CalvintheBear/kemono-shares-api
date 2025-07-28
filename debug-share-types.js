const fetch = require('node-fetch');

async function debugShareTypes() {
  console.log('🔍 调试分享类型问题...\n');

  try {
    // 1. 获取所有分享列表
    console.log('1. 获取所有分享列表...');
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
    
    const shareDetails = [];
    for (let i = 0; i < listData.data.items.length; i++) {
      const share = listData.data.items[i];
      console.log(`\n${i + 1}. 检查分享: ${share.id}`);
      
      // 获取详细信息
      const detailResponse = await fetch(`http://localhost:3000/api/share?id=${share.id}`);
      const detailData = await detailResponse.json();
      
      if (detailData.success) {
        const shareDetail = detailData.data;
        
        // 判断类型
        const isTextToImage = !shareDetail.originalUrl || 
          shareDetail.originalUrl === null || 
          shareDetail.originalUrl === undefined ||
          (typeof shareDetail.originalUrl === 'string' && (
            shareDetail.originalUrl.trim() === '' ||
            shareDetail.originalUrl.startsWith('data:image/') ||
            shareDetail.originalUrl.includes('placeholder.com') ||
            shareDetail.originalUrl.includes('Text+to+Image') ||
            shareDetail.originalUrl.includes('base64') ||
            shareDetail.originalUrl.length > 1000
          ));

        const shareInfo = {
          id: shareDetail.id,
          style: shareDetail.style,
          originalUrl: shareDetail.originalUrl,
          isTextToImage: isTextToImage,
          type: isTextToImage ? '文生图' : '图生图',
          shouldShowInGallery: isTextToImage
        };

        shareDetails.push(shareInfo);
        
        console.log(`   - 样式: ${shareDetail.style}`);
        console.log(`   - originalUrl: ${shareDetail.originalUrl ? '有值' : 'null'}`);
        console.log(`   - isTextToImage: ${isTextToImage}`);
        console.log(`   - 类型: ${isTextToImage ? '文生图' : '图生图'}`);
        console.log(`   - 应该在画廊显示: ${isTextToImage ? '是' : '否'}`);
        
        // 检查是否有问题
        if (!isTextToImage) {
          console.log(`   ⚠️  问题: 这是图生图，但显示在画廊中！`);
        }
      } else {
        console.log(`   ❌ 获取详情失败: ${detailData.error}`);
      }
    }

    // 3. 统计结果
    console.log('\n3. 统计结果...');
    const textToImageCount = shareDetails.filter(s => s.isTextToImage).length;
    const imageToImageCount = shareDetails.filter(s => !s.isTextToImage).length;
    const problematicCount = shareDetails.filter(s => !s.isTextToImage).length;

    console.log(`📊 统计结果:`);
    console.log(`   - 文生图: ${textToImageCount} 个`);
    console.log(`   - 图生图: ${imageToImageCount} 个`);
    console.log(`   - 问题分享: ${problematicCount} 个`);

    if (problematicCount > 0) {
      console.log('\n🚨 发现问题!');
      console.log('以下图生图分享错误地显示在画廊中:');
      shareDetails.filter(s => !s.isTextToImage).forEach((share, index) => {
        console.log(`   ${index + 1}. ${share.id} - ${share.style}`);
      });
    } else {
      console.log('\n✅ 没有发现问题，所有分享类型正确');
    }

    // 4. 检查本地存储数据
    console.log('\n4. 检查本地存储数据...');
    const fs = require('fs');
    const path = require('path');
    
    const devJsonPath = path.resolve(process.cwd(), 'local-storage/shares-dev.json');
    if (fs.existsSync(devJsonPath)) {
      const rawData = fs.readFileSync(devJsonPath, 'utf-8');
      const shareData = JSON.parse(rawData);
      
      console.log(`📦 本地存储中有 ${Object.keys(shareData).length} 个分享`);
      
      let textToImageInStorage = 0;
      let imageToImageInStorage = 0;
      
      for (const [shareId, data] of Object.entries(shareData)) {
        const isTextToImage = !data.originalUrl || 
          data.originalUrl === null || 
          data.originalUrl === undefined ||
          (typeof data.originalUrl === 'string' && (
            data.originalUrl.trim() === '' ||
            data.originalUrl.startsWith('data:image/') ||
            data.originalUrl.includes('placeholder.com') ||
            data.originalUrl.includes('Text+to+Image') ||
            data.originalUrl.includes('base64') ||
            data.originalUrl.length > 1000
          ));
        
        if (isTextToImage) {
          textToImageInStorage++;
        } else {
          imageToImageInStorage++;
        }
      }
      
      console.log(`   - 本地存储中文生图: ${textToImageInStorage} 个`);
      console.log(`   - 本地存储中图生图: ${imageToImageInStorage} 个`);
      console.log(`   - 画廊显示: ${listData.data.items.length} 个`);
      
      if (textToImageInStorage !== listData.data.items.length) {
        console.log(`   ⚠️  数量不匹配！本地存储有 ${textToImageInStorage} 个文生图，但画廊显示 ${listData.data.items.length} 个`);
      }
    }

  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error);
  }
}

// 运行调试
debugShareTypes(); 