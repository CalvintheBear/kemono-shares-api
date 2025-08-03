const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 优化构建...');

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
} catch (error) {
  console.log('清理文件时出错:', error.message);
}

// 设置环境变量以优化构建
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_CACHE = 'false';

console.log('📦 开始 Next.js 构建...');
try {
  // 使用优化的构建命令
  execSync('next build --no-lint', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_CACHE: 'false'
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
  
  files.forEach(file => {
    const filePath = path.join(staticDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    
    if (stats.size > 25 * 1024 * 1024) { // 25MB
      console.warn(`⚠️  警告: ${file} 大小为 ${sizeInMB}MB (超过 25MB 限制)`);
    } else {
      console.log(`✅ ${file}: ${sizeInMB}MB`);
    }
  });
  
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`📈 总大小: ${totalSizeInMB}MB`);
  
  if (totalSize > 25 * 1024 * 1024) {
    console.warn('⚠️  警告: 总大小超过 25MB，可能需要进一步优化');
  }
}

// 运行 Cloudflare Pages 构建
console.log('☁️  开始 Cloudflare Pages 构建...');
try {
  execSync('npx @cloudflare/next-on-pages', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
} catch (error) {
  console.error('❌ Cloudflare Pages 构建失败:', error.message);
  process.exit(1);
}

console.log('✅ Cloudflare Pages 构建完成！');
console.log('📁 构建输出位于 .vercel/output/static 目录'); 