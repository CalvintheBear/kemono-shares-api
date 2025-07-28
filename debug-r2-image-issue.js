// 调试R2图片加载问题
const debugR2ImageIssue = async () => {
  console.log('🔍 开始调试R2图片加载问题...\\n');
  
  try {
    // 1. 检查R2配置
    console.log('1. 检查R2配置...');
    const configResponse = await fetch('/api/check-r2-config');
    const configResult = await configResponse.json();
    
    console.log('📊 R2配置检查结果:', configResult);
    
    if (!configResult.success) {
      console.log('❌ R2配置有问题:', configResult.error);
      console.log('📋 配置详情:', configResult.configInfo);
      return;
    }
    
    // 2. 检查afterimage R2配置
    console.log('\\n2. 检查afterimage R2配置...');
    const afterimageConfigResponse = await fetch('/api/check-afterimage-r2-config');
    const afterimageConfigResult = await afterimageConfigResponse.json();
    
    console.log('📊 Afterimage R2配置检查结果:', afterimageConfigResult);
    
    if (!afterimageConfigResult.success) {
      console.log('❌ Afterimage R2配置有问题:', afterimageConfigResult.error);
      console.log('📋 配置详情:', afterimageConfigResult.configInfo);
    }
    
    // 3. 测试文件上传到主R2
    console.log('\\n3. 测试文件上传到主R2...');
    const formData = new FormData();
    const testFile = new File(['test image data'], 'test.jpg', { type: 'image/jpeg' });
    formData.append('file', testFile);
    
    const uploadResponse = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      console.log('✅ 主R2文件上传成功:', uploadResult);
      
      // 测试图片访问
      const imageUrl = uploadResult.url;
      console.log('📸 主R2图片URL:', imageUrl);
      
      const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
      if (imageResponse.ok) {
        console.log('✅ 主R2图片可以正常访问');
      } else {
        console.log('❌ 主R2图片无法访问:', imageResponse.status, imageResponse.statusText);
      }
      
    } else {
      console.log('❌ 主R2文件上传失败:', await uploadResponse.text());
    }
    
    // 4. 测试分享创建流程
    console.log('\\n4. 测试分享创建流程...');
    const shareData = {
      generatedUrl: 'https://example.com/test-generated-image.jpg',
      originalUrl: 'https://example.com/test-original-image.jpg',
      prompt: 'テスト用のプロンプト',
      style: 'テスト',
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
      
      // 验证分享数据
      const verifyResponse = await fetch(`/api/share?id=${shareResult.shareId}`);
      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('📊 分享验证结果:', {
          id: verifyResult.data.id,
          originalUrl: verifyResult.data.originalUrl,
          generatedUrl: verifyResult.data.generatedUrl,
          style: verifyResult.data.style,
          isR2Stored: verifyResult.data.isR2Stored,
          isTextToImage: verifyResult.data.isTextToImage
        });
        
        // 测试生成的图片URL
        if (verifyResult.data.generatedUrl) {
          console.log('\\n5. 测试生成的图片URL...');
          const generatedImageResponse = await fetch(verifyResult.data.generatedUrl, { method: 'HEAD' });
          if (generatedImageResponse.ok) {
            console.log('✅ 生成的图片可以正常访问');
          } else {
            console.log('❌ 生成的图片无法访问:', generatedImageResponse.status, generatedImageResponse.statusText);
          }
        }
        
        // 测试原始图片URL
        if (verifyResult.data.originalUrl) {
          console.log('\\n6. 测试原始图片URL...');
          const originalImageResponse = await fetch(verifyResult.data.originalUrl, { method: 'HEAD' });
          if (originalImageResponse.ok) {
            console.log('✅ 原始图片可以正常访问');
          } else {
            console.log('❌ 原始图片无法访问:', originalImageResponse.status, originalImageResponse.statusText);
          }
        }
      }
    } else {
      console.log('❌ 分享创建失败:', await shareResponse.text());
    }
    
  } catch (error) {
    console.error('❌ 调试过程出错:', error);
  }
};

// 检查环境变量
const checkAllEnvironmentVariables = () => {
  console.log('\\n🔍 检查所有环境变量...');
  
  const requiredVars = [
    // 主R2配置
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL',
    // Afterimage R2配置
    'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME',
    'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL',
    // KIE AI配置
    'KIE_AI_API_KEY'
  ];
  
  const missingVars = [];
  const configuredVars = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      configuredVars.push(varName);
      console.log(`✅ ${varName}: 已配置`);
    } else {
      missingVars.push(varName);
      console.log(`❌ ${varName}: 未配置`);
    }
  });
  
  console.log('\\n📊 配置统计:');
  console.log(`  已配置: ${configuredVars.length}/${requiredVars.length}`);
  console.log(`  未配置: ${missingVars.length}/${requiredVars.length}`);
  
  if (missingVars.length > 0) {
    console.log('\\n⚠️ 缺少的环境变量:');
    missingVars.forEach(varName => {
      console.log(`  - ${varName}`);
    });
    
    console.log('\\n💡 建议:');
    console.log('  1. 检查.env.local文件是否存在');
    console.log('  2. 确保所有必需的环境变量都已设置');
    console.log('  3. 重启开发服务器以加载新的环境变量');
  }
};

// 测试图片URL处理
const testImageUrlProcessing = async () => {
  console.log('\\n🎭 测试图片URL处理...');
  
  try {
    // 模拟KIE AI临时URL
    const kieTempUrl = 'https://kie.ai/temp/image123.jpg';
    
    console.log('📤 测试URL:', kieTempUrl);
    
    // 这里可以添加实际的URL处理测试
    // 由于processImageUrl是服务器端函数，我们需要通过API测试
    
    const testData = {
      imageUrl: kieTempUrl,
      fileName: 'test-processed.png'
    };
    
    console.log('📋 测试数据:', testData);
    console.log('💡 注意: 实际的URL处理需要在服务器端进行');
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.debugR2ImageIssue = debugR2ImageIssue;
  window.checkAllEnvironmentVariables = checkAllEnvironmentVariables;
  window.testImageUrlProcessing = testImageUrlProcessing;
  console.log('🔧 R2图片调试函数已加载:');
  console.log('  - debugR2ImageIssue(): 调试R2图片加载问题');
  console.log('  - checkAllEnvironmentVariables(): 检查所有环境变量');
  console.log('  - testImageUrlProcessing(): 测试图片URL处理');
} 