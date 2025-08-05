const fs = require('fs');
const path = require('path');

console.log('🚀 开始将页面从[locale]目录移动到根目录...');

// 源目录和目标目录
const sourceDir = 'src/app/[locale]';
const targetDir = 'src/app';

// 需要移动的页面目录
const pagesToMove = [
  'page.tsx',
  'workspace',
  'share',
  'faq',
  'privacy',
  'terms',
  'ai-image-conversion-free',
  'ai-image-generation-guide',
  'anime-icon-creation',
  'chibi-character-maker',
  'line-sticker-creation',
  'personification-ai'
];

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 复制文件: ${srcPath} -> ${destPath}`);
    }
  }
}

// 移动页面
pagesToMove.forEach(page => {
  const srcPath = path.join(sourceDir, page);
  const destPath = path.join(targetDir, page);
  
  if (fs.existsSync(srcPath)) {
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
      console.log(`📁 复制目录: ${srcPath} -> ${destPath}`);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 复制文件: ${srcPath} -> ${destPath}`);
    }
  } else {
    console.log(`⚠️ 文件不存在: ${srcPath}`);
  }
});

console.log('✅ 页面移动完成！');
console.log('📝 接下来需要删除[locale]目录并更新文件内容'); 