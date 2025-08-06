// 测试新的 get-generated-url API 端点
const testGeneratedUrl = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/get-generated-url?taskId=${taskId}`)
    const data = await response.json()
    console.log('测试结果:', data)
  } catch (error) {
    console.error('测试失败:', error)
  }
}

// 使用示例 taskId 测试
if (require.main === module) {
  const sampleTaskId = process.argv[2] || 'test123'
  testGeneratedUrl(sampleTaskId)
}