#!/usr/bin/env node

/**
 * Deploy the fixed version to Cloudflare Pages
 */

const { execSync } = require('child_process');

console.log('🚀 Deploying fixed version to Cloudflare Pages...');

try {
  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Fix deployment
  console.log('🔧 Applying deployment fixes...');
  execSync('node scripts/fix-deployment.js', { stdio: 'inherit' });
  
  // Deploy to Cloudflare Pages
  console.log('🌐 Deploying to Cloudflare Pages...');
  execSync('npx wrangler pages deploy out --config wrangler.pages.toml', { stdio: 'inherit' });
  
  console.log('✅ Deployment complete!');
  console.log('🌐 Your site should be available at: https://2kawaii.com/');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('💡 You can manually deploy with: npx wrangler pages deploy out --config wrangler.pages.toml');
}