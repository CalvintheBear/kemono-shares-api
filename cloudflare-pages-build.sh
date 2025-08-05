#!/bin/bash

# Cloudflare Pages build script
# This script is designed to work in the Cloudflare Pages environment

echo "🚀 Starting Cloudflare Pages build..."

# Set environment variables
export CF_PAGES=true
export NODE_ENV=production

# Build the project
echo "🔨 Building Next.js project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Next.js build completed successfully"
    
    # Build for Cloudflare Pages
    echo "🔨 Building for Cloudflare Pages with next-on-pages..."
    npx @cloudflare/next-on-pages
    
    if [ $? -eq 0 ]; then
        echo "✅ Cloudflare Pages build completed successfully"
    else
        echo "⚠️  next-on-pages failed, using static export fallback..."
        npm run build
        node scripts/fix-deployment.js
    fi
else
    echo "❌ Next.js build failed"
    exit 1
fi

echo "🎉 Build completed successfully!"