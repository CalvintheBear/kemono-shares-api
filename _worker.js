
// Cloudflare Pages Worker
export default {
  async fetch(request, env, ctx) {
    // 这里可以添加自定义的Worker逻辑
    // 默认情况下，Cloudflare Pages会自动处理Next.js应用
    return new Response('Cloudflare Pages API Worker', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
