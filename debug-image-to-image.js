// 调试图生图模式的分享创建过程
const debugImageToImage = async () => {
  console.log('🔍 开始调试图生图模式...\\n');
  
  try {
    // 1. 检查最新的分享数据
    console.log('1. 检查最新的分享数据...');
    const response = await fetch('/api/share/list?limit=10&offset=0');
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ API请求失败:', result.error);
      return;
    }
    
    console.log('📊 最新分享数据:');
    result.data.items.forEach((item, index) => {
      console.log(`\\n分享 ${index + 1}:`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Style: ${item.style}`);
      console.log(`  OriginalUrl: ${item.originalUrl}`);
      console.log(`  GeneratedUrl: ${item.generatedUrl ? '有' : '无'}`);
      console.log(`  Timestamp: ${new Date(item.timestamp).toLocaleString()}`);
      
      // 判断模式
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com');
      
      const mode = hasOriginalUrl ? '图生图/模板' : '文生图';
      console.log(`  判断模式: ${mode}`);
    });
    
    // 2. 检查分享创建API
    console.log('\\n2. 检查分享创建API...');
    const testShareData = {
      generatedUrl: 'https://example.com/test.jpg',
      originalUrl: 'https://example.com/original.jpg', // 模拟图生图
      prompt: '测试图生图',
      style: 'テスト',
      timestamp: Date.now()
    };
    
    console.log('📤 测试分享数据:', testShareData);
    
    const createResponse = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testShareData)
    });
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('✅ 测试分享创建成功:', createResult);
    } else {
      console.log('❌ 测试分享创建失败:', await createResponse.text());
    }
    
  } catch (error) {
    console.error('❌ 调试过程出错:', error);
  }
};

// 检查图生图模式的文件上传
const debugFileUpload = async () => {
  console.log('\\n🔍 检查文件上传过程...');
  
  // 模拟文件上传的API调用
  const formData = new FormData();
  const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  formData.append('file', testFile);
  
  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('📤 文件上传API返回:', result);
    } else {
      console.log('❌ 文件上传API失败:', await response.text());
    }
  } catch (error) {
    console.log('❌ 文件上传测试失败:', error);
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.debugImageToImage = debugImageToImage;
  window.debugFileUpload = debugFileUpload;
  console.log('🔧 调试函数已加载:');
  console.log('  - debugImageToImage(): 调试图生图模式');
  console.log('  - debugFileUpload(): 调试文件上传');
} 