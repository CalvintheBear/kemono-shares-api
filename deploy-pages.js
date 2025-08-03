#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Cloudflare Pages 部署脚本');
console.log('================================');

// 检查环境
console.log('🔍 检查环境...');
try {
  execSync('wrangler --version', { stdio: 'ignore' });
  console.log('✅ Wrangler CLI 已安装');
} catch (error) {
  console.error('❌ 未安装 Wrangler CLI');
  console.log('💡 请运行: npm install -g wrangler');
  process.exit(1);
}

// 检查配置文件
console.log('📋 检查配置文件...');
if (!fs.existsSync('wrangler.toml')) {
  console.error('❌ 未找到 wrangler.toml');
  process.exit(1);
}

// 检查环境变量
console.log('🔐 检查环境变量...');
const requiredEnvVars = [
  'KIE_AI_API_KEY',
  'KIE_AI_USER_ID',
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('⚠️  缺失环境变量:', missingVars.join(', '));
  console.log('💡 请设置环境变量后再部署');
}

// 部署函数
async function deploy(environment = 'production') {
  console.log(`\n🎯 开始部署到 ${environment} 环境...`);
  
  try {
    // 1. 清理和构建
    console.log('🧹 清理和构建...');
    execSync('npm run clean:build', { stdio: 'inherit', shell: true });
    execSync('npm run build:pages', { stdio: 'inherit', shell: true });
    
    // 2. 验证构建
    console.log('✅ 验证构建...');
    if (!fs.existsSync('.vercel/output/static')) {
      console.error('❌ 构建失败，输出目录不存在');
      process.exit(1);
    }
    
    // 3. 部署
    console.log('🚀 开始部署...');
    const projectName = environment === 'production' ? 'kemono-shares-api' : 'kemono-shares-api-dev';
    
    const deployCommand = `wrangler pages deploy .vercel/output/static --project-name=${projectName}`;
    
    if (environment === 'development') {
      execSync(`${deployCommand} --env=development`, { stdio: 'inherit', shell: true });
    } else {
      execSync(deployCommand, { stdio: 'inherit', shell: true });
    }
    
    console.log(`🎉 ${environment} 环境部署成功！`);
    
  } catch (error) {
    console.error(`❌ ${environment} 环境部署失败:`, error.message);
    process.exit(1);
  }
}

// 主程序
const args = process.argv.slice(2);
const env = args[0] || 'production';

if (['production', 'dev', 'development'].includes(env)) {
  deploy(env === 'dev' ? 'development' : env);
} else {
  console.log('使用方法:');
  console.log('  node deploy-pages.js           # 部署到生产环境');
  console.log('  node deploy-pages.js dev       # 部署到开发环境');
  console.log('  node deploy-pages.js development # 部署到开发环境');
}

// 退出处理
process.on('SIGINT', () => {
  console.log('\n👋 部署已取消');
  process.exit(0);
});