const fs = require('fs');
const path = require('path');

console.log('🧹 清理Cloudflare Pages部署缓存...');

// 需要清理的目录和文件模式
const cleanupPaths = [
  '.next',
  'out', 
  'cache',
  '.next/cache',
  'node_modules/.cache',
  '.cache',
  'tmp',
  'temp'
];

const cleanupPatterns = [
  '*.pack',
  '**/*.pack',
  '**/cache/webpack/**',
];

// 清理指定目录
function cleanDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      console.log(`📁 删除目录: ${dirPath}`);
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ 已删除: ${dirPath}`);
    }
  } catch (error) {
    console.warn(`⚠️  无法删除 ${dirPath}:`, error.message);
  }
}

// 递归查找并删除.pack文件
function findAndDeletePackFiles(dir) {
  try {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findAndDeletePackFiles(filePath);
      } else if (file.endsWith('.pack')) {
        const sizeInMB = stat.size / (1024 * 1024);
        if (sizeInMB > 10) { // 删除超过10MB的.pack文件
          console.log(`🗑️  删除大文件: ${filePath} (${sizeInMB.toFixed(2)}MB)`);
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  扫描目录 ${dir} 时出错:`, error.message);
  }
}

// 执行清理
try {
  // 清理指定目录
  cleanupPaths.forEach(cleanDirectory);
  
  // 查找并删除.pack文件
  console.log('🔍 查找并删除大的.pack文件...');
  findAndDeletePackFiles('./');
  
  console.log('✅ 缓存清理完成！');
  console.log('🚀 现在可以安全地构建和部署到Cloudflare Pages');
  
} catch (error) {
  console.error('❌ 清理过程中出错:', error.message);
  process.exit(1);
}
