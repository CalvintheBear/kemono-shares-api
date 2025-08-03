const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 超激进优化构建...');

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

// 设置超激进的环境变量
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_CACHE = 'false';
process.env.NEXT_SHARP_PATH = 'false';
process.env.NEXT_IMAGE_DOMAIN = '';
process.env.NEXT_DISABLE_OPTIMIZATION = 'false';
process.env.NEXT_DISABLE_SOURCEMAPS = 'true';
process.env.NEXT_DISABLE_STATIC_IMAGES = 'true';
process.env.NEXT_DISABLE_IMAGE_OPTIMIZATION = 'true';

console.log('📦 开始超激进优化构建...');
try {
  // 使用超激进的构建命令
  execSync('next build --no-lint', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_CACHE: 'false',
      NEXT_SHARP_PATH: 'false',
      NEXT_IMAGE_DOMAIN: '',
      NEXT_DISABLE_OPTIMIZATION: 'false',
      NEXT_DISABLE_SOURCEMAPS: 'true',
      NEXT_DISABLE_STATIC_IMAGES: 'true',
      NEXT_DISABLE_IMAGE_OPTIMIZATION: 'true',
      // 限制内存使用
      NODE_OPTIONS: '--max-old-space-size=2048',
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
  
  function checkDirectory(dirPath, prefix = '') {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        checkDirectory(itemPath, `${prefix}${item}/`);
      } else {
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        totalSize += stats.size;
        
        if (stats.size > 25 * 1024 * 1024) { // 25MB
          largeFiles.push(`${prefix}${item}: ${sizeInMB}MB`);
          console.warn(`⚠️  警告: ${prefix}${item} 大小为 ${sizeInMB}MB (超过 25MB 限制)`);
        } else {
          console.log(`✅ ${prefix}${item}: ${sizeInMB}MB`);
        }
      }
    });
  }
  
  checkDirectory(staticDir);
  
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
    console.warn('5. 考虑使用 Railway 或其他平台');
  }
}

// 尝试运行 Cloudflare Pages 构建
console.log('☁️  开始 Cloudflare Pages 构建...');
try {
  // 设置更保守的环境变量
  const cloudflareEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NODE_OPTIONS: '--max-old-space-size=2048', // 限制内存使用
  };
  
  execSync('npx @cloudflare/next-on-pages', { 
    stdio: 'inherit',
    env: cloudflareEnv
  });
} catch (error) {
  console.error('❌ Cloudflare Pages 构建失败:', error.message);
  console.log('\n💡 如果仍然遇到 25MB 限制，请尝试以下解决方案:');
  console.log('1. 使用 Railway 部署（无文件大小限制）');
  console.log('2. 使用 Vercel 部署');
  console.log('3. 检查是否有大型依赖项可以移除');
  console.log('4. 使用 CDN 加载大型库');
  console.log('5. 联系 Cloudflare 支持获取帮助');
  process.exit(1);
}

console.log('✅ Cloudflare Pages 构建完成！');
console.log('📁 构建输出位于 .vercel/output/static 目录'); 