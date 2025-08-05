// 移除国际化中间件，直接使用根路径
export function middleware() {
  // 不进行任何重定向，直接访问
  return
}

export const config = {
  // 不匹配任何路径，禁用中间件
  matcher: []
} 