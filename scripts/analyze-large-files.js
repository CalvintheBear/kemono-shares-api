const fs = require('fs');
const path = require('path');

console.log('🔍 分析大文件...');

function analyzeLargeFiles() {
  const nextDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(nextDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.log('❌ .next/static 目录不存在，请先运行构建');
    return;
  }
  
  const largeFiles = [];
  const allFiles = [];
  
  function scanDirectory(dirPath, prefix = '') {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        scanDirectory(itemPath, `${prefix}${item}/`);
      } else {
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        const fileInfo = {
          path: `${prefix}${item}`,
          size: stats.size,
          sizeInMB: parseFloat(sizeInMB),
          fullPath: itemPath
        };
        
        allFiles.push(fileInfo);
        
        if (stats.size > 25 * 1024 * 1024) { // 25MB
          largeFiles.push(fileInfo);
        }
      }
    });
  }
  
  scanDirectory(staticDir);
  
  // 按大小排序
  allFiles.sort((a, b) => b.size - a.size);
  largeFiles.sort((a, b) => b.size - a.size);
  
  console.log('\n📊 文件大小分析:');
  console.log('='.repeat(60));
  
  // 显示前 20 个最大的文件
  console.log('\n🔝 前 20 个最大的文件:');
  allFiles.slice(0, 20).forEach((file, index) => {
    const status = file.sizeInMB > 25 ? '⚠️  ' : '✅ ';
    console.log(`${index + 1}. ${status}${file.path}: ${file.sizeInMB}MB`);
  });
  
  if (largeFiles.length > 0) {
    console.log('\n❌ 超过 25MB 的文件:');
    console.log('='.repeat(60));
    largeFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file.path}: ${file.sizeInMB}MB`);
    });
  }
  
  const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log('\n📈 统计信息:');
  console.log(`总文件数: ${allFiles.length}`);
  console.log(`总大小: ${totalSizeInMB}MB`);
  console.log(`超过 25MB 的文件数: ${largeFiles.length}`);
  
  if (largeFiles.length > 0) {
    console.log('\n💡 优化建议:');
    console.log('1. 检查是否有不必要的依赖项');
    console.log('2. 使用动态导入分割代码');
    console.log('3. 考虑使用 CDN 加载大型库');
    console.log('4. 移除未使用的代码');
    console.log('5. 优化图片和静态资源');
    console.log('6. 考虑使用 Railway 部署（无文件大小限制）');
    
    console.log('\n🔧 具体优化措施:');
    largeFiles.forEach(file => {
      if (file.path.includes('node_modules')) {
        console.log(`- 检查依赖项: ${file.path}`);
      } else if (file.path.includes('chunks')) {
        console.log(`- 优化代码分割: ${file.path}`);
      } else if (file.path.includes('images')) {
        console.log(`- 优化图片资源: ${file.path}`);
      } else {
        console.log(`- 检查文件: ${file.path}`);
      }
    });
  } else {
    console.log('\n✅ 所有文件都在 25MB 限制内！');
  }
  
  return { allFiles, largeFiles, totalSize };
}

// 分析依赖项
function analyzeDependencies() {
  console.log('\n📦 分析依赖项...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    console.log('\n主要依赖项:');
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    Object.entries(dependencies).forEach(([name, version]) => {
      console.log(`- ${name}: ${version}`);
    });
    
    console.log('\n💡 依赖项优化建议:');
    console.log('1. 检查是否有重复功能的库');
    console.log('2. 考虑使用更轻量的替代品');
    console.log('3. 移除未使用的依赖项');
    console.log('4. 使用 tree-shaking 移除未使用的代码');
  }
}

// 主函数
function main() {
  console.log('🚀 开始大文件分析...\n');
  
  const result = analyzeLargeFiles();
  analyzeDependencies();
  
  if (result.largeFiles.length > 0) {
    console.log('\n❌ 发现超过 25MB 的文件，需要进一步优化');
    process.exit(1);
  } else {
    console.log('\n✅ 所有文件都在 25MB 限制内');
  }
}

main(); 