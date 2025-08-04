const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复生产环境错误...');

// 清理函数
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🧹 清理目录: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// 清理缓存和构建文件
console.log('📁 清理缓存和构建文件...');
cleanDirectory('.next');
cleanDirectory('.vercel');
cleanDirectory('cache');
cleanDirectory('node_modules/.cache');

// 清理package-lock.json（如果存在）
if (fs.existsSync('package-lock.json')) {
  console.log('📦 清理 package-lock.json');
  fs.unlinkSync('package-lock.json');
}

// 重新安装依赖
console.log('📦 重新安装依赖...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ 依赖安装完成');
} catch (error) {
  console.error('❌ 依赖安装失败:', error.message);
  process.exit(1);
}

// 构建项目
console.log('🏗️ 构建项目...');
try {
  // 使用优化的构建命令
  execSync('npm run build:cloudflare', { stdio: 'inherit' });
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
  
  // 检查是否有CSS文件
  const cssFiles = files.filter(file => file.endsWith('.css'));
  console.log(`🎨 CSS文件数量: ${cssFiles.length}`);
  
  if (cssFiles.length === 0) {
    console.warn('⚠️ 警告: 没有找到CSS文件');
  }
} else {
  console.error('❌ 构建目录不存在');
  process.exit(1);
}

console.log('🎉 修复完成！请重新部署项目。');
console.log('');
console.log('📋 修复内容:');
console.log('1. ✅ 修复了客户端环境变量访问问题');
console.log('2. ✅ 优化了webpack配置，避免CSS文件损坏');
console.log('3. ✅ 调整了代码分割策略，提高稳定性');
console.log('4. ✅ 启用了合理的压缩和缓存配置');
console.log('');
console.log('🚀 建议的部署命令:');
console.log('npm run deploy:pages'); 