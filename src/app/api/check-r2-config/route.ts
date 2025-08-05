import { validateR2Config, getR2ConfigInfo } from '@/lib/r2-client';

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'

// 禁用静态生成，确保只在运行时执行
export const runtime = 'nodejs'

export async function GET(_request: Request) {
  try {
    // 检查R2配置
    const info = await getR2ConfigInfo()
    const valid = await validateR2Config()
    return new Response(JSON.stringify({ valid, info }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : '未知错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 