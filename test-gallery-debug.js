// 测试画廊API和分页逻辑
async function testGalleryAPI() {
  console.log('🔍 开始测试画廊API...');
  
  try {
    // 测试第一页
    console.log('\n📄 测试第一页 (limit=20, offset=0)');
    const response1 = await fetch('/api/share/list?limit=20&offset=0');
    const result1 = await response1.json();
    
    if (result1.success) {
      console.log(`✅ 第一页成功: ${result1.data.items.length} 个项目`);
      console.log(`📊 总数: ${result1.data.total}, hasMore: ${result1.data.hasMore}`);
      console.log(`📊 分页信息: limit=${result1.data.limit}, offset=${result1.data.offset}`);
      
      // 显示前5个项目的信息
      result1.data.items.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.id} - ${item.style} - ${item.generatedUrl ? '有图片' : '无图片'}`);
      });
    } else {
      console.log('❌ 第一页失败:', result1.error);
    }
    
    // 测试第二页
    console.log('\n📄 测试第二页 (limit=20, offset=20)');
    const response2 = await fetch('/api/share/list?limit=20&offset=20');
    const result2 = await response2.json();
    
    if (result2.success) {
      console.log(`✅ 第二页成功: ${result2.data.items.length} 个项目`);
      console.log(`📊 总数: ${result2.data.total}, hasMore: ${result2.data.hasMore}`);
      console.log(`📊 分页信息: limit=${result2.data.limit}, offset=${result2.data.offset}`);
      
      // 显示前5个项目的信息
      result2.data.items.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.id} - ${item.style} - ${item.generatedUrl ? '有图片' : '无图片'}`);
      });
    } else {
      console.log('❌ 第二页失败:', result2.error);
    }
    
    // 测试第三页
    console.log('\n📄 测试第三页 (limit=20, offset=40)');
    const response3 = await fetch('/api/share/list?limit=20&offset=40');
    const result3 = await response3.json();
    
    if (result3.success) {
      console.log(`✅ 第三页成功: ${result3.data.items.length} 个项目`);
      console.log(`📊 总数: ${result3.data.total}, hasMore: ${result3.data.hasMore}`);
      console.log(`📊 分页信息: limit=${result3.data.limit}, offset=${result3.data.offset}`);
      
      // 显示前5个项目的信息
      result3.data.items.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.id} - ${item.style} - ${item.generatedUrl ? '有图片' : '无图片'}`);
      });
    } else {
      console.log('❌ 第三页失败:', result3.error);
    }
    
    // 分析分页逻辑
    console.log('\n📊 分页逻辑分析:');
    const totalItems = result1.data.total;
    const itemsPerPage = 20;
    const expectedPages = Math.ceil(totalItems / itemsPerPage);
    console.log(`📊 总项目数: ${totalItems}`);
    console.log(`📊 每页项目数: ${itemsPerPage}`);
    console.log(`📊 预期页数: ${expectedPages}`);
    
    // 验证hasMore逻辑
    for (let offset = 0; offset < totalItems; offset += itemsPerPage) {
      const expectedHasMore = offset + itemsPerPage < totalItems;
      console.log(`📊 offset=${offset}: 预期hasMore=${expectedHasMore}`);
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 测试前端状态管理
function testFrontendState() {
  console.log('\n🔍 测试前端状态管理...');
  
  // 模拟状态
  let shareLinks = [];
  let totalCount = 0;
  let hasMore = true;
  let currentOffset = 0;
  const ITEMS_PER_PAGE = 20;
  
  // 模拟API调用
  const mockFetchShareLinks = async (offset, append) => {
    console.log(`📡 模拟API调用: offset=${offset}, append=${append}`);
    
    // 模拟API响应
    const mockItems = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
      id: `share_${offset + i}`,
      title: `テスト${offset + i}変換`,
      style: 'テスト',
      timestamp: new Date().toLocaleDateString('ja-JP'),
      generatedUrl: `https://example.com/image${offset + i}.jpg`,
      originalUrl: null
    }));
    
    const mockResponse = {
      success: true,
      data: {
        items: mockItems,
        total: 52, // 模拟总数
        limit: ITEMS_PER_PAGE,
        offset: offset,
        hasMore: offset + ITEMS_PER_PAGE < 52
      }
    };
    
    // 更新状态
    if (append) {
      shareLinks = [...shareLinks, ...mockResponse.data.items];
    } else {
      shareLinks = mockResponse.data.items;
    }
    
    totalCount = mockResponse.data.total;
    hasMore = mockResponse.data.hasMore;
    currentOffset = offset + ITEMS_PER_PAGE;
    
    console.log(`📊 状态更新: shareLinks.length=${shareLinks.length}, totalCount=${totalCount}, hasMore=${hasMore}`);
    
    return mockResponse;
  };
  
  // 测试初始加载
  mockFetchShareLinks(0, false);
  
  // 测试追加加载
  setTimeout(() => {
    mockFetchShareLinks(20, true);
  }, 1000);
  
  setTimeout(() => {
    mockFetchShareLinks(40, true);
  }, 2000);
}

// 运行测试
console.log('🚀 开始画廊调试测试...');
testGalleryAPI();
testFrontendState(); 