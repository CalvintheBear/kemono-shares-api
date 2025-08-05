import { NextResponse } from 'next/server'

// 静态导出配置
export const dynamic = 'force-static'
export const revalidate = false

// 静态导出兼容路由
export async function GET() {
  return NextResponse.json({ 
    error: 'API not available in static export mode',
    message: 'This feature requires server-side processing',
    status: 'static_mode'
  }, { status: 501 })
}

export async function POST() {
  return NextResponse.json({ 
    error: 'API not available in static export mode',
    message: 'This feature requires server-side processing',
    status: 'static_mode'
  }, { status: 501 })
}