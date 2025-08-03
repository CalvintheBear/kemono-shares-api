import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime 兼容
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { base64Data, mimeType } = body

    if (!base64Data || !mimeType) {
      return NextResponse.json(
        { error: '缺少必要参数：base64Data 或 mimeType' },
        { status: 400 }
      )
    }

    // 验证是否是有效的base64数据URL
    if (!base64Data.startsWith('data:')) {
      return NextResponse.json(
        { error: '无效的base64数据格式' },
        { status: 400 }
      )
    }

    // 提取base64数据（去掉 data:image/jpeg;base64, 前缀）
    const base64String = base64Data.split(',')[1]
    if (!base64String) {
      return NextResponse.json(
        { error: '无法解析base64数据' },
        { status: 400 }
      )
    }

    // 根据mimeType确定文件扩展名
    const extensionMap: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg', 
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif'
    }

    const extension = extensionMap[mimeType] || 'jpg'
    // Edge Runtime 兼容：使用 crypto.randomUUID()
    const fileName = `${crypto.randomUUID()}.${extension}`

    // Edge Runtime 中不支持文件系统操作
    // 直接返回处理后的数据，由前端使用 blob URL 或直接使用 base64
    const fileUrl = base64Data // 直接返回 base64 数据作为 URL

    console.log('临时数据已处理:', { fileName, mimeType })

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName,
      mimeType,
      isBase64: true // 标识这是 base64 数据而不是实际文件 URL
    })

  } catch (error) {
    console.error('处理临时数据失败:', error)
    return NextResponse.json(
      { error: '处理临时数据失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 