#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 测试Cloudflare R2配置...\n');

// 检查环境变量
const requiredEnvVars = [
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME',
  'CLOUDFLARE_R2_PUBLIC_URL'
];

console.log('📋 检查环境变量:');
let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***已配置***' : value}`);
  } else {
    console.log(`❌ ${varName}: 未配置`);
    missingVars.push(varName);
  }
});

console.log('\n📦 检查依赖包:');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredPackages = [
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner'
  ];
  
  requiredPackages.forEach(pkg => {
    if (dependencies[pkg]) {
      console.log(`✅ ${pkg}: ${dependencies[pkg]}`);
    } else {
      console.log(`❌ ${pkg}: 未安装`);
    }
  });
} else {
  console.log('❌ package.json 文件不存在');
}

console.log('\n🔍 检查源代码文件:');
const sourceFiles = [
  'src/lib/r2-client.ts',
  'src/lib/image-upload.ts',
  'src/lib/image-delete.ts',
  'src/app/api/upload-image/route.ts',
  'src/app/api/check-r2-config/route.ts'
];

sourceFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`❌ ${filePath}: 文件不存在`);
  }
});

console.log('\n📊 配置状态总结:');
if (missingVars.length === 0) {
  console.log('✅ 所有必需的环境变量已配置');
  console.log('✅ 可以开始使用Cloudflare R2');
} else {
  console.log(`❌ 缺少 ${missingVars.length} 个环境变量:`);
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 请在环境变量中配置这些值');
}

console.log('\n🚀 下一步操作:');
console.log('1. 如果环境变量未配置，请在Cloudflare控制台获取R2配置信息');
console.log('2. 安装依赖: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner');
console.log('3. 测试上传功能: npm run test:upload');
console.log('4. 部署到生产环境');

console.log('\n📚 相关文档:');
console.log('- Cloudflare R2: https://developers.cloudflare.com/r2/');
console.log('- AWS SDK: https://docs.aws.amazon.com/sdk-for-javascript/'); 