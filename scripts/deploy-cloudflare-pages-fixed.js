#!/usr/bin/env node

/**
 * Cloudflare Pages 部署脚本 - 修复版本
 * 自动修复 node:stream 和路由重叠问题
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 部署 (修复版本)...');

try {
  // 1. 清理之前的构建
  console.log('🧹 清理之前的构建...');
  if (fs.existsSync('.next')) {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('.vercel')) {
    execSync('rmdir /s /q .vercel', { stdio: 'inherit' });
  }
  
  // 2. 安装依赖
  console.log('📦 安装依赖...');
  execSync('npm install', { stdio: 'inherit' });
  
  // 3. 构建项目
  console.log('🔨 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 4. 生成 Cloudflare Pages 构建
  console.log('☁️ 生成 Cloudflare Pages 构建...');
  execSync('npx @cloudflare/next-on-pages@latest', { stdio: 'inherit' });
  
  // 5. 修复路由重叠问题
  console.log('🔧 修复路由重叠问题...');
  execSync('node scripts/fix-routes-overlap.js', { stdio: 'inherit' });
  
  // 6. 验证构建输出
  console.log('✅ 验证构建输出...');
  if (fs.existsSync('.vercel/output/_routes.json')) {
    const routes = JSON.parse(fs.readFileSync('.vercel/output/_routes.json', 'utf8'));
    console.log('📋 最终路由配置:', JSON.stringify(routes, null, 2));
  }
  
  // 7. 检查是否有 node:stream 相关的问题
  console.log('🔍 检查 Node.js 兼容性问题...');
  const functionsDir = '.vercel/output/functions';
  if (fs.existsSync(functionsDir)) {
    const files = fs.readdirSync(functionsDir, { recursive: true });
    const jsFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    
    let hasNodeStream = false;
    for (const file of jsFiles) {
      const filePath = path.join(functionsDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('node:stream') || content.includes('require("stream")')) {
          console.log(`⚠️ 发现 Node.js stream 引用: ${file}`);
          hasNodeStream = true;
        }
      } catch (error) {
        // 忽略读取错误
      }
    }
    
    if (!hasNodeStream) {
      console.log('✅ 未发现 Node.js stream 引用');
    }
  }
  
  console.log('🎉 构建完成！现在可以部署到 Cloudflare Pages');
  console.log('');
  console.log('📋 部署步骤:');
  console.log('1. 将 .vercel/output 目录上传到 Cloudflare Pages');
  console.log('2. 或者使用 wrangler pages deploy .vercel/output');
  console.log('3. 确保环境变量已正确配置');
  
} catch (error) {
  console.error('❌ 部署失败:', error.message);
  process.exit(1);
}
