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
    
    // 获取 Kie.ai API 密钥
    const kieApiKey = env.KIE_AI_API_KEY;
    if (!kieApiKey) {
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
    try {
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

      if (!uploadResult) {
        throw new Error('R2 上传返回空结果');
      }

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

 