import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 根据环境变量决定是否静态导出
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  
  // 静态导出配置
  trailingSlash: true,
  distDir: process.env.STATIC_EXPORT === 'true' ? 'out' : '.next',
  
  // 图片优化配置
  images: {
    // 允许外部图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-d00e7b41917848d1a8403c984cb62880.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '2kawaii.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 禁用图片优化（用于外部图片）
    unoptimized: true,
  },
  
  // 重定向配置（仅在非静态导出时生效）
  async redirects() {
    if (process.env.STATIC_EXPORT === 'true') {
      return []
    }
    return [
      {
        source: '/',
        destination: '/workspace',
        permanent: false,
      },
    ]
  },
  
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 构建配置
  typescript: {
    // 构建时忽略TypeScript错误
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
}

export default nextConfig 