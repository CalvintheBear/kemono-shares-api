const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 开始简化静态构建...');

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
  
  // 跳过 out 目录删除，直接构建
  console.log('📝 跳过 out 目录删除，直接构建...');

  // 直接运行 Next.js 构建
  console.log('🔨 运行 Next.js 静态构建...');
  execSync('npx next build', { stdio: 'inherit' });

  // 验证输出目录
  if (!fs.existsSync('out')) {
    throw new Error('❌ 构建失败：out 目录未生成');
  }

  console.log('✅ 构建完成！');
  console.log('📁 输出目录：out/');

} catch (error) {
  console.error('❌ 构建失败：', error.message);
  process.exit(1);
} 