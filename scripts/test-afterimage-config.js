#!/usr/bin/env node

/**
 * 测试生成图片R2配置
 * 验证kemono-afterimage桶的配置是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 测试生成图片R2配置...\n');

// 检查关键文件是否存在
const filesToCheck = [
  '../src/lib/afterimage-upload.ts',
  '../src/lib/r2-afterimage-client.ts',
  '../src/app/api/check-afterimage-r2-config/route.ts'
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

console.log('\n🔍 配置说明:');
console.log('1. CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME: kemono-afterimage');
console.log('2. CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL: 生成图片的公共访问URL');
console.log('3. 生成图片存储在独立的kemono-afterimage桶中');
console.log('4. 与上传图片存储桶完全隔离');

console.log('\n📝 配置步骤:');
console.log('1. 在Cloudflare R2中创建kemono-afterimage桶');
console.log('2. 配置公共访问权限');
console.log('3. 设置自定义域名（可选）');
console.log('4. 更新.env.local文件中的配置');

console.log('\n🎯 预期配置:');
console.log('CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage');
console.log('CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://your-afterimage-domain.com');

console.log('\n⚠️ 注意事项:');
console.log('- 确保kemono-afterimage桶已创建');
console.log('- 确保桶有公共读取权限');
console.log('- 确保自定义域名已正确配置');
console.log('- 生成图片将存储在afterimages/目录下');

console.log('\n✨ kemono-afterimage桶配置检查完成！'); 