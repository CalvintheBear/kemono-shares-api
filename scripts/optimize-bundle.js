const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 开始分析包大小...');

// 分析 .next/static 目录中的文件
function analyzeBundle() {
  const staticDir = path.join(process.cwd(), '.next', 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.log('❌ .next/static 目录不存在，请先运行构建');
    return;
  }
  
  const files = fs.readdirSync(staticDir);
  const fileSizes = [];
  
  files.forEach(file => {
    const filePath = path.join(staticDir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // 如果是目录，递归分析
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach(subFile => {
        const subFilePath = path.join(filePath, subFile);
        const stats = fs.statSync(subFilePath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        fileSizes.push({
          name: `${file}/${subFile}`,
          size: stats.size,
          sizeInMB: parseFloat(sizeInMB)
        });
      });
    } else {
      // 如果是文件，直接分析
      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      fileSizes.push({
        name: file,
        size: stats.size,
        sizeInMB: parseFloat(sizeInMB)
      });
    }
  });
  
  // 按大小排序
  fileSizes.sort((a, b) => b.size - a.size);
  
  console.log('\n📊 文件大小分析:');
  fileSizes.forEach(file => {
    const status = file.sizeInMB > 25 ? '⚠️  ' : '✅ ';
    console.log(`${status}${file.name}: ${file.sizeInMB}MB`);
  });
  
  const totalSize = fileSizes.reduce((sum, file) => sum + file.size, 0);
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log(`\n📈 总大小: ${totalSizeInMB}MB`);
  
  if (totalSize > 25 * 1024 * 1024) {
    console.log('\n⚠️  警告: 总大小超过 25MB 限制！');
    console.log('💡 建议的优化措施:');
    console.log('1. 检查是否有不必要的依赖');
    console.log('2. 使用动态导入减少初始包大小');
    console.log('3. 优化图片和静态资源');
    console.log('4. 考虑使用 CDN 加载大型库');
  }
  
  return fileSizes;
}

// 检查依赖项大小
function analyzeDependencies() {
  console.log('\n📦 分析依赖项...');
  
  try {
    const result = execSync('npx webpack-bundle-analyzer .next/static/chunks/*.js --mode static --report', { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    console.log('✅ 依赖项分析完成');
  } catch (error) {
    console.log('ℹ️  需要安装 webpack-bundle-analyzer 进行详细分析');
    console.log('运行: npm install --save-dev webpack-bundle-analyzer');
  }
}

// 优化建议
function provideOptimizationSuggestions() {
  console.log('\n💡 优化建议:');
  console.log('1. 检查 package.json 中的依赖项');
  console.log('2. 使用动态导入 (import()) 进行代码分割');
  console.log('3. 移除未使用的依赖项');
  console.log('4. 考虑使用更轻量的替代库');
  console.log('5. 优化图片和静态资源');
  console.log('6. 使用 Tree Shaking 移除未使用的代码');
}

// 主函数
function main() {
  console.log('🚀 开始包优化分析...\n');
  
  const fileSizes = analyzeBundle();
  analyzeDependencies();
  provideOptimizationSuggestions();
  
  if (fileSizes && fileSizes.some(f => f.sizeInMB > 25)) {
    console.log('\n❌ 发现超过 25MB 的文件，需要进一步优化');
    process.exit(1);
  } else {
    console.log('\n✅ 所有文件都在 25MB 限制内');
  }
}

main(); 