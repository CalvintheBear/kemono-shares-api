#!/usr/bin/env node

/**
 * 模拟share API调用
 * 测试KIE AI图片下载上传到kemono-afterimage桶的功能
 */

// 使用内置的fetch（Node.js 18+）

async function testShareUpload() {
  console.log('🧪 开始模拟share API调用...\n');
  
  try {
    // 模拟一个KIE AI的图片URL（使用真实的KIE AI域名格式）
    const mockKieImageUrl = 'https://api.kieai.com/generated/image123.png';
    
    console.log('📋 测试数据:');
    console.log('KIE AI图片URL:', mockKieImageUrl);
    console.log('样式:', '擬人化');
    console.log('时间戳:', Date.now());
    
    // 调用share API
    const response = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        generatedUrl: mockKieImageUrl,
        originalUrl: 'https://example.com/original.jpg',
        prompt: '将这张图片转换为擬人化风格',
        style: '擬人化',
        timestamp: Date.now()
      })
    });
    
    const data = await response.json();
    
    console.log('\n📊 API响应:');
    console.log('状态码:', response.status);
    console.log('成功:', data.success);
    
    if (data.success) {
      console.log('分享ID:', data.shareId);
      console.log('分享URL:', data.shareUrl);
      console.log('是否存储到R2:', data.data.isR2Stored);
      console.log('处理后的图片URL:', data.data.generatedUrl);
    } else {
      console.log('错误:', data.error);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

async function testAfterimageConfig() {
  console.log('\n🔍 测试kemono-afterimage桶配置...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/test-afterimage-upload');
    const data = await response.json();
    
    console.log('配置检查结果:');
    console.log('成功:', data.success);
    console.log('配置正确:', data.isConfigured);
    console.log('消息:', data.message);
    
  } catch (error) {
    console.error('❌ 配置检查失败:', error.message);
  }
}

async function main() {
  console.log('🚀 开始测试share上传功能...\n');
  
  // 等待服务器启动
  console.log('⏳ 等待服务器启动...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 测试配置
  await testAfterimageConfig();
  
  // 测试share上传
  await testShareUpload();
  
  console.log('\n✨ 测试完成！');
  console.log('\n📝 下一步:');
  console.log('1. 查看服务器控制台日志');
  console.log('2. 检查kemono-afterimage桶是否有新文件');
  console.log('3. 如果测试失败，检查错误日志');
}

main().catch(console.error); 