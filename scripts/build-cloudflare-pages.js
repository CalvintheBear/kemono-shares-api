const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 极优化构建...');

// 清理之前的构建文件
console.log('🧹 清理之前的构建文件...');
try {
  const dirsToClean = ['.next', 'cache', 'dist', '.vercel'];
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      if (process.platform === 'win32') {
        execSync(`if exist ${dir} rmdir /s /q ${dir}`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
      }
    }
  });
} catch (error) {
  console.log('清理文件时出错:', error.message);
}

// 设置环境变量以优化构建
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_CACHE = 'false';
process.env.NEXT_OPTIMIZE_FONTS = 'false';
process.env.NEXT_OPTIMIZE_IMAGES = 'false';

console.log('📦 开始 Next.js 极优化构建...');
try {
  // 临时重命名配置文件
  const originalConfig = 'next.config.ts';
  const cloudflareConfig = 'next.config.cloudflare.ts';
  
  if (fs.existsSync(cloudflareConfig)) {
    // 备份原配置
    if (fs.existsSync(originalConfig)) {
      fs.copyFileSync(originalConfig, originalConfig + '.backup');
    }
    // 使用Cloudflare配置
    fs.copyFileSync(cloudflareConfig, originalConfig);
    console.log('📝 使用 Cloudflare Pages 极优化配置...');
  }
  
  // 使用极优化的构建命令
  execSync('next build --no-lint', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_CACHE: 'false',
      NEXT_OPTIMIZE_FONTS: 'false',
      NEXT_OPTIMIZE_IMAGES: 'false'
    }
  });
  
  // 恢复原配置
  if (fs.existsSync(originalConfig + '.backup')) {
    fs.copyFileSync(originalConfig + '.backup', originalConfig);
    fs.unlinkSync(originalConfig + '.backup');
    console.log('📝 恢复原配置...');
  }
  
  console.log('✅ Next.js 构建完成！');
} catch (error) {
  console.error('❌ Next.js 构建失败:', error.message);
  
  // 恢复原配置
  if (fs.existsSync(originalConfig + '.backup')) {
    fs.copyFileSync(originalConfig + '.backup', originalConfig);
    fs.unlinkSync(originalConfig + '.backup');
    console.log('📝 恢复原配置...');
  }
  
  process.exit(1);
}

// 检查文件大小
console.log('🔍 检查文件大小...');
try {
  const staticDir = path.join('.next', 'static');
  if (fs.existsSync(staticDir)) {
    const files = fs.readdirSync(staticDir, { recursive: true });
    let hasLargeFiles = false;
    
    files.forEach(file => {
      const filePath = path.join(staticDir, file);
      if (fs.statSync(filePath).isFile()) {
        const sizeInMB = fs.statSync(filePath).size / (1024 * 1024);
        if (sizeInMB > 25) {
          console.log(`⚠️  发现大文件: ${file} (${sizeInMB.toFixed(2)} MB)`);
          hasLargeFiles = true;
        }
      }
    });
    
    if (!hasLargeFiles) {
      console.log('✅ 所有文件都在 25MB 限制内！');
    } else {
      console.log('❌ 发现超过 25MB 的文件，需要进一步优化！');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('检查文件大小时出错:', error.message);
}

console.log('🎉 Cloudflare Pages 构建完成！'); 