const testKieApi = async () => {
  console.log('🧪 测试 KIE AI API...');
  
  const testData = {
    prompt: 'anime style, high quality, detailed, kawaii, 滑らかな肌のレンダリング',
    size: '3:2',
    userId: 'j2983236233@gmail.com',
    nVariants: 1,
    isEnhance: false,
    enableFallback: true
  };
  
  try {
    const response = await fetch('https://api.kie.ai/api/v1/gpt4o-image/generate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 2800cbec975bf014d815f4e5353c826a',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('错误:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('成功:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('异常:', error);
  }
};

testKieApi(); 