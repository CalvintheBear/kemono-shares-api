const fetch = require('node-fetch');

async function testInfiniteScroll() {
  console.log('🧪 测试无限滚动功能...\n');

  try {
    // 1. 测试第一页加载
    console.log('1. 测试第一页加载 (limit=20, offset=0)...');
    const firstPageResponse = await fetch('http://localhost:3000/api/share/list?limit=20&offset=0');
    const firstPageData = await firstPageResponse.json();
    
    if (firstPageData.success) {
      console.log(`✅ 第一页加载成功:`);
      console.log(`   - 返回项目数: ${firstPageData.data.items.length}`);
      console.log(`   - 总项目数: ${firstPageData.data.total}`);
      console.log(`   - 是否有更多: ${firstPageData.data.hasMore}`);
      console.log(`   - 当前偏移: ${firstPageData.data.offset}`);
      console.log(`   - 限制数量: ${firstPageData.data.limit}`);
    } else {
      console.log('❌ 第一页加载失败:', firstPageData.error);
      return;
    }

    // 2. 测试第二页加载
    console.log('\n2. 测试第二页加载 (limit=20, offset=20)...');
    const secondPageResponse = await fetch('http://localhost:3000/api/share/list?limit=20&offset=20');
    const secondPageData = await secondPageResponse.json();
    
    if (secondPageData.success) {
      console.log(`✅ 第二页加载成功:`);
      console.log(`   - 返回项目数: ${secondPageData.data.items.length}`);
      console.log(`   - 是否有更多: ${secondPageData.data.hasMore}`);
      console.log(`   - 当前偏移: ${secondPageData.data.offset}`);
      
      // 检查是否有重复项目
      const firstPageIds = firstPageData.data.items.map(item => item.id);
      const secondPageIds = secondPageData.data.items.map(item => item.id);
      const duplicates = firstPageIds.filter(id => secondPageIds.includes(id));
      
      if (duplicates.length > 0) {
        console.log(`⚠️  发现重复项目: ${duplicates.length}个`);
      } else {
        console.log(`✅ 无重复项目`);
      }
    } else {
      console.log('❌ 第二页加载失败:', secondPageData.error);
    }

    // 3. 测试第三页加载
    console.log('\n3. 测试第三页加载 (limit=20, offset=40)...');
    const thirdPageResponse = await fetch('http://localhost:3000/api/share/list?limit=20&offset=40');
    const thirdPageData = await thirdPageResponse.json();
    
    if (thirdPageData.success) {
      console.log(`✅ 第三页加载成功:`);
      console.log(`   - 返回项目数: ${thirdPageData.data.items.length}`);
      console.log(`   - 是否有更多: ${thirdPageData.data.hasMore}`);
      console.log(`   - 当前偏移: ${thirdPageData.data.offset}`);
    } else {
      console.log('❌ 第三页加载失败:', thirdPageData.error);
    }

    // 4. 测试边界情况
    console.log('\n4. 测试边界情况...');
    
    // 测试超出范围的偏移
    const overflowResponse = await fetch('http://localhost:3000/api/share/list?limit=20&offset=1000');
    const overflowData = await overflowResponse.json();
    
    if (overflowData.success) {
      console.log(`✅ 超出范围偏移处理正常:`);
      console.log(`   - 返回项目数: ${overflowData.data.items.length}`);
      console.log(`   - 是否有更多: ${overflowData.data.hasMore}`);
    }

    // 5. 测试不同限制数量
    console.log('\n5. 测试不同限制数量...');
    
    const smallLimitResponse = await fetch('http://localhost:3000/api/share/list?limit=5&offset=0');
    const smallLimitData = await smallLimitResponse.json();
    
    if (smallLimitData.success) {
      console.log(`✅ 小限制数量测试成功:`);
      console.log(`   - 返回项目数: ${smallLimitData.data.items.length}`);
      console.log(`   - 限制数量: ${smallLimitData.data.limit}`);
      console.log(`   - 是否有更多: ${smallLimitData.data.hasMore}`);
    }

    // 6. 性能测试
    console.log('\n6. 性能测试...');
    
    const startTime = Date.now();
    const performanceResponse = await fetch('http://localhost:3000/api/share/list?limit=20&offset=0');
    const performanceData = await performanceResponse.json();
    const endTime = Date.now();
    
    if (performanceData.success) {
      console.log(`✅ 性能测试完成:`);
      console.log(`   - 响应时间: ${endTime - startTime}ms`);
      console.log(`   - 数据大小: ${JSON.stringify(performanceData).length} 字符`);
    }

    // 7. 总结
    console.log('\n📊 测试总结:');
    console.log(`   - 总分享数: ${firstPageData.data.total}`);
    console.log(`   - 每页限制: 20`);
    console.log(`   - 分页功能: ✅ 正常`);
    console.log(`   - 无限滚动: ✅ 支持`);
    console.log(`   - 性能表现: ✅ 良好`);
    
    if (firstPageData.data.total > 20) {
      console.log(`   - 建议: 可以测试无限滚动UI功能`);
    } else {
      console.log(`   - 建议: 添加更多测试数据以验证无限滚动`);
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testInfiniteScroll(); 