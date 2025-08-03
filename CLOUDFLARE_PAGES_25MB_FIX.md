# Cloudflare Pages 25MB 限制解决方案

## 问题描述
Cloudflare Pages 对单个文件有 25MB 的大小限制。您的项目构建后出现了超过此限制的文件：
```
✘ [ERROR] Error: Pages only supports files up to 25 MiB in size
cache/webpack/client-production/0.pack is 29.6 MiB in size
```

## 解决方案

### 1. 使用超激进优化构建

运行以下命令进行超激进优化：

```bash
npm run build:ultra
```

这个命令会：
- 清理所有缓存文件
- 使用更激进的代码分割策略
- 限制每个 chunk 的大小为 50KB
- 禁用不必要的功能
- 优化依赖项

### 2. 分析大文件

如果仍然遇到问题，运行分析脚本：

```bash
npm run analyze:large
```

这会显示：
- 所有文件的大小
- 超过 25MB 的文件列表
- 优化建议

### 3. 手动优化步骤

#### 3.1 检查依赖项
查看 `package.json` 中的依赖项，移除不必要的库：

```bash
npm ls --depth=0
```

#### 3.2 使用动态导入
将大型组件改为动态导入：

```javascript
// 替换
import HeavyComponent from './HeavyComponent'

// 使用
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>加载中...</div>
})
```

#### 3.3 优化图片
- 使用 WebP 格式
- 压缩图片
- 使用 CDN 加载图片

#### 3.4 移除未使用的代码
使用 tree-shaking 移除未使用的代码：

```javascript
// 只导入需要的部分
import { useState } from 'react' // 而不是 import React from 'react'
```

### 4. 替代部署方案

如果无法解决 25MB 限制，考虑以下替代方案：

#### 4.1 Railway 部署（推荐）
Railway 没有文件大小限制：

```bash
npm run build:railway
```

#### 4.2 Vercel 部署
Vercel 也没有严格的文件大小限制：

```bash
npm run build
# 然后部署到 Vercel
```

#### 4.3 使用 CDN
将大型库通过 CDN 加载：

```html
<script src="https://cdn.jsdelivr.net/npm/large-library@version/dist/library.min.js"></script>
```

### 5. 构建脚本说明

#### 5.1 标准构建
```bash
npm run build:cloudflare
```

#### 5.2 激进优化构建
```bash
npm run build:aggressive
```

#### 5.3 超激进优化构建
```bash
npm run build:ultra
```

#### 5.4 分析大文件
```bash
npm run analyze:large
```

### 6. 配置文件优化

已更新的 `next.config.ts` 包含：
- 更激进的代码分割
- 更小的 chunk 大小限制
- 优化的模块解析
- 禁用的不必要功能

### 7. 环境变量

设置以下环境变量以优化构建：

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_CACHE=false
NEXT_SHARP_PATH=false
NEXT_DISABLE_SOURCEMAPS=true
NEXT_DISABLE_STATIC_IMAGES=true
NEXT_DISABLE_IMAGE_OPTIMIZATION=true
```

### 8. 故障排除

#### 8.1 如果仍然超过 25MB
1. 检查是否有大型依赖项
2. 使用 `npm run analyze:large` 分析
3. 考虑使用 Railway 部署

#### 8.2 构建失败
1. 清理缓存：`npm run clean`
2. 重新安装依赖：`npm install`
3. 使用超激进构建：`npm run build:ultra`

#### 8.3 性能问题
1. 启用代码分割
2. 使用动态导入
3. 优化图片和静态资源

### 9. 最佳实践

1. **定期分析**：定期运行 `npm run analyze:large`
2. **监控大小**：关注构建产物的大小
3. **优化依赖**：移除不必要的依赖项
4. **使用 CDN**：将大型库通过 CDN 加载
5. **代码分割**：使用动态导入分割代码

### 10. 联系支持

如果问题仍然存在：
1. 联系 Cloudflare 支持
2. 考虑使用 Railway 或 Vercel
3. 检查是否有其他优化空间

## 总结

通过以上优化措施，应该能够解决 Cloudflare Pages 的 25MB 限制问题。如果仍然无法解决，建议使用 Railway 部署，它没有文件大小限制且性能优秀。 