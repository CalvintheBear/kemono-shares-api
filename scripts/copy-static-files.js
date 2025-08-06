const fs = require('fs');
const path = require('path');

console.log('📁 开始复制静态文件...');

try {
  const sourceDir = '.next/server/app';
  const targetDir = 'out';
  
  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 复制 HTML 文件
  function copyFiles(source, target) {
    if (!fs.existsSync(source)) {
      console.warn(`⚠️  源目录不存在: ${source}`);
      return;
    }
    
    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);
      
      try {
        const stat = fs.statSync(sourcePath);
        
        if (stat.isDirectory()) {
          // 创建目录
          if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
          }
          copyFiles(sourcePath, targetPath);
        } else {
          // 复制文件
          // 跳过一些不需要的文件
          if (item.endsWith('.nft.json') || 
              item.endsWith('_reference-manifest.js') ||
              item.endsWith('.meta') ||
              item.endsWith('.rsc') ||
              item.endsWith('.body')) {
            continue;
          }
          
          // 确保目标目录存在
          const targetDir = path.dirname(targetPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✅ 复制: ${item}`);
        }
      } catch (error) {
        console.warn(`⚠️  跳过文件 ${item}: ${error.message}`);
        continue;
      }
    }
  }
  
  // 复制静态文件
  copyFiles(sourceDir, targetDir);
  
  // 复制 _next/static 目录
  const staticSource = '.next/static';
  const staticTarget = 'out/_next/static';
  
  if (fs.existsSync(staticSource)) {
    if (!fs.existsSync(staticTarget)) {
      fs.mkdirSync(staticTarget, { recursive: true });
    }
    copyFiles(staticSource, staticTarget);
  }
  
  // 复制 public 目录中的静态文件
  const publicSource = 'public';
  if (fs.existsSync(publicSource)) {
    copyFiles(publicSource, targetDir);
  }
  
  // 创建 _redirects 文件
  const redirectsPath = path.join(targetDir, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    fs.writeFileSync(redirectsPath, '/* /index.html 200');
    console.log('✅ 创建 _redirects 文件');
  }
  
  // 创建 _headers 文件
  const headersPath = path.join(targetDir, '_headers');
  if (!fs.existsSync(headersPath)) {
    fs.writeFileSync(headersPath, `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
`);
    console.log('✅ 创建 _headers 文件');
  }
  
  console.log('✅ 静态文件复制完成！');
  console.log(`📁 输出目录: ${targetDir}/`);
  
} catch (error) {
  console.error('❌ 复制失败:', error.message);
  process.exit(1);
} 