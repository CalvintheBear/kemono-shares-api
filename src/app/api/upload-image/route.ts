import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToR2 } from '@/lib/image-upload';

// Cloudflare Pages 需要 Edge Runtime
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ success: false, error: '没有文件' }, { status: 400 });
    }
    const result = await uploadImageToR2(file);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : '未知错误' }, { status: 500 });
  }
} 