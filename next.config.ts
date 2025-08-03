import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 禁用构建缓存以避免生成超过 25MB 的 webpack 缓存文件
  experimental: {
    webpackBuildWorker: false,
  },
  // 禁用持久化缓存
  distDir: '.next',
  generateBuildId: async () => {
    // 生成随机 build ID 避免缓存
    return Date.now().toString()
  },
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
