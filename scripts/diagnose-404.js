const fs = require('fs');
const path = require('path');

console.log('🔍 2kawaii.com 404问题诊断...');
console.log('');

// 1. 检查构建输出
console.log('📁 检查构建输出...');
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('✅ .next目录存在');
  
  // 检查关键目录
  const keyDirs = ['server', 'static', 'cache'];
  keyDirs.forEach(dir => {
    const dirPath = path.join(nextDir, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`✅ ${dir}目录存在`);
    } else {
      console.log(`❌ ${dir}目录不存在`);
    }
  });

  // 检查关键文件
  const keyFiles = [
    'server/app/page.js',
    'server/app/layout.js',
    'server/app/api/upload-image/route.js'
  ];
  
  keyFiles.forEach(file => {
    const filePath = path.join(nextDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ ${file}存在 (${(stats.size / 1024).toFixed(2)}KB)`);
    } else {
      console.log(`❌ ${file}不存在`);
    }
  });
} else {
  console.log('❌ .next目录不存在 - 需要先构建项目');
}

console.log('');

// 2. 检查配置文件
console.log('⚙️ 检查配置文件...');
const configFiles = [
  'wrangler.pages.2kawaii.toml',
  'wrangler.pages.api.toml',
  '_redirects',
  'next.config.ts'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}存在`);
  } else {
    console.log(`❌ ${file}不存在`);
  }
});

console.log('');

// 3. 检查环境变量
console.log('🔧 检查环境变量...');
const requiredEnvVars = [
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME',
  'CLOUDFLARE_R2_PUBLIC_URL',
  'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME',
  'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL'
];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}已设置`);
  } else {
    console.log(`❌ ${varName}未设置`);
  }
});

console.log('');

// 4. 检查package.json脚本
console.log('📦 检查package.json脚本...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = [
  'build:pages:api:minimal',
  'deploy:2kawaii',
  'deploy:2kawaii:full'
];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}脚本存在`);
  } else {
    console.log(`❌ ${script}脚本不存在`);
  }
});

console.log('');

// 5. 提供解决方案
console.log('💡 404问题解决方案:');
console.log('');
console.log('1. 确保Cloudflare Pages项目配置:');
console.log('   - 构建命令: npm run build:pages:api:minimal');
console.log('   - 输出目录: .next');
console.log('   - Node.js版本: 20');
console.log('');
console.log('2. 检查环境变量设置:');
console.log('   - 在Cloudflare Pages控制台中设置所有必需的环境变量');
console.log('   - 确保CLOUDFLARE_R2_*变量都已正确配置');
console.log('');
console.log('3. 重新部署:');
console.log('   - 运行: npm run deploy:2kawaii:full');
console.log('   - 这会执行完整的构建和部署流程');
console.log('');
console.log('4. 检查DNS设置:');
console.log('   - 确保2kawaii.com的DNS指向Cloudflare Pages');
console.log('   - 检查是否有重定向规则冲突');
console.log('');
console.log('5. 检查构建日志:');
console.log('   - 在Cloudflare Pages控制台中查看构建日志');
console.log('   - 确认没有构建错误');
console.log('');
console.log('🔗 有用的链接:');
console.log('- Cloudflare Pages控制台: https://dash.cloudflare.com/pages');
console.log('- 2kawaii.com: https://2kawaii.com');
console.log('- 构建日志: 在Cloudflare Pages控制台中查看'); 