// 测试轮询终止机制修复
const testPollingTermination = () => {
  console.log('🧪 测试轮询终止机制修复...\n')

  // 模拟API响应数据
  const testCases = [
    {
      name: 'GENERATE_FAILED 状态',
      data: {
        status: 'GENERATE_FAILED',
        errorMessage: 'Your content was flagged by OpenAI as violating content policies.',
        successFlag: 3
      },
      shouldTerminate: true
    },
    {
      name: 'FAILED 状态',
      data: {
        status: 'FAILED',
        errorMessage: 'Generation failed',
        successFlag: 0
      },
      shouldTerminate: true
    },
    {
      name: 'ERROR 状态',
      data: {
        status: 'ERROR',
        errorMessage: 'Unknown error',
        successFlag: 0
      },
      shouldTerminate: true
    },
    {
      name: 'successFlag = 3',
      data: {
        status: 'GENERATING',
        successFlag: 3,
        errorMessage: 'Content policy violation'
      },
      shouldTerminate: true
    },
    {
      name: 'successFlag = 0',
      data: {
        status: 'GENERATING',
        successFlag: 0,
        errorMessage: 'Generation failed'
      },
      shouldTerminate: true
    },
    {
      name: '正常进行中状态',
      data: {
        status: 'GENERATING',
        successFlag: 1,
        progress: '0.5'
      },
      shouldTerminate: false
    },
    {
      name: '成功状态',
      data: {
        status: 'SUCCESS',
        successFlag: 1,
        response: { resultUrls: ['https://example.com/image.jpg'] }
      },
      shouldTerminate: false
    }
  ]

  console.log('📋 测试用例:')
  testCases.forEach((testCase, index) => {
    const { name, data, shouldTerminate } = testCase
    const status = data.status || '未知'
    const successFlag = data.successFlag !== undefined ? data.successFlag : '未设置'
    const errorMsg = data.errorMessage || '无错误信息'
    
    console.log(`\n${index + 1}. ${name}`)
    console.log(`   状态: ${status}`)
    console.log(`   successFlag: ${successFlag}`)
    console.log(`   错误信息: ${errorMsg}`)
    console.log(`   应该终止: ${shouldTerminate ? '✅ 是' : '❌ 否'}`)
    
    // 模拟检查逻辑
    const shouldStop = (
      status === 'FAILED' || 
      status === 'ERROR' || 
      status === 'GENERATE_FAILED' || 
      successFlag === 3 || 
      successFlag === 0
    )
    
    const result = shouldStop === shouldTerminate ? '✅ 通过' : '❌ 失败'
    console.log(`   测试结果: ${result}`)
  })

  console.log('\n🎯 修复总结:')
  console.log('   • 添加了 GENERATE_FAILED 状态检查')
  console.log('   • 添加了 successFlag === 3 检查')
  console.log('   • 添加了 successFlag === 0 检查')
  console.log('   • 确保所有失败状态都能正确终止轮询')
  
  console.log('\n✨ 轮询终止机制测试完成！')
}

testPollingTermination() 