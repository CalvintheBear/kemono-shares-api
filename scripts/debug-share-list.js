const fetch = require('node-fetch');

const API_BASE = 'https://kemono-shares-api.y2983236233.workers.dev/api';

async function debugShareList() {
  console.log('🔍 调试分享列表API响应...\n');

  try {
    const response = await fetch(`${API_BASE}/share/list?limit=5`);
    const data = await response.json();
    
    console.log('📋 完整API响应:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success && data.data && data.data.items) {
      console.log('\n📊 分享项目详情:');
      data.data.items.forEach((item, index) => {
        console.log(`\n项目 ${index + 1}:`);
        console.log('  所有字段:', Object.keys(item));
        console.log('  完整数据:', JSON.stringify(item, null, 2));
      });
    }
    
  } catch (error) {
    console.error('❌ 调试失败:', error.message);
  }
}

debugShareList(); 