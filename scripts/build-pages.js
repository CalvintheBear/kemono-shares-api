#!/usr/bin/env node

/**
 * Cloudflare Pages 静态部署构建脚本
 * 专为 Pages 静态导出设计
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for Cloudflare Pages static deployment...');

// 设置环境变量
process.env.CF_PAGES = 'true';
process.env.NODE_ENV = 'production';

// 清理之前的构建
const outDir = 'out';
if (fs.existsSync(outDir)) {
  try {
    fs.rmSync(outDir, { recursive: true, force: true });
  } catch (error) {
    console.warn('⚠️  Could not fully clean out directory:', error.message);
  }
}

// 构建 Next.js 项目
try {
  console.log('🔨 Building Next.js...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed');
} catch (error) {
  console.error('❌ Next.js build failed:', error.message);
  process.exit(1);
}

// 复制静态文件到输出目录
console.log('📁 Preparing static deployment...');

// 创建输出目录结构
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 复制静态资源
const staticSource = '.next/static';
const staticDest = path.join(outDir, '_next', 'static');
if (fs.existsSync(staticSource)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  try {
    fs.cpSync(staticSource, staticDest, { recursive: true });
    console.log('✅ Static assets copied');
  } catch (error) {
    console.warn('⚠️  Could not copy static assets:', error.message);
  }
}

// 复制 HTML 文件
const pagesSource = '.next/server/pages';
if (fs.existsSync(pagesSource)) {
  try {
    fs.cpSync(pagesSource, outDir, { recursive: true });
    console.log('✅ HTML pages copied');
  } catch (error) {
    console.warn('⚠️  Could not copy pages:', error.message);
  }
}

// 创建必要的重定向和配置
const redirects = `# Cloudflare Pages 重定向配置
/    /ja    302

# SPA 路由处理
/*    /:splat/index.html    200

# 静态资源缓存
/_next/static/*    /_next/static/:splat    200`;

const headers = `# 静态资源缓存头
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

*.html
  Cache-Control: public, max-age=3600`;

fs.writeFileSync(path.join(outDir, '_redirects'), redirects);
fs.writeFileSync(path.join(outDir, '_headers'), headers);

// 复制 favicon
try {
  const srcFavicon = path.join('src', 'app', 'favicon.ico');
  const destFavicon = path.join(outDir, 'favicon.ico');
  if (fs.existsSync(srcFavicon)) {
    fs.copyFileSync(srcFavicon, destFavicon);
    console.log('✅ favicon.ico copied');
  } else {
    console.warn('⚠️  src/app/favicon.ico not found; creating empty placeholder');
    if (!fs.existsSync(destFavicon)) fs.writeFileSync(destFavicon, '');
  }
} catch (e) {
  console.warn('⚠️  Could not copy favicon.ico:', e.message);
}

console.log('🎉 Cloudflare Pages build completed!');
console.log('📂 Files ready in out/ directory');
console.log('🚀 Deploy with: wrangler pages deploy out --config wrangler.pages.toml');