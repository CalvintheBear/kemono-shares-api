// 为静态导出提供空参数，避免 next export 报错。
// Cloudflare Pages 静态部署通过 _redirects 将 /share/* 回退到查询参数方案。

export default function generateStaticParams() {
  return []
}


