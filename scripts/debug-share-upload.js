#!/usr/bin/env node

/**
 * 调试share上传功能
 * 测试从KIE AI下载图片并上传到kemono-afterimage桶
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 调试share上传功能...\n');

// 检查环境变量
console.log('📋 检查环境变量:');
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // 检查关键环境变量
  const vars = {
    'CLOUDFLARE_R2_ACCOUNT_ID': envContent.includes('CLOUDFLARE_R2_ACCOUNT_ID'),
    'CLOUDFLARE_R2_ACCESS_KEY_ID': envContent.includes('CLOUDFLARE_R2_ACCESS_KEY_ID'),
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY': envContent.includes('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
    'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME': envContent.includes('CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME'),
    'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL': envContent.includes('CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL')
  };
  
  Object.entries(vars).forEach(([varName, hasVar]) => {
    console.log(`${hasVar ? '✅' : '❌'} ${varName}`);
  });
  
  // 提取具体的值
  const extractValue = (varName) => {
    const match = envContent.match(new RegExp(`${varName}=(.+)`));
    return match ? match[1] : '未设置';
  };
  
  console.log('\n📊 当前配置值:');
  console.log(`CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME: ${extractValue('CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME')}`);
  console.log(`CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL: ${extractValue('CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL')}`);
  
} else {
  console.log('❌ .env.local 文件不存在');
}

console.log('\n🔍 可能的问题:');
console.log('1. 环境变量未正确配置');
console.log('2. kemono-afterimage桶未创建');
console.log('3. R2权限不足');
console.log('4. KIE AI URL检测失败');
console.log('5. 网络连接问题');

console.log('\n📝 调试步骤:');
console.log('1. 检查.env.local文件中的配置');
console.log('2. 确认kemono-afterimage桶已创建');
console.log('3. 检查R2 API Token权限');
console.log('4. 查看浏览器控制台日志');
console.log('5. 检查服务器端日志');

console.log('\n🎯 预期日志:');
console.log('🔄 开始处理分享请求: { generatedUrl: "...", style: "..." }');
console.log('🔄 检测到KIE AI临时URL，开始下载到R2');
console.log('📥 开始从KIE AI下载图片: [KIE_URL]');
console.log('📤 开始上传生成图片到kemono-afterimage桶: [filename]');
console.log('✅ 生成图片上传成功: [kemono-afterimage_URL]');
console.log('✅ 图片已处理并存储到R2: [kemono-afterimage_URL]');

console.log('\n⚠️ 如果看到错误日志，请检查:');
console.log('- 环境变量是否正确设置');
console.log('- kemono-afterimage桶是否存在');
console.log('- R2权限是否足够');
console.log('- 网络连接是否正常');

console.log('\n✨ 调试信息收集完成！'); 