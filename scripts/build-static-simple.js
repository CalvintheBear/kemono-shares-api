const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  
  // 清理out目录
  try {
    if (fs.existsSync('out')) {
      fs.rmSync('out', { recursive: true, force: true });
    }
  } catch (error) {
    console.warn('⚠️  无法删除 out 目录，继续...');
  }

  // 运行 Next.js 构建
  console.log('🔨 运行 Next.js 静态构建...');
  execSync('npx next build', { stdio: 'inherit' });

  // 验证输出目录
  if (!fs.existsSync('out')) {
    throw new Error('❌ 构建失败：out 目录未生成');
  }

  // 复制public文件到out目录
  console.log('📁 复制public文件到out目录...');
  if (fs.existsSync('public')) {
    execSync('cp -r public/* out/', { stdio: 'inherit' });
  }

  // 创建必要的配置文件
  console.log('📝 创建Cloudflare Pages配置文件...');
  
  // 创建 _redirects 文件
  const redirectsPath = path.join('out', '_redirects');
  const redirectsContent = `# 分享详情页动态路由 - 重定向到静态页面
/share/* /share.html?id=:splat 200

# 其他页面
/* /index.html 200`;
  fs.writeFileSync(redirectsPath, redirectsContent);

  // 创建 _headers 文件
  const headersPath = path.join('out', '_headers');
  const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/api/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization`;
  fs.writeFileSync(headersPath, headersContent);

  console.log('✅ 构建完成！');
  console.log('📁 输出目录：out/');
  console.log('📊 目录内容：');
  
  // 列出out目录内容
  if (fs.existsSync('out')) {
    const files = fs.readdirSync('out');
    files.forEach(file => {
      const filePath = path.join('out', file);
      const stats = fs.statSync(filePath);
      console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
    });
  }

} catch (error) {
  console.error('❌ 构建失败：', error.message);
  process.exit(1);
} 