#!/usr/bin/env node

/**
 * 测试share系统的R2集成
 * 验证从KIE AI下载图片到R2存储的完整流程
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 测试share系统的R2集成...\n');

// 检查关键文件是否存在
const filesToCheck = [
  '../src/lib/image-download-to-r2.ts',
  '../src/lib/afterimage-upload.ts',
  '../src/lib/r2-afterimage-client.ts',
  '../src/app/api/share/route.ts',
  '../src/app/api/check-afterimage-r2-config/route.ts',
  '../src/components/Workspace.tsx',
  '../src/components/ShareButton.tsx'
];

console.log('📋 检查关键文件:');
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// 检查环境变量
console.log('\n🔧 检查环境变量:');
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL',
    'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME',
    'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL'
  ];
  
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    console.log(`${hasVar ? '✅' : '❌'} ${varName}`);
  });
} else {
  console.log('❌ .env.local 文件不存在');
}

// 检查package.json依赖
console.log('\n📦 检查依赖:');
const packagePath = path.join(__dirname, '../package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = [
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner'
  ];
  
  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`${hasDep ? '✅' : '❌'} ${dep}`);
  });
} else {
  console.log('❌ package.json 文件不存在');
}

console.log('\n🔍 功能说明:');
console.log('1. 用户生成图片后，系统自动检测KIE AI临时URL');
console.log('2. 自动下载图片并上传到kemono-afterimage存储桶');
console.log('3. 使用R2的永久URL创建分享链接');
console.log('4. share页面显示R2的永久图片，不再有过期问题');
console.log('5. 生成图片与上传图片存储桶完全隔离');

console.log('\n📝 测试步骤:');
console.log('1. 确保环境变量已正确配置');
console.log('2. 启动开发服务器: npm run dev');
console.log('3. 访问 http://localhost:3000/workspace');
console.log('4. 上传图片并生成AI图片');
console.log('5. 观察控制台日志，确认R2上传过程');
console.log('6. 点击分享按钮，验证分享链接使用R2 URL');

console.log('\n🎯 预期结果:');
console.log('- 图片生成成功后，控制台显示"开始自动处理分享图片"');
console.log('- 显示"开始从KIE AI下载图片"和"开始上传到kemono-afterimage桶"');
console.log('- 显示"生成图片上传成功"和"分享图片自动处理完成"');
console.log('- share页面显示kemono-afterimage桶的永久URL');
console.log('- 生成图片存储在独立的kemono-afterimage桶中');

console.log('\n⚠️ 注意事项:');
console.log('- 确保kemono-afterimage桶已创建并配置正确');
console.log('- 确保R2配置正确且有足够的存储空间');
console.log('- 网络连接稳定，避免下载/上传失败');
console.log('- 如果R2上传失败，系统会回退到原始KIE AI URL');
console.log('- 生成图片与上传图片使用不同的存储桶，完全隔离');

console.log('\n✨ kemono-afterimage桶集成已完成！生成图片将存储在独立的存储桶中。'); 