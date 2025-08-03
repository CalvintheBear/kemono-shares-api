const path = require('path');

module.exports = {
  optimization: {
    // 启用代码分割
    splitChunks: {
      chunks: 'all',
      maxSize: 244000, // 约 250KB，确保每个块都小于 25MB
      cacheGroups: {
        // 分离 React 相关库
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 40,
          enforce: true,
        },
        // 分离 Next.js 相关
        next: {
          test: /[\\/]node_modules[\\/]next[\\/]/,
          name: 'next',
          chunks: 'all',
          priority: 30,
          enforce: true,
        },
        // 分离 AWS SDK
        aws: {
          test: /[\\/]node_modules[\\/]@aws-sdk[\\/]/,
          name: 'aws-sdk',
          chunks: 'all',
          priority: 20,
          enforce: true,
        },
        // 分离其他第三方库
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
        // 分离公共代码
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          enforce: true,
        },
      },
    },
    // 启用模块连接
    concatenateModules: true,
    // 启用副作用优化
    sideEffects: false,
    // 启用最小化
    minimize: true,
  },
  
  // 优化模块解析
  resolve: {
    fallback: {
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
  },
  
  // 外部化大型依赖项
  externals: {
    // 如果某些库可以通过 CDN 加载，可以在这里外部化
  },
  
  // 性能提示
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000, // 500KB
  },
}; 