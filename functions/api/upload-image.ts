import { createR2Client, generateUniqueFileName, validateImageFile } from '../../src/lib/r2-client-cloudflare';

// Cloudflare R2 类型定义
interface R2Bucket {
  put(key: string, value: ArrayBuffer, options?: any): Promise<void>;
  get(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

export async function onRequestPost({ 
  request, 
  env 
}: { 
  request: Request; 
  env: { 
    R2_BUCKET: R2Bucket; 
    R2_AFTERIMAGE_BUCKET: R2Bucket; 
  } 
}) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: '缺少文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证文件
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 创建 R2 客户端
    const r2Client = createR2Client(env.R2_BUCKET, env.R2_AFTERIMAGE_BUCKET);
    
    // 生成唯一文件名
    const key = generateUniqueFileName(file.name);
    
    // 转换为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    console.log(`📤 开始上传到Cloudflare R2: ${key} (${(file.size / 1024).toFixed(2)}KB)`);

    // 上传到 R2
    const result = await r2Client.uploadToMainBucket(
      key,
      arrayBuffer,
      file.type,
      {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size.toString(),
      }
    );
    
    console.log(`✅ 上传成功: ${result.url}`);
    
    return new Response(JSON.stringify({
      fileUrl: result.url,
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      key: result.key,
      message: `✅ 上传到Cloudflare R2成功，文件URL: ${result.url}`
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ 文件上传错误:', errorMessage);
    return new Response(JSON.stringify({ error: `文件上传失败: ${errorMessage}` }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
}

// 支持OPTIONS请求（CORS预检）
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 