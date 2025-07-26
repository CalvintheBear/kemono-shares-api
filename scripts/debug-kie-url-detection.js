#!/usr/bin/env node

/**
 * 调试KIE AI URL检测逻辑
 */

// 模拟KIE AI URL检测函数
function isKieTemporaryUrl(url) {
  const kieDomains = [
    'kieai.com',
    'kie.ai',
    'api.kieai.com',
    'cdn.kieai.com',
    'kie-ai.com',
    'kieai.ai'
  ];
  
  const isKieUrl = kieDomains.some(domain => url.includes(domain));
  console.log(`🔍 KIE AI URL检测: ${url} -> ${isKieUrl ? '是KIE AI URL' : '不是KIE AI URL'}`);
  
  return isKieUrl;
}

// 测试各种URL格式
const testUrls = [
  'https://api.kieai.com/generated/image123.png',
  'https://kieai.com/images/result.png',
  'https://kie.ai/output/file.jpg',
  'https://cdn.kieai.com/temp/image.png',
  'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/image.png',
  'https://example.com/image.png',
  'https://imgbb.com/image.jpg'
];

console.log('🧪 测试KIE AI URL检测逻辑...\n');

testUrls.forEach(url => {
  isKieTemporaryUrl(url);
});

console.log('\n📝 分析结果:');
console.log('- 如果KIE AI URL没有被正确识别，需要更新检测逻辑');
console.log('- 如果R2 URL被误识别为KIE AI URL，需要排除R2域名');
console.log('- 建议添加更多KIE AI域名到检测列表中');

console.log('\n🔧 可能的解决方案:');
console.log('1. 检查真实的KIE AI URL格式');
console.log('2. 更新KIE AI域名列表');
console.log('3. 排除R2域名避免误判');
console.log('4. 添加更精确的URL模式匹配'); 