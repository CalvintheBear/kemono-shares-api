const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始Cloudflare Pages构建...');

try {
  // 设置环境变量
  process.env.CF_PAGES = 'true';
  process.env.STATIC_EXPORT = 'true';
  process.env.NODE_ENV = 'production';

  console.log('📦 构建Next.js应用...');
  
  // 执行Next.js构建
  execSync('next build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log('✅ Next.js构建完成');

  // 检查输出目录
  const outDir = path.join(process.cwd(), 'out');
  if (fs.existsSync(outDir)) {
    console.log('📁 静态文件已生成到:', outDir);
    
    // 列出输出目录内容
    const files = fs.readdirSync(outDir);
    console.log('📋 输出文件列表:', files.slice(0, 10)); // 只显示前10个文件
    
    if (files.length > 10) {
      console.log(`... 还有 ${files.length - 10} 个文件`);
    }
  } else {
    console.error('❌ 输出目录不存在:', outDir);
    process.exit(1);
  }

  console.log('🎉 Cloudflare Pages构建完成！');
  console.log('📤 可以部署到Cloudflare Pages了');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
} 