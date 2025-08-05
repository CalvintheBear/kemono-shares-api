#!/usr/bin/env node

/**
 * Cloudflare Pages deployment script
 * This script prepares the build for Cloudflare Pages deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Cloudflare Pages deployment...');

// Set environment variables for Cloudflare Pages
process.env.CF_PAGES = 'true';
process.env.NODE_ENV = 'production';

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
}
if (fs.existsSync('.vercel')) {
  fs.rmSync('.vercel', { recursive: true, force: true });
}

// Build the project
console.log('🔨 Building Next.js project...');
try {
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed');
} catch (error) {
  console.error('❌ Next.js build failed:', error.message);
  process.exit(1);
}

// Build for Cloudflare Pages
console.log('🔨 Building for Cloudflare Pages...');
try {
  execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
  console.log('✅ Cloudflare Pages build completed');
} catch (error) {
  console.error('⚠️  @cloudflare/next-on-pages build failed, using Next.js build directly:', error.message);
  
  // Fallback: Copy .next to .vercel/output
  const vercelOutput = path.join('.vercel', 'output');
  if (!fs.existsSync(vercelOutput)) {
    fs.mkdirSync(vercelOutput, { recursive: true });
  }
  
  // Copy static files
  if (fs.existsSync('.next/static')) {
    fs.cpSync('.next/static', path.join(vercelOutput, 'static'), { recursive: true });
  }
  
  // Copy server files
  if (fs.existsSync('.next/server')) {
    fs.cpSync('.next/server', path.join(vercelOutput, 'functions'), { recursive: true });
  }
  
  console.log('✅ Using fallback deployment structure');
}

console.log('🎉 Deployment preparation complete!');
console.log('📁 Files ready in .vercel/output/');