const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始Cloudflare Pages优化构建...');

try {
  // 设置环境变量 - 支持API路由
  process.env.CF_PAGES = 'true';
  process.env.STATIC_EXPORT = 'false'; // 禁用静态导出以支持API
  process.env.NODE_ENV = 'production';

  console.log('📦 构建Next.js应用（Cloudflare Pages优化）...');
  
  // 清理之前的构建
  console.log('🧹 清理之前的构建...');
  if (fs.existsSync('.next')) {
    // 使用跨平台的删除命令
    if (process.platform === 'win32') {
      execSync('if exist .next rmdir /s /q .next', { stdio: 'inherit' });
    } else {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
  }
  
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

    // 检查文件大小 - Cloudflare Pages限制25MB
    console.log('🔍 检查文件大小...');
    const maxFileSize = 25 * 1024 * 1024; // 25MB
    let hasLargeFiles = false;
    const largeFiles = [];

    function checkDirectorySize(dirPath, relativePath = '') {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const relativeFilePath = path.join(relativePath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          checkDirectorySize(filePath, relativeFilePath);
        } else {
          const sizeInMB = stats.size / (1024 * 1024);
          if (stats.size > maxFileSize) {
            console.warn(`⚠️ 文件过大: ${relativeFilePath} (${sizeInMB.toFixed(2)}MB)`);
            largeFiles.push({ path: relativeFilePath, size: stats.size, sizeInMB });
            hasLargeFiles = true;
          } else if (sizeInMB > 10) {
            console.log(`📊 大文件: ${relativeFilePath} (${sizeInMB.toFixed(2)}MB)`);
          }
        }
      }
    }

    checkDirectorySize(nextDir);

    if (hasLargeFiles) {
      console.warn('❌ 发现超过25MB的文件，这会导致Cloudflare Pages部署失败');
      console.warn('📋 大文件列表:');
      largeFiles.forEach(file => {
        console.warn(`  - ${file.path}: ${file.sizeInMB.toFixed(2)}MB`);
      });
      console.warn('');
      console.warn('💡 解决方案:');
      console.warn('1. 检查webpack配置中的代码分割设置');
      console.warn('2. 考虑移除不必要的依赖');
      console.warn('3. 使用动态导入减少初始包大小');
      console.warn('4. 检查是否有重复的依赖包');
      
      // 尝试清理一些可能不需要的文件
      console.log('🧹 尝试清理不必要的文件...');
      const cacheDir = path.join(nextDir, 'cache');
      if (fs.existsSync(cacheDir)) {
        console.log('删除缓存目录...');
        if (process.platform === 'win32') {
          execSync(`if exist "${cacheDir}" rmdir /s /q "${cacheDir}"`, { stdio: 'inherit' });
        } else {
          execSync(`rm -rf "${cacheDir}"`, { stdio: 'inherit' });
        }
      }
      
      process.exit(1);
    } else {
      console.log('✅ 所有文件大小都在25MB限制内');
    }

    // 计算总大小
    function calculateDirectorySize(dirPath) {
      let totalSize = 0;
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          totalSize += calculateDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
      return totalSize;
    }

    const totalSize = calculateDirectorySize(nextDir);
    const totalSizeInMB = totalSize / (1024 * 1024);
    console.log(`📊 构建输出总大小: ${totalSizeInMB.toFixed(2)}MB`);

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

  console.log('🎉 Cloudflare Pages优化构建完成！');
  console.log('📤 可以部署到Cloudflare Pages了');
  console.log('');
  console.log('📋 部署说明:');
  console.log('1. 确保Cloudflare Pages项目配置为支持Next.js');
  console.log('2. 设置所有必需的环境变量');
  console.log('3. 构建命令: npm run build:pages:api:optimized');
  console.log('4. 输出目录: .next (不是 out)');
  console.log('5. 所有文件大小都在25MB限制内');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
} 