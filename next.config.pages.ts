import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 针对 Cloudflare Pages 的极激进优化
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: ['@aws-sdk/client-s3', '@heroicons/react', 'axios'],
  },
  
  // 静态导出配置
  output: 'export',
  distDir: 'out',
  generateBuildId: async () => {
    return Date.now().toString()
  },
  
  // 禁用Next.js优化以减小包大小
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  
  // 确保静态导出
  images: {
    unoptimized: true,
    loader: 'custom',
  },
  
  // 针对 Cloudflare Pages 25MB 限制的极激进优化
  webpack: (config, { dev, isServer }) => {
    // 完全禁用所有缓存
    config.cache = false;
    
    if (!dev && !isServer) {
      // 客户端构建优化
      config.optimization = {
        ...config.optimization,
        // 极激进的代码分割
        splitChunks: {
          chunks: 'all',
          maxSize: 5000, // 5KB 限制 - 极激进
          minSize: 500,  // 500B 最小块
          cacheGroups: {
            // 分离 React 相关库
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 50,
              enforce: true,
              maxSize: 2000, // 2KB
            },
            // 分离 Next.js 相关
            next: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next',
              chunks: 'all',
              priority: 40,
              enforce: true,
              maxSize: 2000, // 2KB
            },
            // 分离 AWS SDK
            aws: {
              test: /[\\/]node_modules[\\/]@aws-sdk[\\/]/,
              name: 'aws-sdk',
              chunks: 'all',
              priority: 30,
              enforce: true,
              maxSize: 1000, // 1KB
            },
            // 分离其他第三方库
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 20,
              enforce: true,
              maxSize: 1000, // 1KB
            },
            // 分离公共代码
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              enforce: true,
              maxSize: 500, // 500B
            },
            // 分离样式文件
            styles: {
              name: 'styles',
              test: /\.(css|scss|sass)$/,
              chunks: 'all',
              enforce: true,
              maxSize: 500, // 500B
            },
          },
        },
        // 禁用模块连接
        concatenateModules: false,
        // 启用副作用优化
        sideEffects: false,
        // 启用最小化
        minimize: true,
        // 设置更小的入口点大小限制
        runtimeChunk: 'single',
        // 禁用模块连接
        moduleIds: 'named',
        chunkIds: 'named',
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
      
      // 极严格的性能提示
      config.performance = {
        hints: 'error',
        maxEntrypointSize: 10000, // 10KB
        maxAssetSize: 10000, // 10KB
      };
      
      // 禁用source map以减少文件大小
      config.devtool = false;
      
      // 禁用缓存相关的插件
      config.plugins = config.plugins.filter((plugin: any) => {
        const pluginName = plugin.constructor.name;
        return !pluginName.includes('Cache') && 
               !pluginName.includes('HotModuleReplacement') &&
               !pluginName.includes('DefinePlugin');
      });
    }
    
    return config;
  },
  
  // 压缩配置
  compress: true,
  
  // 启用 gzip 压缩
  poweredByHeader: false,
  
  // 禁用图片优化
  images: {
    unoptimized: true,
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