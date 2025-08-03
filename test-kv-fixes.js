// 测试KV存储修复
import { readFile } from 'fs/promises';
import { join } from 'path';

// 模拟Cloudflare Workers环境
console.log('=== 测试 Cloudflare Workers 环境检测修复 ===\n');

// 模拟不同的环境条件
const testCases = [
  {
    name: '生产环境（模拟）',
    env: { NODE_ENV: 'production', CF_WORKER: 'true' },
    globalThis: { SHARE_DATA_KV: { put: () => {}, get: () => {} } }
  },
  {
    name: 'Cloudflare Workers环境',
    env: { CF_WORKER: 'true' },
    globalThis: { KV: { put: () => {}, get: () => {} } }
  },
  {
    name: '本地开发环境',
    env: { NODE_ENV: 'development' },
    globalThis: {}
  }
];

// 测试环境检测逻辑
function testEnvironmentDetection(envVars, globalVars) {
  // 模拟环境
  if (envVars) {
    process.env = { ...process.env, ...envVars };
  }
  
  if (globalVars) {
    Object.assign(globalThis, globalVars);
  }
  
  // 模拟检测逻辑
  const isWorkers = typeof globalThis !== 'undefined' && (
    globalThis.SHARE_DATA_KV !== undefined ||
    globalThis.KV !== undefined ||
    globalThis.__KV__ !== undefined ||
    globalThis.KV_NAMESPACE !== undefined ||
    (typeof process !== 'undefined' && process.env.CF_WORKER === 'true')
  );
  
  const forceCloudflare = typeof process !== 'undefined' && 
                         (process.env.CF_WORKER === 'true' || 
                          process.env.NODE_ENV === 'production') &&
                         typeof globalThis !== 'undefined';
  
  const result = isWorkers || forceCloudflare;
  
  console.log(`${envVars.CF_WORKER ? 'Cloudflare' : 'Local'} 环境检测结果:`);
  console.log(`  isWorkers: ${isWorkers}`);
  console.log(`  forceCloudflare: ${forceCloudflare}`);
  console.log(`  最终结果: ${result}\n`);
  
  return result;
}

// 运行测试
testCases.forEach(testCase => {
  testEnvironmentDetection(testCase.env, testCase.globalThis);
});

// 验证isTextToImage字段设置
console.log('=== 验证 isTextToImage 字段设置 ===\n');

const testData = [
  {
    name: '文生图模式',
    data: {
      id: 'test_txt_1',
      generatedUrl: 'https://example.com/gen1.jpg',
      originalUrl: null,
      prompt: '测试文生图',
      style: 'ghibli'
    },
    expected: true
  },
  {
    name: '图生图模式',
    data: {
      id: 'test_img_1',
      generatedUrl: 'https://example.com/gen2.jpg',
      originalUrl: 'https://example.com/original.jpg',
      prompt: '测试图生图',
      style: 'anime'
    },
    expected: false
  }
];

testData.forEach(test => {
  const isTextToImage = !test.data.originalUrl || test.data.originalUrl === null || test.data.originalUrl === '';
  console.log(`${test.name}: ${isTextToImage} (期望: ${test.expected}) ${isTextToImage === test.expected ? '✅' : '❌'}`);
});

console.log('\n=== 测试完成 ===');