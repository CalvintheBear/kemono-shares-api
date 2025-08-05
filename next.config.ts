import type { NextConfig } from "next";

// 根据环境变量确定构建类型
const isCloudflarePages = process.env.CF_PAGES === 'true';
const isRailway = process.env.RAILWAY === 'true';

// 移除静态导出配置，支持API路由
const shouldUseStaticExport = false; // 强制禁用静态导出以支持API

const nextConfig: NextConfig = {
  // 移除静态导出配置
  // output: shouldUseStaticExport ? 'export' : undefined,
  distDir: '.next',
  
  // 移除静态导出优化
  trailingSlash: false,
  skipTrailingSlashRedirect: false,
  
  // 图片配置 - 支持API路由
  images: {
    unoptimized: false, // 启用图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 静态资源路径
  assetPrefix: undefined,
  basePath: '',
  
  // 性能优化配置
  compress: true,
  productionBrowserSourceMaps: false,
  
  // 实验性功能
  experimental: {
    webpackBuildWorker: false,
    optimizePackageImports: ['@aws-sdk/client-s3', '@heroicons/react', 'axios'],
  },
  
  // Webpack配置
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      // 禁用缓存
      config.cache = false;
      
      // 代码分割配置
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 50000,
          minSize: 10000,
          cacheGroups: {
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              maxSize: 20000,
              minSize: 5000,
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
      
      // 禁用source map
      config.devtool = false;
      
      // 性能配置
      config.performance = {
        hints: false,
        maxEntrypointSize: Infinity,
        maxAssetSize: Infinity,
      };
    }
    
    return config;
  },
};

export default nextConfig; 