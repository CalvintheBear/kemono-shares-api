// 测试R2 Binding版本的download-and-upload API修复
const testR2BindingFix = async () => {
  console.log('🧪 开始测试R2 Binding版本的API修复...');
  
  // 使用实际的KIE AI临时URL进行测试
  const testUrl = 'https://tempfile.aiquickdraw.com/s/da23a3ce221fbd6b0fce251bf594e6dd_0_1754497777_8834.png';
  const testTaskId = 'test_task_' + Date.now();
  
  console.log('🔍 测试场景说明:');
  console.log('• 使用R2 Binding而不是手动签名');
  console.log('• 直接上传到kemono-afterimage桶');
  console.log('• 返回稳定的公网URL');
  console.log('');
  
  try {
    console.log('📤 发送测试请求到 /api/download-and-upload');
    console.log('请求参数:', { 
      kieImageUrl: testUrl, 
      taskId: testTaskId,
      fileName: `test_r2_binding_${testTaskId}.png`
    });
    
    const startTime = Date.now();
    const response = await fetch('/api/download-and-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        kieImageUrl: testUrl, 
        taskId: testTaskId,
        fileName: `test_r2_binding_${testTaskId}.png`
      })
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`📥 响应状态: ${response.status} (耗时: ${responseTime}ms)`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 成功响应:', data);
      
      if (data.success && data.url) {
        console.log('🎉 R2 Binding版本修复成功！');
        console.log('📊 详细信息:');
        console.log('  • R2公网URL:', data.url);
        console.log('  • 对象键:', data.key);
        console.log('  • 文件大小:', (data.size / 1024).toFixed(2), 'KB');
        console.log('  • 内容类型:', data.contentType);
        console.log('  • 任务ID:', data.taskId);
        
        // 验证URL是否可访问
        console.log('\n🔍 验证URL可访问性...');
        try {
          const verifyResponse = await fetch(data.url, { method: 'HEAD' });
          if (verifyResponse.ok) {
            console.log('✅ URL验证成功，图片可正常访问');
            console.log('  • 响应状态:', verifyResponse.status);
            console.log('  • 内容类型:', verifyResponse.headers.get('content-type'));
            console.log('  • 内容长度:', verifyResponse.headers.get('content-length'), 'bytes');
          } else {
            console.log('⚠️ URL验证失败:', verifyResponse.status, verifyResponse.statusText);
          }
        } catch (verifyError) {
          console.log('❌ URL验证出错:', verifyError.message);
        }
        
      } else {
        console.log('⚠️ 响应格式可能有问题:', data);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API调用失败:', errorData);
      
      // 分析常见错误
      if (errorData.error?.includes('缺少R2桶绑定')) {
        console.log('💡 解决建议: 确保在Cloudflare Pages项目中已绑定AFTERIMAGE_BUCKET');
      } else if (errorData.error?.includes('缺少R2公共URL配置')) {
        console.log('💡 解决建议: 确保环境变量CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL已配置');
      } else if (errorData.error?.includes('Kie.ai API 密钥未配置')) {
        console.log('💡 解决建议: 确保环境变量KIE_AI_API_KEY已配置');
      }
    }
    
  } catch (error) {
    console.error('💥 测试过程中发生错误:', error);
  }
};

// 测试完整的图片生成流程
const testFullGenerationFlow = async () => {
  console.log('\n🧪 开始测试完整的图片生成流程...');
  
  const testPrompt = '可爱的动漫少女，粉色头发，大眼睛，微笑';
  
  try {
    console.log('📤 第一步: 调用generate-image API');
    console.log('请求参数:', { 
      prompt: testPrompt,
      mode: 'text-to-image',
      size: '1:1',
      enhancePrompt: true
    });
    
    const generateResponse = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: testPrompt,
        mode: 'text-to-image',
        size: '1:1',
        enhancePrompt: true
      })
    });
    
    console.log('📥 generate-image响应状态:', generateResponse.status);
    
    if (generateResponse.ok) {
      const generateData = await generateResponse.json();
      console.log('✅ 图片生成任务创建成功:', generateData);
      
      if (generateData.taskId) {
        console.log('🔄 第二步: 模拟轮询过程...');
        // 这里可以添加轮询逻辑的测试
        console.log('💡 提示: 实际轮询会在前端Workspace.tsx中进行');
        console.log('  • taskId:', generateData.taskId);
        console.log('  • 轮询API: /api/image-details?taskId=' + generateData.taskId);
      }
    } else {
      const errorData = await generateResponse.json();
      console.log('❌ 图片生成失败:', errorData);
    }
    
  } catch (error) {
    console.error('💥 完整流程测试失败:', error);
  }
};

// 主测试函数
const runAllTests = async () => {
  console.log('🚀 开始R2 Binding修复验证测试...\n');
  
  console.log('📋 测试清单:');
  console.log('1. ✅ R2 Binding版本的download-and-upload API');
  console.log('2. ✅ URL可访问性验证');
  console.log('3. ✅ 完整生成流程测试');
  console.log('');
  
  await testR2BindingFix();
  await testFullGenerationFlow();
  
  console.log('\n🎯 测试完成！');
  console.log('💡 如果所有测试通过，说明R2 Binding修复成功');
  console.log('📝 接下来可以进行实际的图片生成测试');
};

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  console.log('🌐 检测到浏览器环境，可以直接运行测试');
  console.log('💡 在控制台中输入 runAllTests() 开始测试');
  window.runAllTests = runAllTests;
  window.testR2BindingFix = testR2BindingFix;
  window.testFullGenerationFlow = testFullGenerationFlow;
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    runAllTests, 
    testR2BindingFix, 
    testFullGenerationFlow 
  };
}
