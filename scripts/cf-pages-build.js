#!/usr/bin/env node

/**
 * Cloudflare Pages build script
 * Handles static export with API route compatibility
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for Cloudflare Pages...');

// Set environment
process.env.CF_PAGES = 'true';
process.env.NODE_ENV = 'production';

// Clean previous build
if (fs.existsSync('out')) {
  try {
    fs.rmSync('out', { recursive: true, force: true });
  } catch (error) {
    console.warn('⚠️  Could not remove out directory:', error.message);
    // Try alternative approach
    try {
      const files = fs.readdirSync('out');
      files.forEach(file => {
        const filePath = path.join('out', file);
        try {
          fs.rmSync(filePath, { recursive: true, force: true });
        } catch (e) {
          // Ignore errors for individual files
        }
      });
    } catch (e) {
      // Directory might not exist or be accessible
    }
  }
}

// Build Next.js
console.log('🔨 Building Next.js...');
try {
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Next.js build failed:', error.message);
  process.exit(1);
}

// Copy static files to out directory
console.log('📁 Preparing static deployment...');

// Copy static assets
const staticSource = '.next/static';
const staticDest = 'out/_next/static';
if (fs.existsSync(staticSource)) {
  if (!fs.existsSync('out')) {
    fs.mkdirSync('out', { recursive: true });
  }
  if (!fs.existsSync('out/_next')) {
    fs.mkdirSync('out/_next', { recursive: true });
  }
  
  try {
    fs.cpSync(staticSource, staticDest, { recursive: true });
    console.log('✅ Static assets copied');
  } catch (error) {
    console.error('⚠️  Could not copy static assets:', error.message);
  }
}

// Copy server pages as static HTML
const serverDir = '.next/server/pages';
const outDir = 'out';

function copyStaticFiles(src, dest) {
  if (!fs.existsSync(src)) return;
  
  const files = fs.readdirSync(src, { withFileTypes: true });
  
  for (const file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);
    
    if (file.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyStaticFiles(srcPath, destPath);
    } else if (file.name.endsWith('.html')) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy static HTML files
if (fs.existsSync('.next/server/pages')) {
  copyStaticFiles('.next/server/pages', 'out');
}

// Create fallback files (Japanese-only, neutral meta)
const fallbackHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>2kawaii - AI画像変換</title>
    <meta name="description" content="AI画像変換ツール。写真をアニメ風に変換。">
    <link rel="icon" href="/favicon.ico">
    <script src="/_next/static/chunks/main-app-*.js" defer></script>
    <script src="/_next/static/chunks/webpack-*.js" defer></script>
</head>
<body>
    <div id="__next"><div style="text-align:center;padding:50px;font-family:Arial,sans-serif;">
        <h1>2kawaii - AI画像変換</h1>
        <p>読み込み中...</p>
    </div></div>
</body>
</html>`;

// Create index files
const filesToCreate = [
  'index.html',
  'ja/index.html',
  'ja/workspace/index.html',
  '404.html'
];

filesToCreate.forEach(file => {
  const filePath = path.join('out', file);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, fallbackHTML);
});

// Create _redirects file for Cloudflare Pages (no locale redirects)
const redirects = `# Handle SPA routing
/*    /index.html    200

# Static assets
/_next/static/*    /_next/static/:splat    200
/favicon.ico    /favicon.ico    200
*.js    /:splat    200
*.css    /:splat    200`;

fs.writeFileSync('out/_redirects', redirects);

// Create _headers file
const headers = `# Cache static assets
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

*.js
  Cache-Control: public, max-age=86400

*.css
  Cache-Control: public, max-age=86400`;

fs.writeFileSync('out/_headers', headers);

// Copy favicon.ico from src/app if available
try {
  const srcFavicon = path.join('src', 'app', 'favicon.ico');
  const destFavicon = path.join('out', 'favicon.ico');
  if (fs.existsSync(srcFavicon)) {
    fs.copyFileSync(srcFavicon, destFavicon);
    console.log('✅ favicon.ico copied');
  } else {
    console.warn('⚠️  src/app/favicon.ico not found; favicon may be missing in out/');
  }
} catch (e) {
  console.warn('⚠️  Could not copy favicon.ico:', e.message);
}

console.log('✅ Cloudflare Pages build completed!');
console.log('📂 Files ready in out/ directory');
console.log('📄 Created _redirects and _headers for proper routing');
console.log('🚀 Ready for deployment');

// Update package.json for Cloudflare Pages
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts['build:pages'] = 'node scripts/cf-pages-build.js';
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('📋 Updated package.json build script');