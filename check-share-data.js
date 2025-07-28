const fetch = require('node-fetch');

async function checkShareData() {
  console.log('🔍 检查分享数据详细信息...\n');

  try {
    // 1. 获取分享列表
    console.log('1. 获取分享列表...');
    const listResponse = await fetch('http://localhost:3000/api/share/list?limit=10');
    const listData = await listResponse.json();
    
    if (listData.success) {
      console.log(`✅ 分享列表获取成功，共${listData.data.total}个分享`);
      
      // 2. 检查前5个分享的详细信息
      const shares = listData.data.items.slice(0, 5);
      
      for (let i = 0; i < shares.length; i++) {
        const share = shares[i];
        console.log(`\n${i + 1}. 检查分享: ${share.id}`);
        
        // 获取详细信息
        const detailResponse = await fetch(`http://localhost:3000/api/share?id=${share.id}`);
        const detailData = await detailResponse.json();
        
        if (detailData.success) {
          const shareDetail = detailData.data;
          console.log(`   标题: ${share.title}`);
          console.log(`   风格: ${shareDetail.style}`);
          console.log(`   原图URL: ${shareDetail.originalUrl || 'null'}`);
          console.log(`   生成图URL: ${shareDetail.generatedUrl ? '有' : '无'}`);
          console.log(`   提示词: ${shareDetail.prompt ? shareDetail.prompt.substring(0, 50) + '...' : '无'}`);
          console.log(`   时间戳: ${new Date(shareDetail.timestamp).toLocaleString()}`);
          
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
          
          console.log(`   类型: ${isTextToImage ? '文生图' : '图生图'}`);
          console.log(`   在画廊中: ${isTextToImage ? '是' : '否 (应该被过滤)'}`);
          
          if (!isTextToImage && shareDetail.originalUrl) {
            console.log(`   ⚠️  问题: 这是图生图但显示在画廊中！`);
          }
        } else {
          console.log(`   ❌ 获取详情失败: ${detailData.error}`);
        }
      }
    } else {
      console.log('❌ 分享列表获取失败:', listData.error);
    }

    // 3. 检查本地存储文件
    console.log('\n2. 检查本地存储文件...');
    const fs = require('fs');
    const path = require('path');
    
    const storageFile = path.join(__dirname, 'local-storage', 'shares-dev.json');
    if (fs.existsSync(storageFile)) {
      const fileContent = fs.readFileSync(storageFile, 'utf8');
      console.log(`✅ 本地存储文件存在，文件大小: ${fileContent.length} 字符`);
      
      try {
        const storageData = JSON.parse(fileContent);
        console.log(`✅ 解析成功，数据类型: ${typeof storageData}, 长度: ${Array.isArray(storageData) ? storageData.length : '非数组'}`);
        
        if (Array.isArray(storageData)) {
          // 分析存储数据
          let textToImageCount = 0;
          let imageToImageCount = 0;
          
          storageData.forEach((share, index) => {
            console.log(`\n   分享 ${index + 1}: ${share.id}`);
            console.log(`     原图URL: ${share.originalUrl || 'null'}`);
            console.log(`     风格: ${share.style}`);
            
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
              console.log(`     类型: 文生图`);
            } else {
              imageToImageCount++;
              console.log(`     类型: 图生图 ⚠️`);
              console.log(`     ⚠️  发现图生图: ${share.id} (原图: ${share.originalUrl})`);
            }
          });
          
          console.log(`\n📊 本地存储统计:`);
          console.log(`  - 文生图: ${textToImageCount}个`);
          console.log(`  - 图生图: ${imageToImageCount}个`);
          
          if (imageToImageCount > 0) {
            console.log(`\n❌ 问题: 本地存储中有${imageToImageCount}个图生图，这些可能显示在画廊中！`);
          }
        } else {
          console.log('❌ 存储数据不是数组格式');
          console.log('存储数据内容:', JSON.stringify(storageData, null, 2));
        }
      } catch (parseError) {
        console.log('❌ JSON解析失败:', parseError.message);
        console.log('文件内容前100字符:', fileContent.substring(0, 100));
      }
    } else {
      console.log('❌ 本地存储文件不存在');
    }

  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error);
  }
}

// 运行检查
checkShareData().then(() => {
  console.log('\n🔍 检查完成');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 检查执行失败:', error);
  process.exit(1);
}); 