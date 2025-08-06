// 测试download-url API修复的脚本
const testDownloadUrlAPI = async () => {
  console.log('🧪 开始测试download-url API修复...');
  
  // 模拟KIE AI的临时URL
  const testUrl = 'https://tempfile.aiquickdraw.com/s/da23a3ce221fbd6b0fce251bf594e6dd_0_1754497777_8834.png';
  const testTaskId = 'test_task_123';
  
  try {
    console.log('📤 发送测试请求到 /api/download-url');
    console.log('请求参数:', { url: testUrl, taskId: testTaskId });
    
    const response = await fetch('/api/download-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url: testUrl, 
        taskId: testTaskId 
      })
    });
    
    console.log('📥 响应状态:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 成功响应:', data);
      
      if (data.success && data.downloadUrl) {
        console.log('🎉 download-url API修复成功！');
        console.log('获取到的下载URL:', data.downloadUrl);
        console.log('URL有效期:', data.expiresIn);
      } else {
        console.log('⚠️ 响应格式可能有问题:', data);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API调用失败:', errorData);
    }
    
  } catch (error) {
    console.error('💥 测试过程中发生错误:', error);
  }
};

// 测试download-and-upload API
const testDownloadAndUploadAPI = async () => {
  console.log('\n🧪 开始测试download-and-upload API...');
  
  const testUrl = 'https://tempfile.aiquickdraw.com/s/da23a3ce221fbd6b0fce251bf594e6dd_0_1754497777_8834.png';
  const testTaskId = 'test_task_123';
  
  try {
    console.log('📤 发送测试请求到 /api/download-and-upload');
    console.log('请求参数:', { 
      kieImageUrl: testUrl, 
      taskId: testTaskId,
      fileName: 'test_generated.png'
    });
    
    const response = await fetch('/api/download-and-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        kieImageUrl: testUrl, 
        taskId: testTaskId,
        fileName: 'test_generated.png'
      })
    });
    
    console.log('📥 响应状态:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 成功响应:', data);
      
      if (data.success && data.url) {
        console.log('🎉 download-and-upload API修复成功！');
        console.log('上传到R2的URL:', data.url);
        console.log('文件大小:', data.size, 'bytes');
      } else {
        console.log('⚠️ 响应格式可能有问题:', data);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API调用失败:', errorData);
    }
    
  } catch (error) {
    console.error('💥 测试过程中发生错误:', error);
  }
};

// 运行测试
console.log('🚀 开始API修复验证测试...\n');

// 注意：这些测试需要在浏览器环境中运行，因为它们调用了fetch API
// 在实际使用时，需要确保环境变量已正确配置

// 导出测试函数供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testDownloadUrlAPI, testDownloadAndUploadAPI };
}
