#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Cloudflare Pages 构建开始...');

// 清理函数
function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    try {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${dir}"`, { stdio: 'inherit', shell: true });
      } else {
        execSync(`rm -rf "${dir}"`, { stdio: 'inherit' });
      }
      console.log(`✅ 已清理: ${dir}`);
    } catch (error) {
      console.log(`⚠️  清理失败: ${dir}`);
    }
  }
}

// 设置环境变量
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_CACHE = 'false';
process.env.WEBPACK_CACHE = 'false';

// 步骤1: 清理缓存和构建目录
console.log('🧹 清理缓存和构建目录...');
const dirsToClean = ['.next', '.vercel', 'cache', 'dist'];
dirsToClean.forEach(cleanDirectory);

// 步骤2: 临时移除API路由和动态路由
console.log('🔧 临时移除API路由和动态路由...');
const apiDir = 'src/app/api';
const apiBackupDir = '../api.backup';
const iconFile = 'src/app/icon.tsx';
const iconBackupFile = '../icon.tsx.backup';
const shareDir = 'src/app/[locale]/share';
const shareBackupDir = '../share.backup';
const i18nDir = 'src/i18n';
const i18nBackupDir = '../i18n.backup';
const workspaceFile = 'src/app/[locale]/workspace/page.tsx';
const workspaceBackupFile = '../workspace.page.tsx.backup';

// 备份API路由
if (fs.existsSync(apiDir)) {
  if (fs.existsSync(apiBackupDir)) {
    cleanDirectory(apiBackupDir);
  }
  // 复制而不是重命名，避免权限问题
  execSync(`xcopy "${apiDir}" "${apiBackupDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  cleanDirectory(apiDir);
  console.log('✅ 已备份API路由');
}

// 备份icon.tsx文件
if (fs.existsSync(iconFile)) {
  fs.copyFileSync(iconFile, iconBackupFile);
  fs.unlinkSync(iconFile);
  console.log('✅ 已备份icon.tsx文件');
}

// 备份share目录
if (fs.existsSync(shareDir)) {
  if (fs.existsSync(shareBackupDir)) {
    cleanDirectory(shareBackupDir);
  }
  execSync(`xcopy "${shareDir}" "${shareBackupDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  cleanDirectory(shareDir);
  console.log('✅ 已备份share目录');
}

// 备份i18n目录
if (fs.existsSync(i18nDir)) {
  if (fs.existsSync(i18nBackupDir)) {
    cleanDirectory(i18nBackupDir);
  }
  execSync(`xcopy "${i18nDir}" "${i18nBackupDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  cleanDirectory(i18nDir);
  console.log('✅ 已备份i18n目录');
}

// 备份workspace页面
if (fs.existsSync(workspaceFile)) {
  fs.copyFileSync(workspaceFile, workspaceBackupFile);
  fs.unlinkSync(workspaceFile);
  console.log('✅ 已备份workspace页面');
}

// 步骤3: 使用专门的Pages配置
console.log('📋 使用 Cloudflare Pages 配置...');
const originalConfig = 'next.config.ts';
const pagesConfig = 'next.config.pages.ts';

if (fs.existsSync(pagesConfig)) {
  if (fs.existsSync(originalConfig)) {
    fs.copyFileSync(originalConfig, `${originalConfig}.backup`);
  }
  fs.copyFileSync(pagesConfig, originalConfig);
  console.log('✅ 已应用 Pages 配置');
}

// 步骤4: 执行静态构建
console.log('🔨 开始静态构建...');
try {
  execSync('npm run build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_CACHE: 'false',
      WEBPACK_CACHE: 'false',
      NEXT_WEBPACK_CACHE: 'false'
    },
    shell: true
  });
  
  console.log('✅ 构建完成！');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  
  // 恢复原始配置
  if (fs.existsSync(`${originalConfig}.backup`)) {
    fs.copyFileSync(`${originalConfig}.backup`, originalConfig);
    fs.unlinkSync(`${originalConfig}.backup`);
  }
  
  // 恢复API路由
  if (fs.existsSync(apiBackupDir)) {
    if (fs.existsSync(apiDir)) {
      cleanDirectory(apiDir);
    }
    execSync(`xcopy "${apiBackupDir}" "${apiDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
    cleanDirectory(apiBackupDir);
    console.log('✅ 已恢复API路由');
  }
  
  // 恢复icon.tsx文件
  if (fs.existsSync(iconBackupFile)) {
    fs.copyFileSync(iconBackupFile, iconFile);
    fs.unlinkSync(iconBackupFile);
    console.log('✅ 已恢复icon.tsx文件');
  }
  
  // 恢复share目录
if (fs.existsSync(shareBackupDir)) {
  if (fs.existsSync(shareDir)) {
    cleanDirectory(shareDir);
  }
  execSync(`xcopy "${shareBackupDir}" "${shareDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  cleanDirectory(shareBackupDir);
  console.log('✅ 已恢复share目录');
}

  // 恢复i18n目录
if (fs.existsSync(i18nBackupDir)) {
  if (fs.existsSync(i18nDir)) {
    cleanDirectory(i18nDir);
  }
  execSync(`xcopy "${i18nBackupDir}" "${i18nDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  cleanDirectory(i18nBackupDir);
  console.log('✅ 已恢复i18n目录');
}

// 恢复workspace页面
if (fs.existsSync(workspaceBackupFile)) {
  fs.copyFileSync(workspaceBackupFile, workspaceFile);
  fs.unlinkSync(workspaceBackupFile);
  console.log('✅ 已恢复workspace页面');
}
  
  process.exit(1);
}

// 步骤5: 验证文件大小
console.log('📏 验证文件大小...');
function checkFileSizes(dir) {
  if (!fs.existsSync(dir)) return true;
  
  const files = fs.readdirSync(dir, { recursive: true });
  let hasLargeFiles = false;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isFile()) {
      const sizeInMB = fs.statSync(filePath).size / (1024 * 1024);
      if (sizeInMB > 25) {
        console.log(`⚠️  大文件: ${file} (${sizeInMB.toFixed(2)} MB)`);
        hasLargeFiles = true;
      }
    }
  });
  
  return !hasLargeFiles;
}

const staticDir = 'out';
if (checkFileSizes(staticDir)) {
  console.log('✅ 所有文件都在 25MB 限制内');
} else {
  console.log('❌ 发现超过 25MB 的文件');
  process.exit(1);
}

// 步骤5.5: 复制文件到 Cloudflare Pages 期望的目录
console.log('📁 复制文件到 Cloudflare Pages 输出目录...');
const targetDir = '.vercel/output/static';

// 创建目标目录
if (!fs.existsSync('.vercel')) {
  fs.mkdirSync('.vercel');
}
if (!fs.existsSync('.vercel/output')) {
  fs.mkdirSync('.vercel/output');
}
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

// 复制所有文件到目标目录
try {
  execSync(`xcopy "${staticDir}" "${targetDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  console.log('✅ 已复制文件到 .vercel/output/static');
} catch (error) {
  console.error('❌ 复制文件失败:', error.message);
  process.exit(1);
}

// 步骤6: 恢复原始配置和API路由
console.log('🔄 恢复原始配置...');
if (fs.existsSync(`${originalConfig}.backup`)) {
  fs.copyFileSync(`${originalConfig}.backup`, originalConfig);
  fs.unlinkSync(`${originalConfig}.backup`);
  console.log('✅ 已恢复原始配置');
}

// 恢复API路由
if (fs.existsSync(apiBackupDir)) {
  if (fs.existsSync(apiDir)) {
    cleanDirectory(apiDir);
  }
  execSync(`xcopy "${apiBackupDir}" "${apiDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  cleanDirectory(apiBackupDir);
  console.log('✅ 已恢复API路由');
}

// 恢复share目录
if (fs.existsSync(shareBackupDir)) {
  if (fs.existsSync(shareDir)) {
    cleanDirectory(shareDir);
  }
  execSync(`xcopy "${shareBackupDir}" "${shareDir}" /E /I /H /Y`, { stdio: 'inherit', shell: true });
  cleanDirectory(shareBackupDir);
  console.log('✅ 已恢复share目录');
}

console.log('🎉 Cloudflare Pages 构建成功！');
console.log('📁 输出目录:', staticDir);