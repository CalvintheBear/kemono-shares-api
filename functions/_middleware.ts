export async function onRequest(context: any) {
  const request: Request = context.request;
  const origin = request.headers.get('Origin') || '*';

  // 预检请求直接放行
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Vary': 'Origin',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // --- 简单按 IP 限流（按东京时间每日计数），优先用 KV，缺失则回退为短期内存 ---
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    const isPost = request.method === 'POST';
    // 需求：所有 POST 请求，每 IP 每日（东京时区）最多 40 次
    const shouldLimit = isPost;

    if (shouldLimit) {
      const ip = request.headers.get('CF-Connecting-IP')
        || request.headers.get('X-Forwarded-For')
        || 'unknown';

      // 计算东京时区日界桶与距离次日 00:00 JST 的 TTL（秒）
      const nowMs = Date.now();
      const offsetMs = 9 * 60 * 60 * 1000; // JST = UTC+9，无夏令时
      const dayMs = 24 * 60 * 60 * 1000;
      const jstMs = nowMs + offsetMs;
      const jstDayIndex = Math.floor(jstMs / dayMs);
      const nextJstMidnightUtcMs = (jstDayIndex + 1) * dayMs - offsetMs;
      const ttlSeconds = Math.max(1, Math.ceil((nextJstMidnightUtcMs - nowMs) / 1000));

      const limitPerDay = 45;
      const key = `rl:post:${ip}:${jstDayIndex}`;

      const kv = (context.env as any)?.RATE_LIMIT_KV;
      if (kv && typeof kv.get === 'function' && typeof kv.put === 'function') {
        const currentRaw = await kv.get(key);
        const current = parseInt(currentRaw || '0', 10);
        if (current >= limitPerDay) {
          return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' }
          });
        }
        // TTL 到东京次日零点
        await kv.put(key, String(current + 1), { expirationTtl: ttlSeconds });
      } else {
        // 内存回退（边缘实例内短期有效）
        // @ts-ignore: 挂载到全局以复用同实例缓存
        const globalAny: any = globalThis as any;
        if (!globalAny.__rateLimitCountersDailyJst) {
          globalAny.__rateLimitCountersDailyJst = new Map<string, { count: number; expiresAt: number }>();
        }
        const map: Map<string, { count: number; expiresAt: number }> = globalAny.__rateLimitCountersDailyJst;
        const now = nowMs;
        const record = map.get(key);
        if (record && record.expiresAt > now) {
          if (record.count >= limitPerDay) {
            return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
              status: 429,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' }
            });
          }
          record.count += 1;
        } else {
          map.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 });
        }
      }
    }
  } catch (_e) {
    // 忽略限流过程中的非关键错误，继续执行
  }

  // 继续执行目标函数
  const response: Response = await context.next();

  // 为所有响应附加 CORS 头
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', origin);
  newHeaders.set('Vary', 'Origin');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // 安全与SEO相关响应头（HTTPS 强化与轻量安全）
  newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}


