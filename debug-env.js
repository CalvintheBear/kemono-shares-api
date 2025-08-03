// 简单的环境检测调试
console.log('=== 环境检测调试 ===');

// 检查全局变量
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.CF_WORKER:', process.env.CF_WORKER);
console.log('typeof globalThis:', typeof globalThis);
console.log('typeof process:', typeof process);

// 检查可能的KV绑定
if (typeof globalThis !== 'undefined') {
  console.log('\n=== KV绑定检查 ===');
  const possibleBindings = ['SHARE_DATA_KV', 'KV', '__KV__', 'KV_NAMESPACE'];
  possibleBindings.forEach(binding => {
    console.log(`globalThis.${binding}:`, globalThis[binding] !== undefined);
  });
}

// 模拟KV存储检测逻辑
function isCloudflareWorkers() {
  // 检查CF_WORKER环境变量
  if (typeof process !== 'undefined' && process.env.CF_WORKER === 'true') {
    console.log('\n✅ 检测到CF_WORKER环境变量');
    return true;
  }
  
  // 检查多种环境标识
  const isWorkers = typeof globalThis !== 'undefined' && (
    globalThis.SHARE_DATA_KV !== undefined ||
    globalThis.KV !== undefined ||
    globalThis.__KV__ !== undefined ||
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
    (typeof process !== 'undefined' && process.env.CF_WORKER === 'true')
  );
  
  // 强制Cloudflare模式 - 在生产环境始终尝试使用KV
  const forceCloudflare = typeof process !== 'undefined' && 
                         (process.env.NODE_ENV === 'production' || process.env.CF_WORKER === 'true') &&
                         typeof globalThis !== 'undefined';
  
  console.log('\n=== 检测结果 ===');
  console.log('isWorkers:', isWorkers);
  console.log('forceCloudflare:', forceCloudflare);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('CF_WORKER:', process.env.CF_WORKER);
  
  return isWorkers || forceCloudflare;
}

const result = isCloudflareWorkers();
console.log('\n最终结果:', result);