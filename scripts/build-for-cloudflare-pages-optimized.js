const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始Cloudflare Pages优化构建...');

// 设置环境变量
process.env.STATIC_EXPORT = 'true';
process.env.CF_PAGES = 'true';
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1'; // 禁用遥测

// 设置构建超时
process.env.NEXT_BUILD_TIMEOUT = '300'; // 5分钟超时

try {
  // 1. 清理构建缓存
  console.log('🧹 清理构建缓存...');
  const dirsToClean = ['.next', 'out', '.next/cache'];
  dirsToClean.forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ 已清理: ${dir}`);
      }
    } catch (error) {
      console.warn(`⚠️  无法删除 ${dir}，继续...`);
    }
  });

  // 2. 优化package.json中的脚本（临时）
  console.log('📝 临时优化构建配置...');
  
  // 3. 运行Next.js构建，设置超时
  console.log('🔨 运行Next.js静态构建（优化模式）...');
  
  const buildCommand = 'npx next build';
  const buildOptions = {
    stdio: 'inherit',
    timeout: 300000, // 5分钟超时
    env: {
      ...process.env,
      // 优化环境变量
      NODE_OPTIONS: '--max-old-space-size=2048', // 增加内存限制
      NEXT_PRIVATE_STANDALONE: 'true',
      NEXT_PRIVATE_DEBUG_CACHE: 'false',
    }
  };

  execSync(buildCommand, buildOptions);

  // 4. 验证输出
  console.log('🔍 验证构建输出...');
  
  if (!fs.existsSync('out')) {
    throw new Error('❌ 构建失败：out目录未生成');
  }

  // 检查关键文件
  const criticalFiles = [
    'out/index.html',
    'out/_next',
    'out/workspace/index.html'
  ];

  const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    console.warn('⚠️  以下文件缺失:', missingFiles);
  }

  // 5. 统计构建结果
  const outStats = getDirectoryStats('out');
  console.log('📊 构建统计:');
  console.log(`   - 总文件数: ${outStats.fileCount}`);
  console.log(`   - 总大小: ${(outStats.totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   - HTML文件: ${outStats.htmlFiles}个`);
  console.log(`   - JS文件: ${outStats.jsFiles}个`);
  console.log(`   - CSS文件: ${outStats.cssFiles}个`);

  // 6. 检查文件大小限制（Cloudflare Pages限制）
  const maxFileSize = 25 * 1024 * 1024; // 25MB
  const largeFiles = findLargeFiles('out', maxFileSize);
  if (largeFiles.length > 0) {
    console.warn('⚠️  发现超大文件（>25MB）:');
    largeFiles.forEach(file => {
      console.warn(`   - ${file.path}: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    });
  }

  console.log('✅ Cloudflare Pages构建完成！');
  console.log('📁 输出目录: out/');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  
  // 提供调试信息
  if (error.message.includes('timeout')) {
    console.error('💡 构建超时建议:');
    console.error('   1. 检查分享页面的API调用');
    console.error('   2. 确保STATIC_EXPORT环境变量已设置');
    console.error('   3. 考虑简化generateMetadata逻辑');
  }
  
  process.exit(1);
}

// 辅助函数：获取目录统计信息
function getDirectoryStats(dirPath) {
  let fileCount = 0;
  let totalSize = 0;
  let htmlFiles = 0;
  let jsFiles = 0;
  let cssFiles = 0;

  function scanDirectory(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDirectory(itemPath);
        } else {
          fileCount++;
          totalSize += stats.size;
          
          const ext = path.extname(item).toLowerCase();
          if (ext === '.html') htmlFiles++;
          else if (ext === '.js') jsFiles++;
          else if (ext === '.css') cssFiles++;
        }
      });
    } catch (error) {
      // 忽略无法读取的目录
    }
  }

  scanDirectory(dirPath);
  return { fileCount, totalSize, htmlFiles, jsFiles, cssFiles };
}

// 辅助函数：查找大文件
function findLargeFiles(dirPath, maxSize) {
  const largeFiles = [];

  function scanDirectory(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDirectory(itemPath);
        } else if (stats.size > maxSize) {
          largeFiles.push({
            path: path.relative('out', itemPath),
            size: stats.size
          });
        }
      });
    } catch (error) {
      // 忽略无法读取的目录
    }
  }

  scanDirectory(dirPath);
  return largeFiles;
}