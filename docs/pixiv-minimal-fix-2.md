## Pixiv 极简风三期修复与自检（模板选择统一、主背景更白、Workspace/Share 全面收敛）

按本提示一次性完成：
- 模板选择按钮（Template/Style）选中前后样式统一为“圆角方形”（rounded-md），不再使用胶囊形（rounded-full）
- 主背景再提亮（更白）：`--bg: #ffffff`
- Workspace（PC）编辑区的尺寸按钮交互与移动端一致（有清晰的选中视觉）
- Workspace 页面移除“選べる変身スタイル”区块
- Workspace 编辑区下方组装区域与 Share 页面、其他页面的琥珀色、渐变、米黄背景全面清除并替换为中性色

完成后请执行自检（零匹配门槛）与构建验证：`npm run build:pages:static`（产物在 `out`）

---

### A. 主题与 Token 调整（让背景更白）
1) 在 `src/app/globals.css` 中将背景再提亮：
```css
:root {
  --bg: #ffffff;        /* 主背景更白 */
  --surface: #ffffff;
  --text: #111827;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --brand: #0096fa;
  --brand-hover: #007ee0;
  --ring: #93c5fd;
  --radius: 8px;
  --shadow-1: 0 1px 2px rgba(0,0,0,0.04);
}
body { background: var(--bg); color: var(--text); }
```
说明：表层 `--surface` 维持白色，靠边框/阴影与留白分层。

---

### B. 模板选择按钮（TemplateGallery/StyleGallery）统一为“圆角方形”

涉及文件：
- `src/components/TemplateGallery.tsx`
- `src/components/StyleGallery.tsx`

修改点：
- 将分类/样式按钮的形状统一为圆角方形：`rounded-full` → `rounded-md`（或使用 `rounded-[var(--radius)]`）
- 选中前后的“形态”一致（均为方形），选中仅改变颜色对比度：
  - 选中：`.btn-primary`（蓝底白字）
  - 未选：`bg-surface text-text-muted border border-border hover:bg-surface`
- 移除 amber 系类（如 `text-amber-*`、`border-amber-*`、`hover:bg-amber-*`）与渐变

示例（TemplateGallery 分类按钮）：
```tsx
<button
  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-colors ${
    selectedCategory === category
      ? 'btn-primary text-white'
      : 'bg-surface text-text-muted border border-border hover:bg-surface'
  }`}
>
  {category}
</button>
```

示例（StyleGallery 样式按钮）：将 `rounded-full` 改为 `rounded-md`，并用与上文相同的选中/未选中方案。

---

### C. Workspace（PC）尺寸按钮交互与样式对齐移动端

涉及文件：
- `src/components/Workspace.tsx`（`SizeButton` 组件 & 使用处）

要求：
- 桌面端 `SizeButton` 使用与移动端一致的视觉体系：
  - 选中：`.btn-primary text-white rounded-md`
  - 未选：`bg-surface text-text-muted border border-border hover:bg-surface rounded-md`
- 点击后应立即更新 `selectedSize` 并有明显的视觉变化。

示例（桌面端 SizeButton）：
```tsx
<button
  onClick={onClick}
  className={`p-3 rounded-md border transition-colors flex flex-col items-center justify-center gap-2 ${
    isSelected
      ? 'btn-primary text-white'
      : 'border-border bg-surface text-text-muted hover:bg-surface'
  }`}
>
  ...
</button>
```

---

### D. Workspace 页面移除“選べる変身スタイル”

涉及文件：
- `src/components/Workspace.tsx`

操作：
- 删除文件中注释 `{/* 選べる変身スタイル セクション */}` 下方包含的 `TemplateGallery` 区块（包含该区块的外层 `div` 节）。

---

### E. Workspace 编辑区下方的组装部分去琥珀化

涉及文件：
- `src/components/Workspace.tsx`

操作：
- 搜索并替换：将 `text-amber-*` → `text-text`/`text-text-muted`；`border-amber-*` → `border-border`；`bg-amber-*` → `bg-surface/bg-bg`；移除 `bg-gradient-to-*`。
- 所有提示、分组面板、徽标、指示器使用中性色方案（蓝色仅用作主 CTA/焦点态）。

---

### F. Share 页面与其他页面颜色统一

涉及文件（不完全列举，需全站执行）：
- `src/app/share/page.tsx`, `src/app/share/[id]/page.tsx`
- `src/components/ShareDetail.tsx`, `src/components/SharePageClient.tsx`, `src/components/ShareGallery.tsx`
- 全部内容页：FAQ/Terms/Privacy/ai-image-*/anime-icon-*/line-sticker-*/chibi-*/personification-ai 等

统一规则：
- 背景：删除 `bg-[#fff7ea]`，由 `<body>` 背景统一；必要处使用 `bg-bg` 或 `bg-surface`
- 文字：`text-amber-*|text-pink-*|text-purple-*|text-blue-*`（非链接/状态）→ `text-text` 或 `text-text-muted`
- 边框：`border-amber-*` → `border-border`
- 按钮：渐变类全部换为 `.btn-primary`/`.btn-outline`
- 卡片：统一 `.card`（或 `bg-surface border border-border rounded-md`）

---

### G. 自检清单（必须零匹配）
使用“全局搜索”，确保以下模式为 0：
- 背景与渐变
  - `bg-\[#fff7ea\]`
  - `bg-amber-(50|100|200|300|400|500|600|700|800|900)`
  - `bg-gradient-to-`（若有灰阶进度占位可保留，否则为 0）
- 文本与装饰
  - `text-amber-(400|500|600|700|800|900)`
  - `text-(pink|purple|orange|amber|emerald|teal|blue)-(400|500|600|700|800|900)`（链接/激活例外可改为 `text-brand`）
- 可爱系/不需要的类
  - `btn-kawaii|card-kawaii|border-kawaii|text-gradient|sparkle|float|rainbow|glow`
- 形状（仅限模板/样式按钮）
  - 在 `TemplateGallery.tsx` 与 `StyleGallery.tsx` 中，按钮不应出现 `rounded-full`（统一为圆角方形）

---

### H. 页面验收
- `/` 首页：模板选择按钮为圆角方形；无 amber/渐变；背景更白
- `/workspace`（PC）：
  - 编辑区尺寸按钮可点击且样式明显变化
  - “選べる変身スタイル”区块已删除
  - 组装区域去琥珀化（中性色）
- `/share`、`/share/[id]`：按钮、卡片、标签均为中性/品牌蓝，无 amber/渐变/米黄背景
- 其他内容页：无 amber/渐变/米黄背景

---

### I. 构建与提交
1) 执行：`npm run build:pages:static`
2) 确认无 ESLint/TS 报错，产物在 `out`
3) 提交信息建议：`chore(ui): unify template buttons, brighten background, normalize workspace/share colors`


