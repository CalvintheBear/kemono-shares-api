import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToR2 } from '@/lib/image-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只支持图片文件' }, { status: 400 });
    }

    // 验证文件大小 (最大 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    // 上传到Cloudflare R2
    const result = await uploadImageToR2(file, file.name);
    
    return NextResponse.json({
      fileUrl: result.url,
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      key: result.key,
      message: `✅ 上传到Cloudflare R2成功，文件URL: ${result.url}`
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('文件上传错误:', errorMessage);
    return NextResponse.json(
      { error: `文件上传失败: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// 支持OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}