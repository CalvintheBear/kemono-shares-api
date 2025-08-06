#!/usr/bin/env node

/**
 * R2存储桶配置修复脚本
 * 用于验证和修复Cloudflare R2存储桶的公共访问权限
 */

const https = require('https');
const http = require('http');

// 您的R2配置
const R2_CONFIG = {
  // 上传图片存储桶
  UPLOAD_BUCKET: {
    name: 'kemono-uploadimage',
    publicUrl: 'https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev',
    accountId: '9a5ff316a26b8abb696af519e515d2de'
  },
  // 生成图片存储桶
  AFTERIMAGE_BUCKET: {
    name: 'kemono-afterimage',
    publicUrl: 'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev',
    accountId: '9a5ff316a26b8abb696af519e515d2de'
  }
};

// 测试URL访问
function testUrlAccess(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.get(url, (res) => {
      console.log(`✅ ${url} - 状态码: ${res.statusCode}`);
      resolve({ url, status: res.statusCode, accessible: res.statusCode < 400 });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${url} - 错误: ${err.message}`);
      resolve({ url, status: 'ERROR', accessible: false, error: err.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ${url} - 超时`);
      req.destroy();
      resolve({ url, status: 'TIMEOUT', accessible: false });
    });
  });
}

// 生成测试文件URL
function generateTestUrls() {
  const testFile = 'test-image-access.txt';
  const timestamp = Date.now();
  
  return {
    upload: `${R2_CONFIG.UPLOAD_BUCKET.publicUrl}/${testFile}`,
    afterimage: `${R2_CONFIG.AFTERIMAGE_BUCKET.publicUrl}/${testFile}`,
    // 测试您提到的具体文件
    specific: `https://pub-9a5ff316a26b8abb696af519e515d2de.r2.dev/uploads/1754452931040-k58zo9xpzqp.png`
  };
}

// 主函数
async function main() {
  console.log('🔍 开始验证R2存储桶配置...\n');
  
  const testUrls = generateTestUrls();
  
  console.log('📋 测试URL列表:');
  console.log(`上传桶: ${testUrls.upload}`);
  console.log(`生成桶: ${testUrls.afterimage}`);
  console.log(`特定文件: ${testUrls.specific}\n`);
  
  // 测试所有URL
  const results = await Promise.all([
    testUrlAccess(testUrls.upload),
    testUrlAccess(testUrls.afterimage),
    testUrlAccess(testUrls.specific)
  ]);
  
  console.log('\n📊 测试结果汇总:');
  results.forEach(result => {
    const status = result.accessible ? '✅ 可访问' : '❌ 不可访问';
    console.log(`${status} - ${result.url}`);
  });
  
  // 分析问题
  console.log('\n🔧 问题分析和解决方案:');
  
  const uploadBucketResult = results[0];
  const afterimageBucketResult = results[1];
  const specificFileResult = results[2];
  
  if (!uploadBucketResult.accessible) {
    console.log('\n❌ 上传桶访问问题:');
    console.log('   1. 检查存储桶是否启用了公共访问');
    console.log('   2. 验证自定义域名配置');
    console.log('   3. 确认CORS策略设置');
  }
  
  if (!afterimageBucketResult.accessible) {
    console.log('\n❌ 生成桶访问问题:');
    console.log('   1. 检查存储桶是否启用了公共访问');
    console.log('   2. 验证自定义域名配置');
    console.log('   3. 确认CORS策略设置');
  }
  
  if (!specificFileResult.accessible) {
    console.log('\n❌ 特定文件访问问题:');
    console.log('   1. 文件可能不存在');
    console.log('   2. 存储桶权限配置错误');
    console.log('   3. URL格式可能不正确');
  }
  
  console.log('\n📝 建议的修复步骤:');
  console.log('1. 登录Cloudflare Dashboard');
  console.log('2. 进入R2 Object Storage');
  console.log('3. 选择相应的存储桶');
  console.log('4. 在Settings中启用"Public bucket"');
  console.log('5. 配置CORS策略（如果需要）');
  console.log('6. 验证自定义域名设置');
  
  console.log('\n🔗 环境变量配置建议:');
  console.log(`CLOUDFLARE_R2_PUBLIC_URL=${R2_CONFIG.UPLOAD_BUCKET.publicUrl}`);
  console.log(`CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=${R2_CONFIG.AFTERIMAGE_BUCKET.publicUrl}`);
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testUrlAccess, generateTestUrls }; 