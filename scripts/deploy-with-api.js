#!/usr/bin/env node

/**
 * 支持API路由的部署脚本
 * 用于Cloudflare Pages或其他支持API的平台
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始部署支持API路由的版本...');

// 设置环境变量
process.env.STATIC_EXPORT = 'false';
process.env.CF_PAGES = 'false';

try {
  // 1. 清理之前的构建
  console.log('🧹 清理之前的构建...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rm -rf out', { stdio: 'inherit' });
  }

  // 2. 安装依赖
  console.log('📦 安装依赖...');
  execSync('npm install', { stdio: 'inherit' });

  // 3. 构建项目
  console.log('🔨 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });

  // 4. 验证API路由
  console.log('🔍 验证API路由...');
  const apiRoutes = [
    'src/app/api/upload-image/route.ts',
    'src/app/api/generate-image/route.ts',
    'src/app/api/share/route.ts'
  ];

  apiRoutes.forEach(route => {
    if (fs.existsSync(route)) {
      console.log(`✅ API路由存在: ${route}`);
    } else {
      console.warn(`⚠️ API路由不存在: ${route}`);
    }
  });

  // 5. 检查环境变量
  console.log('🔧 检查环境变量...');
  const requiredEnvVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn(`⚠️ 缺少环境变量: ${missingVars.join(', ')}`);
    console.log('请确保在生产环境中设置了这些变量');
  } else {
    console.log('✅ 所有必需的环境变量都已配置');
  }

  console.log('🎉 部署准备完成！');
  console.log('');
  console.log('📋 部署说明:');
  console.log('1. 确保目标平台支持Next.js API路由');
  console.log('2. 设置所有必需的环境变量');
  console.log('3. 上传构建后的文件到服务器');
  console.log('4. 启动服务器: npm start');

} catch (error) {
  console.error('❌ 部署失败:', error.message);
  process.exit(1);
} 