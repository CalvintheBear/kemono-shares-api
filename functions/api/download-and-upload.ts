// Cloudflare Pages Functions 版本的 download-and-upload API
// 专门处理从KIE AI下载图片并上传到R2的完整流程
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const body = await request.json();
    // 兼容两种字段：url (新版) 或 imageUrl (旧版)
    const { url: incomingUrl, kieImageUrl, taskId, fileName } = body;
    const imageUrl: string = (kieImageUrl ?? incomingUrl) as string;
    
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: '缺少图片URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔄 开始下载并上传流程: ${imageUrl}, taskId: ${taskId}`);
    
    // 获取 Kie.ai API 密钥池（最多5个），并在并发下做分流+回退
    const keyPool = [
      env.KIE_AI_API_KEY,
      env.KIE_AI_API_KEY_2,
      env.KIE_AI_API_KEY_3,
      env.KIE_AI_API_KEY_4,
      env.KIE_AI_API_KEY_5,
    ].filter((k: string | undefined) => !!k) as string[]
    if (keyPool.length === 0) {
      return new Response(JSON.stringify({ error: 'Kie.ai API 密钥未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查R2绑定
    const bucket = env.AFTERIMAGE_BUCKET;
    if (!bucket) {
      return new Response(JSON.stringify({ 
        error: '缺少R2桶绑定: AFTERIMAGE_BUCKET' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 检查公共URL配置
    if (!env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL) {
      return new Response(JSON.stringify({ 
        error: '缺少R2公共URL配置: CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let downloadUrl = imageUrl;
    
    // 1. 如果是KIE AI的临时URL，先获取下载直链
    if (imageUrl.includes('tempfile.aiquickdraw.com') || imageUrl.includes('kie.ai')) {
      console.log('🔗 检测到KIE AI临时URL，获取下载直链...');
      
      const downloadRequestBody: any = { 
        url: imageUrl
      };
      
      if (taskId) {
        downloadRequestBody.taskId = taskId;
      }
      
      console.log(`📤 发送请求到KIE AI:`, JSON.stringify(downloadRequestBody, null, 2));
      
      // 采用密钥池随机起点轮询回退，提升并发分流能力
      let downloadResponse: Response | null = null
      const start = Math.floor(Math.random() * keyPool.length)
      let lastErrText = ''
      for (let i = 0; i < keyPool.length; i++) {
        const key = keyPool[(start + i) % keyPool.length]
        try {
          const resp = await fetch('https://api.kie.ai/api/v1/gpt4o-image/download-url', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadRequestBody)
          })
          if (resp.ok) {
            downloadResponse = resp
            console.log(`[KEY OK] 下载直链使用密钥#${(start + i) % keyPool.length + 1}`)
            break
          } else {
            lastErrText = await resp.text()
            console.warn(`[KEY FAIL] 下载直链密钥#${(start + i) % keyPool.length + 1} 响应 ${resp.status} ${resp.statusText}`)
          }
        } catch (e) {
          lastErrText = e instanceof Error ? e.message : String(e)
          console.warn(`[KEY ERROR] 下载直链密钥#${(start + i) % keyPool.length + 1} 异常:`, lastErrText)
        }
      }

      if (!downloadResponse) {
        return new Response(JSON.stringify({ error: '获取下载直链失败', details: lastErrText }), { status: 500, headers: { 'Content-Type': 'application/json' } })
      }

      if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text();
        console.error(`❌ 获取下载直链失败: ${downloadResponse.status} ${downloadResponse.statusText}`, errorText);
        return new Response(JSON.stringify({ 
          error: '获取下载直链失败',
          status: downloadResponse.status,
          message: downloadResponse.statusText,
          details: errorText
        }), {
          status: downloadResponse.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const downloadData = await downloadResponse.json();
      console.log(`✅ KIE AI 下载URL API 响应:`, downloadData);
      
      // 根据KIE AI官方文档，响应格式是 { code: 200, msg: "success", data: "download_url" }
      downloadUrl = downloadData.data || downloadData.downloadUrl || imageUrl;
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
    
    // 3. 生成文件名和对象键
    const timestamp = Date.now();
    const randomId = crypto.randomUUID ? crypto.randomUUID().substring(0, 8) : Math.random().toString(36).substring(2, 8);
    const finalFileName = fileName || `generated_${taskId || timestamp}_${randomId}.png`;
    const key = `generated/${finalFileName}`;
    
    console.log(`📤 开始上传到R2: ${key}`);
    
    // 4. 使用R2 Binding上传到afterimage桶
    // 简单重试上传，防抖动/瞬断
    const retry = async (fn: () => Promise<any>, attempts = 3, baseDelayMs = 250) => {
      let lastErr: any;
      for (let i = 0; i < attempts; i++) {
        try { return await fn(); } catch (e) {
          lastErr = e;
          await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, i)));
        }
      }
      throw lastErr;
    };

    try {
      await retry(async () => {
        const uploadResult = await bucket.put(key, imageData, {
          httpMetadata: { 
            contentType: contentType 
          },
          customMetadata: {
            originalName: finalFileName,
            uploadedAt: new Date().toISOString(),
            fileSize: imageData.byteLength.toString(),
            taskId: taskId || '',
            source: 'kie-download',
            originalUrl: imageUrl
          }
        });
        if (!uploadResult) throw new Error('R2 上传返回空结果');
      });
      console.log(`✅ R2上传成功，对象键: ${key}`);
    } catch (uploadError) {
      console.error(`❌ R2 上传失败:`, uploadError);
      throw new Error(`R2 上传失败: ${uploadError instanceof Error ? uploadError.message : '未知错误'}`);
    }
    
    // 5. 构建公共URL
    const publicUrl = `${env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL}/${key}`;
    
    console.log(`✅ 成功上传到R2: ${publicUrl}`);
    
    return new Response(JSON.stringify({
      success: true,
      publicUrl: publicUrl, // 保持向后兼容
      url: publicUrl,
      key: key,
      fileName: finalFileName,
      size: imageData.byteLength,
      contentType: contentType,
      taskId: taskId,
      originalUrl: imageUrl
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

 