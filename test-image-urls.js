// 测试图片URL的可访问性
console.log('🔍 测试图片URL可访问性...');

// 测试URL列表
const testUrls = [
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/irasutoya-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%B5%9B%E9%A9%AC%E5%A8%98-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%B0%91%E5%A5%B3-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-after',
  'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after'
];

// 测试单个URL
async function testUrl(url) {
  try {
    console.log(`🔍 测试URL: ${url}`);
    
    // 方法1: 使用fetch测试
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`📊 HTTP状态: ${response.status} ${response.statusText}`);
    console.log(`📊 Content-Type: ${response.headers.get('content-type')}`);
    console.log(`📊 Content-Length: ${response.headers.get('content-length')}`);
    
    if (response.ok) {
      console.log('✅ URL可访问');
      return true;
    } else {
      console.log('❌ URL不可访问');
      return false;
    }
  } catch (error) {
    console.log(`❌ 请求失败: ${error.message}`);
    return false;
  }
}

// 测试所有URL
async function testAllUrls() {
  console.log('🚀 开始测试所有图片URL...\n');
  
  const results = [];
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    const isAccessible = await testUrl(url);
    results.push({ url, isAccessible });
    console.log('---\n');
    
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 总结结果
  console.log('📊 测试结果总结:');
  const accessibleCount = results.filter(r => r.isAccessible).length;
  const totalCount = results.length;
  
  console.log(`✅ 可访问: ${accessibleCount}/${totalCount}`);
  console.log(`❌ 不可访问: ${totalCount - accessibleCount}/${totalCount}`);
  
  if (accessibleCount === 0) {
    console.log('\n⚠️ 所有URL都不可访问，可能的原因:');
    console.log('1. URL格式不正确（缺少文件扩展名）');
    console.log('2. 访问权限问题');
    console.log('3. CORS跨域限制');
    console.log('4. 网络连接问题');
    console.log('5. 腾讯云COS配置问题');
  }
  
  return results;
}

// 测试图片元素加载
function testImageElements() {
  console.log('\n🔍 测试页面上的图片元素...');
  
  const images = document.querySelectorAll('img');
  console.log(`📊 找到 ${images.length} 个图片元素`);
  
  images.forEach((img, index) => {
    console.log(`📊 图片 ${index + 1}:`);
    console.log(`  - src: ${img.src}`);
    console.log(`  - complete: ${img.complete}`);
    console.log(`  - naturalWidth: ${img.naturalWidth}`);
    console.log(`  - naturalHeight: ${img.naturalHeight}`);
    console.log(`  - currentSrc: ${img.currentSrc}`);
    
    // 检查加载状态
    if (img.complete && img.naturalHeight !== 0) {
      console.log('  ✅ 图片已成功加载');
    } else if (img.complete && img.naturalHeight === 0) {
      console.log('  ❌ 图片加载失败');
    } else {
      console.log('  ⏳ 图片正在加载中');
    }
  });
}

// 创建测试图片
function createTestImages() {
  console.log('\n🔍 创建测试图片...');
  
  const testContainer = document.createElement('div');
  testContainer.style.position = 'fixed';
  testContainer.style.top = '10px';
  testContainer.style.right = '10px';
  testContainer.style.background = 'rgba(0,0,0,0.8)';
  testContainer.style.color = 'white';
  testContainer.style.padding = '10px';
  testContainer.style.borderRadius = '5px';
  testContainer.style.fontSize = '12px';
  testContainer.style.zIndex = '9999';
  testContainer.innerHTML = '<h3>图片测试</h3>';
  
  document.body.appendChild(testContainer);
  
  // 为每个测试URL创建一个小图片
  testUrls.forEach((url, index) => {
    const img = document.createElement('img');
    img.src = url;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.margin = '2px';
    img.style.border = '1px solid white';
    img.style.objectFit = 'cover';
    
    img.onload = () => {
      console.log(`✅ 测试图片 ${index + 1} 加载成功: ${url}`);
      img.style.border = '1px solid green';
    };
    
    img.onerror = () => {
      console.log(`❌ 测试图片 ${index + 1} 加载失败: ${url}`);
      img.style.border = '1px solid red';
      img.style.background = 'red';
    };
    
    testContainer.appendChild(img);
  });
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始全面图片测试...');
  
  // 测试URL可访问性
  await testAllUrls();
  
  // 测试页面图片元素
  testImageElements();
  
  // 创建测试图片
  createTestImages();
  
  console.log('\n🎯 测试完成！');
  console.log('请查看页面右上角的测试图片区域');
}

// 运行测试
runAllTests(); 