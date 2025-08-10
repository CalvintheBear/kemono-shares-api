## Pixiv 极简风格改造指南（一次性落地）

本指南用于将现有站点的“可爱系/渐变/强动效”视觉统一改造为 Pixiv 风格：中性浅灰背景、深色文本、蓝色品牌主色、轻边框、弱动效、统一圆角和间距。仅涉及样式与设计 Token，不改业务逻辑与接口。

### 目标与边界
- 视觉：对齐 Pixiv 的克制与信息密度，移除渐变/彩虹/夸张动画，统一组件规格。
- 工程：不改功能逻辑；仅改样式类与主题变量；保证构建与关键页面正常。
- 构建：使用命令 `npm run build:pages:static` 生成静态产物到 `out` 目录。

### 风格基线（与 Pixiv 对齐）
- 字体与字重
  - 主字体：Noto Sans JP（或系统日文字体回退），权重 400/500/700
  - 英文/数字回退：系统 UI
 - 色彩与对比
  - 背景：#f9fafb（更接近白的浅灰）
  - 主文：#111827；次文：#6b7280
  - 边框：#e5e7eb
  - 品牌蓝：#0096fa；Hover：#007ee0；Focus Ring：#93c5fd
- 组件风格
  - 按钮：实心主色、浅灰描边、幽灵按钮三体系；无渐变、轻阴影
  - 卡片：白底 + 1px 边 + 极浅阴影，圆角 8px
  - 导航：白底 + 1px 边；激活态蓝色指示
- 排版与间距
  - 容器宽 `max-w-6xl/7xl`；节距 24/32/40；网格间距 12/16
  - 标题层级：H1 32~40，H2 24~28，H3 18~20，正文 14~16
- 动效
  - 移除彩虹/浮动/大幅淡入；只保留轻微的颜色/透明度/位移过渡

### 设计 Token（CSS 变量 + Tailwind 映射）

在 `src/app/globals.css` 中新增（或覆盖）主题变量：

```css
:root {
  --bg: #f9fafb;
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

html { text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
body { background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
```

在 `tailwind.config.js` 中扩展映射（保留既有 content 配置与其他扩展）：

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'ui-sans-serif', 'system-ui'],
    },
    colors: {
      bg: 'var(--bg)',
      surface: 'var(--surface)',
      text: 'var(--text)',
      'text-muted': 'var(--text-muted)',
      border: 'var(--border)',
      brand: 'var(--brand)'
    },
    borderRadius: { md: 'var(--radius)' },
  },
},
```

### 统一原子类（新增到 `globals.css`）

```css
.btn-primary {
  background: var(--brand);
  color: #fff;
  font-weight: 600;
  border-radius: var(--radius);
  padding: 10px 16px;
  box-shadow: var(--shadow-1);
  transition: background-color .2s ease, color .2s ease, transform .1s ease;
}
.btn-primary:hover { background: var(--brand-hover); }
.btn-primary:focus { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.btn-outline {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 16px;
  transition: background-color .2s ease, color .2s ease, border-color .2s ease;
}
.btn-outline:hover { background: #f3f4f6; }

.btn-ghost {
  background: transparent;
  color: var(--brand);
  border-radius: var(--radius);
  padding: 8px 12px;
}
.btn-ghost:hover { background: #f3f4f6; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-1);
}

.divider { border-top: 1px solid var(--border); }

.input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 12px;
  color: var(--text);
}
.input:focus { outline: none; box-shadow: 0 0 0 3px var(--ring); border-color: var(--brand); }

/* 图片容器的中性化 hover 效果 */
.image-container {
  background: var(--surface);
  border-radius: 12px;
  box-shadow: var(--shadow-1);
  transition: transform .15s ease, box-shadow .15s ease;
}
.image-container:hover { transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0,0,0,.06); }
```

同时，在 `globals.css` 中删除以下“可爱系”与重度动画相关样式与 keyframes（若仍存在）：`text-gradient`、`sparkle`、`float`、`btn-kawaii`、`card-kawaii`、`border-kawaii`、彩虹/渐变滚动条和选择态等。Masonry/瀑布流必要布局可保留，但颜色与阴影须改为上面的中性样式。

### 分阶段落地（推荐顺序）
- 第1阶段：引入字体与 Token（Noto Sans JP + 变量 + 原子类），不动功能
- 第2阶段：导航体系（Header/MobileBottomNav/Footer）统一色板与 CTA
- 第3阶段：首页英雄区/CTA 去渐变/强动效
- 第4阶段：内容卡与图库（Share/Masonry）统一卡片样式
- 第5阶段：Workspace 表单/面板统一输入与留白
- 第6阶段：清理无用动画与 safelist，统一残留色值与类名
- 第7阶段（可选）：暗色模式通过变量覆盖实现

### 文件修改清单与示例

- `src/app/layout.tsx`：替换字体与 body 类（保留 SEO/脚本）

```tsx
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head />
      <body className={`${notoSans.variable} antialiased font-sans bg-bg text-text`}>
        {children}
      </body>
    </html>
  );
}
```

- `src/components/Header.tsx`：
  - 顶部使用 `bg-white border-b border-border`
  - 链接默认 `text-text-muted`，hover `text-text`
  - CTA 使用 `.btn-primary`（主）和 `.btn-outline`（次），移除渐变/放大动效

- `src/components/MobileBottomNav.tsx`：
  - 容器 `bg-white border-t border-border`
  - 非激活 `text-text-muted`，激活 `text-brand`

- `src/components/Footer.tsx`：
  - 背景 `bg-surface` 或 `bg-white`，文本 `text-text/text-muted`
  - 使用 `.divider` 分隔，去除大色块和琥珀/紫色主色

- `src/components/HomeHero.tsx`：
  - 移除 `text-gradient/float/自定义 keyframes`
  - H1/H2 普通文本色；主按钮 `.btn-primary`，次按钮 `.btn-outline`

- `src/components/MasonryGallery.tsx` / `src/components/ShareGallery.tsx`：
  - 卡片容器统一中性 hover（参考 `.image-container`），移除 scale 过大与重度 overlay

- `src/components/ShareDetail.tsx`：
  - 主内容用 `.card`；按钮统一 `.btn-primary`/`.btn-outline`

- `src/components/Workspace.tsx`：
  - 输入/下拉/面板统一使用 `.input`、`.card` 与中性色；移除渐变类

### 批量替换规则（正则建议）
- 渐变按钮
  - 搜索：`bg-gradient-to-[^\s]+\s+from-[^\s]+\s+to-[^\s]+`
  - 处理：主 CTA → `.btn-primary`；次 CTA → `.btn-outline`
- “可爱系”类
  - `btn-kawaii` → `btn-primary`
  - `card-kawaii` → `card`
  - 移除：`text-gradient|sparkle|float|animate-(fade|slide|sparkle|rainbow|glow|scale)-[\w-]*`
- 主题色归一
  - `text-amber-(800|900)` → `text-text`
  - `text-amber-(600|700)` → `text-text-muted`
  - `bg-amber-[0-9]+|bg-\[#fff7ea\]` → `bg-bg`（或删除交由 body 控制）
  - `border-amber-[0-9]+` → `border-border`
  - 链接/激活主色：`text-blue-[0-9]+|text-amber-[0-9]+` → `text-brand`

### 验收标准
- 视觉
  - 站内不再出现 `bg-gradient*`、`text-gradient`
  - 主色统一为品牌蓝；文本/次文本/边框为中性灰谱
  - 按钮/卡片/输入统一圆角与高度，hover 变化轻微
- 工程
  - `npm run build:pages:static` 成功，产物输出到 `out`
  - 无新增 ESLint/TS 报错
  - 关键页面正常：`/`、`/workspace`、`/share`、`/share/[id]`
- 代码整洁
  - `globals.css` 清理“可爱系”类与重度动画，仅保留必要布局/过渡
  - `tailwind.config.js` 精简未用的动画 safelist

### 测试与提交
1) 安装依赖（如需）：`npm i`
2) 构建：`npm run build:pages:static`
3) 若失败：回退最大范围替换，分步提交，直至通过
4) 提交信息建议：`chore(ui): migrate to pixiv minimal theme with brand tokens and unified components`

### 回滚策略
- 通过 CSS 变量驱动的主题切换，保留旧类短期映射到新样式，出现问题可快速回滚变量或类名映射。

