const fs = require('fs');
const path = require('path');

console.log('🔍 验证 Cloudflare Pages 构建输出...');

try {
  // 检查 .vercel/output 目录
  const vercelOutputPath = '.vercel/output';
  if (!fs.existsSync(vercelOutputPath)) {
    throw new Error('❌ .vercel/output 目录不存在');
  }
  console.log('✅ .vercel/output 目录存在');

  // 检查 static 目录
  const staticPath = path.join(vercelOutputPath, 'static');
  if (!fs.existsSync(staticPath)) {
    throw new Error('❌ .vercel/output/static 目录不存在');
  }
  console.log('✅ .vercel/output/static 目录存在');

  // 检查 functions 目录
  const functionsPath = path.join(vercelOutputPath, 'functions');
  if (!fs.existsSync(functionsPath)) {
    throw new Error('❌ .vercel/output/functions 目录不存在');
  }
  console.log('✅ .vercel/output/functions 目录存在');

  // 检查 config.json
  const configPath = path.join(vercelOutputPath, 'config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('❌ .vercel/output/config.json 文件不存在');
  }
  console.log('✅ .vercel/output/config.json 文件存在');

  // 读取并验证 config.json
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('📋 config.json 内容:');
  console.log(JSON.stringify(config, null, 2));

  // 列出 static 目录内容
  console.log('📁 .vercel/output/static 目录内容:');
  const staticFiles = fs.readdirSync(staticPath);
  staticFiles.forEach(file => {
    const filePath = path.join(staticPath, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });

  // 列出 functions 目录内容
  console.log('📁 .vercel/output/functions 目录内容:');
  const functionFiles = fs.readdirSync(functionsPath);
  functionFiles.forEach(file => {
    const filePath = path.join(functionsPath, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });

  console.log('✅ Cloudflare Pages 构建输出验证完成');

} catch (error) {
  console.error('❌ 验证失败:', error.message);
  process.exit(1);
}
