const fs = require('fs');
const path = require('path');

function fixOldShareData() {
  console.log('🔧 修复旧的分享数据...\\n');

  try {
    // 读取本地存储文件
    const devJsonPath = path.resolve(process.cwd(), 'local-storage/shares-dev.json');
    
    if (!fs.existsSync(devJsonPath)) {
      console.log('❌ 本地存储文件不存在:', devJsonPath);
      return;
    }

    const rawData = fs.readFileSync(devJsonPath, 'utf-8');
    const shareData = JSON.parse(rawData);
    
    console.log(`📊 读取到 ${Object.keys(shareData).length} 个分享数据`);
    
    let fixedCount = 0;
    let totalCount = 0;
    
    // 遍历所有分享数据
    for (const [shareId, data] of Object.entries(shareData)) {
      totalCount++;
      
      // 检查是否需要修复
      if (data.isTextToImage === undefined) {
        // 根据originalUrl判断是否为文生图
        const isTextToImage = !data.originalUrl || 
          data.originalUrl === null || 
          data.originalUrl === undefined ||
          (typeof data.originalUrl === 'string' && (
            data.originalUrl.trim() === '' ||
            data.originalUrl.startsWith('data:image/') ||
            data.originalUrl.includes('placeholder.com') ||
            data.originalUrl.includes('Text+to+Image') ||
            data.originalUrl.includes('base64')
          ));
        
        // 添加isTextToImage字段
        data.isTextToImage = isTextToImage;
        fixedCount++;
        
        console.log(`🔧 修复分享 ${shareId}:`);
        console.log(`   - 样式: ${data.style}`);
        console.log(`   - originalUrl: ${data.originalUrl}`);
        console.log(`   - 添加 isTextToImage: ${isTextToImage}`);
        console.log(`   - 类型: ${isTextToImage ? '文生图' : '图生图'}`);
      }
    }
    
    // 保存修复后的数据
    if (fixedCount > 0) {
      fs.writeFileSync(devJsonPath, JSON.stringify(shareData, null, 2), 'utf-8');
      console.log(`\\n✅ 修复完成:`);
      console.log(`   - 总共检查: ${totalCount} 个分享`);
      console.log(`   - 修复了: ${fixedCount} 个分享`);
      console.log(`   - 数据已保存到: ${devJsonPath}`);
    } else {
      console.log(`\\n✅ 无需修复:`);
      console.log(`   - 总共检查: ${totalCount} 个分享`);
      console.log(`   - 所有分享都已包含 isTextToImage 字段`);
    }
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
  }
}

fixOldShareData(); 