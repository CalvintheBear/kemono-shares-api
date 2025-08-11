export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  // 仅为静态导出提供空参数，实际详情页由 CSR + _redirects 回退
  return []
}

// 为静态导出提供空参数，避免 next export 报错。
// Cloudflare Pages 静态部署通过 _redirects 将 /share/* 回退到查询参数方案。

export default function generateStaticParams() {
  return []
}


