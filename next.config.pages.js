const { execSync } = require('child_process');
const fs = require('fs');

// 创建适用于 Cloudflare Pages 的 Next.js 配置
const nextConfig = {
  output: 'export',
  distDir: '.next',
  
  // 禁用所有缓存
  generateBuildId: () => Date.now().toString(),
  
  // 图片配置
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 禁用压缩和优化以减少构建时间
  compress: false,
  productionBrowserSourceMaps: false,
  
  // 静态导出配置
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // 实验性配置
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: ['@aws-sdk/client-s3', '@heroicons/react'],
  },
  
  // 极激进的 Webpack 配置
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // 完全禁用缓存
      config.cache = false;
      
      // 合理的代码分割
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 50000, // 50KB
          minSize: 10000,  // 10KB
          cacheGroups: {
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              maxSize: 20000,
              priority: 50,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              maxSize: 50000,
              minSize: 10000,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              maxSize: 20000,
              minSize: 10000,
            },
          },
        },
        concatenateModules: false,
        minimize: true,
      };
      
      // 禁用 source map
      config.devtool = false;
      
      // 放宽性能限制
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 250000, // 250KB
        maxAssetSize: 250000, // 250KB
      };
    }
    
    return config;
  },
  
};

module.exports = nextConfig;