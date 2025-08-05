import { NextRequest, NextResponse } from 'next/server'
import { uploadImageWithFallback } from '@/lib/image-upload-fallback'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'

// 禁用静态生成，确保只在运行时执行
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: '没有文件' 
      }, { status: 400 });
    }

    console.log('📤 开始上传图片:', file.name, file.type, file.size);

    const result = await uploadImageWithFallback(file);
    
    console.log('✅ 图片上传成功:', {
      url: result.url,
      source: result.source,
      size: file.size
    });

    return NextResponse.json({ 
      success: true, 
      url: result.url,
      key: result.key,
      source: result.source,
      size: file.size
    });

  } catch (error) {
    console.error('❌ 图片上传失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
} 