const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始部署到 Cloudflare Pages...');

try {
  // 检查out目录是否存在
  if (!fs.existsSync('out')) {
    console.log('📁 out目录不存在，先构建项目...');
    execSync('npm run build:pages:static', { stdio: 'inherit' });
  }

  // 验证构建输出
  console.log('🧪 验证构建输出...');
  execSync('npm run test:build', { stdio: 'inherit' });

  // 检查wrangler配置
  console.log('🔧 检查wrangler配置...');
  if (!fs.existsSync('wrangler.toml')) {
    throw new Error('❌ wrangler.toml 文件不存在');
  }

  // 部署到Cloudflare Pages
  console.log('🚀 部署到Cloudflare Pages...');
  // 强制指定 functions 目录，确保 Pages Functions 一起部署
  execSync('wrangler pages deploy out --project-name=kemono-shares-api --branch=production --functions=functions', { stdio: 'inherit' });

  console.log('✅ 部署完成！');
  console.log('🌐 网站地址: https://2kawaii.com');
  console.log('📊 管理面板: https://dash.cloudflare.com/pages');

} catch (error) {
  console.error('❌ 部署失败:', error.message);
  process.exit(1);
} 