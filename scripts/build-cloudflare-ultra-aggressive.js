const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始极激进构建 - 解决25MB限制问题...');

// 清理函数
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🧹 清理目录: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// 极激进的清理
console.log('📁 极激进清理缓存和构建文件...');
cleanDirectory('.next');
cleanDirectory('.vercel');
cleanDirectory('cache');
cleanDirectory('node_modules/.cache');
cleanDirectory('node_modules/.vite');
cleanDirectory('node_modules/.esbuild');

// 清理package-lock.json
if (fs.existsSync('package-lock.json')) {
  console.log('📦 清理 package-lock.json');
  fs.unlinkSync('package-lock.json');
}

// 设置极激进的环境变量
console.log('⚙️ 设置极激进环境变量...');
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_CACHE = 'false';
process.env.WEBPACK_CACHE = 'false';
process.env.NEXT_SHARP_PATH = 'false';
process.env.NEXT_IMAGE_DOMAIN = '';
process.env.NEXT_DISABLE_OPTIMIZATION = 'false';
process.env.NEXT_DISABLE_SOURCEMAPS = 'true';
process.env.NEXT_DISABLE_STATIC_IMAGES = 'true';
process.env.NEXT_DISABLE_IMAGE_OPTIMIZATION = 'true';
process.env.NEXT_DISABLE_CSS_OPTIMIZATION = 'true';
process.env.NEXT_DISABLE_JS_OPTIMIZATION = 'false';
process.env.NEXT_DISABLE_HTML_OPTIMIZATION = 'false';

// 重新安装依赖
console.log('📦 重新安装依赖...');
try {
  execSync('npm install --no-optional --no-shrinkwrap', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NPM_CONFIG_PRODUCTION: 'true'
    }
  });
  console.log('✅ 依赖安装完成');
} catch (error) {
  console.error('❌ 依赖安装失败:', error.message);
  process.exit(1);
}

// 构建项目
console.log('🏗️ 开始极激进构建...');
try {
  // 使用极激进的构建命令
  execSync('npm run build:cloudflare', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_CACHE: 'false',
      WEBPACK_CACHE: 'false',
      NEXT_SHARP_PATH: 'false',
      NEXT_IMAGE_DOMAIN: '',
      NEXT_DISABLE_OPTIMIZATION: 'false',
      NEXT_DISABLE_SOURCEMAPS: 'true',
      NEXT_DISABLE_STATIC_IMAGES: 'true',
      NEXT_DISABLE_IMAGE_OPTIMIZATION: 'true',
      NEXT_DISABLE_CSS_OPTIMIZATION: 'true',
      NEXT_DISABLE_JS_OPTIMIZATION: 'false',
      NEXT_DISABLE_HTML_OPTIMIZATION: 'false'
    }
  });
  console.log('✅ 项目构建完成');
} catch (error) {
  console.error('❌ 项目构建失败:', error.message);
  process.exit(1);
}

// 验证构建结果
console.log('🔍 验证构建结果...');
const nextDir = '.next';
if (fs.existsSync(nextDir)) {
  const files = fs.readdirSync(nextDir);
  console.log(`📊 构建文件数量: ${files.length}`);
  
  // 检查文件大小
  let totalSize = 0;
  let largeFiles = [];
  
  function checkDirectory(dirPath, prefix = '') {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        checkDirectory(fullPath, prefix + item + '/');
      } else {
        const sizeInMB = stat.size / (1024 * 1024);
        totalSize += sizeInMB;
        
        if (sizeInMB > 5) { // 大于5MB的文件
          largeFiles.push({
            path: prefix + item,
            size: sizeInMB.toFixed(2) + 'MB'
          });
        }
      }
    }
  }
  
  checkDirectory(nextDir);
  
  console.log(`📏 总构建大小: ${totalSize.toFixed(2)}MB`);
  
  if (largeFiles.length > 0) {
    console.log('⚠️ 发现大文件:');
    largeFiles.forEach(file => {
      console.log(`   ${file.path}: ${file.size}`);
    });
  }
  
  // 检查是否有CSS文件
  const cssFiles = files.filter(file => file.endsWith('.css'));
  console.log(`🎨 CSS文件数量: ${cssFiles.length}`);
  
  if (cssFiles.length === 0) {
    console.warn('⚠️ 警告: 没有找到CSS文件');
  }
  
  // 检查webpack缓存目录
  const cacheDir = path.join(nextDir, 'cache');
  if (fs.existsSync(cacheDir)) {
    const cacheFiles = fs.readdirSync(cacheDir);
    console.log(`🗂️ Webpack缓存文件数量: ${cacheFiles.length}`);
    
    // 检查缓存文件大小
    let cacheSize = 0;
    function checkCacheSize(dirPath) {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          checkCacheSize(fullPath);
        } else {
          cacheSize += stat.size / (1024 * 1024);
        }
      }
    }
    
    checkCacheSize(cacheDir);
    console.log(`🗂️ Webpack缓存大小: ${cacheSize.toFixed(2)}MB`);
    
    if (cacheSize > 10) {
      console.warn('⚠️ 警告: Webpack缓存过大，建议清理');
    }
  }
} else {
  console.error('❌ 构建目录不存在');
  process.exit(1);
}

console.log('🎉 极激进构建完成！');
console.log('');
console.log('📋 构建优化内容:');
console.log('1. ✅ 极激进清理所有缓存文件');
console.log('2. ✅ 设置极激进环境变量');
console.log('3. ✅ 禁用所有不必要的优化');
console.log('4. ✅ 极激进的代码分割策略');
console.log('5. ✅ 禁用source maps和图片优化');
console.log('');
console.log('🚀 建议的部署命令:');
console.log('npm run deploy:pages');
console.log('');
console.log('💡 如果仍然遇到25MB限制，请考虑:');
console.log('1. 进一步减少依赖包');
console.log('2. 使用动态导入减少初始包大小');
console.log('3. 考虑使用CDN加载大型库'); 