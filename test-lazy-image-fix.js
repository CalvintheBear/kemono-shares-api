// 测试LazyImage修复效果
console.log('🔍 测试LazyImage修复效果...');

// 检查页面上的图片元素
function checkImages() {
  console.log('\n📊 检查页面图片状态:');
  
  // 检查所有LazyImage组件
  const lazyImages = document.querySelectorAll('[data-testid="lazy-image"]');
  console.log(`📊 找到 ${lazyImages.length} 个LazyImage组件`);
  
  // 检查所有img标签
  const imgElements = document.querySelectorAll('img');
  console.log(`📊 找到 ${imgElements.length} 个img标签`);
  
  // 检查图片加载状态
  let loadedCount = 0;
  let loadingCount = 0;
  let errorCount = 0;
  
  imgElements.forEach((img, index) => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedCount++;
      console.log(`✅ 图片 ${index + 1} 已加载: ${img.src}`);
    } else if (img.complete && img.naturalHeight === 0) {
      errorCount++;
      console.log(`❌ 图片 ${index + 1} 加载失败: ${img.src}`);
    } else {
      loadingCount++;
      console.log(`⏳ 图片 ${index + 1} 加载中: ${img.src}`);
    }
  });
  
  console.log(`\n📈 图片加载统计:`);
  console.log(`✅ 已加载: ${loadedCount}`);
  console.log(`⏳ 加载中: ${loadingCount}`);
  console.log(`❌ 加载失败: ${errorCount}`);
  
  return { loadedCount, loadingCount, errorCount };
}

// 检查画廊项目
function checkGalleryItems() {
  console.log('\n📊 检查画廊项目:');
  
  // 检查所有画廊项目
  const galleryItems = document.querySelectorAll('[class*="group cursor-pointer"]');
  console.log(`📊 找到 ${galleryItems.length} 个画廊项目`);
  
  // 检查每个项目的图片容器
  galleryItems.forEach((item, index) => {
    const imageContainer = item.querySelector('[class*="relative overflow-hidden"]');
    const img = item.querySelector('img');
    
    console.log(`📊 项目 ${index + 1}:`);
    console.log(`  - 图片容器: ${imageContainer ? '存在' : '不存在'}`);
    console.log(`  - 图片元素: ${img ? '存在' : '不存在'}`);
    console.log(`  - 图片URL: ${img ? img.src : '无'}`);
    console.log(`  - 图片加载状态: ${img ? (img.complete ? '已加载' : '加载中') : '无图片'}`);
  });
  
  return galleryItems.length;
}

// 检查CSS Grid布局
function checkGridLayout() {
  console.log('\n📊 检查Grid布局:');
  
  const gridContainer = document.querySelector('[class*="grid grid-cols"]');
  if (gridContainer) {
    console.log('✅ 找到Grid容器');
    
    // 检查Grid子元素
    const gridItems = gridContainer.children;
    console.log(`📊 Grid子元素数量: ${gridItems.length}`);
    
    // 检查每个Grid项目的可见性
    Array.from(gridItems).forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      console.log(`📊 Grid项目 ${index + 1}: ${isVisible ? '可见' : '不可见'}`);
    });
  } else {
    console.log('❌ 未找到Grid容器');
  }
}

// 检查无限滚动状态
function checkInfiniteScroll() {
  console.log('\n📊 检查无限滚动状态:');
  
  // 检查加载指示器
  const loadingIndicator = document.querySelector('[class*="animate-spin"]');
  console.log(`📊 加载指示器: ${loadingIndicator ? '存在' : '不存在'}`);
  
  // 检查是否有更多内容
  const hasMoreText = document.querySelector('p:contains("スクロールしてさらに読み込む")');
  console.log(`📊 更多内容提示: ${hasMoreText ? '存在' : '不存在'}`);
  
  // 检查滚动位置
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  console.log(`📊 滚动状态:`);
  console.log(`  - 当前滚动位置: ${scrollTop}`);
  console.log(`  - 窗口高度: ${windowHeight}`);
  console.log(`  - 文档高度: ${documentHeight}`);
  console.log(`  - 距离底部: ${documentHeight - scrollTop - windowHeight}`);
}

// 主测试函数
function runTests() {
  console.log('🚀 开始LazyImage修复测试...');
  
  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runTests, 1000);
    });
    return;
  }
  
  // 等待图片加载
  setTimeout(() => {
    checkImages();
    checkGalleryItems();
    checkGridLayout();
    checkInfiniteScroll();
    
    console.log('\n🎯 测试完成！');
    console.log('如果看到所有图片都正确显示，说明修复成功！');
  }, 2000);
}

// 运行测试
runTests();

// 监听图片加载事件
window.addEventListener('load', () => {
  console.log('📊 页面完全加载完成，重新检查图片状态...');
  setTimeout(checkImages, 1000);
}); 