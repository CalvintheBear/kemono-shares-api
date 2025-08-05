import { NextRequest, NextResponse } from 'next/server'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'
import { uploadAfterimageToR2 } from '@/lib/afterimage-upload'
import { validateAfterimageR2Config } from '@/lib/r2-afterimage-client'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 开始测试kemono-afterimage桶上传功能')
    
    // 检查配置
    const isConfigured = validateAfterimageR2Config()
    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        error: 'kemono-afterimage桶配置无效'
      }, { status: 400 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: '没有文件'
      }, { status: 400 })
    }
    
    console.log('📁 测试文件信息:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    // 将File转换为Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // 上传到kemono-afterimage桶
    const result = await uploadAfterimageToR2(buffer, `test-${Date.now()}.png`, file.type)
    
    console.log('✅ 测试上传成功:', result)
    
    return NextResponse.json({
      success: true,
      message: 'kemono-afterimage桶上传测试成功',
      result
    })
    
  } catch (error) {
    console.error('❌ kemono-afterimage桶上传测试失败:', error)
    return NextResponse.json({
      success: false,
      error: '上传测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  try {
    console.log('🔍 检查kemono-afterimage桶配置')
    
    const isConfigured = validateAfterimageR2Config()
    
    return NextResponse.json({
      success: true,
      isConfigured,
      message: isConfigured ? 'kemono-afterimage桶配置正确' : 'kemono-afterimage桶配置无效'
    })
    
  } catch (error) {
    console.error('❌ kemono-afterimage桶配置检查失败:', error)
    return NextResponse.json({
      success: false,
      error: '配置检查失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 