#!/usr/bin/env node

/**
 * Quick fix for Cloudflare Pages deployment issues
 * This creates proper static files for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Cloudflare Pages deployment...');

// Ensure we're using correct build output
const buildOutput = '.next';
const pagesOutput = 'out';

// Create out directory if it doesn't exist
if (!fs.existsSync(pagesOutput)) {
  fs.mkdirSync(pagesOutput, { recursive: true });
}

// Copy static files to out directory
function copyStaticFiles() {
  console.log('📁 Copying static files...');
  
  // Copy static assets
  if (fs.existsSync(path.join(buildOutput, 'static'))) {
    const staticOut = path.join(pagesOutput, '_next', 'static');
    if (!fs.existsSync(staticOut)) {
      fs.mkdirSync(staticOut, { recursive: true });
    }
    
    try {
      fs.cpSync(path.join(buildOutput, 'static'), staticOut, { recursive: true });
      console.log('✅ Static files copied');
    } catch (error) {
      console.error('⚠️  Could not copy static files:', error.message);
    }
  }
  
  // Copy HTML files
  const htmlFiles = [
    'index.html',
    '404.html',
    'ja/index.html',
    'ja/workspace/index.html',
    'ja/share/index.html',
    'ja/faq/index.html',
    'ja/privacy/index.html',
    'ja/terms/index.html'
  ];
  
  // Create base HTML structure for fallback
  const baseHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>2kawaii - AI画像変換</title>
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/_next/static/css/app/layout.css">
    <meta name="description" content="AI画像変換ツール。写真をアニメ風に変換。">
</head>
<body>
    <div id="__next"></div>
    <script src="/_next/static/chunks/main-app-3f2e4d8ef343f46d.js" defer></script>
    <script src="/_next/static/chunks/webpack-56127e418f5e2181.js" defer></script>
</body>
</html>`;

  // Write index.html
  fs.writeFileSync(path.join(pagesOutput, 'index.html'), baseHTML);
  
  // Write ja/index.html
  const jaDir = path.join(pagesOutput, 'ja');
  if (!fs.existsSync(jaDir)) {
    fs.mkdirSync(jaDir, { recursive: true });
  }
  fs.writeFileSync(path.join(jaDir, 'index.html'), baseHTML);
  
  // Create workspace directory
  const workspaceDir = path.join(pagesOutput, 'ja', 'workspace');
  if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir, { recursive: true });
  }
  fs.writeFileSync(path.join(workspaceDir, 'index.html'), baseHTML);
  
  console.log('✅ Deployment files created');
}

// Create _redirects file for Cloudflare Pages
function createRedirects() {
  console.log('🔄 Creating _redirects file...');
  
  const redirects = `/*    /ja/:splat    302
/    /ja    302
/_next/static/* /_next/static/:splat 200
/api/* /api/:splat 200
/favicon.ico /favicon.ico 200
*.js *.js 200
*.css *.css 200
*.png *.png 200
*.jpg *.jpg 200
*.svg *.svg 200`;
  
  fs.writeFileSync(path.join(pagesOutput, '_redirects'), redirects);
  console.log('✅ _redirects file created');
}

// Create _headers file
function createHeaders() {
  console.log('📋 Creating _headers file...');
  
  const headers = `/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

*.js
  Cache-Control: public, max-age=31536000

*.css
  Cache-Control: public, max-age=31536000`;
  
  fs.writeFileSync(path.join(pagesOutput, '_headers'), headers);
  console.log('✅ _headers file created');
}

// Copy favicon.ico from src/app
function copyFavicon() {
  try {
    const srcFavicon = path.join('src', 'app', 'favicon.ico');
    const destFavicon = path.join(pagesOutput, 'favicon.ico');
    if (fs.existsSync(srcFavicon)) {
      fs.copyFileSync(srcFavicon, destFavicon);
      console.log('✅ favicon.ico copied');
    } else {
      console.warn('⚠️  src/app/favicon.ico not found; favicon may be missing');
    }
  } catch (e) {
    console.warn('⚠️  Could not copy favicon.ico:', e.message);
  }
}

// Run the fixes
copyStaticFiles();
createRedirects();
createHeaders();
copyFavicon();

console.log('🎉 Deployment fix complete!');
console.log('📂 Files ready in out/ directory');
console.log('🚀 Deploy with: wrangler pages deploy out --config wrangler.pages.toml');