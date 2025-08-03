const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 开始彻底清理缓存文件...');

// 需要清理的目录和文件
const cleanTargets = [
  '.next',
  'cache',
  'dist',
  '.vercel',
  'node_modules/.cache',
  'cache/webpack',
  '.next/cache',
  '.next/static',
  'build',
  'out'
];

// 需要清理的文件模式
const filePatterns = [
  '*.pack',
  '*.cache',
  '*.map'
];

console.log('📁 清理目录...');
cleanTargets.forEach(target => {
  if (fs.existsSync(target)) {
    try {
      if (process.platform === 'win32') {
        execSync(`if exist ${target} rmdir /s /q ${target}`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf ${target}`, { stdio: 'inherit' });
      }
      console.log(`✅ 已清理: ${target}`);
    } catch (error) {
      console.log(`⚠️  清理失败: ${target} - ${error.message}`);
    }
  }
});

console.log('📄 清理文件...');
filePatterns.forEach(pattern => {
  try {
    if (process.platform === 'win32') {
      execSync(`del /s /q ${pattern}`, { stdio: 'inherit' });
    } else {
      execSync(`find . -name "${pattern}" -delete`, { stdio: 'inherit' });
    }
    console.log(`✅ 已清理文件模式: ${pattern}`);
  } catch (error) {
    console.log(`⚠️  清理文件失败: ${pattern} - ${error.message}`);
  }
});

// 检查是否还有大文件
console.log('🔍 检查剩余的大文件...');
try {
  const checkForLargeFiles = (dir) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { recursive: true });
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile()) {
          const sizeInMB = fs.statSync(filePath).size / (1024 * 1024);
          if (sizeInMB > 25) {
            console.log(`⚠️  发现大文件: ${filePath} (${sizeInMB.toFixed(2)} MB)`);
          }
        }
      });
    }
  };
  
  checkForLargeFiles('.');
  checkForLargeFiles('.next');
  checkForLargeFiles('cache');
} catch (error) {
  console.log('检查大文件时出错:', error.message);
}

console.log('✅ 缓存清理完成！'); 