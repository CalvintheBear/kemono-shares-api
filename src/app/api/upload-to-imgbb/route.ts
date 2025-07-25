import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { base64Data } = body

    if (!base64Data) {
      return NextResponse.json(
        { error: '缺少base64数据' },
        { status: 400 }
      )
    }

    // 提取base64字符串（去掉 data:image/xxx;base64, 前缀）
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data

    // 使用ImgBB API上传图片
    const imgbbApiKey = process.env.IMGBB_API_KEY || 'f62c400dfa7cffdbe66ebcdbf6f2d783' // 使用提供的真实API密钥
    
    const formData = new FormData()
    formData.append('image', base64String)

    console.log('正在上传图片到ImgBB...')
    
    // 根据官方文档，API密钥应该在URL参数中
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('ImgBB上传失败:', errorData)
      throw new Error(`ImgBB API错误: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      const imageUrl = result.data.url
      console.log('图片上传成功:', imageUrl)
      
      return NextResponse.json({
        success: true,
        url: imageUrl,
        deleteUrl: result.data.delete_url
      })
    } else {
      throw new Error('ImgBB返回失败状态')
    }

  } catch (error) {
    console.error('图片上传到ImgBB失败:', error)
    
    // 如果ImgBB失败，尝试其他免费服务或返回错误
    return NextResponse.json(
      { 
        error: '图片上传失败', 
        details: error instanceof Error ? error.message : String(error),
        suggestion: '请尝试使用较小的图片文件或稍后重试'
      },
      { status: 500 }
    )
  }
} 