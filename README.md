## 2kawaii / FuryCode — AI 图片生成与「照片→二次元」转换

将照片一键转换为多种可爱二次元风格，或直接用文本生成插画。基于 Next.js 15 + Cloudflare Pages Functions，使用 KIE AI GPT‑4o Image 接口，生成结果持久化到 Cloudflare R2，并支持生成作品分享页（KV 存储）。

在线演示：`https://2kawaii.com`

---

### 技术栈

- Next.js 15（App Router）+ TypeScript
- Tailwind CSS v4
- Zustand 状态管理
- Cloudflare Pages Functions（Serverless 边缘函数）
- Cloudflare R2（对象存储）+ KV（分享数据）
- next-sitemap（站点地图）
- Heroicons、React 19、React DOM 19

### 运行要求

- Node.js >= 20
- npm >= 10

---

### 快速开始（本地开发）

1) 安装依赖

```bash
npm install
```

2) 配置环境变量

在项目根目录创建 `.env.local`（仅本地使用，不要提交到仓库），填入占位值：

```bash
# 应用公开地址（用于回调与生成分享链接，本地可用默认）
NEXT_PUBLIC_APP_URL=http://localhost:3000

# KIE AI（仅示例占位，替换为你的真实 Key）
KIE_AI_API_KEY=YOUR_KIE_AI_API_KEY
KIE_AI_API_KEY_2=
KIE_AI_API_KEY_3=
KIE_AI_API_KEY_4=
KIE_AI_API_KEY_5=
KIE_AI_4O_BASE_URL=https://api.kie.ai
KIE_AI_USER_ID=your_email@example.com

# 备用上传（可选）
IMGBB_API_KEY=YOUR_IMGBB_API_KEY
```

重要：请勿在仓库中提交任何真实密钥或账号信息。生产环境变量与绑定统一通过 `wrangler.toml` 与 `package.json` 进行配置与部署，无需在 Pages 控制台手改配置[[memory:6066309]]。

3) 启动开发服务

```bash
npm run dev
```

访问 `http://localhost:3000`。

---

### 项目目录结构

```
functions/                 # Cloudflare Pages Functions 路由（api 网关）
  └── api/
      ├── generate-image.ts      # 调用 KIE AI 创建任务
      ├── upload-image.ts        # 上传图片到 R2（优先使用绑定）
      ├── get-generated-url.ts   # 从 R2 after 桶查询生成结果 URL
      └── share/                 # 作品分享 API（KV 存储）
          ├── index.ts           # 创建/读取分享
          ├── [id].ts            # 按 ID 读取/更新/删除
          ├── latest.ts          # 首页最新 12 条（带 KV 缓存）
          └── list.ts            # 分享列表（分页）

src/
├── app/
  │   ├── workspace/page.tsx     # 日文工作台页面（带 SEO）
  │   └── en/workspace/page.tsx  # 英文工作台页面（带 SEO）
  └── components/Workspace.tsx   # 交互主控组件（上传、模板、生成、分享）

wrangler.toml               # Pages Functions 与 R2/KV 绑定、运行时变量
next.config.ts              # Next 配置（静态导出/standalone、图片域名等）
package.json                # 脚本与依赖
```

---

### 核心功能

- 模板模式：内置 20+ 二次元风格模板，一键套用
- 图→图：上传照片并输入提示词进行转换
- 文→图：仅输入提示词直接生成插画
- 生成进度轮询与失败重试、自动获取 R2 永久地址
- 结果分享：写入 KV，生成可访问的分享链接

---

### 可用脚本（package.json）

- 开发与构建
  - `npm run dev`：本地开发
  - `npm run build`：Next.js 构建
  - `npm run postbuild`：自动执行站点地图生成（在部分构建流程中由脚本触发）
  - `npm run build:pages`：为 Cloudflare Pages 动态构建（next-on-pages）
  - `npm run build:pages:dynamic`：同上，动态函数版本
  - `npm run build:pages:static`：仅静态导出到 `out/`
  - `npm run build:pages:export`：`next export`

- 部署（Cloudflare Pages）
  - `npm run deploy:pages`：构建并输出到 `out/`（动态）
  - `npm run deploy:pages:static`：静态构建并部署（脚本封装）
  - `npm run deploy:api`：带 API 的部署流程（脚本封装）

- 清理与诊断
  - `npm run clean` / `clean:build` / `clean:cf`
  - `npm run test:build`、`verify:cf-build`、`check:production`
  - `npm run validate:env`、`diagnose:404`、`fix:routes`

---

### 部署（Cloudflare Pages）

本项目使用 Cloudflare Pages Functions 提供后端能力，构建产物输出目录为 `out/`（见 `wrangler.toml` 的 `pages_build_output_dir`）。

1) 构建

```bash
# 动态函数（推荐）
npm run build:pages:dynamic

# 或仅静态导出
npm run build:pages:static
```

2) 部署

可直接使用仓库内的部署脚本（基于 wrangler/Pages API 封装），或在 CI 中执行 `wrangler pages deploy out`。项目的 Pages 配置（变量、绑定等）集中由 `wrangler.toml` 与 `package.json` 驱动，无需在 Pages 控制台手动修改[[memory:6066309]]。

3) 运行时绑定与环境变量（生产）

在 `wrangler.toml` 中定义：

- KV：`SHARE_DATA_KV`
- R2：
  - `UPLOAD_BUCKET`（原图/上传图）
  - `AFTERIMAGE_BUCKET`（生成结果）
- 变量：`KIE_AI_API_KEY`（支持多 Key 轮换 `_2.._5`）、`NEXT_PUBLIC_APP_URL`、R2 公网地址等

注意：请在私有环境中维护真实值，不要将任何秘密写入仓库。

---

### API 概览（Pages Functions）

- `POST /api/generate-image`：创建 KIE AI 生成任务（支持 filesUrl 与回调）
- `POST /api/upload-image`：上传图片至 R2（优先使用绑定，回退 S3 签名）
- `GET  /api/get-generated-url?taskId=...`：从 R2 after 桶查询生成结果 URL
- `GET/POST /api/share`：读取/创建分享；`GET /api/share/latest`、`GET /api/share/list`、`GET /api/share/[id]`

前端在 `src/components/Workspace.tsx` 中实现了完整的上传、轮询与自动分享逻辑。

---

### Next.js 配置要点（`next.config.ts`）

- 静态导出开关：`process.env.STATIC_EXPORT === 'true'` 时使用 `export`
- 导出模式下关闭 i18n；动态模式默认 `ja` 语言
- 远程图片域名白名单（含 R2 公网域）并设置 `images.unoptimized = true`
- 构建阶段忽略 TS/ESLint 错误（生产请酌情开启）

---

### SEO 与站点地图

- 工作台页面内置 `metadata` 与 JSON‑LD
- 生成站点地图：`next-sitemap`，在部分构建脚本或 `postbuild` 阶段自动执行

---

### 常见问题（FAQ）

- 构建后 404 或路由冲突
  - 运行 `npm run fix:routes`（`scripts/fix-routes-overlap.js`）
  - 使用 `npm run verify:cf-build` 检查构建产物

- 图片外链无法显示
  - 确认远程域名已加入 `next.config.ts > images.remotePatterns`

- 生成成功但未拿到永久 URL
  - 前端会回退到 `/api/get-generated-url` 与 `/api/download-url`/上传流程，请检查 R2 `AFTERIMAGE_BUCKET` 写入权限与公网地址配置

- KV 或 R2 未生效
  - 确认 `wrangler.toml` 的绑定与变量齐全，并在 Pages 项目中使用该配置进行部署（不要在控制台手改）[[memory:6066309]]

---

### 许可证

未在仓库中显式声明许可证。如需商用或二次开发，请根据公司/团队合规策略补充相应 LICENSE。

