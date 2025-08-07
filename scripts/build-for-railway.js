#!/usr/bin/env node

/**
 * Railway 专用构建脚本
 * 支持 API 路由的 Next.js 应用构建
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚂 开始 Railway 构建...');

try {
  // 设置环境变量
  process.env.RAILWAY = 'true';
  process.env.NODE_ENV = 'production';
  process.env.STATIC_EXPORT = 'false'; // Railway 支持 API 路由

  console.log('📦 安装依赖...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('🔨 构建 Next.js 应用...');
  execSync('next build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log('✅ Next.js 构建完成');

  // 修复 standalone package.json
  console.log('🔧 修复 standalone package.json...');
  try {
    const { fixStandalonePackage } = require('./fix-standalone-package.js');
    fixStandalonePackage();
  } catch (error) {
    console.warn('⚠️ 修复 standalone package.json 失败:', error.message);
  }

  // 检查构建输出
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('📁 Next.js 构建文件已生成到:', nextDir);
    
    // 检查 standalone 输出
    const standaloneDir = path.join(nextDir, 'standalone');
    if (fs.existsSync(standaloneDir)) {
      console.log('✅ Standalone 输出已生成');
      const standaloneFiles = fs.readdirSync(standaloneDir);
      console.log('📋 Standalone 文件列表:', standaloneFiles);
    } else {
      console.warn('⚠️ Standalone 输出目录不存在');
    }
    
    // 检查 API 路由
    const apiDir = path.join(nextDir, 'server', 'app', 'api');
    if (fs.existsSync(apiDir)) {
      console.log('✅ API 路由已生成');
      const apiFiles = fs.readdirSync(apiDir);
      console.log('📋 API 路由列表:', apiFiles);
    } else {
      console.warn('⚠️ API 路由目录不存在');
    }

    // 检查文件大小
    console.log('🔍 检查文件大小...');
    const maxFileSize = 50 * 1024 * 1024; // Railway 限制更宽松，50MB
    let hasLargeFiles = false;

    function checkDirectorySize(dirPath) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          checkDirectorySize(filePath);
        } else {
          const sizeInMB = stats.size / (1024 * 1024);
          if (stats.size > maxFileSize) {
            console.warn(`⚠️ 文件过大: ${filePath} (${sizeInMB.toFixed(2)}MB)`);
            hasLargeFiles = true;
          }
        }
      }
    }

    checkDirectorySize(nextDir);

    if (hasLargeFiles) {
      console.warn('⚠️ 发现超过50MB的文件');
    } else {
      console.log('✅ 所有文件大小都在限制内');
    }
  } else {
    console.error('❌ Next.js 构建目录不存在:', nextDir);
    process.exit(1);
  }

  console.log('🎉 Railway 构建完成！');
  console.log('📤 可以部署到 Railway 了');
  console.log('');
  console.log('📋 部署说明:');
  console.log('1. Railway 会自动检测 Next.js 应用');
  console.log('2. 确保环境变量已正确配置');
  console.log('3. 构建命令: npm run build:railway');
  console.log('4. 启动命令: npm start');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
