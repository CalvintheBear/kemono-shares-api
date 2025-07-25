import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // 支持的语言
  locales: ['ja'],
  defaultLocale: 'ja',
  // 关闭路径前缀强制重定向，保留原始 URL
  localePrefix: 'never'
})

export const config = {
  // 仅对应用路由进行国际化处理（排除 _next 等资源）
  matcher: [
    '/((?!_next|favicon.ico|assets|api).*)'
  ]
} 