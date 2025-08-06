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
      
      // Cloudflare Pages优化 - 确保文件大小不超过25MB
      const isCloudflarePages = process.env.CF_PAGES === 'true';
      
      if (isCloudflarePages) {
        // 更激进的代码分割，确保文件大小限制
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            maxSize: 20000, // 降低到20KB
            minSize: 5000,  // 降低到5KB
            cacheGroups: {
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                maxSize: 15000, // 15KB
                minSize: 3000,  // 3KB
                priority: 50,
              },
              aws: {
                test: /[\\/]node_modules[\\/]@aws-sdk[\\/]/,
                name: 'aws-sdk',
                chunks: 'all',
                maxSize: 10000, // 10KB
                minSize: 2000,  // 2KB
                priority: 40,
              },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all',
                maxSize: 15000, // 15KB
                minSize: 3000,  // 3KB
                priority: 20,
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                maxSize: 10000, // 10KB
                minSize: 2000,  // 2KB
              },
            },
          },
          concatenateModules: false,
          minimize: true,
        };
        
        // 更严格的性能限制
        config.performance = {
          hints: 'warning',
          maxEntrypointSize: 20000, // 20KB
          maxAssetSize: 20000,      // 20KB
        };
      } else {
        // 非Cloudflare Pages的配置
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
        
        config.performance = {
          hints: false,
          maxEntrypointSize: Infinity,
          maxAssetSize: Infinity,
        };
      }
      
      // 禁用source map
      config.devtool = false;
    }
    
    return config;
  },
};

export default nextConfig; 