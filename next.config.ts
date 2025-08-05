import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// 根据环境变量确定构建类型
const isCloudflarePages = process.env.CF_PAGES === 'true';
const isRailway = process.env.RAILWAY === 'true';

// 只有在明确设置为Cloudflare Pages时才使用静态导出
const shouldUseStaticExport = isCloudflarePages; // 启用Pages静态导出

const nextConfig: NextConfig = {
  // 根据部署环境设置输出类型
  output: shouldUseStaticExport ? 'export' : undefined,
  distDir: '.next',
  
  // 禁用缓存以确保构建一致性
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
  
  // 性能优化配置
  compress: false,
  productionBrowserSourceMaps: false,
  
  // 静态导出配置（仅用于Cloudflare Pages）
  ...(isCloudflarePages && {
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),
  
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
          maxSize: shouldUseStaticExport ? 20000 : 50000, // Cloudflare Pages使用更小的块
          minSize: shouldUseStaticExport ? 5000 : 10000,
          cacheGroups: {
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              maxSize: shouldUseStaticExport ? 20000 : 20000,
              minSize: shouldUseStaticExport ? 5000 : 10000,
              priority: 50,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              maxSize: shouldUseStaticExport ? 10000 : 50000,
              minSize: shouldUseStaticExport ? 5000 : 10000,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              maxSize: shouldUseStaticExport ? 10000 : 20000,
              minSize: shouldUseStaticExport ? 5000 : 10000,
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
        maxEntrypointSize: shouldUseStaticExport ? 10000 : Infinity,
        maxAssetSize: shouldUseStaticExport ? 10000 : Infinity,
      };
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig); 