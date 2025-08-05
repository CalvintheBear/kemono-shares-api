const fs = require('fs');
const path = require('path');

// 创建out目录
const outDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 清空out目录
const clearDir = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        clearDir(filePath);
        fs.rmdirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
};

clearDir(outDir);

// 复制静态导出的文件
const exportDir = path.join(__dirname, '..', '.next', 'export');
if (fs.existsSync(exportDir)) {
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
  
  copyDir(exportDir, outDir);
  console.log('静态导出文件已复制到out目录');
} else {
  // 如果没有export目录，复制server目录中的HTML文件
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
    console.log('HTML文件已复制到out目录');
  }
  
  // 复制其他静态文件
  const copyStaticFiles = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      if (fs.statSync(srcPath).isDirectory()) {
        copyStaticFiles(srcPath, destPath);
      } else if (file.endsWith('.txt') || file.endsWith('.xml') || file.endsWith('.ico')) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  
  copyStaticFiles(serverDir, outDir);
  console.log('静态文件已复制到out目录');
}

// 复制静态文件
const staticDir = path.join(__dirname, '..', '.next', 'static');
const outStaticDir = path.join(outDir, '_next', 'static');

if (fs.existsSync(staticDir)) {
  if (!fs.existsSync(path.dirname(outStaticDir))) {
    fs.mkdirSync(path.dirname(outStaticDir), { recursive: true });
  }
  
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
  console.log('静态文件已复制到out目录');
}

console.log('Pages输出文件已复制到out目录'); 