const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始Cloudflare Pages静态构建...');

try {
  // 设置环境变量 - 静态导出
  process.env.STATIC_EXPORT = 'true';
  process.env.CF_PAGES = 'true';
  process.env.NODE_ENV = 'production';

  console.log('📦 构建Next.js静态应用...');
  
  // 跳过清理步骤，直接构建
  console.log('📦 开始构建...');
  
  // 执行Next.js静态构建
  execSync('next build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log('✅ Next.js静态构建完成');

  // 检查out目录
  const outDir = path.join(process.cwd(), 'out');
  if (fs.existsSync(outDir)) {
    console.log('📁 静态文件已生成到:', outDir);
    
    // 检查关键文件
    const keyFiles = ['index.html', 'workspace/index.html', 'share/index.html'];
    keyFiles.forEach(file => {
      const filePath = path.join(outDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}存在`);
      } else {
        console.log(`❌ ${file}不存在`);
      }
    });
  } else {
    console.error('❌ 静态构建目录不存在:', outDir);
    process.exit(1);
  }

  // 检查functions目录
  const functionsDir = path.join(process.cwd(), 'functions');
  if (fs.existsSync(functionsDir)) {
    console.log('📁 Functions目录存在:', functionsDir);
    
    // 列出所有functions文件
    const functionFiles = fs.readdirSync(functionsDir, { recursive: true });
    console.log('📋 Functions文件列表:', functionFiles);
  } else {
    console.warn('⚠️ Functions目录不存在，将创建...');
    fs.mkdirSync(functionsDir, { recursive: true });
  }

  console.log('🎉 Cloudflare Pages静态构建完成！');
  console.log('');
  console.log('📋 部署说明:');
  console.log('1. 静态文件在 out/ 目录');
  console.log('2. Functions在 functions/ 目录');
  console.log('3. 使用 npm run deploy:2kawaii:static 部署');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
} 