### 2kawaii Next.js + Cloudflare Pages Functions 全链路接口与数据流设计文档

本文面向新加入的开发者，系统性梳理了项目的后端 API（Cloudflare Pages Functions）与前端调用关系、R2/KV 的读写规则，以及从用户操作到页面渲染的全流程数据流。阅读完本文件，你可以迅速掌握各模块的数据来源、流转和落地方式。

---

## 概览与术语

- **技术栈**
  - 前端：Next.js App Router（`src/app`）、客户端组件为主（如 `src/components/Workspace.tsx`）
  - 后端：Cloudflare Pages Functions（`functions/api`），按文件即路由
  - 存储：
    - Cloudflare R2：对象存储，分主上传桶与生成图专用桶
      - 绑定名：`env.UPLOAD_BUCKET`（主上传）/ `env.AFTERIMAGE_BUCKET`（生成图）
      - 直链前缀：`env.CLOUDFLARE_R2_PUBLIC_URL` / `env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL`
    - Cloudflare KV：分享数据（Share）持久化
      - 绑定名：`env.SHARE_DATA_KV`
      - REST 回退：`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`(或 `CLOUDFLARE_R2_ACCOUNT_ID`) + `SHARE_DATA_KV_NAMESPACE_ID`
- **第三方服务**
  - Kie.ai（图片生成、记录查询、下载直链）
  - 可选上传回退：ImgBB、Cloudinary（仅前端直传兜底）

- **中间件**
  - `functions/_middleware.ts`：统一 CORS（含预检响应）、HEADERS 注入

---

## 一、后端 API 分析（functions/api）

下表为 API 总览，详表见各小节：

- 生成与资源流转类
  - POST `/api/generate-image`（密钥池回退，支持 `filesUrl` 与回调）
  - GET `/api/image-details`
  - POST `/api/download-url`（密钥池回退，KIE 临时直链）
  - POST `/api/download-and-upload`（下载后上传至 R2 `generated/` 前缀并返回 `publicUrl`）
  - GET `/api/get-generated-url`（S3 v4 列举反查；当前前缀为 `kie-downloads/`，建议统一）
  - POST `/api/upload-image`
  - POST `/api/flux-kontext/generate`（Flux 模型：Pro/Max）
  - GET `/api/flux-kontext/image-details`（Flux 任务详情）
  - POST `/api/callback/flux-kontext`（Flux 回调 → R2 永久化）
  - POST `/api/callback/image-generated`

- 分享与列表类
  - POST/GET `/api/share`
  - GET `/api/share/[id]`
  - GET `/api/share/list`
  - GET `/api/share/latest`
  - GET `/api/sitemap-share`

- 其他
  - GET `/api/check-r2-config`
  - GET `/api/debug-env`
  - GET `/api/task-status`（示例/占位）

### 统一中间件：CORS

- 文件：`functions/_middleware.ts`
- 作用：OPTIONS 预检直接 200，所有响应统一注入跨域头：
  - `Access-Control-Allow-Origin`: 请求 Origin 或 `*`
  - `Access-Control-Allow-Methods`: GET, POST, PUT, DELETE, OPTIONS
  - `Access-Control-Allow-Headers`: Content-Type, Authorization
  - `Access-Control-Max-Age`: 86400

---

### 1) POST /api/generate-image

- 文件：`functions/api/generate-image.ts`
- 方法与路径：POST `/api/generate-image`
- 请求体（JSON）：
  - `prompt: string` 必填
  - `style?: string`
  - `size?: string` 比例，如 `"1:1" | "3:2" | "2:3"`；若传像素值会被转换
  - `mode?: 'image-to-image' | 'template' | 'template-mode' | 'text-to-image'`
  - `fileUrl?: string` 当 `mode` 为图生图/模板时传（服务端会转换为 KIE 所需的 `filesUrl: string[]`）
  - `enhancePrompt?: boolean`
- 响应（JSON）：`{ success: true, taskId: string, status?: string, data: any }`
- 外部调用：Kie.ai `POST https://api.kie.ai/api/v1/gpt4o-image/generate`（最多 5 个 API Key 轮询回退）
- 回调设置：若存在 `env.NEXT_PUBLIC_APP_URL`，将 `callBackUrl` 指向 `{APP_URL}/api/callback/image-generated`
- R2/KV：本接口不直接操作 R2/KV

---

### 1a) POST /api/flux-kontext/generate

- 文件：`functions/api/flux-kontext/generate.ts`
- 方法与路径：POST `/api/flux-kontext/generate`
- 请求体（JSON）：
  - `prompt: string`
  - `aspectRatio?: string` 比例，如 `"1:1" | "4:3" | "3:4" | "16:9" | "9:16" `
  - `inputImage?: string` 以图编辑时传（参考图 URL）
  - `model: 'flux-kontext-pro' | 'flux-kontext-max'`
  - `enableTranslation?: boolean`（默认 true）
  - `promptUpsampling?: boolean`（可映射前端的 `enhancePrompt`）
  - `outputFormat?: 'jpeg' | 'png'`（默认 `jpeg`）
- 响应（JSON）：`{ success: true, taskId: string }`
- 外部调用：Kie.ai `POST https://api.kie.ai/api/v1/flux/kontext/generate`
- 回调设置：若存在 `env.NEXT_PUBLIC_APP_URL`，将 `callBackUrl` 指向 `{APP_URL}/api/callback/flux-kontext`

---

### 2) GET /api/image-details

- 文件：`functions/api/image-details.ts`
- 方法与路径：GET `/api/image-details?taskId=...`
- 查询参数：`taskId: string` 必填
- 响应（JSON）：`{ success: true, data: KieApiRecordInfoRaw }`（含 `status`, `response.resultUrls` 等）
- 外部调用：Kie.ai `GET /gpt4o-image/record-info?taskId=...`
- R2/KV：无

---

### 2a) GET /api/flux-kontext/image-details

- 文件：`functions/api/flux-kontext/image-details.ts`
- 方法与路径：GET `/api/flux-kontext/image-details?taskId=...`
- 查询参数：`taskId: string` 必填
- 响应（JSON）：标准化后的结构（服务端已做兼容）：
  - `status: 'GENERATING' | 'SUCCESS' | 'FAILED'`
  - `resultUrls: string[]`（兼容 `result_urls/resultImageUrl`）
  - `errorMessage?: string`
- 外部调用：Kie.ai `GET /flux/kontext/record-info?taskId=...`

---

### 3) POST /api/download-url

- 文件：`functions/api/download-url.ts`
- 方法与路径：POST `/api/download-url`
- 请求体（JSON）：`{ url: string, taskId?: string }`
- 响应（JSON）：
  - 非 KIE 临时 URL：`{ success: true, downloadUrl: url, isDirectUrl: true }`
  - KIE 临时 URL：调用直链 API 返回 `{ success: true, downloadUrl, originalUrl, taskId, expiresIn: '20 minutes' }`
- 外部调用：Kie.ai `POST /gpt4o-image/download-url`
- R2/KV：无

---

### 4) POST /api/download-and-upload

- 文件：`functions/api/download-and-upload.ts`
- 方法与路径：POST `/api/download-and-upload`
- 请求体（JSON）：`{ url?: string, kieImageUrl?: string, taskId?: string, fileName?: string }`
- 逻辑：
  - 如 URL 属于 `kie.ai` 或 `tempfile.aiquickdraw.com`：先获取直链
  - 下载图片二进制 → 上传到 `env.AFTERIMAGE_BUCKET`
  - Key 规则：`generated/{finalFileName}`；默认 `generated_${taskId|timestamp}_${random}.png`
  - 公网：`${env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL}/{key}`
- 响应（JSON）：`{ success: true, publicUrl, url, key, fileName, size, contentType, taskId, originalUrl }`
- R2：写入（`customMetadata` 包含 `originalName, uploadedAt, fileSize, taskId, source, originalUrl`）
- KV：无

---

### 5) GET /api/get-generated-url

- 文件：`functions/api/get-generated-url.ts`
- 方法与路径：GET `/api/get-generated-url?taskId=...`
- 查询参数：`taskId: string` 必填
- 逻辑：使用 S3 v4 签名列举 R2 Afterimage 桶，基于前缀查找匹配 `taskId` 的 Key
- 注意：当前实现前缀为 `kie-downloads/`，而上传默认为 `generated/`，建议统一或兼容多前缀
- 响应（JSON）：
  - 找到：`{ success: true, found: true, url, key }`
  - 未找到：`{ success: true, found: false, message: '文件尚未上传到R2' }`

---

### 6) POST /api/upload-image + OPTIONS

- 文件：`functions/api/upload-image.ts`
- 方法与路径：POST `/api/upload-image`（`OPTIONS` 预检同路由）
- 请求体：`multipart/form-data`，字段 `file`
- 逻辑：
  - 优先使用绑定 `env.UPLOAD_BUCKET.put`
  - 否则使用 `CLOUDFLARE_R2_*` 环境变量走 S3 v4 签名直传
  - Key 规则：`uploads/{timestamp}-{random}.{ext}`（`generateUniqueFileName`）
- 响应（JSON）：`{ success, fileUrl, fileName, fileType, fileSize, key, message }`

---

### 7) POST /api/callback/image-generated

- 文件：`functions/api/callback/image-generated.ts`
- 方法与路径：POST `/api/callback/image-generated`
- 请求体：Kie.ai 回调 `{ code, data, msg }`
- 逻辑：当 `code===200 && data.status==='SUCCESS'` 时，遍历 `resultUrls`，为每个 URL 调用 `/api/download-and-upload` 持久化到 R2
- 响应：`{ success: true, message: '回调处理成功' }`

---

### 7a) POST /api/callback/flux-kontext

- 文件：`functions/api/callback/flux-kontext.ts`
- 方法与路径：POST `/api/callback/flux-kontext`
- 请求体：Kie.ai 回调 `{ code, data, msg }`
- 逻辑：当回调成功时解析结果 URL 集合，逐一调用 `/api/download-and-upload` 转存到 R2（与 GPT‑4o 回调一致的持久化策略）
- 响应：`{ success: true, message: '回调处理成功' }`

---

### 8) POST/GET /api/share

- 文件：`functions/api/share.ts`
- 方法与路径：
  - GET `/api/share?id=...`
  - POST `/api/share`
- POST 请求体（JSON）：`{ generatedUrl, originalUrl?, prompt?, style?, timestamp?, isR2Stored?, seoTags? }`
- 存储：`ShareStoreWorkers`
  - 单条：`share:{shareId}`
  - 列表：`share:list`（最多 1000，头插）
  - 统计：`share:stats`
- 响应：
  - GET：`{ success: true, data }` 或 404
  - POST：`{ success: true, shareId, shareUrl, data }`（`shareUrl` 为 `/share?id=...`）

---

### 9) GET /api/share/[id]

- 文件：`functions/api/share/[id].ts`
- 方法与路径：GET `/api/share/[id]`（还提供 PUT/DELETE 占位）
- 参数：路径 `{id}`
- 响应：`{ success: true, data }` 或 404

---

### 10) GET /api/share/list

- 文件：`functions/api/share/list.ts`
- 方法与路径：GET `/api/share/list?limit&offset`
- 查询：`limit` 默认 20，`offset` 默认 0
- 响应：`{ success: true, data: { items, total, limit, offset, hasMore, filter: 'all' } }`
- 备注：服务端过滤仅返回“文生图”（`originalUrl` 为空）

---

### 11) GET /api/share/latest

- 文件：`functions/api/share/latest.ts`
- 方法与路径：GET `/api/share/latest`
- 缓存：KV 内部缓存（键 `share:cache:latest:12`，TTL 10 分钟）
- 响应：`{ success: true, data: { items } }`
- Cache-Control：`public, s-maxage=600, max-age=300, stale-while-revalidate=120`

---

### 12) GET /api/sitemap-share

- 文件：`functions/api/sitemap-share.ts`
- 方法与路径：GET `/api/sitemap-share`
- 响应：XML 站点地图，列出 `/share/{id}`

---

### 13) 诊断与占位接口

- GET `/api/check-r2-config`：检查 `UPLOAD_BUCKET` / `AFTERIMAGE_BUCKET` 是否绑定
- GET `/api/debug-env`：输出主要 `env` 键信息（不泄露密钥值）
- GET `/api/task-status`：示例/占位，返回随机状态

---

## 二、前端交互过程与调用位置

### Workspace（生成主流程）

- 文件：`src/components/Workspace.tsx`
- 调用点与数据：
  - 上传图片 → `POST /api/upload-image`（XHR）→ `fileUrl`
  - 发起生成（按模型分流）
    - GPT‑4o Image → `POST /api/generate-image` → `taskId`
    - Flux Kontext（Pro/Max）→ `POST /api/flux-kontext/generate` → `taskId`
  - 轮询状态（按模型分流）
    - GPT‑4o Image → `GET /api/image-details?taskId`
    - Flux Kontext → `GET /api/flux-kontext/image-details?taskId`
  - 获取结果与持久化
    - 若得到结果 URL → `POST /api/download-and-upload` 转存到 R2 → `publicUrl`
    - 若短期内未获取 → `GET /api/get-generated-url?taskId` 反查 afterimage 桶（兼容历史前缀）
  - 分享：页面按钮触发 `POST /api/share`；自动分享逻辑已去除
- 前端用途：
  - `currentResult.generated_url` → 结果渲染/下载
  - `autoShareUrl` → 复用分享链接
  - `selectedSize/mode/style` → 影响生成入参

### 分享与列表

- 详情（App Router）`src/app/share/[id]/page.tsx` → `GET /api/share/{id}`（静态导出时不参与路由）
- 详情（Query 回退）`src/app/share/page.tsx`（`?id=`）→ `GET /api/share/{id}`（静态导出主要使用该页面作为回退）
- 首页最新 `src/components/HomeLatestShares.tsx` → `GET /api/share/latest`
- 画廊无限加载 `src/components/ShareGallery.tsx` → `GET /api/share/list`

---

## 三、全链路数据流（功能视角）

### A. 图片上传 → 生成 → R2 永久化 → 分享

- 用户：在 `Workspace.tsx` 上传 → `POST /api/upload-image`
- 生成：`POST /api/generate-image` → `taskId`
- 轮询：`GET /api/image-details?taskId`
  - 临时 URL → `POST /api/download-url` → `POST /api/download-and-upload` → R2 永久 URL
  - 无 URL → `GET /api/get-generated-url?taskId`
- 渲染：写入 `currentResult.generated_url`
- 分享：`POST /api/share` 持久化 KV

字段追踪：
- `fileUrl`：来自 `/api/upload-image`，作为生成输入，亦用于分享 `originalUrl`
- `taskId`：来自 `/api/generate-image`，用于查询/反查 R2
- `generated_url`：来源于直传、搬运、或回调后反查的 R2 永久 URL
- 分享 KV：`share:{id}`（详情）、`share:list`（列表）

### B. KIE 回调 → R2 永久化（服务端）

- GPT‑4o → `POST /api/callback/image-generated` → 内部 `POST /api/download-and-upload` → R2 永久 URL
- Flux Kontext → `POST /api/callback/flux-kontext` → 内部 `POST /api/download-and-upload` → R2 永久 URL

### C. 分享展示（落地页）

- 访问 `/share/{id}` → `GET /api/share/{id}` → 渲染分享页

### D. 画廊与首页

- 画廊 `/share` → `GET /api/share/list?limit&offset`
- 首页最新 → `GET /api/share/latest`

---

## 四、R2/KV 交互与键名规则

- R2（对象键）
  - 上传原图（用户上传）：`uploads/{timestamp}-{random}.{ext}`
  - 生成图（服务端下载后入库）：`generated/{finalFileName}`（默认 `generated_{taskId|timestamp}_{random}.png`）
  - 历史/工具函数可能使用：`kie-downloads/{fileName}`（与 `/api/get-generated-url` 逻辑一致）
  - 公网 URL 前缀：主桶 `CLOUDFLARE_R2_PUBLIC_URL`；afterimage 桶 `CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL`

- KV（分享数据）
  - 单条：`share:{shareId}`
  - 列表：`share:list`（最近 1000 个头插）
  - 统计：`share:stats`
  - 缓存（latest）：`share:cache:latest:12`（30 分钟）

ShareData 字段：`id, generatedUrl, originalUrl, prompt, style, timestamp, createdAt, isR2Stored?, seoTags?`

---

## 五、参数与返回字段表（精选）

### /api/generate-image（POST）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| prompt | string | req | 提示词 |
| fileUrl | string? | req | 参考图 URL（图生图/模板） |
| size | string | req | 比例，如 1:1/3:2/2:3 |
| mode | string | req | 'image-to-image'/'template-mode'/'text-to-image' |
| enhancePrompt | boolean | req | 是否增强提示词 |
| taskId | string | res | 任务 ID |
| success | boolean | res | 是否受理成功 |

### /api/flux-kontext/generate（POST）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| prompt | string | req | 提示词 |
| aspectRatio | string? | req | 比例，如 1:1/4:3/3:4/16:9/9:16|
| inputImage | string? | req | 参考图 URL（以图编辑） |
| model | string | req | 'flux-kontext-pro'/'flux-kontext-max' |
| enableTranslation | boolean? | req | 翻译开关（默认 true） |
| promptUpsampling | boolean? | req | 提示词增强（可映射前端开关） |
| outputFormat | 'jpeg'|'png'? | req | 输出格式（默认 'jpeg'） |
| taskId | string | res | 任务 ID |
| success | boolean | res | 是否受理成功 |

### /api/flux-kontext/image-details（GET）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| taskId | string | req | 任务 ID |
| status | 'GENERATING'|'SUCCESS'|'FAILED' | res | 任务状态（标准化） |
| resultUrls | string[] | res | 结果 URL 集合（兼容多字段名） |
| errorMessage | string? | res | 错误信息 |

### /api/image-details（GET）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| taskId | string | req | 任务 ID |
| data | any | res | KIE 任务详情（含 status、resultUrls） |

### /api/download-url（POST）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| url | string | req | 临时 URL |
| taskId | string? | req | 任务 ID（可选） |
| downloadUrl | string | res | 临时直链（20 分钟） |
| isDirectUrl | boolean? | res | 非临时 URL 时为 true |

### /api/download-and-upload（POST）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| url/kieImageUrl | string | req | 图片地址 |
| taskId | string? | req | 任务 ID |
| fileName | string? | req | 指定文件名 |
| publicUrl/url | string | res | R2 公网 URL |
| key | string | res | R2 对象键（`generated/...`） |

### /api/upload-image（POST）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| file | File | req | 表单文件 |
| fileUrl | string | res | R2 公网 URL（主桶） |
| key | string | res | R2 对象键（`uploads/...`） |

### /api/share（POST/GET）

| 字段名 | 类型 | 方向 | 含义 |
|---|---|---|---|
| id | string | query | GET 查询 id |
| generatedUrl | string | req | 生成图 URL |
| originalUrl | string? | req | 原图 URL |
| prompt | string? | req | 提示词 |
| style | string? | req | 风格名 |
| timestamp | number? | req | 生成时间 |
| isR2Stored | boolean? | req | 是否 R2 永久 URL |
| seoTags | string[]? | req | SEO 标签（≤20） |
| shareUrl | string | res | `/share?id=...` |

---

## 六、Next.js 与 Cloudflare Pages Functions 特性说明

- Next.js（App Router）
  - 动态路由：`/share/[id]`（客户端组件加载数据）
  - SEO：`generateMetadata`/客户端 `<head>` 补充（为静态导出兼容）
- Cloudflare Pages Functions
  - 每个 `functions/api/*.ts` 对应一个路由
  - 导出 `onRequestGet/onRequestPost/onRequest*` 方法
  - 通过 `env` 访问 KV/R2 绑定或环境变量
  - `_middleware.ts` 实现全局 CORS
- KV 封装
  - `ShareStoreWorkers`：优先绑定；缺失时以 REST API 回退（需 `CLOUDFLARE_API_TOKEN` 等）
- R2 封装
  - 绑定优先（`env.UPLOAD_BUCKET`/`env.AFTERIMAGE_BUCKET`），否则走 S3 v4 签名（`CLOUDFLARE_R2_*`）

---

## 七、注意事项与维护建议

- R2 Key 命名一致性
  - 建议统一 Afterimage 桶前缀（`generated/` 或 `kie-downloads/`），并同步 `/api/get-generated-url` 的前缀搜索逻辑
- 分享数据去重
  - 目前前端“自动分享”每次生成都会创建新记录；如需去重，可在服务端基于 `generatedUrl` 幂等
- 安全与合规
  - 中间件默认放开 CORS，如对外域使用需白名单
- 性能
  - `/api/share/latest` 使用 KV 内缓存（30 分钟）
  - `ShareStoreWorkers` 内置 5 分钟本地缓存（函数实例级）

---

## 八、示例代码（前后端常用片段）

### 前端：上传图片到 R2（XHR 进度）

```ts
// 片段：src/components/Workspace.tsx 的核心思路
const formData = new FormData()
formData.append('file', file)

const xhr = new XMLHttpRequest()
xhr.open('POST', '/api/upload-image', true)
xhr.upload.onprogress = (e) => {
  if (e.lengthComputable) {
    const percent = Math.round((e.loaded / e.total) * 100)
    setUploadProgress(percent)
  }
}
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    const data = JSON.parse(xhr.responseText)
    // data.fileUrl 即 R2 公网 URL
  }
}
xhr.send(formData)
```

### 前端：发起生成 + 轮询状态

```ts
// 发起生成
const genRes = await fetch('/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileUrl, // 文生图可省略
    prompt,
    enhancePrompt,
    size: selectedSize, // '1:1' | '3:2' | '2:3'
    mode,               // 'image-to-image' | 'template-mode' | 'text-to-image'
    style
  })
})
const genJson = await genRes.json()
const taskId = genJson.taskId

// 轮询状态（成功时可能返回临时 URL）
const poll = async (taskId: string) => {
  const r = await fetch(`/api/image-details?taskId=${taskId}`)
  const j = await r.json()
  const info = j.data?.data || j.data
  const status = info?.status
  const tmpUrl = info?.response?.resultUrls?.[0] || info?.response?.result_urls?.[0]

  if (status === 'SUCCESS' && tmpUrl) {
    // 临时 URL → 直链 → R2 永久
    const d = await fetch('/api/download-url', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tmpUrl, taskId })
    }).then(r => r.json())

    const u = await fetch('/api/download-and-upload', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: d.downloadUrl, taskId, fileName: `generated_${taskId}.png` })
    }).then(r => r.json())

    const finalUrl = u.publicUrl // R2 永久 URL
    // 渲染 finalUrl / 进入分享
  }
}
```

### 前端：创建分享（KV 入库）

```ts
const shareRes = await fetch('/api/share', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    generatedUrl: finalUrl,
    originalUrl: fileUrl || null,
    prompt,
    style,
    timestamp: Date.now(),
    isR2Stored: finalUrl.startsWith('https://pub-') || finalUrl.includes('.r2.dev'),
    seoTags: ['画像生成ai 無料', 'チャットgpt 画像生成']
  })
}).then(r => r.json())

console.log(shareRes.shareUrl) // 可能为绝对地址，如 https://2kawaii.com/share?id=share_...
```

### 后端：Cloudflare Pages Function 基本形态

```ts
// functions/api/example.ts
export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  const body = await request.json()
  // 使用 env 访问 KV/R2 绑定或环境变量
  return new Response(JSON.stringify({ ok: true, echo: body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### 后端：R2 绑定上传片段（Afterimage 桶）

```ts
const key = `generated/${fileName}`
await env.AFTERIMAGE_BUCKET.put(key, imageData, {
  httpMetadata: { contentType },
  customMetadata: {
    originalName: fileName,
    uploadedAt: new Date().toISOString()
  }
})
const publicUrl = `${env.CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL}/${key}`
```

### 后端：KV 持久化（ShareStoreWorkers）

```ts
import { ShareStoreWorkers } from '../../src/lib/share-store-workers.js'

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  const store = new ShareStoreWorkers(env.SHARE_DATA_KV ?? env)
  const body = await request.json()
  const created = await store.createShare({
    generatedUrl: body.generatedUrl,
    originalUrl: body.originalUrl ?? '',
    prompt: body.prompt ?? '',
    style: body.style ?? 'default',
    timestamp: body.timestamp ?? Date.now(),
    isR2Stored: !!body.isR2Stored,
    seoTags: Array.isArray(body.seoTags) ? body.seoTags.slice(0, 20) : []
  })
  return new Response(JSON.stringify({ success: true, data: created }), { status: 200 })
}
```

---

## 九、变更建议（Roadmap）

- 统一 R2 Afterimage 桶前缀（`generated/` vs `kie-downloads/`），并调整 `/api/get-generated-url` 前缀逻辑（兼容 Flux 与 GPT‑4o 产物检索）
- `/api/share` 可加入基于 `generatedUrl` 的幂等去重策略
- `_middleware.ts` 可增加允许域白名单以增强安全
- 为接口在 `src/types/api.ts` 补充更严格的响应类型约束
- 下载直链兜底：`/api/download-and-upload` 优先尝试对结果 URL 直接下载；仅当识别为 GPT‑4o 临时域名时调用 `/gpt4o-image/download-url` 兜底

---

以上分析覆盖所有后端 API、前端调用点、R2/KV 交互与数据流，足以支持快速上手与后续维护。如需英文版请告知。


