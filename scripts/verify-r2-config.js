#!/usr/bin/env node

/**
 * R2存储桶配置验证脚本
 * 用于验证Cloudflare R2存储桶的配置和权限
 */

const https = require('https');
const http = require('http');

// R2配置
const R2_CONFIG = {
  UPLOAD_BUCKET: {
    name: 'kemono-uploadimage',
    publicUrl: 'https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev',
    accountId: '9a5ff316a26b8abb696af519e515d2de'
  },
  AFTERIMAGE_BUCKET: {
    name: 'kemono-afterimage',
    publicUrl: 'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev',
    accountId: '9a5ff316a26b8abb696af519e515d2de'
  }
};

// 测试URL访问
function testUrlAccess(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.get(url, (res) => {
      console.log(`✅ ${description} - 状态码: ${res.statusCode}`);
      resolve({ 
        url, 
        description,
        status: res.statusCode, 
        accessible: res.statusCode < 400,
        headers: res.headers
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${description} - 错误: ${err.message}`);
      resolve({ 
        url, 
        description,
        status: 'ERROR', 
        accessible: false, 
        error: err.message 
      });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ${description} - 超时`);
      req.destroy();
      resolve({ 
        url, 
        description,
        status: 'TIMEOUT', 
        accessible: false 
      });
    });
  });
}

// 主函数
async function main() {
  console.log('🔍 开始验证R2存储桶配置...\n');
  
  // 测试上传桶
  const uploadTestUrl = `${R2_CONFIG.UPLOAD_BUCKET.publicUrl}/test-access.txt`;
  const uploadResult = await testUrlAccess(uploadTestUrl, '上传桶访问测试');
  
  // 测试生成桶
  const afterimageTestUrl = `${R2_CONFIG.AFTERIMAGE_BUCKET.publicUrl}/test-access.txt`;
  const afterimageResult = await testUrlAccess(afterimageTestUrl, '生成桶访问测试');
  
  // 测试您提到的具体文件
  const specificFileUrl = 'https://pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev/uploads/1754454431160-gl2z86hasq5.jpg';
  const specificFileResult = await testUrlAccess(specificFileUrl, '具体文件访问测试');
  
  // 测试生成的图片文件
  const generatedFileUrl = 'https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/generated/ef5a8f6c837341545eeed156c149b481_1.jpg';
  const generatedFileResult = await testUrlAccess(generatedFileUrl, '生成图片访问测试');
  
  console.log('\n📊 测试结果汇总:');
  [uploadResult, afterimageResult, specificFileResult, generatedFileResult].forEach(result => {
    const status = result.accessible ? '✅ 可访问' : '❌ 不可访问';
    console.log(`${status} - ${result.description}: ${result.url}`);
  });
  
  console.log('\n🔧 问题分析和解决方案:');
  
  if (!uploadResult.accessible) {
    console.log('\n❌ 上传桶访问问题:');
    console.log('   1. 检查存储桶是否启用了公共访问');
    console.log('   2. 验证自定义域名配置');
    console.log('   3. 确认CORS策略设置');
    console.log('   4. 检查存储桶权限设置');
  }
  
  if (!afterimageResult.accessible) {
    console.log('\n❌ 生成桶访问问题:');
    console.log('   1. 检查存储桶是否启用了公共访问');
    console.log('   2. 验证自定义域名配置');
    console.log('   3. 确认CORS策略设置');
    console.log('   4. 检查存储桶权限设置');
  }
  
  if (!specificFileResult.accessible) {
    console.log('\n❌ 具体文件访问问题:');
    console.log('   1. 文件可能不存在');
    console.log('   2. 存储桶权限配置错误');
    console.log('   3. URL格式可能不正确');
  }
  
  if (!generatedFileResult.accessible) {
    console.log('\n❌ 生成图片访问问题:');
    console.log('   1. 文件可能不存在');
    console.log('   2. 存储桶权限配置错误');
    console.log('   3. 回调处理可能失败');
  }
  
  console.log('\n📝 建议的修复步骤:');
  console.log('1. 登录Cloudflare Dashboard');
  console.log('2. 进入R2 Object Storage');
  console.log('3. 选择相应的存储桶');
  console.log('4. 在Settings中启用"Public bucket"');
  console.log('5. 配置CORS策略（如果需要）');
  console.log('6. 验证自定义域名设置');
  console.log('7. 检查存储桶权限');
  
  console.log('\n🔗 环境变量配置建议:');
  console.log(`CLOUDFLARE_R2_PUBLIC_URL=${R2_CONFIG.UPLOAD_BUCKET.publicUrl}`);
  console.log(`CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=${R2_CONFIG.AFTERIMAGE_BUCKET.publicUrl}`);
  
  // 根据Cloudflare R2文档的建议
  console.log('\n📚 根据Cloudflare R2文档的建议:');
  console.log('1. 确保启用了"Public buckets"功能');
  console.log('2. 配置适当的CORS策略');
  console.log('3. 使用正确的自定义域名');
  console.log('4. 验证存储桶权限设置');
  console.log('5. 检查对象访问权限');
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testUrlAccess, R2_CONFIG }; 