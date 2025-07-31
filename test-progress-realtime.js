// 测试实时进度更新功能
// 这个脚本模拟了实际的进度更新场景

console.log('🧪 测试实时进度更新功能...')

// 模拟状态
let currentProgress = 0;
let lastProgress = 0;

// 模拟API响应数据
const mockApiResponses = [
  { status: 'GENERATING', progress: 0.15 },
  { status: 'GENERATING', progress: 0.25 },
  { status: 'GENERATING', progress: 0.45 },
  { status: 'GENERATING', progress: 0.65 },
  { status: 'GENERATING', progress: 0.85 },
  { status: 'SUCCESS', progress: 1.0, generatedUrl: 'https://example.com/image.png' }
];

// 模拟setState函数
function setGenerationProgress(value) {
  console.log(`📈 更新进度: ${value}% (上次: ${lastProgress}%)`);
  currentProgress = value;
  lastProgress = value;
}

function setGenerationStatusText(text) {
  console.log(`📊 更新状态: ${text}`);
}

// 模拟轮询逻辑
async function simulatePolling() {
  console.log('\n🔄 开始模拟轮询...');
  
  for (let i = 0; i < mockApiResponses.length; i++) {
    const response = mockApiResponses[i];
    
    // 模拟计算进度
    let currentProgress = 0;
    if (response.progress !== undefined && response.progress !== null) {
      if (typeof response.progress === 'number') {
        if (response.progress <= 1) {
          currentProgress = Math.round(response.progress * 100);
        } else {
          currentProgress = Math.round(response.progress);
        }
      }
    }
    
    // 确保进度值有效
    currentProgress = Math.max(0, Math.min(currentProgress, 99));
    
    // 模拟状态更新
    setGenerationProgress(currentProgress);
    setGenerationStatusText(`処理中... ${currentProgress}%`);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 检查是否完成
    if (response.status === 'SUCCESS') {
      console.log('✅ 模拟完成');
      break;
    }
  }
}

// 测试实时更新场景
async function testRealTimeUpdates() {
  console.log('\n🎯 测试实时更新场景...');
  
  const scenarios = [
    { progress: 10, expected: 10 },
    { progress: 25, expected: 25 },
    { progress: 50, expected: 50 },
    { progress: 75, expected: 75 },
    { progress: 90, expected: 90 },
    { progress: 100, expected: 100 }
  ];
  
  for (const scenario of scenarios) {
    console.log(`📊 测试: ${scenario.progress}% -> 应该显示 ${scenario.expected}%`);
    setGenerationProgress(scenario.progress);
    setGenerationStatusText(`処理中... ${scenario.progress}%`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// 运行测试
async function runTests() {
  console.log('🚀 开始所有测试...\n');
  
  await simulatePolling();
  console.log('\n' + '='.repeat(50));
  await testRealTimeUpdates();
  
  console.log('\n✅ 所有测试完成！');
  console.log('💡 进度条应该实时更新每个轮询响应的值');
}

// 如果直接运行
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { simulatePolling, testRealTimeUpdates };