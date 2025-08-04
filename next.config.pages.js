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
      
      // 极激进的代码分割
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 2000, // 2KB
          minSize: 500,  // 500B
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              maxSize: 2000,
              minSize: 500,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              maxSize: 2000,
              minSize: 500,
            },
          },
        },
        concatenateModules: false,
        minimize: false,
      };
      
      // 禁用 source map
      config.devtool = false;
      
      // 严格的性能限制
      config.performance = {
        hints: 'error',
        maxEntrypointSize: 25000,
        maxAssetSize: 25000,
      };
    }
    
    return config;
  },
  
};

module.exports = nextConfig;