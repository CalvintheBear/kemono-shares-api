// Cloudflare Workers entry point
const worker = {
  async fetch(_request, _env, _ctx) {
    // 简单的响应示例
    return new Response('Hello from Kemono Shares API!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};

export default worker; 