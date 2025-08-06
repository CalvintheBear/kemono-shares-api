import { generateUniqueFileName, validateImageFile } from '../../src/lib/r2-client-cloudflare';

// 生成AWS S3兼容的签名
function generateS3Signature(stringToSign: string, secretKey: string): string {
  const crypto = require('crypto');
  return crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');
}

// 生成规范化的请求字符串
function generateCanonicalRequest(method: string, uri: string, queryString: string, headers: Record<string, string>, payloadHash: string): string {
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map(key => `${key.toLowerCase()}:${headers[key].trim()}`)
    .join('\n') + '\n';
  
  const signedHeaders = Object.keys(headers)
    .sort()
    .map(key => key.toLowerCase())
    .join(';');
  
  return [
    method,
    uri,
    queryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');
}

// 生成待签名字符串
function generateStringToSign(algorithm: string, requestDateTime: string, credentialScope: string, canonicalRequestHash: string): string {
  return [
    algorithm,
    requestDateTime,
    credentialScope,
    canonicalRequestHash
  ].join('\n');
}

// 使用环境变量创建 R2 客户端
function createR2ClientFromEnv(env: any) {
  // 检查必要的环境变量
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME'
  ];
  
  const missingVars = requiredVars.filter(varName => !env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`缺少必要的 R2 环境变量: ${missingVars.join(', ')}`);
  }

  return {
    // 上传到主存储桶
    async uploadToMainBucket(key: string, data: ArrayBuffer, contentType: string, metadata?: Record<string, string>) {
      try {
        // 使用 S3 兼容的 API 端点
        const endpoint = `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
        const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME;
        
        // 构建上传 URL
        const uploadUrl = `${endpoint}/${bucketName}/${key}`;
        
        // 计算payload hash
        const crypto = require('crypto');
        const payloadHash = crypto.createHash('sha256').update(Buffer.from(data)).digest('hex');
        
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
          'Content-Length': data.byteLength.toString()
        };
        
        // 添加metadata
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            headers[`X-Amz-Meta-${key}`] = value;
          });
        }
        
        // 生成规范化的请求字符串
        const canonicalRequest = generateCanonicalRequest('PUT', `/${bucketName}/${key}`, '', headers, payloadHash);
        const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
        
        // 生成待签名字符串
        const stringToSign = generateStringToSign(algorithm, requestDateTime, credentialScope, canonicalRequestHash);
        
        // 生成签名
        const dateKey = crypto.createHmac('sha256', `AWS4${env.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`).update(dateStamp).digest();
        const dateRegionKey = crypto.createHmac('sha256', dateKey).update(region).digest();
        const dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update(service).digest();
        const signingKey = crypto.createHmac('sha256', dateRegionServiceKey).update('aws4_request').digest();
        const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
        
        // 构建Authorization header
        const signedHeaders = Object.keys(headers)
          .sort()
          .map(key => key.toLowerCase())
          .join(';');
        
        const authorization = `${algorithm} Credential=${env.CLOUDFLARE_R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        
        // 创建上传请求
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            ...headers,
            'Authorization': authorization
          },
          body: data
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ R2 上传失败: ${response.status} ${response.statusText}`, errorText);
          throw new Error(`R2 上传失败: ${response.status} ${response.statusText}`);
        }
        
        // 构建公共URL
        const publicUrl = env.CLOUDFLARE_R2_PUBLIC_URL 
          ? `${env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
          : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${key}`;
        
        console.log(`✅ R2 上传成功: ${publicUrl}`);
        
        return {
          url: publicUrl,
          key,
          success: true
        };
      } catch (error) {
        console.error('❌ 上传到主存储桶失败:', error);
        throw new Error(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  };
}

export async function onRequestPost({ 
  request, 
  env 
}: { 
  request: Request; 
  env: any 
}) {
  try {
    // 调试：检查环境变量和绑定
    console.log('🔍 调试信息:');
    console.log('- R2_BUCKET 绑定存在:', !!env.R2_BUCKET);
    console.log('- R2_AFTERIMAGE_BUCKET 绑定存在:', !!env.R2_AFTERIMAGE_BUCKET);
    console.log('- CLOUDFLARE_R2_BUCKET_NAME:', env.CLOUDFLARE_R2_BUCKET_NAME);
    console.log('- CLOUDFLARE_R2_ACCOUNT_ID:', env.CLOUDFLARE_R2_ACCOUNT_ID);
    console.log('- CLOUDFLARE_R2_ACCESS_KEY_ID 存在:', !!env.CLOUDFLARE_R2_ACCESS_KEY_ID);
    
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

    // 尝试使用绑定，如果不存在则使用环境变量
    let r2Client;
    if (env.R2_BUCKET) {
      // 使用绑定
      const { createR2Client } = await import('../../src/lib/r2-client-cloudflare');
      r2Client = createR2Client(env.R2_BUCKET, env.R2_AFTERIMAGE_BUCKET);
    } else {
      // 使用环境变量
      console.log('⚠️ 使用环境变量创建 R2 客户端');
      r2Client = createR2ClientFromEnv(env);
    }
    
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