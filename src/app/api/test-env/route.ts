import { NextRequest, NextResponse } from 'next/server'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    const envVars = {
      KIE_AI_API_KEY: process.env.KIE_AI_API_KEY,
      KIE_AI_USER_ID: process.env.KIE_AI_USER_ID,
      KIE_AI_4O_BASE_URL: process.env.KIE_AI_4O_BASE_URL,
      IMGBB_API_KEY: process.env.IMGBB_API_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV
    }

    console.log('🔍 环境变量详细检查:')
    Object.entries(envVars).forEach(([key, value]) => {
      if (key.includes('KEY') || key.includes('DATABASE_URL')) {
        console.log(`- ${key}:`, value ? `${String(value).substring(0, 8)}...` : '❌ 未设置')
      } else {
        console.log(`- ${key}:`, value || '❌ 未设置')
      }
    })

    return NextResponse.json({
      success: true,
      environment: {
        KIE_AI_API_KEY: envVars.KIE_AI_API_KEY ? `${envVars.KIE_AI_API_KEY.substring(0, 8)}...` : null,
        KIE_AI_USER_ID: envVars.KIE_AI_USER_ID,
        KIE_AI_4O_BASE_URL: envVars.KIE_AI_4O_BASE_URL,
        IMGBB_API_KEY: envVars.IMGBB_API_KEY ? `${envVars.IMGBB_API_KEY.substring(0, 8)}...` : null,
        DATABASE_URL: envVars.DATABASE_URL ? 'configured' : null,
        NODE_ENV: envVars.NODE_ENV,
        hasAllRequired: !!(envVars.KIE_AI_API_KEY && envVars.KIE_AI_USER_ID)
      }
    })
    
  } catch (error) {
    console.error('环境变量测试失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 