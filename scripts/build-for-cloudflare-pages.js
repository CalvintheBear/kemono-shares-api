const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始Cloudflare Pages API构建...');

try {
  // 设置环境变量 - 支持API路由
  process.env.CF_PAGES = 'true';
  process.env.STATIC_EXPORT = 'false'; // 禁用静态导出以支持API
  process.env.NODE_ENV = 'production';

  console.log('📦 构建Next.js应用（支持API路由）...');
  
  // 执行Next.js构建
  execSync('next build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log('✅ Next.js构建完成');

  // 检查.next目录
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('📁 Next.js构建文件已生成到:', nextDir);
    
    // 检查API路由
    const apiDir = path.join(nextDir, 'server', 'app', 'api');
    if (fs.existsSync(apiDir)) {
      console.log('✅ API路由已生成');
      const apiFiles = fs.readdirSync(apiDir);
      console.log('📋 API路由列表:', apiFiles);
    } else {
      console.warn('⚠️ API路由目录不存在');
    }
  } else {
    console.error('❌ Next.js构建目录不存在:', nextDir);
    process.exit(1);
  }

  // 创建Cloudflare Pages所需的文件
  console.log('🔧 创建Cloudflare Pages配置...');
  
  // 创建 _worker.js 文件用于Cloudflare Pages
  const workerContent = `
// Cloudflare Pages Worker
export default {
  async fetch(request, env, ctx) {
    // 这里可以添加自定义的Worker逻辑
    // 默认情况下，Cloudflare Pages会自动处理Next.js应用
    return new Response('Cloudflare Pages API Worker', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
`;

  fs.writeFileSync('_worker.js', workerContent);
  console.log('✅ 创建了 _worker.js 文件');

  // 创建 _routes.json 文件
  const routesContent = {
    version: 1,
    include: ['/*'],
    exclude: [
      '/_next/*',
      '/api/*'
    ]
  };

  fs.writeFileSync('_routes.json', JSON.stringify(routesContent, null, 2));
  console.log('✅ 创建了 _routes.json 文件');

  console.log('🎉 Cloudflare Pages API构建完成！');
  console.log('📤 可以部署到Cloudflare Pages了');
  console.log('');
  console.log('📋 部署说明:');
  console.log('1. 确保Cloudflare Pages项目配置为支持Next.js');
  console.log('2. 设置所有必需的环境变量');
  console.log('3. 构建命令: npm run build:pages:api');
  console.log('4. 输出目录: .next (不是 out)');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
} 