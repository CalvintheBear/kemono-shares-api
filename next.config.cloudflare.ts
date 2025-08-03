import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 针对 Cloudflare Pages 的极激进优化
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: ['@aws-sdk/client-s3', '@heroicons/react', 'axios'],
    // 禁用一些可能导致大文件的功能
    optimizeCss: false,
  },
  
  // 禁用持久化缓存
  distDir: '.next',
  generateBuildId: async () => {
    return Date.now().toString()
  },
  
  // 极激进的 webpack 配置
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // 客户端构建优化
      config.optimization = {
        ...config.optimization,
        // 极激进的代码分割
        splitChunks: {
          chunks: 'all',
          maxSize: 10000, // 10KB 限制
          minSize: 2000,  // 2KB 最小块
          cacheGroups: {
            // React 相关库
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              maxSize: 8000, // 8KB
              priority: 40,
            },
            // Next.js 相关库
            next: {
              test: /[\\/]node_modules[\\/](next)[\\/]/,
              name: 'next',
              chunks: 'all',
              maxSize: 8000, // 8KB
              priority: 30,
            },
            // AWS SDK
            aws: {
              test: /[\\/]node_modules[\\/](@aws-sdk)[\\/]/,
              name: 'aws',
              chunks: 'all',
              maxSize: 5000, // 5KB
              priority: 20,
            },
            // 其他第三方库
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 6000, // 6KB
              priority: 10,
            },
            // 公共代码
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              maxSize: 5000, // 5KB
              priority: 5,
            },
            // 样式文件
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              maxSize: 4000, // 4KB
              priority: 1,
            },
          },
        },
        // 禁用模块连接以减少包大小
        concatenateModules: false,
        // 设置更小的入口点大小限制
        runtimeChunk: 'single',
      };
      
      // 设置性能提示
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 50000, // 50KB
        maxAssetSize: 50000, // 50KB
      };
      
      // 优化模块解析
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        },
      };
    }
    
    return config;
  },
  
  // 禁用图片优化
  images: {
    unoptimized: true,
  },
  
  // 输出配置
  output: 'standalone',
  
  // 禁用压缩以减少文件大小
  compress: false,
};

export default withNextIntl(nextConfig); 