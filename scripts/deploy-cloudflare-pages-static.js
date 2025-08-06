const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 静态部署...');

try {
  // 第一步：构建静态文件
  console.log('📦 构建静态文件...');
  execSync('npm run build:pages:static', { stdio: 'inherit' });

  // 第二步：临时重命名 functions 目录（避免 wrangler 尝试处理它）
  const functionsPath = 'functions';
  const functionsBackupPath = 'functions_backup';
  
  if (fs.existsSync(functionsPath)) {
    console.log('📁 临时重命名 functions 目录...');
    if (fs.existsSync(functionsBackupPath)) {
      fs.rmSync(functionsBackupPath, { recursive: true, force: true });
    }
    fs.renameSync(functionsPath, functionsBackupPath);
  }

  try {
    // 第三步：部署到 Cloudflare Pages
    console.log('🚀 部署到 Cloudflare Pages...');
    execSync('wrangler pages deploy out --config wrangler.pages.toml', { stdio: 'inherit' });
    
    console.log('✅ 部署成功！');
  } finally {
    // 第四步：恢复 functions 目录
    if (fs.existsSync(functionsBackupPath)) {
      console.log('📁 恢复 functions 目录...');
      if (fs.existsSync(functionsPath)) {
        fs.rmSync(functionsPath, { recursive: true, force: true });
      }
      fs.renameSync(functionsBackupPath, functionsPath);
    }
  }

} catch (error) {
  console.error('❌ 部署失败：', error.message);
  
  // 确保恢复 functions 目录
  const functionsBackupPath = 'functions_backup';
  if (fs.existsSync(functionsBackupPath)) {
    console.log('📁 恢复 functions 目录...');
    if (fs.existsSync('functions')) {
      fs.rmSync('functions', { recursive: true, force: true });
    }
    fs.renameSync(functionsBackupPath, 'functions');
  }
  
  process.exit(1);
} 