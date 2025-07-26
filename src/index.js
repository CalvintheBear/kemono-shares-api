export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (url.pathname === '/api/shares') {
      try {
           const list = await env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME.list({ prefix: 'kie-downloads/' });
        const data = list.objects
          .filter(obj => obj.key.includes('share-'))
          .map(obj => {
            const fileName = obj.key.replace('kie-downloads/', '');
            const shareId = fileName.replace(/\.(png|jpg|jpeg)$/i, '');
            return {
              shareId: shareId,
              imageUrl: `https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/${obj.key}`,
              fileName: fileName,
              uploaded: obj.uploaded,
              size: obj.size
            };
          })
          .sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
        return new Response(JSON.stringify({
          success: true,
          data: data,
          total: data.length
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=60'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to fetch shares data',
          details: error.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};
