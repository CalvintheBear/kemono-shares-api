const fs = require('fs');
const path = require('path');

// 创建out目录
const outDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 复制静态文件
const staticDir = path.join(__dirname, '..', '.next', 'static');
const outStaticDir = path.join(outDir, '_next', 'static');

if (fs.existsSync(staticDir)) {
  if (!fs.existsSync(path.dirname(outStaticDir))) {
    fs.mkdirSync(path.dirname(outStaticDir), { recursive: true });
  }
  
  // 复制静态文件
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      if (fs.statSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  
  copyDir(staticDir, outStaticDir);
}

// 复制HTML文件（如果存在）
const serverDir = path.join(__dirname, '..', '.next', 'server');
if (fs.existsSync(serverDir)) {
  const copyHtmlFiles = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      if (fs.statSync(srcPath).isDirectory()) {
        copyHtmlFiles(srcPath, destPath);
      } else if (file.endsWith('.html')) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  
  copyHtmlFiles(serverDir, outDir);
}

console.log('Pages输出文件已复制到out目录'); 