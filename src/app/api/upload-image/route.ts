import { NextRequest, NextResponse } from 'next/server'
// 移除本地数据库依赖，完全依赖 ImgBB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: '缺少文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只支持图片文件' },
        { status: 400 }
      )
    }

    // 验证文件大小 (最大 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过 10MB' },
        { status: 400 }
      )
    }

    console.log('准备上传文件到imgbb:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })

    // 直接调用ImgBB API，不经过内部路由
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    
    const imgbbApiKey = process.env.IMGBB_API_KEY || 'f62c400dfa7cffdbe66ebcdbf6f2d783'
    
    const formData2 = new FormData()
    formData2.append('image', base64)
    
    console.log('正在直接调用ImgBB API...')
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData2
    })

    const result = await response.json()
    
    if (result.success) {
      const fileUrl = result.data.url
      console.log('✅ 上传到imgbb成功:', fileUrl)
      return NextResponse.json({
        fileUrl,
        success: true,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        message: `✅ 上传到imgbb成功，文件URL: ${fileUrl}`
      })
    } else {
      console.error('❌ ImgBB API错误:', result)
      return NextResponse.json(
        { error: 'ImgBB上传失败', details: result.error || result },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('文件上传错误:', errorMessage)
    console.error('详细错误对象:', error)
    return NextResponse.json(
      { error: `文件上传失败: ${errorMessage}` },
      { status: 500 }
    )
  }
} 