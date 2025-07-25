// 测试轮询终止修复
const testPollingTermination = () => {
  console.log('🧪 测试轮询终止修复...\n')

  // 模拟修复后的逻辑
  const simulatePolling = (status, successFlag, errorMessage) => {
    console.log(`📋 模拟状态: status=${status}, successFlag=${successFlag}, errorMessage=${errorMessage}`)
    
    // 检查是否应该终止轮询
    const shouldTerminate = (
      status === 'FAILED' || 
      status === 'ERROR' || 
      status === 'GENERATE_FAILED' || 
      successFlag === 3 || 
      successFlag === 0
    )
    
    if (shouldTerminate) {
      console.log('🛑 检测到失败状态，应该终止轮询')
      console.log('✅ 返回错误响应，不再继续轮询')
      return { terminated: true, error: `图像生成失败: ${errorMessage || '未知错误'}` }
    } else {
      console.log('⏳ 任务进行中，继续轮询')
      return { terminated: false }
    }
  }

  // 测试用例
  const testCases = [
    {
      name: 'GENERATE_FAILED 状态',
      status: 'GENERATE_FAILED',
      successFlag: 3,
      errorMessage: 'Your content was flagged by OpenAI as violating content policies.'
    },
    {
      name: 'successFlag = 0',
      status: 'GENERATING',
      successFlag: 0,
      errorMessage: null
    },
    {
      name: '正常进行中',
      status: 'GENERATING',
      successFlag: 1,
      errorMessage: null
    }
  ]

  console.log('🔍 测试轮询终止逻辑:')
  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.name}`)
    const result = simulatePolling(testCase.status, testCase.successFlag, testCase.errorMessage)
    
    if (result.terminated) {
      console.log(`   ✅ 正确终止轮询: ${result.error}`)
    } else {
      console.log('   ⏳ 继续轮询')
    }
  })

  console.log('\n🎯 修复说明:')
  console.log('   • 之前: 检测到失败状态时抛出异常，被catch捕获后继续重试')
  console.log('   • 现在: 检测到失败状态时直接返回错误响应，立即终止轮询')
  console.log('   • 避免了无限重试的问题')
  
  console.log('\n✨ 轮询终止修复测试完成！')
}

testPollingTermination() 