import { NextRequest, NextResponse } from 'next/server'
import { validateAfterimageR2Config, getAfterimageR2ConfigInfo } from '@/lib/r2-afterimage-client'

export async function GET(_request: NextRequest) {
  try {
    const isConfigured = validateAfterimageR2Config()
    const configInfo = getAfterimageR2ConfigInfo()

    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        error: '生成图片R2配置不完整',
        configInfo
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: '生成图片R2配置正确',
      configInfo
    })
  } catch (error) {
    console.error('检查生成图片R2配置失败:', error)
    return NextResponse.json({
      success: false,
      error: '配置检查失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 