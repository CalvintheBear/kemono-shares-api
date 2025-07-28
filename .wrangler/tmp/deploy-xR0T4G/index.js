var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApiRequest(request, env, ctx);
    }
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/static/")) {
      return env.ASSETS.fetch(request);
    }
    return new Response("Kemono Shares API is running!", {
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
};
async function handleApiRequest(request, _env, _ctx) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  return new Response(JSON.stringify({
    message: "Kemono Shares API",
    endpoint: url.pathname,
    method: request.method,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
__name(handleApiRequest, "handleApiRequest");
var index_default = worker;
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
