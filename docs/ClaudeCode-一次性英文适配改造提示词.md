### 一次性英文适配与分享详情页 SEO 改造提示词（给 Claude Code）

请在不改变静态导出与 Cloudflare Pages 部署策略的前提下，为本站新增英文版本（路径前缀 `/en`），并完善分享详情页的多语言 SEO。务必保持现有日文根路径不变，不引入自动重定向或 Next 内建 i18n（静态导出不支持）。保持原有缩进与格式，不要无关重排。

---

### 目标
- 保留日文根路径（无 `/ja` 前缀），新增英文前缀 `/en/...` 路由。
- API/KV 与数据结构不分语种；仅视图文案与 SEO 元信息按路由切换。
- 为所有核心页面与分享详情页增加 `hreflang` 互链与 OpenGraph `locale`。
- 更新站点地图以输出 `ja/en/x-default`。

### 原则
- 不开启 Next 内建 i18n 多语言（export 不支持）。
- 不新增语言检测中间件与自动重定向；`src/middleware.ts` 保持禁用。
- 保持缩进风格与宽度，不混用 Tab/空格；最小必要改动。

### 路由与布局
1) 新增英文布局：`src/app/en/layout.tsx`（复制 `src/app/layout.tsx`），修改：
   - `<html lang="en">`
   - 英文 `metadata`（`title`、`description`）
   - `openGraph.locale: 'en_US'`
   - `alternates.languages` 包含：`ja` 指向日文根、`en` 指向 `/en`、`x-default` 指向日文根
2) 保留 `src/app/layout.tsx` 为日文：
   - 确认 `<html lang="ja">`、`openGraph.locale: 'ja_JP'`
   - 在 `alternates.languages` 增加 `en: 'https://2kawaii.com/en'`

### 页面英文副本（首批必须覆盖）
为以下页面创建英文副本，路径均在 `src/app/en/**`，页面内所有可见文案与 `metadata` 改为英文，`openGraph.locale='en_US'`，`alternates.languages` 互链日文/英文：
- `page.tsx`（首页）
- `workspace/page.tsx`
- `ai-image-generation-guide/page.tsx`
- `ai-image-conversion-free/page.tsx`
- `anime-icon-creation/page.tsx`
- `chibi-character-maker/page.tsx`
- `line-sticker-creation/page.tsx`
- `personification-ai/page.tsx`
- `faq/page.tsx`
- `privacy/page.tsx`
- `terms/page.tsx`
- 如存在列表页：`share/page.tsx` → 新增 `src/app/en/share/page.tsx` 并英文化。

### 分享详情页（最重要）
1) 日文详情页保持并补充互链：
   - 文件：`src/app/share/__id/generateMetadata.ts`
     - 在 `alternates.languages` 中新增：
       - `en: https://2kawaii.com/en/share/${id}`
     - 保持 `openGraph.locale='ja_JP'`
   - 文件：`src/app/share/__id/page.tsx`
     - 客户端 `<head>` 兜底补充：
```tsx
<link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${shareId}`} />
```
     - 日期格式保持 `toLocaleDateString('ja-JP')`
2) 新增英文详情页目录：`src/app/en/share/__id/`
   - `generateMetadata.ts`：同域 API 取数（`GET /api/share/:id`），生成英文 `title/description`，`openGraph.locale='en_US'`，`alternates.languages`：
     - `en: https://2kawaii.com/en/share/${id}`
     - `ja: https://2kawaii.com/share/${id}`
     - `x-default: https://2kawaii.com/share/${id}`
   - `page.tsx`：复用渲染/下载逻辑，全部文案英文；日期 `toLocaleDateString('en-US')`；在 `<head>` 注入：
```tsx
<link rel="alternate" hrefLang="en" href={`https://2kawaii.com/en/share/${shareId}`} />
<link rel="alternate" hrefLang="ja" href={`https://2kawaii.com/share/${shareId}`} />
<link rel="alternate" hrefLang="x-default" href={`https://2kawaii.com/share/${shareId}`} />
```
3) 数据/接口保持不变：
   - 统一使用 `GET /api/share/:id` 返回：`{ id, generatedUrl, originalUrl, prompt, style, timestamp, createdAt, seoTags? }`
   - 生产环境用绝对 `https://2kawaii.com`，本地相对 `/api/share/${id}` 的策略保持。

### 站点地图与 robots
1) `next-sitemap.config.js` 中 `transform.alternateRefs` 扩充为三语：
```js
alternateRefs: [
  { href: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}${path}`, hreflang: 'ja' },
  { href: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}${path}`, hreflang: 'en' },
  { href: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}${path}`, hreflang: 'x-default' },
]
```
2) 若保留手写 `src/app/sitemap.xml`，为每条 URL 同步添加 `<xhtml:link hreflang="en" href=".../en/...">`。
3) 如采用 `functions/api/sitemap-share.ts` 输出分享详情站点地图，为每个分享输出 `ja/en/x-default` 互链。

### Header 语言切换（推荐）
- 在 `src/components/Header.tsx` 增加语言切换链接：
  - 若当前路径以 `/en` 开头，切换为去掉 `/en` 的同路径
  - 否则在当前路径前加 `/en`
- 仅做链接，不做自动跳转或检测。

### 静态导出兼容
- `next.config.ts` 保持当前静态导出策略；不要启用多语言 `i18n.locales`；在 `export` 模式下继续禁用 i18n 块。
- 不修改 `src/middleware.ts` 的禁用策略。

### 渐进字典化（后续）
1) 新增 `src/i18n/dict.ts`：
```ts
export const dict = {
  ja: { startNow: '無料で始める', guideTitle: 'AI画像変換の使い方' },
  en: { startNow: 'Start for free', guideTitle: 'How to use AI image conversion' },
}
export function t(lang: 'ja' | 'en', key: keyof typeof dict['ja']) {
  return dict[lang][key]
}
```
2) 基于路由是否以 `/en` 判定 `lang`，逐步将硬编码文案替换为 `t(lang, 'key')`，优先首页与 `workspace` 的按钮/标题。

### 日期与 Locale
- 日文页面保持 `toLocaleDateString('ja-JP')`
- 英文页面改为 `toLocaleDateString('en-US')`

### SEO 检查清单
- 日/英页面 `openGraph.locale` 分别为 `ja_JP` / `en_US`
- `metadata.alternates.languages` 均包含 `ja/en/x-default`
- 分享详情页 SSR metadata 与客户端 `<head>` 均包含两语言 `hreflang` 互链

### 需要修改/新增的文件（以现有仓库为准）
- `src/app/layout.tsx`
- `src/app/page.tsx` 及上述各页面对应路径
- 新增：`src/app/en/layout.tsx`、`src/app/en/**/page.tsx`
- `src/app/share/__id/generateMetadata.ts`
- 新增：`src/app/en/share/__id/generateMetadata.ts`、`src/app/en/share/__id/page.tsx`
- 如存在：`src/app/share/page.tsx` 与 `src/app/en/share/page.tsx`
- `next-sitemap.config.js`
- 如存在：`src/app/sitemap.xml`、`functions/api/sitemap-share.ts`
- 可选：`src/components/Header.tsx`（语言切换）

### 构建与验证
- 构建：`npm run build:pages:static`
- 验证：
  - `http://localhost:3000/` 与 `/en` 均 200
  - `/share/[id]` 与 `/en/share/[id]` 渲染相同数据、文案语言正确、日期格式正确
  - `head` 中 `hreflang` 覆盖 `ja/en/x-default`；OG locale 正确
  - 站点地图包含英文 `alternate`；分享详情站点地图输出互链

### 注意
- 不引入未使用依赖；不重排无关代码。
- 保持现有部署脚本与 `_redirects` 行为。


