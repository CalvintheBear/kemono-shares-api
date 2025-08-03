const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 超优化构建...');

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

console.log('📦 开始 Next.js 优化构建...');
try {
  // 临时重命名配置文件
  const originalConfig = 'next.config.ts';
  const pagesConfig = 'next.config.pages.ts';
  
  if (fs.existsSync(pagesConfig)) {
    // 备份原配置
    if (fs.existsSync(originalConfig)) {
      fs.copyFileSync(originalConfig, originalConfig + '.backup');
    }
    // 使用Pages配置
    fs.copyFileSync(pagesConfig, originalConfig);
    console.log('📝 使用 Pages 优化配置...');
  }
  
  // 使用优化的构建命令
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
  }
} catch (error) {
  console.error('❌ Next.js 构建失败:', error.message);
  process.exit(1);
}

// 检查并优化构建输出文件大小
console.log('📊 检查构建文件大小...');
const nextDir = path.join(process.cwd(), '.next');
const staticDir = path.join(nextDir, 'static');

if (fs.existsSync(staticDir)) {
  const files = fs.readdirSync(staticDir);
  let totalSize = 0;
  let largeFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(staticDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    
    if (stats.size > 25 * 1024 * 1024) { // 25MB
      largeFiles.push({ name: file, size: stats.size, sizeInMB });
      console.warn(`⚠️  警告: ${file} 大小为 ${sizeInMB}MB (超过 25MB 限制)`);
    } else if (stats.size > 10 * 1024 * 1024) { // 10MB
      console.warn(`⚠️  注意: ${file} 大小为 ${sizeInMB}MB (较大文件)`);
    } else {
      console.log(`✅ ${file}: ${sizeInMB}MB`);
    }
  });
  
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`📈 总大小: ${totalSizeInMB}MB`);
  
  if (largeFiles.length > 0) {
    console.error('❌ 发现超过25MB的文件，需要进一步优化:');
    largeFiles.forEach(file => {
      console.error(`   - ${file.name}: ${file.sizeInMB}MB`);
    });
    
    // 尝试进一步优化
    console.log('🔧 尝试进一步优化大文件...');
    largeFiles.forEach(file => {
      const filePath = path.join(staticDir, file.name);
      console.log(`   处理文件: ${file.name}`);
      
      // 如果是webpack包文件，尝试分割
      if (file.name.includes('webpack') && file.name.includes('.pack')) {
        console.log(`   ⚠️  检测到webpack包文件 ${file.name}，建议检查代码分割配置`);
      }
    });
  }
  
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

// 检查最终输出
console.log('📁 检查最终构建输出...');
const outputDir = path.join(process.cwd(), '.vercel', 'output', 'static');

if (fs.existsSync(outputDir)) {
  const files = fs.readdirSync(outputDir);
  let totalSize = 0;
  
  files.forEach(file => {
    const filePath = path.join(outputDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalSize += stats.size;
    
    if (stats.size > 25 * 1024 * 1024) {
      console.error(`❌ 错误: 最终输出文件 ${file} 大小为 ${sizeInMB}MB (超过 25MB 限制)`);
    } else {
      console.log(`✅ 最终输出: ${file}: ${sizeInMB}MB`);
    }
  });
  
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`📈 最终总大小: ${totalSizeInMB}MB`);
  
  if (totalSize <= 25 * 1024 * 1024) {
    console.log('✅ 构建成功！所有文件都在25MB限制内');
  } else {
    console.error('❌ 构建失败！仍有文件超过25MB限制');
    process.exit(1);
  }
}

console.log('✅ Cloudflare Pages 超优化构建完成！');
console.log('📁 构建输出位于 .vercel/output/static 目录');
console.log('🚀 可以部署到 Cloudflare Pages 了！'); 