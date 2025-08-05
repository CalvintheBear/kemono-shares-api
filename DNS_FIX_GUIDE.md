# 🔧 DNS配置修复指南

## 🚨 当前问题
你的DNS配置有误，导致域名解析混乱。

## 📋 需要修复的DNS记录

### 1. Cloudflare Pages域名（前端）
```
类型: CNAME
名称: 2kawaii.com
内容: kemono-shares-api.pages.dev
代理状态: 已代理（橙色云朵）

类型: CNAME  
名称: www
内容: kemono-shares-api.pages.dev
代理状态: 已代理（橙色云朵）
```

### 2. Railway API域名（后端）
```
类型: CNAME
名称: api
内容: kemono-shares-api-production.up.railway.app
代理状态: 仅DNS（灰色云朵）
```

### 3. R2存储域名（保持不变）
```
类型: CNAME
名称: images
内容: pub-d00e7b41917848d1a8403c984cb62880.r2.dev
代理状态: 已代理（橙色云朵）

类型: CNAME
名称: uploads  
内容: pub-9ea5461e9e8b418caecb7e5b7748bdea.r2.dev
代理状态: 已代理（橙色云朵）
```

## 🔄 修复步骤

### 步骤1：在Cloudflare Pages中移除api域名
1. 进入Cloudflare Pages Dashboard
2. 选择你的项目
3. 进入"自定义域"设置
4. 删除 `api.2kawaii.com` 的自定义域配置

### 步骤2：更新DNS记录
1. 进入Cloudflare DNS管理
2. 修改 `api` 记录：
   - 内容改为：`kemono-shares-api-production.up.railway.app`
   - 代理状态改为：仅DNS（灰色云朵）

### 步骤3：验证配置
1. 等待DNS传播（通常5-10分钟）
2. 测试访问：
   - 前端：https://2kawaii.com
   - API：https://api.2kawaii.com
   - 图片：https://images.2kawaii.com

## ✅ 修复后的架构

### Cloudflare Pages（前端）
- 域名：2kawaii.com, www.2kawaii.com
- 功能：静态网站、用户界面

### Railway（API）
- 域名：api.2kawaii.com
- 功能：图片生成、上传等API服务

### Cloudflare R2（存储）
- 域名：images.2kawaii.com, uploads.2kawaii.com
- 功能：图片存储

## 🚨 重要提醒
1. 确保 `api.2kawaii.com` 的代理状态是"仅DNS"，不要通过Cloudflare代理
2. 只有前端域名（2kawaii.com, www.2kawaii.com）需要"已代理"状态
3. 等待DNS传播完成后再测试 