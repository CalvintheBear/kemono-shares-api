// 测试图生图模式的完整流程
const testImageToImageFlow = async () => {
  console.log('🧪 开始测试图生图模式完整流程...\\n');
  
  try {
    // 1. 模拟文件上传
    console.log('1. 模拟文件上传...');
    const formData = new FormData();
    const testFile = new File(['test image data'], 'test.jpg', { type: 'image/jpeg' });
    formData.append('file', testFile);
    
    const uploadResponse = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    
    let fileUrl = null;
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      fileUrl = uploadResult.url || uploadResult.fileUrl;
      console.log('✅ 文件上传成功，fileUrl:', fileUrl);
    } else {
      console.log('❌ 文件上传失败:', await uploadResponse.text());
      return;
    }
    
    // 2. 模拟图生图生成
    console.log('\\n2. 模拟图生图生成...');
    const generateData = {
      prompt: 'テスト用のプロンプト',
      style: 'テスト',
      fileUrl: fileUrl,
      mode: 'image-to-image'
    };
    
    const generateResponse = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(generateData)
    });
    
    let generatedUrl = null;
    if (generateResponse.ok) {
      const generateResult = await generateResponse.json();
      generatedUrl = generateResult.generatedUrl || generateResult.url;
      console.log('✅ 图片生成成功，generatedUrl:', generatedUrl);
    } else {
      console.log('❌ 图片生成失败:', await generateResponse.text());
      return;
    }
    
    // 3. 模拟分享创建
    console.log('\\n3. 模拟分享创建...');
    const shareData = {
      generatedUrl: generatedUrl,
      originalUrl: fileUrl, // 图生图应该有originalUrl
      prompt: generateData.prompt,
      style: generateData.style,
      timestamp: Date.now()
    };
    
    console.log('📤 分享数据:', shareData);
    
    const shareResponse = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shareData)
    });
    
    if (shareResponse.ok) {
      const shareResult = await shareResponse.json();
      console.log('✅ 分享创建成功:', shareResult);
      
      // 4. 验证分享数据
      console.log('\\n4. 验证分享数据...');
      const verifyResponse = await fetch(`/api/share?id=${shareResult.shareId}`);
      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('📊 验证结果:', {
          id: verifyResult.data.id,
          originalUrl: verifyResult.data.originalUrl,
          generatedUrl: verifyResult.data.generatedUrl,
          style: verifyResult.data.style
        });
        
        // 判断模式
        const hasOriginalUrl = verifyResult.data.originalUrl && 
          typeof verifyResult.data.originalUrl === 'string' && 
          verifyResult.data.originalUrl.trim() !== '' &&
          !verifyResult.data.originalUrl.startsWith('data:image/') &&
          !verifyResult.data.originalUrl.includes('placeholder.com');
        
        const mode = hasOriginalUrl ? '图生图' : '文生图';
        console.log(`🎯 判断模式: ${mode}`);
        
        if (hasOriginalUrl) {
          console.log('✅ 图生图模式正确设置');
        } else {
          console.log('❌ 图生图模式设置失败');
        }
      }
    } else {
      console.log('❌ 分享创建失败:', await shareResponse.text());
    }
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
  }
};

// 检查现有的图生图分享
const checkExistingImageToImage = async () => {
  console.log('\\n🔍 检查现有的图生图分享...');
  
  try {
    const response = await fetch('/api/share/list?limit=50&offset=0');
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ API请求失败:', result.error);
      return;
    }
    
    const imageToImageShares = result.data.items.filter(item => {
      const hasOriginalUrl = item.originalUrl && 
        typeof item.originalUrl === 'string' && 
        item.originalUrl.trim() !== '' &&
        !item.originalUrl.startsWith('data:image/') &&
        !item.originalUrl.includes('placeholder.com');
      
      return hasOriginalUrl;
    });
    
    console.log(`📊 找到 ${imageToImageShares.length} 个图生图分享:`);
    imageToImageShares.forEach((item, index) => {
      console.log(`\\n图生图 ${index + 1}:`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Style: ${item.style}`);
      console.log(`  OriginalUrl: ${item.originalUrl}`);
      console.log(`  GeneratedUrl: ${item.generatedUrl ? '有' : '无'}`);
      console.log(`  Timestamp: ${new Date(item.timestamp).toLocaleString()}`);
    });
    
    if (imageToImageShares.length === 0) {
      console.log('⚠️ 没有找到任何图生图分享，说明originalUrl设置有问题');
    }
    
  } catch (error) {
    console.error('❌ 检查过程出错:', error);
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.testImageToImageFlow = testImageToImageFlow;
  window.checkExistingImageToImage = checkExistingImageToImage;
  console.log('🔧 测试函数已加载:');
  console.log('  - testImageToImageFlow(): 测试图生图完整流程');
  console.log('  - checkExistingImageToImage(): 检查现有图生图分享');
} 