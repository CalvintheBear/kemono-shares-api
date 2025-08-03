const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 激进优化构建...');

// 清理之前的构建文件
console.log('🧹 清理之前的构建文件...');
try {
  if (fs.existsSync('.next')) {
    if (process.platform === 'win32') {
      execSync('if exist .next rmdir /s /q .next', { stdio: 'inherit' });
    } else {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
  }
  if (fs.existsSync('cache')) {
    if (process.platform === 'win32') {
      execSync('if exist cache rmdir /s /q cache', { stdio: 'inherit' });
    } else {
      execSync('rm -rf cache', { stdio: 'inherit' });
    }
  }
  if (fs.existsSync('dist')) {
    if (process.platform === 'win32') {
      execSync('if exist dist rmdir /s /q dist', { stdio: 'inherit' });
    } else {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
  }
  if (fs.existsSync('.vercel')) {
    if (process.platform === 'win32') {
      execSync('if exist .vercel rmdir /s /q .vercel', { stdio: 'inherit' });
    } else {
      execSync('rm -rf .vercel', { stdio: 'inherit' });
    }
  }
} catch (error) {
  console.log('清理文件时出错:', error.message);
}

// 设置更激进的环境变量
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_CACHE = 'false';
process.env.NEXT_SHARP_PATH = 'false'; // 禁用 Sharp 图片处理
process.env.NEXT_IMAGE_DOMAIN = ''; // 禁用图片优化

console.log('📦 开始激进优化构建...');
try {
  // 使用更激进的构建命令
  execSync('next build --no-lint --no-mangling', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_CACHE: 'false',
      NEXT_SHARP_PATH: 'false',
      NEXT_IMAGE_DOMAIN: '',
      // 禁用一些可能导致大文件的功能
      NEXT_DISABLE_OPTIMIZATION: 'false',
      NEXT_DISABLE_SOURCEMAPS: 'true',
    }
  });
} catch (error) {
  console.error('❌ Next.js 构建失败:', error.message);
  process.exit(1);
}

// 检查构建输出文件大小
console.log('📊 检查构建文件大小...');
const nextDir = path.join(process.cwd(), '.next');
const staticDir = path.join(nextDir, 'static');

if (fs.existsSync(staticDir)) {
  const files = fs.readdirSync(staticDir);
  let totalSize = 0;
  let largeFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(staticDir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // 递归检查子目录
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach(subFile => {
        const subFilePath = path.join(filePath, subFile);
        const stats = fs.statSync(subFilePath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        totalSize += stats.size;
        
        if (stats.size > 25 * 1024 * 1024) { // 25MB
          largeFiles.push(`${file}/${subFile}: ${sizeInMB}MB`);
        } else {
          console.log(`✅ ${file}/${subFile}: ${sizeInMB}MB`);
        }
      });
    } else {
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      totalSize += stats.size;
      
      if (stats.size > 25 * 1024 * 1024) { // 25MB
        largeFiles.push(`${file}: ${sizeInMB}MB`);
      } else {
        console.log(`✅ ${file}: ${sizeInMB}MB`);
      }
    }
  });
  
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`📈 总大小: ${totalSizeInMB}MB`);
  
  if (largeFiles.length > 0) {
    console.warn('\n⚠️  发现超过 25MB 的文件:');
    largeFiles.forEach(file => console.warn(`  - ${file}`));
    console.warn('\n💡 建议进一步优化:');
    console.warn('1. 检查是否有大型依赖项');
    console.warn('2. 考虑使用 CDN 加载大型库');
    console.warn('3. 移除不必要的依赖');
    console.warn('4. 使用动态导入分割代码');
  }
}

// 尝试运行 Cloudflare Pages 构建
console.log('☁️  开始 Cloudflare Pages 构建...');
try {
  // 设置更保守的环境变量
  const cloudflareEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NODE_OPTIONS: '--max-old-space-size=4096', // 限制内存使用
  };
  
  execSync('npx @cloudflare/next-on-pages', { 
    stdio: 'inherit',
    env: cloudflareEnv
  });
} catch (error) {
  console.error('❌ Cloudflare Pages 构建失败:', error.message);
  console.log('\n💡 如果仍然遇到 25MB 限制，请尝试以下解决方案:');
  console.log('1. 使用 WSL 或 Linux 环境运行构建');
  console.log('2. 检查是否有大型依赖项可以移除');
  console.log('3. 考虑使用 Vercel 或其他平台');
  console.log('4. 联系 Cloudflare 支持获取帮助');
  process.exit(1);
}

console.log('✅ Cloudflare Pages 构建完成！');
console.log('📁 构建输出位于 .vercel/output/static 目录'); 