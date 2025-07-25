import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

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
    const fileName = `${randomUUID()}.${extension}`

    // 创建临时文件目录
    const tempDir = path.join(process.cwd(), 'public', 'temp')
    try {
      await mkdir(tempDir, { recursive: true })
    } catch {
      // 目录可能已存在，忽略错误
    }

    // 将base64数据转换为Buffer并写入文件
    const buffer = Buffer.from(base64String, 'base64')
    const filePath = path.join(tempDir, fileName)
    await writeFile(filePath, buffer)

    // 生成可访问的URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const fileUrl = `${protocol}://${host}/temp/${fileName}`

    console.log('临时文件已创建:', { fileName, fileUrl, mimeType })

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName,
      mimeType
    })

  } catch (error) {
    console.error('创建临时文件失败:', error)
    return NextResponse.json(
      { error: '创建临时文件失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 