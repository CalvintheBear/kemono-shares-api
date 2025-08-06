const testCompleteKieApi = async () => {
  console.log('🧪 完整测试 KIE AI API...');
  
  // 测试1: 纯文本生成
  console.log('\n📝 测试1: 纯文本生成');
  const textToImageData = {
    prompt: 'anime style, high quality, detailed, kawaii, 滑らかな肌のレンダリング',
    size: '3:2',
    userId: 'j2983236233@gmail.com'
  };
  
  try {
    const response1 = await fetch('https://api.kie.ai/api/v1/gpt4o-image/generate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 2800cbec975bf014d815f4e5353c826a',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(textToImageData)
    });
    
    console.log('状态:', response1.status);
    
    if (!response1.ok) {
      const errorText = await response1.text();
      console.error('错误:', errorText);
    } else {
      const data1 = await response1.json();
      console.log('成功:', JSON.stringify(data1, null, 2));
      
      if (data1.data?.taskId) {
        console.log('🎯 获得taskId:', data1.data.taskId);
        
        // 测试状态查询
        console.log('\n🔍 测试状态查询...');
        const statusResponse = await fetch(`https://api.kie.ai/api/v1/gpt4o-image/record-info?taskId=${data1.data.taskId}&userId=${encodeURIComponent(textToImageData.userId)}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer 2800cbec975bf014d815f4e5353c826a',
            'Content-Type': 'application/json'
          }
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('状态查询成功:', JSON.stringify(statusData, null, 2));
        } else {
          const errorText = await statusResponse.text();
          console.error('状态查询失败:', errorText);
        }
      }
    }
    
  } catch (error) {
    console.error('异常:', error);
  }
};

testCompleteKieApi(); 