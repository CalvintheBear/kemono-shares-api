import { NextRequest, NextResponse } from 'next/server'
import { validateR2Config, getR2ConfigInfo } from '@/lib/r2-client'

export async function GET(_request: NextRequest) {
  try {
    const isConfigValid = validateR2Config()
    const configInfo = getR2ConfigInfo()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      r2Config: {
        isValid: isConfigValid,
        info: configInfo,
        status: isConfigValid ? 'ready' : 'incomplete'
      },
      recommendations: {
        ifIncomplete: [
          '设置CLOUDFLARE_R2_ACCOUNT_ID环境变量',
          '设置CLOUDFLARE_R2_ACCESS_KEY_ID环境变量',
          '设置CLOUDFLARE_R2_SECRET_ACCESS_KEY环境变量',
          '设置CLOUDFLARE_R2_BUCKET_NAME环境变量',
          '设置CLOUDFLARE_R2_PUBLIC_URL环境变量'
        ],
        ifReady: [
          '可以开始使用Cloudflare R2图片上传功能',
          '建议测试上传功能以确保配置正确'
        ]
      }
    })
  } catch (error) {
    console.error('检查R2配置失败:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check R2 configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 