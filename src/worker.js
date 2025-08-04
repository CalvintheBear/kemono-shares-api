import { createRequestHandler } from '@cloudflare/next-on-pages'

// 创建Next.js请求处理器
const handleRequest = createRequestHandler({
  buildId: process.env.BUILD_ID || 'development',
})

// Workers入口点
export default {
  async fetch(request, env, ctx) {
    try {
      // 处理请求
      return await handleRequest(request, env, ctx)
    } catch (error) {
      console.error('Worker error:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
} 