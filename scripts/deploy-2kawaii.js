const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始2kawaii.com部署...');

try {
  // 1. 验证环境变量
  console.log('🔍 验证环境变量...');
  const requiredEnvVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL',
    'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME',
    'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ 缺少必需的环境变量:', missingVars.join(', '));
    console.error('请在Cloudflare Pages控制台中设置这些环境变量');
    process.exit(1);
  }
  console.log('✅ 环境变量验证通过');

  // 2. 清理之前的构建
  console.log('🧹 清理之前的构建...');
  if (fs.existsSync('.next')) {
    if (process.platform === 'win32') {
      execSync('if exist .next rmdir /s /q .next', { stdio: 'inherit' });
    } else {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
  }
  console.log('✅ 清理完成');

  // 3. 执行最小化构建
  console.log('📦 执行最小化构建...');
  execSync('npm run build:pages:api:minimal', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('✅ 构建完成');

  // 4. 验证构建输出
  console.log('🔍 验证构建输出...');
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    console.error('❌ 构建输出目录不存在');
    process.exit(1);
  }

  // 检查关键文件
  const requiredFiles = [
    'server',
    'static',
    'server/app/page.js',
    'server/app/layout.js'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(nextDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ 缺少文件: ${file}`);
    }
  }

  // 5. 部署到Cloudflare Pages
  console.log('🚀 部署到Cloudflare Pages...');
  execSync('npm run deploy:2kawaii', { 
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log('🎉 2kawaii.com部署完成！');
  console.log('');
  console.log('📋 部署后检查清单:');
  console.log('1. 访问 https://2kawaii.com 确认网站正常加载');
  console.log('2. 测试图片上传功能是否正常');
  console.log('3. 检查API路由是否响应');
  console.log('4. 验证静态资源是否正确加载');
  console.log('');
  console.log('🔧 如果仍有404错误，请检查:');
  console.log('- Cloudflare Pages项目配置是否正确');
  console.log('- 域名DNS设置是否正确');
  console.log('- 环境变量是否完整设置');
  console.log('- 构建日志中是否有错误');

} catch (error) {
  console.error('❌ 部署失败:', error.message);
  process.exit(1);
} 