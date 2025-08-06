// Cloudflare Pages Functions 版本的 download-and-upload API
// 专门处理从KIE AI下载图片并上传到R2的完整流程
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    const { kieImageUrl, taskId, fileName } = body;
    
    if (!kieImageUrl) {
      return new Response(JSON.stringify({ error: '缺少KIE图片URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔄 开始下载并上传流程: ${kieImageUrl}, taskId: ${taskId}`);
    
    // 获取 Kie.ai API 密钥
    const kieApiKey = env.KIE_AI_API_KEY;
    if (!kieApiKey) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查R2环境变量
    const requiredVars = [
      'CLOUDFLARE_R2_ACCOUNT_ID',
      'CLOUDFLARE_R2_ACCESS_KEY_ID', 
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      'CLOUDFLARE_R2_BUCKET_NAME'
    ];
    
    const missingVars = requiredVars.filter(varName => !env[varName]);
    if (missingVars.length > 0) {
      return new Response(JSON.stringify({ 
        error: `缺少必要的 R2 环境变量: ${missingVars.join(', ')}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let downloadUrl = kieImageUrl;
    
    // 1. 如果是KIE AI的临时URL，先获取下载直链
    if (kieImageUrl.includes('tempfile.aiquickdraw.com') || kieImageUrl.includes('kie.ai')) {
      console.log('🔗 检测到KIE AI临时URL，获取下载直链...');
      
      const downloadRequestBody: any = { 
        imageUrl: kieImageUrl
      };
      
      if (taskId) {
        downloadRequestBody.taskId = taskId;
      }
      
      const downloadResponse = await fetch('https://api.kie.ai/api/v1/gpt4o-image/download-url', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${kieApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(downloadRequestBody)
      });
      
      if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text();
        console.error(`❌ 获取下载直链失败: ${downloadResponse.status} ${downloadResponse.statusText}`, errorText);
        return new Response(JSON.stringify({ 
          error: '获取下载直链失败',
          status: downloadResponse.status,
          message: downloadResponse.statusText
        }), {
          status: downloadResponse.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const downloadData = await downloadResponse.json();
      downloadUrl = downloadData.data?.downloadUrl || downloadData.downloadUrl || kieImageUrl;
      console.log(`✅ 获取到下载直链: ${downloadUrl}`);
    }
    
    // 2. 下载图片
    console.log(`📥 开始下载图片: ${downloadUrl}`);
    const imageResponse = await fetch(downloadUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`图片下载失败: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    const imageData = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    
    console.log(`✅ 图片下载成功: ${(imageData.byteLength / 1024).toFixed(2)}KB, 类型: ${contentType}`);
    
    // 3. 生成文件名
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const finalFileName = fileName || `generated_${taskId || timestamp}_${randomId}.png`;
    const key = `generated/${finalFileName}`;
    
    console.log(`📤 开始上传到R2: ${key}`);
    
    // 4. 上传到R2 afterimage桶
    const endpoint = `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const bucketName = env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME || env.CLOUDFLARE_R2_BUCKET_NAME;
    const uploadUrl = `${endpoint}/${bucketName}/${key}`;
    
    // 计算payload hash
    const payloadHash = await sha256Hash(imageData);
    
    // 准备签名
    const now = new Date();
    const requestDateTime = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const region = 'auto';
    const service = 's3';
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    
    // 准备headers
    const headers: Record<string, string> = {
      'Host': `${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      'Content-Type': contentType,
      'X-Amz-Date': requestDateTime,
      'X-Amz-Content-Sha256': payloadHash,
      'Content-Length': imageData.byteLength.toString()
    };
    
    // 添加metadata
    const metadata = {
      originalName: finalFileName,
      uploadedAt: new Date().toISOString(),
      fileSize: imageData.byteLength.toString(),
      taskId: taskId || '',
      source: 'kie-download',
      originalUrl: kieImageUrl
    };
    
    Object.entries(metadata).forEach(([key, value]) => {
      headers[`X-Amz-Meta-${key}`] = value;
    });
    
    // 生成规范化的请求字符串
    const canonicalRequest = generateCanonicalRequest('PUT', `/${bucketName}/${key}`, '', headers, payloadHash);
    const canonicalRequestBytes = new TextEncoder().encode(canonicalRequest);
    const canonicalRequestHash = await sha256Hash(canonicalRequestBytes);
    
    // 生成待签名字符串
    const stringToSign = generateStringToSign(algorithm, requestDateTime, credentialScope, canonicalRequestHash);
    
    // 生成签名
    const dateKey = await hmacSha256(`AWS4${env.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`, dateStamp);
    const dateRegionKey = await hmacSha256(dateKey, region);
    const dateRegionServiceKey = await hmacSha256(dateRegionKey, service);
    const signingKey = await hmacSha256(dateRegionServiceKey, 'aws4_request');
    const signature = await hmacSha256(signingKey, stringToSign);
    
    // 构建Authorization header
    const signedHeaders = Object.keys(headers)
      .sort()
      .map(key => key.toLowerCase())
      .join(';');
    
    const authorization = `${algorithm} Credential=${env.CLOUDFLARE_R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    // 创建上传请求
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        ...headers,
        'Authorization': authorization
      },
      body: imageData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`❌ R2 上传失败: ${uploadResponse.status} ${uploadResponse.statusText}`, errorText);
      throw new Error(`R2 上传失败: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }
    
    // 构建公共URL - 使用afterimage桶的公共URL
    const publicUrl = env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL 
      ? `${env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL}/${key}`
      : env.CLOUDFLARE_R2_PUBLIC_URL 
        ? `${env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
        : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${key}`;
    
    console.log(`✅ 成功上传到R2: ${publicUrl}`);
    
    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      key: key,
      fileName: finalFileName,
      size: imageData.byteLength,
      contentType: contentType,
      taskId: taskId,
      originalUrl: kieImageUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ 下载并上传失败:', error);
    return new Response(JSON.stringify({ 
      error: '下载并上传失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 辅助函数
async function sha256Hash(data: ArrayBuffer | Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256(key: string | ArrayBuffer, message: string): Promise<string> {
  const keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key;
  const messageBuffer = new TextEncoder().encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateCanonicalRequest(method: string, uri: string, query: string, headers: Record<string, string>, payloadHash: string): string {
  const canonicalHeaders = Object.entries(headers)
    .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(([key, value]) => `${key.toLowerCase()}:${value.trim()}`)
    .join('\n');
  
  const signedHeaders = Object.keys(headers)
    .sort()
    .map(key => key.toLowerCase())
    .join(';');
  
  return [
    method,
    uri,
    query,
    canonicalHeaders,
    '',
    signedHeaders,
    payloadHash
  ].join('\n');
}

function generateStringToSign(algorithm: string, requestDateTime: string, credentialScope: string, canonicalRequestHash: string): string {
  return [
    algorithm,
    requestDateTime,
    credentialScope,
    canonicalRequestHash
  ].join('\n');
} 