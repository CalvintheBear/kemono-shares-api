// Cloudflare Workers entry point
export default {
  async fetch(request, env, ctx) {
    // 简单的响应示例
    return new Response('Hello from Kemono Shares API!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
}; 