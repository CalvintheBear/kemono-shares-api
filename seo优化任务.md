任务一、你是 SEO 专家，请为我的 Next.js 项目 重写和优化所有页面的 SEO 设置，目标是提升日语搜索排名，重点关注以下关键词，按照从上到下的顺序控制关键词密度（越上面越重要，我们的域名是“2kawaii.com”,用的ai模型是gpt4o image）：

## 優先度順 SEOキーワード一覧

### 🔝 第一層：コア機能（AI画像生成・プロンプト・無料関連）
1. ai画像生成 サイト 無料 登録不要  
2. 画像生成ai 無料  
3. チャットgpt 画像生成  
4. gpt4o image  
5. chatgpt プロンプト  
6. プロンプト  
7. プロンプトとは  
8. stable diffusion プロンプト  

### 🧰 第二層：周辺ニーズ（写真加工・壁紙・スタンプ・アイコン）
9. 写真加工アプリ無料  
10. 写真加工  
11. ジブリ風 写真加工  
12. ジブリ風  
13. 可愛い壁紙  
14. iphone 壁紙  
15. スマホ 壁紙  
16. pc 壁紙  
17. line 可愛アイコン  
18. 無料スタンプ  

### 🎨 第三層：キャラ・趣味系（擬人化・萌え・Vtuber）
19. chibi  
20. SDキャラ  
21. 萌え化  
22. 獣耳  
23. 猫 擬人化  
24. 犬 擬人化  
25. ペット 擬人化  
26. チャットgpt 擬人化  
27. ボケモン擬人化  
28. サンリオ 擬人化  
29. Vtuber  

### 🛠️ 第四層：専門・技術・補足キーワード
30. lora  
31. canvas  
32. ゴシック  
33. irasutoya  

其他相关关键词（自行从页面内容中提取或参考 SERP）

请执行以下操作：

重写所有页面的 <title> 和 <meta name="description">

所有 description 限制在 160 个字符以内

不要添加 <meta name="keywords"> 标签

可参考 Google/Bing 上 SERP 前 10 页面的标题和描述风格

内容语言为日语，确保自然、简洁、有吸引力

所有修改必须适用于 Next.js App Router 项目结构（例如放入 metadata 对象中）


任务二、````plaintext
我有一个基于 Next.js 的项目，项目 `pages` 目录下有很多页面，想让你帮我一次性生成并校验以下内容，请直接给出要修改或新增的文件和完整代码片段，并附上本地验证步骤：

---
## 1. Next.js 内建 i18n 设置
- 在根目录 `next.config.js` 中添加：
  ```js
  module.exports = {
    i18n: {
      locales: ['ja'],
      defaultLocale: 'ja',
      localeDetection: false,
      prefixDefaultLocale: false,   // 默认 / 指向 ja
    }
  }
````

---

## 2. 自动补全默认主页

* 在 `pages/index.js` 中复用 `pages/ja/index.js`：

  ```js
  import HomeJA from './ja';
  export default HomeJA;
  ```

---

## 3. 内容与技术优化（适用于所有页面）

* 不再在每个页面单独添加 `<link>`，而是在全局入口：

  1. 创建或修改 `pages/_app.js`（或 `.tsx`），引入 `next/head` 和 `next/router`，并自动为当前路由生成所有 locale 的 `<link rel="alternate" hreflang="...">` 标签。
  2. 在 `pages/_document.js`（或 `.tsx`）里：

     ```html
     <html lang="ja">
     <head>
       <meta charSet="utf-8" />
       <!-- JSON-LD Schema.org 示例 -->
       <script type="application/ld+json">
         {
           "@context": "https://schema.org",
           "@type": "WebSite",
           "url": "https://your-domain.com/ja/",
           "name": "あなたのサイト名（日本語）"
         }
       </script>
     </head>
     <body>…</body>
     </html>
     ```

---

## 4. Sitemap 与 Robots（自动覆盖所有页面）

* 使用 `next-sitemap`：

  1. `npm install next-sitemap`
  2. 根目录创建 `next-sitemap.config.js`：

     ```js
     module.exports = {
       siteUrl: 'https://your-domain.com',
       generateRobotsTxt: true,
       exclude: [],            // 若有不想收录的路径可在此列出
       i18n: {
         locales: ['ja'],
         defaultLocale: 'ja',
       },
     }
     ```
  3. 在 `package.json` `scripts` 中添加：

     ```json
     "scripts": {
       "postbuild": "next-sitemap"
     }
     ```
* 这样可自动扫描 `pages` 下的所有路由并生成 `public/sitemap.xml` 与 `public/robots.txt`。

---

## 5. 本地验证

* 运行 `npm run dev`，访问：

  * `http://localhost:3000/` → 应返回日文首页
  * `http://localhost:3000/ja/` → 应返回相同日文首页
  * 其他任意页面，如 `http://localhost:3000/ja/about` → 应正常访问，且在 `<head>` 中可见对应的 `<link rel="alternate">` 标签
* 用 `curl -I` 检查 HTTP 200，否则检查 i18n 配置、`pages/_app.js` 和目录结构。

---

请给出上述所有文件的完整代码示例，并标注文件路径。

```
```
