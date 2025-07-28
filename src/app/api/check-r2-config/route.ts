import { validateR2Config, getR2ConfigInfo } from '@/lib/r2-client';

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