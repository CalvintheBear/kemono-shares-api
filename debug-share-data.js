const { shareKVStore } = require('./src/lib/share-store-kv');

async function debugShareData() {
  try {
    const allShares = await shareKVStore.getAll();
    console.log('📊 总分享数量:', allShares.length);
    
    const textToImageShares = allShares.filter(share => {
      // 检查 isTextToImage 字段
      if (typeof share.isTextToImage === 'boolean') {
        return share.isTextToImage;
      }
      // 回退检查
      const hasOriginal = share.originalUrl && 
        typeof share.originalUrl === 'string' && 
        share.originalUrl.trim() !== '' &&
        !share.originalUrl.startsWith('data:image/') &&
        !share.originalUrl.includes('placeholder.com') &&
        !share.originalUrl.includes('Text+to+Image') &&
        !share.originalUrl.includes('base64');
      
      return !hasOriginal;
    });
    
    console.log('🎨 文生图分享数量:', textToImageShares.length);
    console.log('🖼️ 图生图分享数量:', allShares.length - textToImageShares.length);
    
    console.log('\n📋 所有分享详情:');
    allShares.forEach((share, index) => {
      const isTextToImage = typeof share.isTextToImage === 'boolean' ? 
        share.isTextToImage : 
        !share.originalUrl || share.originalUrl.trim() === '';
      
      console.log(`${index + 1}. ID: ${share.id}`);
      console.log(`   Style: ${share.style}`);
      console.log(`   Original URL: ${share.originalUrl || 'null'}`);
      console.log(`   Is Text to Image: ${isTextToImage}`);
      console.log(`   Is Text to Image (field): ${share.isTextToImage}`);
      console.log('---');
    });
    
    console.log('\n✅ 调试完成');
  } catch (error) {
    console.error('❌ 调试失败:', error);
  }
}

debugShareData();