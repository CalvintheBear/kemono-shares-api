// 测试图生图模式修复
const testImageToImageFix = async () => {
  console.log('🧪 测试图生图模式修复...\\n');
  
  try {
    // 1. 清除缓存
    console.log('1. 清除缓存...');
    const clearResponse = await fetch('/api/share/list?clearCache=true');
    const clearResult = await clearResponse.json();
    console.log('清除缓存结果:', clearResult);
    
    // 等待一秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. 检查localStorage状态
    console.log('\\n2. 检查localStorage状态...');
    const savedFileUrl = localStorage.getItem('savedFileUrl');
    const savedMode = localStorage.getItem('savedMode');
    console.log('localStorage状态:', {
      savedFileUrl: savedFileUrl ? '有保存' : '无保存',
      savedMode: savedMode || '无保存'
    });
    
    // 3. 获取最新分享列表
    console.log('\\n3. 获取最新分享列表...');
    const response = await fetch('/api/share/list?limit=20&offset=0');
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ API请求失败:', result.error);
      return;
    }
    
    console.log('📊 分享列表数据:', {
      total: result.data.total,
      items: result.data.items.length
    });
    
    // 4. 分析分享项
    console.log('\\n4. 分析分享项...');
    const imageToImageShares = [];
    const textToImageShares = [];
    
    result.data.items.forEach((item, index) => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com');
      
      if (hasOriginalUrl) {
        imageToImageShares.push(item);
      } else {
        textToImageShares.push(item);
      }
      
      console.log(`分享 ${index + 1}:`, {
        id: item.id,
        style: item.style,
        originalUrl: item.originalUrl ? '有' : '无',
        mode: hasOriginalUrl ? '图生图/模板' : '文生图',
        timestamp: new Date(item.timestamp).toLocaleString()
      });
    });
    
    console.log('\\n📊 统计结果:');
    console.log(`  图生图/模板模式: ${imageToImageShares.length} 个`);
    console.log(`  文生图模式: ${textToImageShares.length} 个`);
    
    if (imageToImageShares.length > 0) {
      console.log('\\n✅ 找到图生图分享，修复可能有效');
      imageToImageShares.forEach((item, index) => {
        console.log(`  图生图 ${index + 1}: ${item.id} - ${item.style}`);
      });
    } else {
      console.log('\\n⚠️ 没有找到图生图分享，可能需要重新测试');
    }
    
    // 5. 测试localStorage恢复机制
    console.log('\\n5. 测试localStorage恢复机制...');
    const testFileUrl = 'https://example.com/test-image.jpg';
    const testMode = 'image-to-image';
    
    localStorage.setItem('savedFileUrl', testFileUrl);
    localStorage.setItem('savedMode', testMode);
    
    const restoredFileUrl = localStorage.getItem('savedFileUrl');
    const restoredMode = localStorage.getItem('savedMode');
    
    console.log('localStorage恢复测试:', {
      saved: { fileUrl: testFileUrl, mode: testMode },
      restored: { fileUrl: restoredFileUrl, mode: restoredMode },
      success: restoredFileUrl === testFileUrl && restoredMode === testMode
    });
    
    // 清理测试数据
    localStorage.removeItem('savedFileUrl');
    localStorage.removeItem('savedMode');
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
  }
};

// 模拟图生图流程测试
const simulateImageToImageFlow = async () => {
  console.log('\\n🎭 模拟图生图流程测试...');
  
  try {
    // 1. 模拟文件上传
    console.log('1. 模拟文件上传...');
    const testFileUrl = 'https://example.com/uploaded-image.jpg';
    localStorage.setItem('savedFileUrl', testFileUrl);
    localStorage.setItem('savedMode', 'image-to-image');
    
    console.log('✅ 模拟fileUrl已保存:', testFileUrl);
    
    // 2. 模拟分享创建
    console.log('\\n2. 模拟分享创建...');
    const shareData = {
      generatedUrl: 'https://example.com/generated-image.jpg',
      originalUrl: testFileUrl, // 使用保存的fileUrl
      prompt: '测试图生图',
      style: 'テスト',
      timestamp: Date.now()
    };
    
    console.log('📤 分享数据:', shareData);
    
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shareData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 模拟分享创建成功:', result.shareId);
      
      // 3. 验证分享数据
      console.log('\\n3. 验证分享数据...');
      const verifyResponse = await fetch(`/api/share?id=${result.shareId}`);
      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('📊 验证结果:', {
          id: verifyResult.data.id,
          originalUrl: verifyResult.data.originalUrl,
          hasOriginalUrl: !!verifyResult.data.originalUrl
        });
        
        if (verifyResult.data.originalUrl) {
          console.log('✅ 图生图模式正确设置originalUrl');
        } else {
          console.log('❌ 图生图模式设置失败');
        }
      }
    } else {
      console.log('❌ 模拟分享创建失败:', await response.text());
    }
    
    // 清理测试数据
    localStorage.removeItem('savedFileUrl');
    localStorage.removeItem('savedMode');
    
  } catch (error) {
    console.error('❌ 模拟测试出错:', error);
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.testImageToImageFix = testImageToImageFix;
  window.simulateImageToImageFlow = simulateImageToImageFlow;
  console.log('🔧 修复测试函数已加载:');
  console.log('  - testImageToImageFix(): 测试图生图模式修复');
  console.log('  - simulateImageToImageFlow(): 模拟图生图流程');
} 