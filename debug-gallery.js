const fs = require('fs');
const path = require('path');

// Debug gallery filtering directly via API call simulation
async function debugGallery() {
  console.log('🔍 开始调试画廊文生图显示问题...');
  
  // 模拟测试数据
  const mockShares = [
    {
      id: 'share_123456789',
      generatedUrl: 'https://example.com/generated1.jpg',
      originalUrl: null, // 文生图
      prompt: 'anime girl with blue hair',
      style: 'Ghibli',
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      isTextToImage: true
    },
    {
      id: 'share_987654321',
      generatedUrl: 'https://example.com/generated2.jpg',
      originalUrl: 'https://example.com/original.jpg', // 图生图
      prompt: 'anime style portrait',
      style: 'VTuber',
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      isTextToImage: false
    }
  ];
  
  // 测试过滤逻辑
  console.log('📊 测试数据:');
  mockShares.forEach(share => {
    console.log(`- ID: ${share.id}`);
    console.log(`  原始URL: ${share.originalUrl}`);
    console.log(`  isTextToImage字段: ${share.isTextToImage}`);
    console.log(`  预期在画廊显示: ${share.isTextToImage ? '是' : '否'}`);
    console.log('---');
  });
  
  // 测试当前过滤逻辑
  const filtered = mockShares.filter(share => {
    // 复制列表API的过滤逻辑
    if (typeof share.isTextToImage === 'boolean') {
      return share.isTextToImage;
    }
    
    const hasValidOriginalUrl = share.originalUrl && 
      typeof share.originalUrl === 'string' && 
      share.originalUrl.trim() !== '' &&
      !share.originalUrl.startsWith('data:image/') &&
      !share.originalUrl.includes('placeholder.com') &&
      !share.originalUrl.includes('Text+to+Image') &&
      !share.originalUrl.includes('base64') &&
      share.originalUrl.length <= 1000;
    
    return !hasValidOriginalUrl;
  });
  
  console.log('🎯 过滤结果:');
  console.log(`- 总分享: ${mockShares.length}个`);
  console.log(`- 文生图显示: ${filtered.length}个`);
  console.log(`- 图生图隐藏: ${mockShares.length - filtered.length}个`);
  
  console.log('\n✅ 过滤逻辑测试完成');
}

debugGallery();