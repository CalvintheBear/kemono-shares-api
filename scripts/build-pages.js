#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Cloudflare Pages 构建开始...');

// 清理函数
function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    try {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${dir}"`, { stdio: 'inherit', shell: true });
      } else {
        execSync(`rm -rf "${dir}"`, { stdio: 'inherit' });
      }
      console.log(`✅ 已清理: ${dir}`);
    } catch (error) {
      console.log(`⚠️  清理失败: ${dir}`);
    }
  }
}

// 设置环境变量
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_CACHE = 'false';
process.env.WEBPACK_CACHE = 'false';

// 步骤1: 清理缓存和构建目录
console.log('🧹 清理缓存和构建目录...');
const dirsToClean = ['.next', '.vercel', 'cache', 'dist'];
dirsToClean.forEach(cleanDirectory);

// 步骤2: 使用专门的Pages配置
console.log('📋 使用 Cloudflare Pages 配置...');
const originalConfig = 'next.config.ts';
const pagesConfig = 'next.config.pages.js';

if (fs.existsSync(pagesConfig)) {
  if (fs.existsSync(originalConfig)) {
    fs.copyFileSync(originalConfig, `${originalConfig}.backup`);
  }
  fs.copyFileSync(pagesConfig, originalConfig);
  console.log('✅ 已应用 Pages 配置');
}

// 步骤3: 执行静态构建
console.log('🔨 开始静态构建...');
try {
  execSync('npm run build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_CACHE: 'false',
      WEBPACK_CACHE: 'false',
      NEXT_WEBPACK_CACHE: 'false'
    },
    shell: true
  });
  
  console.log('✅ 构建完成！');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  
  // 恢复原始配置
  if (fs.existsSync(`${originalConfig}.backup`)) {
    fs.copyFileSync(`${originalConfig}.backup`, originalConfig);
    fs.unlinkSync(`${originalConfig}.backup`);
  }
  process.exit(1);
}

// 步骤4: 验证文件大小
console.log('📏 验证文件大小...');
function checkFileSizes(dir) {
  if (!fs.existsSync(dir)) return true;
  
  const files = fs.readdirSync(dir, { recursive: true });
  let hasLargeFiles = false;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isFile()) {
      const sizeInMB = fs.statSync(filePath).size / (1024 * 1024);
      if (sizeInMB > 25) {
        console.log(`⚠️  大文件: ${file} (${sizeInMB.toFixed(2)} MB)`);
        hasLargeFiles = true;
      }
    }
  });
  
  return !hasLargeFiles;
}

const staticDir = 'out';
if (checkFileSizes(staticDir)) {
  console.log('✅ 所有文件都在 25MB 限制内');
} else {
  console.log('❌ 发现超过 25MB 的文件');
  process.exit(1);
}

// 步骤5: 恢复原始配置
console.log('🔄 恢复原始配置...');
if (fs.existsSync(`${originalConfig}.backup`)) {
  fs.copyFileSync(`${originalConfig}.backup`, originalConfig);
  fs.unlinkSync(`${originalConfig}.backup`);
  console.log('✅ 已恢复原始配置');
}

console.log('🎉 Cloudflare Pages 构建成功！');
console.log('📁 输出目录:', staticDir);