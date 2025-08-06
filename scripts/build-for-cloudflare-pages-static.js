const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建 Cloudflare Pages 静态版本...');

// 设置环境变量
process.env.STATIC_EXPORT = 'true';
process.env.CF_PAGES = 'true';
process.env.NODE_ENV = 'production';

try {
  // 清理之前的构建
  console.log('🧹 清理之前的构建文件...');
  try {
    if (fs.existsSync('.next')) {
      fs.rmSync('.next', { recursive: true, force: true });
    }
  } catch (error) {
    console.warn('⚠️  无法删除 .next 目录，继续...');
  }
  
  try {
    if (fs.existsSync('out')) {
      fs.rmSync('out', { recursive: true, force: true });
    }
  } catch (error) {
    console.warn('⚠️  无法删除 out 目录，尝试使用 PowerShell 命令...');
    try {
      execSync('Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue', { shell: 'powershell' });
    } catch (psError) {
      console.warn('⚠️  PowerShell 也无法删除，继续构建...');
    }
  }

  // 安装依赖
  console.log('📦 安装依赖...');
  execSync('npm install', { stdio: 'inherit' });

  // 构建静态文件
  console.log('🔨 构建静态文件...');
  execSync('node scripts/build-static-simple.js', { stdio: 'inherit' });
  
  // 复制静态文件到 out 目录
  console.log('📁 复制静态文件...');
  execSync('node scripts/copy-static-files.js', { stdio: 'inherit' });

  // 验证输出目录
  if (!fs.existsSync('out')) {
    throw new Error('❌ 构建失败：out 目录未生成');
  }

  // 检查关键文件
  const requiredFiles = [
    'out/index.html',
    'out/_next/static',
    'out/static'
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.warn(`⚠️  警告：${file} 不存在`);
    }
  }

  // 创建 _redirects 文件（如果需要）
  const redirectsPath = path.join('out', '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    console.log('📝 创建 _redirects 文件...');
    fs.writeFileSync(redirectsPath, '/* /index.html 200');
  }

  // 创建 _headers 文件（如果需要）
  const headersPath = path.join('out', '_headers');
  if (!fs.existsSync(headersPath)) {
    console.log('📝 创建 _headers 文件...');
    fs.writeFileSync(headersPath, `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
`);
  }

  console.log('✅ 构建完成！');
  console.log('📁 输出目录：out/');
  console.log('🚀 可以运行以下命令部署：');
  console.log('   npm run deploy:pages');

} catch (error) {
  console.error('❌ 构建失败：', error.message);
  process.exit(1);
} 