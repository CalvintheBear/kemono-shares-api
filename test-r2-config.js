// 测试R2配置和连接
const testR2Config = async () => {
  console.log('🧪 测试R2配置和连接...\\n');
  
  try {
    // 1. 检查R2配置
    console.log('1. 检查R2配置...');
    const configResponse = await fetch('/api/check-r2-config');
    const configResult = await configResponse.json();
    
    console.log('📊 R2配置检查结果:', configResult);
    
    if (!configResult.success) {
      console.log('❌ R2配置有问题:', configResult.error);
      return;
    }
    
    // 2. 测试文件上传
    console.log('\\n2. 测试文件上传...');
    const formData = new FormData();
    const testFile = new File(['test image data'], 'test.jpg', { type: 'image/jpeg' });
    formData.append('file', testFile);
    
    const uploadResponse = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      console.log('✅ 文件上传成功:', uploadResult);
      
      // 3. 测试图片访问
      console.log('\\n3. 测试图片访问...');
      const imageUrl = uploadResult.url;
      console.log('📸 图片URL:', imageUrl);
      
      const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
      if (imageResponse.ok) {
        console.log('✅ 图片可以正常访问');
      } else {
        console.log('❌ 图片无法访问:', imageResponse.status, imageResponse.statusText);
      }
      
    } else {
      console.log('❌ 文件上传失败:', await uploadResponse.text());
    }
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
  }
};

// 检查环境变量
const checkEnvironmentVariables = () => {
  console.log('\\n🔍 检查环境变量...');
  
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL'
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
  }
};

// 测试分享创建时的图片处理
const testShareImageProcessing = async () => {
  console.log('\\n🎭 测试分享创建时的图片处理...');
  
  try {
    // 模拟分享数据
    const shareData = {
      generatedUrl: 'https://example.com/generated-image.jpg',
      originalUrl: 'https://example.com/original-image.jpg',
      prompt: 'テスト用のプロンプト',
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
      console.log('✅ 分享创建成功:', result);
      
      // 验证分享数据
      const verifyResponse = await fetch(`/api/share?id=${result.shareId}`);
      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('📊 验证结果:', {
          id: verifyResult.data.id,
          originalUrl: verifyResult.data.originalUrl,
          generatedUrl: verifyResult.data.generatedUrl,
          style: verifyResult.data.style
        });
      }
    } else {
      console.log('❌ 分享创建失败:', await response.text());
    }
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error);
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.testR2Config = testR2Config;
  window.checkEnvironmentVariables = checkEnvironmentVariables;
  window.testShareImageProcessing = testShareImageProcessing;
  console.log('🔧 R2测试函数已加载:');
  console.log('  - testR2Config(): 测试R2配置和连接');
  console.log('  - checkEnvironmentVariables(): 检查环境变量');
  console.log('  - testShareImageProcessing(): 测试分享图片处理');
} 