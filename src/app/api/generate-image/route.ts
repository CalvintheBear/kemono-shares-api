import { NextRequest, NextResponse } from 'next/server'


// 静态导出配置
export const dynamic = 'force-static'
export const revalidate = false

// 静态导出环境下返回空路由
export async function POST(_request: NextRequest) {
  return NextResponse.json({ 
    error: 'API not available in static export mode',
    message: 'This feature requires server-side processing'
  }, { status: 501 })
}