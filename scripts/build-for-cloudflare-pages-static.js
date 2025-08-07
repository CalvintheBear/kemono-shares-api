const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建 Cloudflare Pages 静态版本...');

// 设置环境变量
process.env.STATIC_EXPORT = 'true';
process.env.CF_PAGES = 'true';
process.env.NODE_ENV = 'production';

try {
  // 首先运行专门的Cloudflare缓存清理
  console.log('🧹 运行Cloudflare Pages缓存清理...');
  try {
    execSync('node scripts/clean-cloudflare-cache.js', { stdio: 'inherit' });
  } catch (cleanError) {
    console.warn('⚠️  缓存清理警告:', cleanError.message);
  }
  
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
  execSync('npx next build', { stdio: 'inherit' });
  
  // 验证输出目录
  if (!fs.existsSync('out')) {
    throw new Error('❌ 构建失败：out 目录未生成');
  }

  // 复制public文件到out目录
  console.log('📁 复制public文件到out目录...');
  if (fs.existsSync('public')) {
    try {
      execSync('cp -r public/* out/', { stdio: 'inherit' });
    } catch (copyError) {
      console.warn('⚠️  复制public文件失败，尝试使用PowerShell...');
      try {
        execSync('Copy-Item -Path "public\\*" -Destination "out\\" -Recurse -Force', { shell: 'powershell' });
      } catch (psCopyError) {
        console.warn('⚠️  PowerShell复制也失败，继续...');
      }
    }
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

  // 创建 _routes.json 文件（确保 /api/* 会进入 Pages Functions）
  const routesPath = path.join('out', '_routes.json');
  const routesContent = {
    version: 1,
    // 仅在 /api/* 路由上触发 Pages Functions，其他保持静态
    include: ["/api/*"],
    exclude: [
      "/_next/static/*",
      "/static/*"
    ]
  };
  fs.writeFileSync(routesPath, JSON.stringify(routesContent, null, 2));

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

  console.log('🚀 可以运行以下命令部署：');
  console.log('   npm run deploy:pages:static');

} catch (error) {
  console.error('❌ 构建失败：', error.message);
  process.exit(1);
} 