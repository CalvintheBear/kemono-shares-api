#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 验证 Cloudflare Pages 部署准备情况...\n');

// 检查并显示大文件
function findLargeFiles(dir, maxSizeMB = 25) {
  const largeFiles = [];
  
  function scanDirectory(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item.name);
      
      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.isFile()) {
        const sizeInMB = fs.statSync(fullPath).size / (1024 * 1024);
        if (sizeInMB > maxSizeMB) {
          largeFiles.push({
            path: fullPath,
            size: sizeInMB.toFixed(2) + ' MB'
          });
        }
      }
    });
  }
  
  scanDirectory(dir);
  return largeFiles;
}

// 检查构建输出目录
const buildDirs = ['.vercel/output/static', '.next', 'cache'];

buildDirs.forEach(dir => {
  console.log(`📁 检查目录: ${dir}`);
  if (fs.existsSync(dir)) {
    const largeFiles = findLargeFiles(dir);
    if (largeFiles.length > 0) {
      console.log(`⚠️  发现大文件 (${largeFiles.length}个):`);
      largeFiles.forEach(file => {
        console.log(`   - ${file.path} (${file.size})`);
      });
    } else {
      console.log('✅ 无大文件');
    }
  } else {
    console.log('ℹ️  目录不存在');
  }
  console.log('');
});

// 检查 .cfignore 是否包含关键排除项
console.log('🔍 检查 .cfignore 配置...');
const cfignorePath = '.cfignore';
if (fs.existsSync(cfignorePath)) {
  const content = fs.readFileSync(cfignorePath, 'utf8');
  const requiredExclusions = [
    '.next/cache',
    '**/*.pack',
    'cache/',
    'node_modules/'
  ];
  
  const missing = requiredExclusions.filter(exclusion => 
    !content.includes(exclusion)
  );
  
  if (missing.length === 0) {
    console.log('✅ .cfignore 包含所有必要排除项');
  } else {
    console.log('⚠️  .cfignore 缺少以下排除项:');
    missing.forEach(item => console.log(`   - ${item}`));
  }
} else {
  console.log('❌ .cfignore 文件不存在');
}

console.log('\n🎯 部署建议:');
console.log('1. 运行: npm run clean:build');
console.log('2. 运行: npm run build:pages');
console.log('3. 验证输出目录大小在25MB限制内');
console.log('4. 部署: npm run deploy:pages');