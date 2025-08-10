## Pixiv 极简风二次修复与自检清单（背景色与字色统一）

本提示词用于指挥一次性修复：
- 全站背景统一为白色/淡灰（去除米黄色 #fff7ea 与琥珀色块）
- 全站字色统一为黑/灰（移除 amber/pink/purple 等作为正文色）
- PC 端 Workspace 的“编辑区/结果区”采用中性色卡片与输入样式

修复完成后需自检，确保零遗漏、零不一致，并通过静态构建：`npm run build:pages:static`。

---

### A. 立即执行的主题变量与原子类（避免回退）
1) 在 `src/app/globals.css`：将旧变量与米黄色替换为中性色（若已存在相同 Token，可保持一致）。注意将背景从偏灰（#f6f7f8）进一步提亮为 #f9fafb。
```css
:root {
  --bg: #f9fafb;           /* 更接近白的浅灰 */
  --surface: #ffffff;      /* 白色卡片 */
  --text: #111827;         /* 近黑 */
  --text-muted: #6b7280;   /* 次级灰 */
  --border: #e5e7eb;       /* 分割线 */
  --brand: #0096fa;        /* 蓝色主色 */
  --brand-hover: #007ee0;
  --ring: #93c5fd;
  --radius: 8px;
  --shadow-1: 0 1px 2px rgba(0,0,0,0.04);
}
body { background: var(--bg); color: var(--text); }
```
2) 确保以下原子类存在（若在 `docs/pixiv-minimal-redesign.md` 已加，可跳过）：`.btn-primary`、`.btn-outline`、`.card`、`.input`、`.divider`（见前述文档定义）。

---

### B. 全盘替换任务（高优先级）

1) 背景色统一
- 搜索并替换以下模式：
  - `bg-[#fff7ea]` → 删除该类（交由 `<body>` 背景控制）或改为 `bg-bg`
  - `bg-amber-50|100|200|300` 等 → 统一改为 `bg-surface`（卡片）或 `bg-bg`（版心/段落）
  - 所有 `bg-gradient-to-* from-amber-* to-orange-*` → 删除渐变，按场景换为 `.btn-primary`（CTA）或 `bg-surface`（容器）

- 需修改的文件（含现存米黄色背景）：
  - `src/app/page.tsx`
  - `src/app/workspace/page.tsx`
  - `src/app/share/page.tsx`, `src/app/share/[id]/page.tsx`
  - `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/app/faq/page.tsx`
  - `src/app/personification-ai/page.tsx`, `src/app/line-sticker-creation/page.tsx`, `src/app/chibi-character-maker/page.tsx`, `src/app/ai-image-conversion-free/page.tsx`, `src/app/anime-icon-creation/page.tsx`, `src/app/ai-image-generation-guide/page.tsx`
  - `src/components/ShareDetail.tsx`, `src/components/SharePageClient.tsx`, `src/components/HomeLatestShares.tsx`, `src/components/FAQ.tsx`
  - `src/components/Workspace.tsx`（如存在）、`src/components/Workspace.tsx.backup`（仅参考，不用改备份）

2) 字色统一（黑/灰）
- 将正文/标题用色统一：
  - `text-amber-800|900` → `text-text`
  - `text-amber-600|700|500|400` → `text-text-muted`
  - 其他彩色正文（如 `text-purple-*|text-pink-*|text-blue-*`）若非强调/状态，请统一为 `text-text` 或 `text-text-muted`

- 需重点修改文件片段（示例来源）：
  - `src/app/page.tsx`：标题、段落、表格头/正文使用了 `text-amber-*`
  - `src/components/Workspace.tsx`：输入提示、标签、面板标题大量 `text-amber-*`
  - 其他页面型组件：FAQ/Terms/Privacy 等引用 `text-amber-*`

3) 渐变与“可爱系”类移除
- 渐变按钮/背景：`bg-gradient-to-*` → 按语义改为 `.btn-primary`（按钮）或 `bg-surface`（容器）
- “可爱系”类：
  - `btn-kawaii` → `.btn-primary`
  - `card-kawaii` → `.card`
  - 移除 `text-gradient|sparkle|float|glow|rainbow` 等重度动效类

---

### C. PC 端 Workspace（编辑区/结果区）专项修复

涉及文件：
- 页面入口：`src/app/workspace/page.tsx`
- 主体组件：`src/components/Workspace.tsx`

要求：
- 外层容器不再设置背景米黄；由 `<body>` 控制背景（如需局部白底，用 `.card`）
- 编辑区（上传、Prompt、参数区）
  - 区块容器：使用 `.card` 或 `bg-surface border border-border rounded-md`
  - 文本：标题/label 用 `text-text`，说明/提示用 `text-text-muted`
  - 输入组件：统一 `.input` 样式，focus 态蓝色描边与 ring
  - 按钮：主操作 `.btn-primary`，次要 `.btn-outline`，禁止渐变
- 结果区（预览/对比/下载 CTA）
  - 容器：`.card`，图像容器采用中性 hover（轻微阴影/位移）
  - CTA 按钮：`.btn-primary`/`.btn-outline`，不使用 `bg-gradient-to-*`

定位参考（示例）：
- `src/app/workspace/page.tsx` 中：
  - 顶部容器存在 `min-h-screen bg-[#fff7ea]` → 改为移除背景或 `bg-bg`
  - 标题/副标题存在 `text-amber-700` → 改为 `text-text`
  - 下方彩色分割条 `bg-gradient-to-r from-pink-400 to-purple-400` → 改为中性色细分割 `.divider`
- `src/components/Workspace.tsx` 中：
  - 大量 `text-amber-*`、`bg-gradient-to-*`、`card-kawaii` → 按上述规范统一

---

### D. 自检清单（必须零匹配）
执行“全局搜索”，确保以下模式均为 0 条结果：
- 背景相关
  - `bg-\[#fff7ea\]`
  - `bg-amber-(50|100|200|300|400|500|600|700|800|900)`
  - `bg-gradient-to-`（若用于进度条灰阶可保留，但彩色渐变必须为 0）
- 字色相关（正文/标题不允许彩色）
  - `text-amber-(400|500|600|700|800|900)`
  - `text-(pink|purple|orange|amber|emerald|teal|blue)-(400|500|600|700|800|900)`（导航/链接强调可使用 `text-brand`，其余正文为 0）
- “可爱系”样式
  - `btn-kawaii|card-kawaii|border-kawaii|text-gradient|sparkle|float|rainbow|glow`

若存在例外（如图像占位/进度条灰阶），请改为中性色实现；不允许彩色背景/文字作为常态样式。

---

### E. 可视验收（页面级）
- 打开并检查：
  - `/` 首页：背景浅灰或白；标题/正文为黑/灰；无渐变按钮
  - `/workspace`：PC 端编辑区/结果区均为白卡片 + 细边；输入统一；CTA 使用蓝色主按钮
  - `/share`、`/share/[id]`：卡片中性化；标签不使用 amber 背景/文字
  - 其他内容页（faq/privacy/terms/...）：无米黄背景、无 amber 文本

---

### F. 构建与提交
1) 运行：`npm run build:pages:static`
2) 确保无 ESLint/TS 报错且构建产物输出到 `out`
3) 提交信息：`chore(ui): unify backgrounds and text colors to pixiv minimal, cleanup gradients`

---

### G. 附：当前扫描发现的典型问题（需覆盖修复）
- 米黄色背景 `bg-[#fff7ea]` 出现于：
  - `src/app/page.tsx`, `src/app/workspace/page.tsx`, `src/app/share/*`, `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/app/faq/page.tsx` 等
  - `src/components/ShareDetail.tsx`, `src/components/SharePageClient.tsx`, `src/components/HomeLatestShares.tsx`, `src/components/FAQ.tsx`
  - `src/components/Workspace.tsx`（及 backup，仅参考）
- 大量 `text-amber-*` 正文/标题：`src/components/Workspace.tsx`、`src/app/page.tsx` 等
- 渐变按钮/区块：`bg-gradient-to-r from-amber-500 to-orange-500` 等在 Share/Terms/Privacy/Workspace 等处
- “可爱系”类：`btn-kawaii`、`card-kawaii` 在多页面组件仍存在

请按本提示完成统一替换，并严格遵守自检零匹配门槛。


