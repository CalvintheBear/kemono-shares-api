// 测试 Cloudflare Workers 环境检测
import { shareKVStore } from './src/lib/share-store-kv.ts';

console.log('=== Cloudflare Workers 环境检测调试 ===\n');

// 检查全局变量
console.log('全局环境变量:');
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.CF_WORKER:', process.env.CF_WORKER);
console.log('typeof globalThis:', typeof globalThis);
console.log('typeof process:', typeof process);

// 检查KV绑定
if (typeof globalThis !== 'undefined') {
  console.log('\n=== KV绑定检查 ===');
  console.log('globalThis.SHARE_DATA_KV:', globalThis.SHARE_DATA_KV !== undefined);
  console.log('globalThis.KV:', globalThis.KV !== undefined);
  console.log('globalThis.__KV__:', globalThis.__KV__ !== undefined);
  
  // 检查所有可能的KV绑定
  const possibleBindings = ['SHARE_DATA_KV', 'KV', '__KV__', 'KV_NAMESPACE'];
  possibleBindings.forEach(binding => {
    if (globalThis[binding]) {
      console.log(`✅ 找到KV绑定: ${binding}`);
    }
  });
}

// 检查存储信息
console.log('\n=== 存储信息 ===');
const storageInfo = shareKVStore.getStorageInfo();
console.log('存储状态:', storageInfo);

// 测试存储功能
async function testStorage() {
  console.log('\n=== 存储功能测试 ===');
  
  const testData = {
    id: 'test_' + Date.now(),
    generatedUrl: 'https://example.com/test.jpg',
    originalUrl: null, // 文生图模式
    prompt: '测试文生图',
    style: 'test-style',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    isTextToImage: true // 明确设置
  };
  
  try {
    console.log('保存测试数据...');
    await shareKVStore.set(testData.id, testData);
    console.log('✅ 测试数据保存成功');
    
    console.log('获取测试数据...');
    const retrieved = await shareKVStore.get(testData.id);
    console.log('✅ 测试数据获取成功:', retrieved);
    
    console.log('获取所有数据...');
    const allData = await shareKVStore.getAll();
    console.log(`✅ 获取到 ${allData.length} 条数据`);
    
    // 检查文生图数据
    const textToImageData = allData.filter(item => item.isTextToImage === true);
    console.log(`文生图数据: ${textToImageData.length} 条`);
    
  } catch (error) {
    console.error('❌ 存储测试失败:', error);
  }
}

testStorage().catch(console.error);