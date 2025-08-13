## 目标

在不打乱现有工作台交互的前提下，集成 KIE Flux Kontext 模型，并在“模型切换”时动态切换参数、接口与尺寸选项；同时复用现有上传→生成→轮询/回调→R2永久化→分享的产线。

## 官方文档（必须遵循）

- 快速开始：[Flux Kontext API 快速开始](https://docs.kie.ai/cn/flux-kontext-api/quickstart)
- 生成或编辑图像（POST）：[生成或编辑图像](https://docs.kie.ai/cn/flux-kontext-api/generate-or-edit-image)
- 回调（Webhook）：[图像生成或编辑回调](https://docs.kie.ai/cn/flux-kontext-api/generate-or-edit-image-callbacks)
- 获取图像详情（GET）：[获取图像详情](https://docs.kie.ai/cn/flux-kontext-api/get-image-details)

## 与现有 GPT‑4o Image 的差异矩阵

- 接口路径
  - GPT‑4o Image：`POST /api/v1/gpt4o-image/generate`，`GET /api/v1/gpt4o-image/record-info`
  - Flux Kontext：`POST /api/v1/flux/kontext/generate`，`GET /api/v1/flux/kontext/record-info`（文档见“快速开始/获取图像详情”）

- 请求参数名与语义
  - 尺寸/比例：
    - GPT‑4o Image：`size`（项目当前仅用比例字符串：`1:1 | 3:2 | 2:3`）
    - Flux Kontext：`aspectRatio`（如 `16:9`, `4:3`, `3:4`, `9:16`, `21:9`, `16:21`, `1:1` 等，见“宽高比选项”示例）
  - 输入图：
    - GPT‑4o Image：当前服务侧使用 `filesUrl` 数组承载参考图 URL
    - Flux Kontext：`inputImage`（单 URL）。若提供则为“图像编辑”；可选 `aspectRatio`（提供则裁剪/填充；省略保留原比例）
  - 模型选择：
    - GPT‑4o Image：固定现有实现
    - Flux Kontext：`model: "flux-kontext-pro" | "flux-kontext-max"`
  - 其他：
    - Flux Kontext特有：`enableTranslation`（默认 true）、`promptUpsampling`、`safetyTolerance`（生成 0-6；编辑 0-2）、`outputFormat`（`jpeg|png`，默认 `jpeg`）、`uploadCn`、`watermark`、`callBackUrl`

- 状态与回调
  - 任务详情：`record-info` 返回 `successFlag` 与 `status`/`errorMessage` 等；文档状态值：`0 生成中 / 1 成功 / 2 创建失败 / 3 生成失败`（见“检查生成状态”）
  - 回调：回传 `data.response` 中包含结果 URL（如 `resultUrls/result_urls` 或 `resultImageUrl` 等）。原始图 URL通常仅 10 分钟有效；生成结果保存 14 天（文档说明）

- 下载与持久化
  - 现有产线：若检测到 KIE 临时域名，先取直链，再下载并上传到 R2（获得永久 URL）
  - Flux Kontext：优先直接下载回调或详情中的结果 URL；无“download-url”专用接口的文档描述时，直接用结果 URL 下载。保持 10 分钟时效的兜底逻辑：尽快转存 R2

## 前端改造方案（`src/components/Workspace.tsx` 等）

1. 新增“模型选择”下拉
   - 位置：保持与现有模式切换并列或下方
   - 选项：`GPT‑4o Image` / `Flux Kontext Pro` / `Flux Kontext Max`
   - 全局状态：`useAppStore` 增加 `selectedModel: 'gpt4o-image' | 'flux-kontext-pro' | 'flux-kontext-max'`

2. 尺寸候选“按模型动态渲染”
   - GPT‑4o Image（保持）：`['1:1','3:2','2:3']`
   - Flux Kontext（扩展）：`['1:1','4:3','3:4','16:9','9:16','21:9','16:21']`
   - UI 上 `SizeButton` 从 `availableSizesByModel[selectedModel]` 派生，切模型联动可选项
   - 默认值：GPT 走 `1:1`；Flux 走 `16:9`

3. 生成请求分流与参数映射
   - 若 `selectedModel === 'gpt4o-image'`：
     - 沿用现有 `/api/generate-image` 路由（服务端仍传 `size` 与 `filesUrl`）
   - 若为 Flux Kontext：
     - 改用新路由 `/api/flux-kontext/generate`
     - 参数：
       - `prompt`
       - `aspectRatio`（由所选尺寸直接透传字符串，如 `16:9`）
       - `inputImage`（当以图编辑时传 `fileUrl`）
       - `model`（`flux-kontext-pro|max`）
       - `enableTranslation`（默认 true；若前端判定提示词已英文，可设为 false）
       - `outputFormat`（默认 `jpeg`）
       - `promptUpsampling`（映射现有 `enhancePrompt` 开关）
       - `callBackUrl`（由服务端注入）

4. 轮询与状态映射
   - GPT：保持 `/api/image-details`
   - Flux：切为 `/api/flux-kontext/image-details`；服务端统一为前端识别的结构：
     - `status`: `GENERATING|SUCCESS|FAILED`
     - `response.result_urls/resultUrls` 标准化为 `resultUrls: string[]`
     - `errorMessage`

5. URL 持久化与分享（复用）
   - 生成完成后继续调用现有 `/api/download-and-upload` 将结果图转存 R2，获取永久 URL，再走 `/api/share`
   - 对 Flux：如果域名不是临时域名，可直接下载；若下载失败，输出错误并允许重试

## 服务端改造方案（Cloudflare Pages Functions）

新增 3 条 API（不影响现有 GPT‑4o Image 路由）：

1) `functions/api/flux-kontext/generate.ts`
   - 读取 body：`prompt, aspectRatio, inputImage, model, enableTranslation, outputFormat, promptUpsampling`
   - 组装请求体调用 `POST https://api.kie.ai/api/v1/flux/kontext/generate`
   - 注入 `callBackUrl = ${NEXT_PUBLIC_APP_URL}/api/callback/flux-kontext`
   - 返回 `{ success: true, taskId }`

2) `functions/api/flux-kontext/image-details.ts`
   - 代理 `GET https://api.kie.ai/api/v1/flux/kontext/record-info?taskId=...`
   - 解析文档状态：`0|1|2|3` 与 `successFlag`，统一输出：
     - `status: GENERATING|SUCCESS|FAILED`
     - `resultUrls: string[]`（兼容 `result_urls/resultUrls/resultImageUrl`）
     - `errorMessage`

3) `functions/api/callback/flux-kontext.ts`
   - 接收回调 `code/msg/data`；当成功时解析 `data.response` 的结果 URL 集合
   - 立即调用现有 `/api/download-and-upload`（传 `url/taskId/fileName`）将图片转存到 R2，避免临时 URL 过期
   - 记录日志并返回 200

说明：下载直链
- 若 Flux 未提供“download-url”专用接口，直接对回调/详情返回的 URL 发起下载
- 继续保留 10 分钟有效期的风险提示与重试策略

与“2kawaii 全链路接口与数据流设计文档”对齐要点：
- 路由注册方式一致：每个 `functions/api/*.ts` 对应一个路由，`onRequestGet/OnRequestPost` 导出（参见文档“一、后端 API 分析”与“六、Next.js 与 Cloudflare Pages Functions 特性说明”）。
- CORS：复用 `functions/_middleware.ts` 的全局跨域策略（`Access-Control-Allow-*` 与 `Access-Control-Max-Age: 86400`），无需为新路由单独实现。
- API 总览需补充三条新路由（建议在全链路文档“API 总览”中新增）：
  - POST `/api/flux-kontext/generate`
  - GET `/api/flux-kontext/image-details`
  - POST `/api/callback/flux-kontext`
- R2 存储：沿用 Afterimage 桶（`env.AFTERIMAGE_BUCKET`），对象键前缀建议统一为 `generated/`，与现有 `/api/download-and-upload` 写入策略一致。
- 反查 R2：`/api/get-generated-url` 当前默认前缀为 `kie-downloads/`；建议兼容同时搜索 `generated/` 与历史 `kie-downloads/`，并在 Roadmap 中推动统一（文档已有同类建议）。
- 下载直链兜底：为避免 Flux 场景误用 GPT‑4o 专属的 `/gpt4o-image/download-url`，推荐将 `/api/download-and-upload` 调整为“优先直接下载；失败时（仅 gpt4o 场景）再调用下载直链 API 兜底”。

## 配置与环境变量

- 复用现有密钥池（`KIE_AI_API_KEY[_2.._5]`）
- `NEXT_PUBLIC_APP_URL` 用于注入 `callBackUrl`
- 无需修改 Pages 控制台，按项目约定仅通过 `wrangler.toml` 与环境变量配置（与当前策略一致）
- 若需显式区分基址，可新增（可选）：
  - `KIE_AI_FLUX_BASE = https://api.kie.ai/api/v1/flux/kontext`
  - 也可在代码内以常量形式维护，避免环境变量膨胀

## UI/交互细节

- 模型切换时：
  - 重置尺寸到模型默认值（GPT `1:1`，Flux `16:9`）
  - 若当前模式为“以图编辑”，保持已上传图片与提示词；若模式为“模板”，只切换参数不重置模板选择
- 尺寸不可用时（例如在 GPT 下选择了 `16:9` 再切回）：
  - 直接禁用按钮并回退到默认尺寸，或弹出一次性提示（避免 silent fallback 造成困惑）

前端调用与数据流对齐（参考“二、前端交互过程与调用位置”与“三、全链路数据流”）：
- `Workspace.tsx`：
  - 上传：仍走 `POST /api/upload-image` → `fileUrl`
  - 生成：根据模型分流，GPT → `POST /api/generate-image`；Flux → `POST /api/flux-kontext/generate`
  - 轮询：GPT → `GET /api/image-details?taskId`；Flux → `GET /api/flux-kontext/image-details?taskId`
  - 获取结果：若详情已包含可下载 URL，直接 `POST /api/download-and-upload`（不再强依赖 `download-url` 接口）；若无 URL，则调用 `GET /api/get-generated-url?taskId` 反查 R2
  - 分享：`POST /api/share`（保持不变）

## 验收标准（关键用例）

- 文生图（Flux）：`prompt="夜晚未来城市" aspectRatio="16:9" model=pro` 能创建任务、轮询至 SUCCESS，并得到 R2 永久 URL 与可用的分享页
- 以图编辑（Flux）：上传可公网访问的 `inputImage`，`aspectRatio` 省略时输出保持原图比例；提供时输出匹配该比例
- 模型切换：在工作台切换到 Flux 时，尺寸候选扩展可见；切回 GPT 时仅显示 3 个比例
- 回调：收到 Flux 回调后 30 秒内能在 R2 查到对应图片对象（日志体现）

## 任务拆分与工期

1. 后端 API（3 条）与统一映射：1 天
2. 前端模型切换与尺寸候选联动：0.5 天
3. 生成分流与参数映射、轮询与完成处理：0.5 天
4. E2E 联调与回归（GPT/Flux 双通路）：0.5 天

## 变更影响与风控

- 所有改动在 Flux 选中时生效；默认保持 GPT 路由与行为不变
- 如果 Flux API 不可用或限流，用户可切回 GPT，服务不中断
- 回滚方案：隐藏“模型选择”或默认强制 GPT（配置开关）
- 监控与日志：
  - 在新路由中统一打印关键点日志（taskId、status、resultUrls 数量、R2 key、错误信息），便于 Cloudflare Pages 日志检索
  - 建议为 Flux 相关日志统一添加前缀 `[FLUX]`，与现有 `[KEY OK]/[KEY FAIL]` 风格一致

## 文件改动清单（计划）

- 新增：
  - `functions/api/flux-kontext/generate.ts`
  - `functions/api/flux-kontext/image-details.ts`
  - `functions/api/callback/flux-kontext.ts`
- 修改：
  - `src/store/useAppStore.ts`（新增 `selectedModel`，扩展尺寸类型或改为字符串模板）
  - `src/components/Workspace.tsx`（模型下拉、尺寸候选源切换、参数映射与路由分流、轮询入口切换）
  - 如需：`functions/api/download-and-upload.ts`（允许 Flux 结果 URL 直接下载，不再仅限 `gpt4o-image/download-url`）
  - 如需：`functions/_middleware.ts` 无需变更；但可在后续迭代引入允许域白名单（参考全链路文档“注意事项与维护建议”）

## 参考实现片段（参数映射要点）

```json
// Flux Kontext generate 请求体关键字段
{
  "prompt": "...",
  "aspectRatio": "16:9",
  "model": "flux-kontext-pro",
  "inputImage": "https://...",    // 仅编辑时
  "enableTranslation": true,
  "promptUpsampling": false,
  "outputFormat": "jpeg",
  "callBackUrl": "https://app.com/api/callback/flux-kontext"
}
```

```json
// 任务详情 record-info（服务端统一给前端）
{
  "status": "SUCCESS|GENERATING|FAILED",
  "resultUrls": ["https://..."],
  "errorMessage": ""
}
```

---

附：尺寸与场景建议（来自文档“宽高比选项”示例）
- `21:9`（电影/超宽屏）、`16:9`（桌面壁纸/视频）、`4:3`（传统显示）、`1:1`（社媒）、`3:4`（杂志版式）、`9:16`（手机壁纸）、`16:21`（移动启动页）

请严格参考官方文档实现与验证：
- 快速开始与状态说明：[Flux Kontext API 快速开始](https://docs.kie.ai/cn/flux-kontext-api/quickstart)
- 生成/编辑参数定义：[生成或编辑图像](https://docs.kie.ai/cn/flux-kontext-api/generate-or-edit-image)
- 回调字段与用法：[图像生成或编辑回调](https://docs.kie.ai/cn/flux-kontext-api/generate-or-edit-image-callbacks)
- 详情查询接口与状态语义：[获取图像详情](https://docs.kie.ai/cn/flux-kontext-api/get-image-details)

并与本仓库的全链路规范严格对齐：`docs/2kawaii全链路接口与数据流设计文档.md`


