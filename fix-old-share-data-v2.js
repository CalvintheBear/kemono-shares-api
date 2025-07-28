const fs = require('fs');
const path = require('path');

function fixOldShareData() {
  console.log('🔧 修复旧的分享数据...\n');

  try {
    // 读取本地存储文件
    const filePath = path.join(__dirname, 'local-storage', 'shares-dev.json');
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ 找不到shares-dev.json文件');
      return;
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const sharesData = JSON.parse(data);
    const shares = Object.values(sharesData);

    console.log(`📊 找到 ${shares.length} 个分享数据`);

    let fixedCount = 0;
    let textToImageCount = 0;
    let imageToImageCount = 0;
    let templateModeCount = 0;

    // 修复每个分享
    shares.forEach((share, index) => {
      console.log(`\n${index + 1}. 检查分享: ${share.id}`);
      console.log(`   Style: ${share.style}`);
      console.log(`   原始 OriginalUrl: ${share.originalUrl ? '有原图' : '无原图'}`);

      // 判断类型并修复
      if (share.style.includes('アイコン') || share.style.includes('template')) {
        // 模板模式：应该有原图（模板的beforeImage）
        if (!share.originalUrl || share.originalUrl === null) {
          // 为模板模式设置一个占位符原图
          share.originalUrl = `https://template-mode-placeholder.com/${share.style}`;
          console.log(`   🔧 修复: 模板模式 -> 设置原图`);
          fixedCount++;
        }
        templateModeCount++;
      } else if (share.originalUrl && 
                 !share.originalUrl.includes('placeholder.com') && 
                 !share.originalUrl.includes('data:image/') &&
                 !share.originalUrl.includes('Text+to+Image') &&
                 !share.originalUrl.includes('base64') &&
                 share.originalUrl.length <= 1000) {
        // 图生图：有有效原图
        console.log(`   ✅ 图生图（无需修复）`);
        imageToImageCount++;
      } else {
        // 文生图：没有原图或原图是占位符
        if (share.originalUrl && 
            (share.originalUrl.includes('placeholder.com') || 
             share.originalUrl.includes('data:image/') ||
             share.originalUrl.includes('Text+to+Image') ||
             share.originalUrl.includes('base64') ||
             share.originalUrl.length > 1000)) {
          // 清除占位符原图
          share.originalUrl = null;
          console.log(`   🔧 修复: 文生图 -> 清除占位符原图`);
          fixedCount++;
        }
        console.log(`   ✅ 文生图`);
        textToImageCount++;
      }

      // 确保isTextToImage字段正确
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

      if (share.isTextToImage !== isTextToImage) {
        share.isTextToImage = isTextToImage;
        console.log(`   🔧 修复: isTextToImage -> ${isTextToImage}`);
        fixedCount++;
      }
    });

    // 保存修复后的数据
    const fixedSharesData = {};
    shares.forEach(share => {
      fixedSharesData[share.id] = share;
    });
    fs.writeFileSync(filePath, JSON.stringify(fixedSharesData, null, 2));
    console.log('\n📊 修复总结:');
    console.log(`   修复的分享: ${fixedCount} 个`);
    console.log(`   文生图: ${textToImageCount} 个`);
    console.log(`   图生图: ${imageToImageCount} 个`);
    console.log(`   模板模式: ${templateModeCount} 个`);
    console.log('\n✅ 数据修复完成！');

  } catch (error) {
    console.error('❌ 修复失败:', error);
  }
}

fixOldShareData(); 