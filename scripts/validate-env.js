#!/usr/bin/env node

/**
 * 环境变量验证脚本
 * 检查所有必需的环境变量是否已配置
 */

require('dotenv').config();

const requiredEnvVars = {
  // Cloudflare R2 配置
  'CLOUDFLARE_R2_ACCOUNT_ID': 'Cloudflare R2 账户ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID': 'Cloudflare R2 访问密钥ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY': 'Cloudflare R2 秘密访问密钥',
  'CLOUDFLARE_R2_BUCKET_NAME': 'Cloudflare R2 存储桶名称',
  'CLOUDFLARE_R2_PUBLIC_URL': 'Cloudflare R2 公共URL',
  
  // Cloudflare R2 生成图片配置
  'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME': 'Cloudflare R2 生成图片存储桶名称',
  'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL': 'Cloudflare R2 生成图片公共URL',
};

console.log('🔍 验证环境变量配置...\n');

let allValid = true;
const missingVars = [];
const configuredVars = [];

for (const [varName, description] of Object.entries(requiredEnvVars)) {
  const value = process.env[varName];
  
  if (!value) {
    missingVars.push({ name: varName, description });
    allValid = false;
  } else {
    configuredVars.push({ name: varName, description, value: value.substring(0, 10) + '...' });
  }
}

// 显示已配置的变量
if (configuredVars.length > 0) {
  console.log('✅ 已配置的环境变量:');
  configuredVars.forEach(({ name, description, value }) => {
    console.log(`  ${name}: ${description} (${value})`);
  });
  console.log('');
}

// 显示缺失的变量
if (missingVars.length > 0) {
  console.log('❌ 缺失的环境变量:');
  missingVars.forEach(({ name, description }) => {
    console.log(`  ${name}: ${description}`);
  });
  console.log('');
}

// 验证R2配置
if (allValid) {
  console.log('🔧 验证R2配置...');
  
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  
  console.log(`  R2端点: https://${accountId}.r2.cloudflarestorage.com`);
  console.log(`  上传存储桶: ${bucketName}`);
  console.log(`  公共URL: ${publicUrl}`);
  
  // 验证URL格式
  if (!publicUrl.startsWith('https://')) {
    console.warn('⚠️ 公共URL应该以https://开头');
    allValid = false;
  }
  
  console.log('');
}

// 最终结果
if (allValid) {
  console.log('🎉 所有环境变量配置正确！');
  console.log('✅ 可以开始部署支持API路由的版本');
} else {
  console.log('❌ 环境变量配置不完整');
  console.log('');
  console.log('📋 配置说明:');
  console.log('1. 创建 .env.local 文件');
  console.log('2. 添加所有必需的环境变量');
  console.log('3. 确保R2存储桶已创建并配置了公共访问');
  console.log('4. 重新运行此脚本验证配置');
  
  process.exit(1);
} 