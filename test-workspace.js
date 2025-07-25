// 测试脚本：验证workspace功能
const axios = require('axios');

async function testWorkspace() {
  console.log('🧪 开始测试workspace功能...');
  
  try {
    // 测试1: 检查task-status API
    console.log('\n📋 测试1: 检查task-status API');
    const taskId = 'test-task-id'; // 使用真实任务ID测试
    const taskStatusResponse = await axios.get(`http://localhost:3000/api/task-status?taskId=${taskId}`);
    console.log('Task status response:', taskStatusResponse.data);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.response) {
      console.error('错误响应:', error.response.data);
      console.error('状态码:', error.response.status);
    }
  }
  
  console.log('\n✅ 测试完成');
}

// 运行测试
if (require.main === module) {
  testWorkspace();
}

module.exports = { testWorkspace };