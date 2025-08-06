// Cloudflare Pages Functions 版本的 get-generated-url API
// 用于从R2 afterimage桶中获取生成图片的公网URL
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    
    if (!taskId) {
      return new Response(JSON.stringify({ error: '缺少任务ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔍 查询生成图片URL: ${taskId}`);
    
    // 检查R2环境变量
    const requiredVars = [
      'CLOUDFLARE_R2_ACCOUNT_ID',
      'CLOUDFLARE_R2_ACCESS_KEY_ID', 
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      'CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME'
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
    
    // 尝试使用绑定，如果不存在则使用环境变量
    let r2Client;
    if (env.AFTERIMAGE_BUCKET) {
      // 使用绑定
      const { createR2Client } = await import('../../src/lib/r2-client-cloudflare');
      r2Client = createR2Client(env.UPLOAD_BUCKET, env.AFTERIMAGE_BUCKET, env);
      console.log('✅ 使用R2桶绑定');
    } else {
      // 使用环境变量
      console.log('⚠️ 使用环境变量创建 R2 客户端');
      r2Client = createR2ClientFromEnv(env);
    }
    
    // 构建查询URL - 查找包含taskId的文件
    const endpoint = `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const bucketName = env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME;
    const listUrl = `${endpoint}/${bucketName}?list-type=2&prefix=kie-downloads/`;
    
    // 计算签名
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
      'X-Amz-Date': requestDateTime,
      'X-Amz-Content-Sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // 空内容的hash
    };
    
    // 生成规范化的请求字符串
    const canonicalRequest = generateCanonicalRequest('GET', `/${bucketName}`, 'list-type=2&prefix=kie-downloads/', headers, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
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
    
    // 查询文件列表
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: {
        ...headers,
        'Authorization': authorization
      }
    });
    
    if (!listResponse.ok) {
      console.error(`❌ R2 列表查询失败: ${listResponse.status} ${listResponse.statusText}`);
      return new Response(JSON.stringify({ 
        error: '查询R2文件列表失败',
        status: listResponse.status,
        message: listResponse.statusText
      }), {
        status: listResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const listData = await listResponse.text();
    console.log(`✅ R2 列表查询成功:`, listData);
    
    // 解析XML响应，查找包含taskId的文件
    // 使用正则表达式解析XML，因为Cloudflare Workers没有DOMParser
    const keyMatches = listData.match(/<Key>(.*?)<\/Key>/g);
    let foundFile = null;
    
    if (keyMatches) {
      for (const match of keyMatches) {
        const key = match.replace(/<\/?Key>/g, '');
        if (key.includes(taskId)) {
          foundFile = key;
          break;
        }
      }
    }
    
    if (foundFile) {
      // 构建公共URL
      const publicUrl = env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL 
        ? `${env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL}/${foundFile}`
        : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${foundFile}`;
      
      console.log(`✅ 找到生成图片: ${publicUrl}`);
      
      return new Response(JSON.stringify({
        success: true,
        found: true,
        url: publicUrl,
        key: foundFile
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.log(`⚠️ 未找到包含taskId ${taskId} 的文件`);
      
      return new Response(JSON.stringify({
        success: true,
        found: false,
        message: '文件尚未上传到R2'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('❌ 查询生成图片URL失败:', error);
    return new Response(JSON.stringify({ 
      error: '查询生成图片URL失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 辅助函数
async function sha256Hash(data: ArrayBuffer | Uint8Array | string): Promise<string> {
  const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256(key: ArrayBuffer | string, message: string): Promise<ArrayBuffer> {
  const keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key;
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

function generateCanonicalRequest(method: string, uri: string, queryString: string, headers: Record<string, string>, payloadHash: string): string {
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
    queryString,
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

// 使用环境变量创建 R2 客户端
function createR2ClientFromEnv(env: any) {
  return {
    async uploadToAfterimageBucket(key: string, data: ArrayBuffer, contentType: string, metadata?: Record<string, string>) {
      try {
        const endpoint = `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
        const bucketName = env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME;
        const uploadUrl = `${endpoint}/${bucketName}/${key}`;
        
        const payloadHash = await sha256Hash(data);
        
        const now = new Date();
        const requestDateTime = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
        const region = 'auto';
        const service = 's3';
        const algorithm = 'AWS4-HMAC-SHA256';
        const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
        
        const headers: Record<string, string> = {
          'Host': `${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          'Content-Type': contentType,
          'X-Amz-Date': requestDateTime,
          'X-Amz-Content-Sha256': payloadHash,
          'Content-Length': data.byteLength.toString()
        };
        
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            headers[`X-Amz-Meta-${key}`] = value;
          });
        }
        
        const canonicalRequest = generateCanonicalRequest('PUT', `/${bucketName}/${key}`, '', headers, payloadHash);
        const canonicalRequestBytes = new TextEncoder().encode(canonicalRequest);
        const canonicalRequestHash = await sha256Hash(canonicalRequestBytes);
        
        const stringToSign = generateStringToSign(algorithm, requestDateTime, credentialScope, canonicalRequestHash);
        
        const dateKey = await hmacSha256(`AWS4${env.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`, dateStamp);
        const dateRegionKey = await hmacSha256(dateKey, region);
        const dateRegionServiceKey = await hmacSha256(dateRegionKey, service);
        const signingKey = await hmacSha256(dateRegionServiceKey, 'aws4_request');
        const signature = await hmacSha256(signingKey, stringToSign);
        
        const signedHeaders = Object.keys(headers)
          .sort()
          .map(key => key.toLowerCase())
          .join(';');
        
        const authorization = `${algorithm} Credential=${env.CLOUDFLARE_R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            ...headers,
            'Authorization': authorization
          },
          body: data
        });

        if (!response.ok) {
          throw new Error(`R2 上传失败: ${response.status} ${response.statusText}`);
        }
        
        const publicUrl = env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL 
          ? `${env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL}/${key}`
          : `https://pub-${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.dev/${key}`;
        
        return {
          url: publicUrl,
          key,
          success: true
        };
      } catch (error) {
        throw new Error(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  };
}