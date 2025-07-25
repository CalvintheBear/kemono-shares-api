# FuryCode - 现代化开发平台

一个使用 Next.js 14+ 和 Tailwind CSS 构建的现代化落地页项目，展示了现代Web开发的最佳实践。

## 🚀 特性

- ✨ **现代化设计** - 使用最新的UI/UX设计理念
- 📱 **完全响应式** - 支持所有设备尺寸
- 🎨 **Tailwind CSS** - 使用原子化CSS框架快速构建UI
- ⚡ **Next.js 15** - 基于最新版本的Next.js框架
- 🔧 **TypeScript** - 完整的类型安全支持
- 🎯 **组件化** - 模块化的组件架构
- 🎨 **Heroicons** - 漂亮的SVG图标库
- 💎 **现代化交互** - 流畅的动画和过渡效果

## 📦 技术栈

- **框架**: [Next.js 15](https://nextjs.org/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **图标**: [Heroicons](https://heroicons.com/)
- **部署**: Vercel (推荐)

## 🛠️ 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目**
   \`\`\`bash
   git clone <your-repo-url>
   cd furycode
   \`\`\`

2. **安装依赖**
   \`\`\`bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   \`\`\`

3. **启动开发服务器**
   \`\`\`bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   \`\`\`

4. **打开浏览器**
   访问 [http://localhost:3000](http://localhost:3000) 查看结果

## 📁 项目结构

\`\`\`
furycode/
├── src/
│   ├── app/
│   │   ├── globals.css          # 全局样式
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 首页
│   │   └── favicon.ico          # 网站图标
│   └── components/
│       ├── Header.tsx           # 头部组件
│       └── Footer.tsx           # 底部组件
├── public/                      # 静态资源
├── tailwind.config.ts           # Tailwind CSS 配置
├── next.config.ts               # Next.js 配置
├── postcss.config.mjs           # PostCSS 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 项目依赖
\`\`\`

## 🎨 页面组成

### 核心页面部分

1. **Header (导航栏)**
   - 响应式导航菜单
   - 移动端汉堡菜单
   - 品牌Logo和CTA按钮

2. **Hero Section (英雄区)**
   - 吸引人的标题和副标题
   - 主要行动召唤按钮
   - 统计数据展示

3. **Features Section (功能特性)**
   - 6个核心功能介绍
   - 图标化展示
   - 悬停效果

4. **About Section (关于我们)**
   - 产品优势说明
   - 三步使用流程
   - 视觉化引导

5. **Pricing Section (价格方案)**
   - 三档价格方案
   - 功能对比
   - 推荐标签

6. **CTA Section (行动召唤)**
   - 最终转化区域
   - 双按钮设计

7. **Footer (页脚)**
   - 公司信息
   - 社交媒体链接
   - 版权信息

## 🎯 自定义指南

### 修改品牌信息

1. 更新 \`src/components/Header.tsx\` 中的品牌名称
2. 更新 \`src/app/page.tsx\` 中的所有文案内容
3. 替换 \`public/\` 目录下的图标和图片

### 修改颜色主题

在 \`tailwind.config.ts\` 中修改主题颜色：

\`\`\`typescript
colors: {
  'primary': {
    // 修改这里的颜色值
    500: '#3b82f6', // 主色调
    600: '#2563eb', // 深色调
    // ...
  },
}
\`\`\`

### 添加新组件

1. 在 \`src/components/\` 目录下创建新的组件文件
2. 导入到需要使用的页面中
3. 保持组件的可复用性和类型安全

## 📱 响应式设计

项目完全支持响应式设计，包括：

- **移动端** (< 768px)
- **平板** (768px - 1024px)  
- **桌面端** (> 1024px)

## 🚀 部署

### Vercel (推荐)

1. 将代码推送到 GitHub
2. 连接到 [Vercel](https://vercel.com)
3. 自动部署

### 其他平台

\`\`\`bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
\`\`\`

## 🛡️ 最佳实践

- ✅ 使用 TypeScript 确保类型安全
- ✅ 遵循 ESLint 规则
- ✅ 组件化开发
- ✅ 响应式设计优先
- ✅ 性能优化
- ✅ SEO友好

## 📝 开发脚本

\`\`\`bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行代码检查
\`\`\`

## 🤝 贡献

欢迎提交 issues 和 pull requests 来改进这个项目！

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
