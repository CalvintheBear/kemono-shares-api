// Cloudflare Workers 兼容的 R2 客户端
// 不使用 AWS SDK，直接使用 fetch API 和 Web Crypto API

// 使用Web Crypto API进行哈希计算
async function sha256Hash(data: ArrayBuffer | Uint8Array | string): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data);
  } else if (data instanceof Uint8Array) {
    buffer = data.buffer;
  } else {
    buffer = data;
  }
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 使用Web Crypto API进行HMAC计算
async function hmacSha256(key: ArrayBuffer | string, message: string): Promise<ArrayBuffer> {
  let keyBuffer: ArrayBuffer;
  if (typeof key === 'string') {
    keyBuffer = new TextEncoder().encode(key);
  } else {
    keyBuffer = key;
  }
  
  const messageBuffer = new TextEncoder().encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  return await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer);
}

// 生成AWS S3兼容的签名
async function generateS3Signature(stringToSign: string, secretKey: string): Promise<string> {
  const signature = await hmacSha256(secretKey, stringToSign);
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

// 创建R2客户端
export function createR2Client(uploadBucket: any, afterimageBucket: any, env: any) {
  return {
    // 上传到主存储桶
    async uploadToMainBucket(key: string, data: ArrayBuffer, contentType: string, metadata?: Record<string, string>) {
      try {
        // 使用 S3 兼容的 API 端点
         const endpoint = `https://${String(env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim()}.r2.cloudflarestorage.com`;
         const bucketName = String(env.CLOUDFLARE_R2_BUCKET_NAME || '').trim();
        
        // 构建上传 URL
        const uploadUrl = `${endpoint}/${bucketName}/${key}`;
        
        // 计算payload hash
        const payloadHash = await sha256Hash(data);
        
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
           'Host': `${String(env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim()}.r2.cloudflarestorage.com`,
          'X-Amz-Date': requestDateTime,
          'X-Amz-Content-Sha256': payloadHash,
          'Content-Type': contentType,
        };
        
        // 添加元数据
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            headers[`x-amz-meta-${key}`] = value;
          });
        }
        
        // 生成规范化的请求字符串
        const canonicalRequest = generateCanonicalRequest('PUT', `/${bucketName}/${key}`, '', headers, payloadHash);
        const canonicalRequestBytes = new TextEncoder().encode(canonicalRequest);
        const canonicalRequestHash = await sha256Hash(canonicalRequestBytes);
        
        // 生成待签名字符串
        const stringToSign = generateStringToSign(algorithm, requestDateTime, credentialScope, canonicalRequestHash);
        
        // 生成签名
         const dateKey = await hmacSha256(`AWS4${String(env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim()}`, dateStamp);
        const dateRegionKey = await hmacSha256(dateKey, region);
        const dateRegionServiceKey = await hmacSha256(dateRegionKey, service);
        const signingKey = await hmacSha256(dateRegionServiceKey, 'aws4_request');
        const signature = await generateS3Signature(stringToSign, signingKey.toString());
        
        // 构建Authorization header
        const signedHeaders = Object.keys(headers)
          .sort()
          .map(key => key.toLowerCase())
          .join(';');
        
         const authorization = `${algorithm} Credential=${String(env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim()}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        
        // 执行上传
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            ...headers,
            'Authorization': authorization
          },
          body: new Uint8Array(data)
        });
        
        if (!response.ok) {
          throw new Error(`上传失败: ${response.status} ${response.statusText}`);
        }
        
         const publicBase = env.CLOUDFLARE_R2_PUBLIC_URL ? String(env.CLOUDFLARE_R2_PUBLIC_URL).trim() : '';
         const url = publicBase ? `${publicBase}/${key}` : `https://pub-${String(env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim()}.r2.dev/${key}`;
        return { url, key, size: data.byteLength };
      } catch (error) {
        console.error('❌ 上传到主存储桶失败:', error);
        throw error;
      }
    },
    
    // 上传到生成图片存储桶
    async uploadToAfterimageBucket(key: string, data: ArrayBuffer, contentType: string, metadata?: Record<string, string>) {
      try {
        // 使用 S3 兼容的 API 端点
         const endpoint = `https://${String(env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim()}.r2.cloudflarestorage.com`;
         const bucketName = String(env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME || '').trim();
        
        // 构建上传 URL
        const uploadUrl = `${endpoint}/${bucketName}/${key}`;
        
        // 计算payload hash
        const payloadHash = await sha256Hash(data);
        
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
           'Host': `${String(env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim()}.r2.cloudflarestorage.com`,
          'X-Amz-Date': requestDateTime,
          'X-Amz-Content-Sha256': payloadHash,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000', // 1年缓存
        };
        
        // 添加元数据
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            headers[`x-amz-meta-${key}`] = value;
          });
        }
        
        // 生成规范化的请求字符串
        const canonicalRequest = generateCanonicalRequest('PUT', `/${bucketName}/${key}`, '', headers, payloadHash);
        const canonicalRequestBytes = new TextEncoder().encode(canonicalRequest);
        const canonicalRequestHash = await sha256Hash(canonicalRequestBytes);
        
        // 生成待签名字符串
        const stringToSign = generateStringToSign(algorithm, requestDateTime, credentialScope, canonicalRequestHash);
        
        // 生成签名
         const dateKey = await hmacSha256(`AWS4${String(env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim()}`, dateStamp);
        const dateRegionKey = await hmacSha256(dateKey, region);
        const dateRegionServiceKey = await hmacSha256(dateRegionKey, service);
        const signingKey = await hmacSha256(dateRegionServiceKey, 'aws4_request');
        const signature = await generateS3Signature(stringToSign, signingKey.toString());
        
        // 构建Authorization header
        const signedHeaders = Object.keys(headers)
          .sort()
          .map(key => key.toLowerCase())
          .join(';');
        
         const authorization = `${algorithm} Credential=${String(env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim()}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        
        // 执行上传
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            ...headers,
            'Authorization': authorization
          },
          body: new Uint8Array(data)
        });
        
        if (!response.ok) {
          throw new Error(`上传失败: ${response.status} ${response.statusText}`);
        }
        
         const afterBase = env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL ? String(env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL).trim() : '';
         const url = afterBase ? `${afterBase}/${key}` : `https://pub-${String(env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim()}.r2.dev/${key}`;
        return { url, key, size: data.byteLength };
      } catch (error) {
        console.error('❌ 上传到生成图片存储桶失败:', error);
        throw error;
      }
    }
  };
}

// 验证R2配置
export function validateR2Config(): boolean {
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL'
  ];
  
  return requiredVars.every(varName => process.env[varName]);
}

// 验证生成图片R2配置
export function validateAfterimageR2Config(): boolean {
  const requiredVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID', 
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME',
    'CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL'
  ];
  
  return requiredVars.every(varName => process.env[varName]);
}

// 生成唯一文件名
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'jpg';
  return `uploads/${timestamp}-${random}.${extension}`;
}

// 验证图片文件
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { valid: false, error: '文件不存在' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `不支持的文件类型: ${file.type}。支持的类型: ${ALLOWED_TYPES.join(', ')}` 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `文件大小超过限制: ${(file.size / 1024 / 1024).toFixed(2)}MB > ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }

  return { valid: true };
} 