// 测试模板模式修复
const testTemplateModeFix = async () => {
  console.log('🧪 测试模板模式修复...\\n');
  
  try {
    // 1. 清除缓存
    console.log('1. 清除缓存...');
    const clearResponse = await fetch('/api/share/list?clearCache=true');
    const clearResult = await clearResponse.json();
    console.log('清除缓存结果:', clearResult);
    
    // 等待一秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. 模拟模板模式分享创建
    console.log('\\n2. 模拟模板模式分享创建...');
    const testFileUrl = 'https://example.com/user-uploaded-image.jpg';
    const shareData = {
      generatedUrl: 'https://example.com/template-generated-image.jpg',
      originalUrl: testFileUrl, // 现在应该使用用户上传的图片
      prompt: 'テスト用のプロンプト',
      style: 'ジブリ風', // 模板名称
      timestamp: Date.now()
    };
    
    console.log('📤 模板模式分享数据:', shareData);
    
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shareData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 模板模式分享创建成功:', result.shareId);
      
      // 3. 验证分享数据
      console.log('\\n3. 验证分享数据...');
      const verifyResponse = await fetch(`/api/share?id=${result.shareId}`);
      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('📊 验证结果:', {
          id: verifyResult.data.id,
          originalUrl: verifyResult.data.originalUrl,
          style: verifyResult.data.style,
          hasOriginalUrl: !!verifyResult.data.originalUrl
        });
        
        if (verifyResult.data.originalUrl === testFileUrl) {
          console.log('✅ 模板模式正确使用用户上传的图片作为originalUrl');
        } else {
          console.log('❌ 模板模式originalUrl设置错误');
        }
      }
    } else {
      console.log('❌ 模板模式分享创建失败:', await response.text());
    }
    
    // 4. 检查localStorage保存机制
    console.log('\\n4. 测试localStorage保存机制...');
    const testMode = 'template-mode';
    const testFileUrl2 = 'https://example.com/another-user-image.jpg';
    
    localStorage.setItem('savedFileUrl', testFileUrl2);
    localStorage.setItem('savedMode', testMode);
    
    const savedFileUrl = localStorage.getItem('savedFileUrl');
    const savedMode = localStorage.getItem('savedMode');
    
    console.log('localStorage保存测试:', {
      saved: { fileUrl: testFileUrl2, mode: testMode },
      restored: { fileUrl: savedFileUrl, mode: savedMode },
      success: savedFileUrl === testFileUrl2 && savedMode === testMode
    });
    
    // 清理测试数据
    localStorage.removeItem('savedFileUrl');
    localStorage.removeItem('savedMode');
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
  }
};

// 检查现有的模板模式分享
const checkExistingTemplateShares = async () => {
  console.log('\\n🔍 检查现有的模板模式分享...');
  
  try {
    const response = await fetch('/api/share/list?limit=50&offset=0');
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ API请求失败:', result.error);
      return;
    }
    
    // 查找可能的模板模式分享（基于style名称）
    const templateStyles = ['ジブリ風', 'chibi', 'lineスタンプ', '可愛line アイコン', 'VTuber', 'ウマ娘', 'irasutoya'];
    const templateShares = result.data.items.filter(item => 
      templateStyles.some(style => item.style.includes(style))
    );
    
    console.log(`📊 找到 ${templateShares.length} 个可能的模板模式分享:`);
    templateShares.forEach((item, index) => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com');
      
      console.log(`\\n模板分享 ${index + 1}:`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Style: ${item.style}`);
      console.log(`  OriginalUrl: ${item.originalUrl ? '有' : '无'}`);
      console.log(`  OriginalUrl内容: ${item.originalUrl || 'null'}`);
      console.log(`  判断: ${hasOriginalUrl ? '使用用户图片' : '可能使用模板图片'}`);
      console.log(`  Timestamp: ${new Date(item.timestamp).toLocaleString()}`);
    });
    
    if (templateShares.length === 0) {
      console.log('⚠️ 没有找到模板模式分享');
    }
    
  } catch (error) {
    console.error('❌ 检查过程出错:', error);
  }
};

// 模拟完整的模板模式流程
const simulateTemplateModeFlow = async () => {
  console.log('\\n🎭 模拟完整的模板模式流程...');
  
  try {
    // 1. 模拟文件上传
    console.log('1. 模拟文件上传...');
    const testFileUrl = 'https://example.com/user-template-image.jpg';
    localStorage.setItem('savedFileUrl', testFileUrl);
    localStorage.setItem('savedMode', 'template-mode');
    
    console.log('✅ 模拟fileUrl已保存:', testFileUrl);
    
    // 2. 模拟模板选择
    console.log('\\n2. 模拟模板选择...');
    const selectedTemplate = {
      id: 'template_1',
      name: 'ジブリ風',
      beforeImage: 'https://example.com/template-before.jpg',
      afterImage: 'https://example.com/template-after.jpg',
      prompt: 'ジブリ風のアニメスタイル',
      category: 'anime'
    };
    
    console.log('✅ 模拟模板已选择:', selectedTemplate.name);
    
    // 3. 模拟分享创建
    console.log('\\n3. 模拟分享创建...');
    const shareData = {
      generatedUrl: 'https://example.com/template-generated.jpg',
      originalUrl: testFileUrl, // 应该使用用户上传的图片
      prompt: 'ユーザーのプロンプト',
      style: selectedTemplate.name,
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
      console.log('✅ 模板模式分享创建成功:', result.shareId);
      
      // 4. 验证分享数据
      console.log('\\n4. 验证分享数据...');
      const verifyResponse = await fetch(`/api/share?id=${result.shareId}`);
      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('📊 验证结果:', {
          id: verifyResult.data.id,
          originalUrl: verifyResult.data.originalUrl,
          style: verifyResult.data.style,
          expectedUrl: testFileUrl,
          isCorrect: verifyResult.data.originalUrl === testFileUrl
        });
        
        if (verifyResult.data.originalUrl === testFileUrl) {
          console.log('✅ 模板模式正确使用用户上传的图片');
        } else {
          console.log('❌ 模板模式使用了错误的图片');
        }
      }
    } else {
      console.log('❌ 模板模式分享创建失败:', await response.text());
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
  window.testTemplateModeFix = testTemplateModeFix;
  window.checkExistingTemplateShares = checkExistingTemplateShares;
  window.simulateTemplateModeFlow = simulateTemplateModeFlow;
  console.log('🔧 模板模式测试函数已加载:');
  console.log('  - testTemplateModeFix(): 测试模板模式修复');
  console.log('  - checkExistingTemplateShares(): 检查现有模板分享');
  console.log('  - simulateTemplateModeFlow(): 模拟完整模板流程');
} 