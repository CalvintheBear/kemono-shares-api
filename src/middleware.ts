import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // 只支持日语
  locales: ['ja'],
  defaultLocale: 'ja',
  // 关闭路径前缀，直接使用根路径
  localePrefix: 'never'
})

export const config = {
  // 仅对应用路由进行国际化处理（排除 _next 等资源）
  matcher: [
    '/((?!_next|favicon.ico|assets|api|.*\\.).*)'
  ]
} 