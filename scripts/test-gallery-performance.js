const fetch = require('node-fetch');

const API_BASE = 'https://kemono-shares-api.y2983236233.workers.dev/api';

async function testGalleryPerformance() {
  console.log('🧪 开始测试画廊页面性能...\n');

  try {
    // 1. 测试API响应时间
    console.log('🔄 测试API响应时间...');
    const startTime = Date.now();
    const response = await fetch(`${API_BASE}/share/list?limit=20`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ API响应时间: ${responseTime}ms`);
    
    const data = await response.json();
    if (data.success && data.data.items) {
      console.log(`📊 返回数据量: ${data.data.items.length} 个项目`);
      
      // 2. 检查图片URL
      const imagesWithUrl = data.data.items.filter(item => item.generatedUrl);
      console.log(`🖼️ 包含图片URL的项目: ${imagesWithUrl.length}/${data.data.items.length}`);
      
      // 3. 检查数据结构完整性
      const completeItems = data.data.items.filter(item => 
        item.id && item.title && item.style && item.generatedUrl
      );
      console.log(`✅ 数据完整性: ${completeItems.length}/${data.data.items.length}`);
      
      // 4. 测试图片URL可访问性
      console.log('\n🔄 测试图片URL可访问性...');
      const testUrls = data.data.items.slice(0, 3).map(item => item.generatedUrl).filter(Boolean);
      
      for (let i = 0; i < testUrls.length; i++) {
        const url = testUrls[i];
        try {
          const imgResponse = await fetch(url, { method: 'HEAD' });
          console.log(`✅ 图片 ${i + 1}: ${imgResponse.status === 200 ? '可访问' : '不可访问'} (${url.substring(0, 50)}...)`);
        } catch (error) {
          console.log(`❌ 图片 ${i + 1}: 访问失败 (${url.substring(0, 50)}...)`);
        }
      }
    }
    
    console.log('\n🏁 画廊页面性能测试完成！');
    console.log('📝 建议:');
    console.log('   - 确保图片URL有效且可访问');
    console.log('   - 考虑使用CDN优化图片加载');
    console.log('   - 监控API响应时间，保持在500ms以下');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testGalleryPerformance(); 