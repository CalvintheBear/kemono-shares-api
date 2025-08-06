#!/usr/bin/env node

/**
 * KIE AI API 修复验证测试脚本
 * 用于验证API调用是否符合官方规范
 */

const testKieApiCall = async () => {
  console.log('🧪 开始测试 KIE AI API 调用...');
  
  const testData = {
    prompt: 'anime style, high quality, detailed, kawaii, 滑らかな肌のレンダリング、アニメスタイルの厚塗り、Procreate、立体感、二次元イラスト、8K、透明感',
    size: '3:2',
    userId: 'j2983236233@gmail.com',
    nVariants: 1,
    isEnhance: false,
    enableFallback: true
  };
  
  console.log('📤 测试请求数据:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch('https://api.kie.ai/api/v1/gpt4o-image/generate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 2800cbec975bf014d815f4e5353c826a',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API调用失败:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ API调用成功:', JSON.stringify(data, null, 2));
    
    if (data.data?.taskId || data.taskId) {
      const taskId = data.data?.taskId || data.taskId;
      console.log(`🎯 获得taskId: ${taskId}`);
      
      // 测试状态查询
      console.log('🔍 测试状态查询...');
      const statusResponse = await fetch(`https://api.kie.ai/api/v1/gpt4o-image/record-info?taskId=${taskId}&userId=${encodeURIComponent(testData.userId)}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 2800cbec975bf014d815f4e5353c826a',
          'Content-Type': 'application/json'
        }
      });
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('✅ 状态查询成功:', JSON.stringify(statusData, null, 2));
      } else {
        const errorText = await statusResponse.text();
        console.error('❌ 状态查询失败:', errorText);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return false;
  }
};

// 运行测试
testKieApiCall().then(success => {
  if (success) {
    console.log('🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.log('💥 测试失败！');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 测试异常:', error);
  process.exit(1);
}); 