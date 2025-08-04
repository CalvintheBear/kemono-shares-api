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
  
  // 优化的 webpack 配置
  webpack: (config, { dev, isServer }) => {
    // 保持缓存以提高构建性能
    if (dev) {
      config.cache = true;
    }
    
    if (!dev && !isServer) {
      // 客户端构建优化
      config.optimization = {
        ...config.optimization,
        // 适度的代码分割
        splitChunks: {
          chunks: 'all',
          maxSize: 50000, // 50KB 限制 - 更合理
          minSize: 10000,  // 10KB 最小块
          cacheGroups: {
            // React 相关库
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 40,
            },
            // Next.js 相关库
            next: {
              test: /[\\/]node_modules[\\/](next)[\\/]/,
              name: 'next',
              chunks: 'all',
              priority: 30,
            },
            // AWS SDK
            aws: {
              test: /[\\/]node_modules[\\/](@aws-sdk)[\\/]/,
              name: 'aws',
              chunks: 'all',
              priority: 20,
            },
            // 其他第三方库
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // 公共代码
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
            },
          },
        },
        // 启用模块连接以提高性能
        concatenateModules: true,
        // 启用压缩
        minimize: true,
        // 设置合理的入口点大小限制
        runtimeChunk: 'single',
      };
      
      // 设置合理的性能提示
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 500000, // 500KB
        maxAssetSize: 500000, // 500KB
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
      
      // 启用source map用于调试
      config.devtool = dev ? 'eval-source-map' : false;
    }
    
    return config;
  },
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 输出配置
  output: 'standalone',
  
  // 启用压缩
  compress: true,
  
  // 合理的缓存配置
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // 25秒
    pagesBufferLength: 2,
  },
};

export default withNextIntl(nextConfig); 