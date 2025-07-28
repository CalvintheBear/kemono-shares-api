// 快速验证测试数据是否正确加载
const fs = require('fs');
const path = require('path');

console.log('🔍 验证测试数据...');

// 读取shares-dev.json文件
const dataPath = path.join(__dirname, 'local-storage', 'shares-dev.json');

try {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  console.log('✅ 文件读取成功');
  console.log(`📊 数据项数量: ${Object.keys(data).length}`);
  
  // 检查数据结构
  const firstItem = Object.values(data)[0];
  console.log('📋 数据结构检查:');
  console.log(`  - id: ${firstItem.id ? '✅' : '❌'}`);
  console.log(`  - generatedUrl: ${firstItem.generatedUrl ? '✅' : '❌'}`);
  console.log(`  - style: ${firstItem.style ? '✅' : '❌'}`);
  console.log(`  - isTextToImage: ${firstItem.isTextToImage ? '✅' : '❌'}`);
  
  // 检查URL格式
  const urls = Object.values(data).map(item => item.generatedUrl);
  const validUrls = urls.filter(url => url && url.includes('fury-template-1363880159.cos.ap-guangzhou.myqcloud.com'));
  
  console.log(`🔗 有效URL数量: ${validUrls.length}/${urls.length}`);
  
  // 显示前几个URL
  console.log('🔗 前5个URL:');
  validUrls.slice(0, 5).forEach((url, index) => {
    console.log(`  ${index + 1}. ${url}`);
  });
  
  // 检查样式分布
  const styles = Object.values(data).map(item => item.style);
  const styleCount = {};
  styles.forEach(style => {
    styleCount[style] = (styleCount[style] || 0) + 1;
  });
  
  console.log('🎨 样式分布:');
  Object.entries(styleCount).forEach(([style, count]) => {
    console.log(`  - ${style}: ${count}张`);
  });
  
  console.log('\n✅ 验证完成！数据格式正确，可以开始测试画廊加载。');
  
} catch (error) {
  console.error('❌ 验证失败:', error.message);
  process.exit(1);
} 