import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 优化 webpack 配置以减少包大小
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: ['@aws-sdk/client-s3', '@heroicons/react', 'axios'],
  },
  
  // 禁用持久化缓存
  distDir: '.next',
  generateBuildId: async () => {
    // 生成随机 build ID 避免缓存
    return Date.now().toString()
  },
  
  // 优化 webpack 配置
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // 客户端构建优化 - 针对 Cloudflare Pages 25MB 限制
      config.optimization = {
        ...config.optimization,
        // 启用代码分割
        splitChunks: {
          chunks: 'all',
          maxSize: 100000, // 更激进的限制：100KB
          minSize: 20000,  // 最小块大小：20KB
          cacheGroups: {
            // 分离 React 相关库
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 40,
              enforce: true,
              maxSize: 50000, // React 库单独限制
            },
            // 分离 Next.js 相关
            next: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next',
              chunks: 'all',
              priority: 30,
              enforce: true,
              maxSize: 50000, // Next.js 库单独限制
            },
            // 分离 AWS SDK
            aws: {
              test: /[\\/]node_modules[\\/]@aws-sdk[\\/]/,
              name: 'aws-sdk',
              chunks: 'all',
              priority: 20,
              enforce: true,
              maxSize: 30000, // AWS SDK 单独限制
            },
            // 分离其他第三方库
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              enforce: true,
              maxSize: 40000, // 其他库限制
            },
            // 分离公共代码
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              enforce: true,
              maxSize: 30000, // 公共代码限制
            },
          },
        },
        // 启用模块连接
        concatenateModules: true,
        // 启用副作用优化
        sideEffects: false,
        // 启用最小化
        minimize: true,
        // 更激进的压缩
        minimizer: [
          ...config.optimization.minimizer || [],
        ],
      };
      
      // 优化模块解析
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: false,
          stream: false,
          url: false,
          zlib: false,
          http: false,
          https: false,
          assert: false,
          os: false,
          path: false,
        },
      };
      
      // 性能提示
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 512000, // 500KB
        maxAssetSize: 512000, // 500KB
      };
    }
    
    return config;
  },
  
  // 压缩配置
  compress: true,
  
  // 启用 gzip 压缩
  poweredByHeader: false,
  
  images: {
    unoptimized: true, // 允许所有远程图片不受限制
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tempfile.aiquickdraw.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/temp/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/temp/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3003',
        pathname: '/temp/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fury-template-1363880159.cos.ap-guangzhou.myqcloud.com',
        port: '',
        pathname: '/**',
      },
      // 添加 2kawaii.com 域名支持
      {
        protocol: 'https',
        hostname: '2kawaii.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.2kawaii.com',
        port: '',
        pathname: '/**',
      },
      // 添加 Cloudflare R2 域名支持
      {
        protocol: 'https',
        hostname: 'pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-d00e7b41917848d1a8403c984cb62880.r2.dev',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default withNextIntl(nextConfig);