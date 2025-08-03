# 🚀 生产环境修复部署指南

## 📋 问题总结

### ❌ 已识别问题
1. **524 Timeout Error** - Cloudflare Workers 100秒限制
2. **401 API权限错误** - KIE AI 配置问题
3. **404路由错误** - Edge Runtime限制
4. **R2存储失败** - 缺少访问密钥
5. **轮询中断** - 超时处理缺陷

### ✅ 已实施修复
1. **分离轮询机制** - 创建独立 `/api/poll-task` 端点
2. **智能上传回退** - R2 → ImgBB 自动切换
3. **超时优化** - 4分钟轮询限制
4. **环境检测** - 运行时自适应
5. **分享防重复** - 5秒重复检测

## 🔧 立即部署步骤

### 1. 环境变量配置

#### Cloudflare Workers 部署
```bash
# 添加必要的环境变量
wrangler secret put KIE_AI_API_KEY
wrangler secret put KIE_AI_USER_ID
wrangler secret put CLOUDFLARE_R2_ACCESS_KEY_ID
wrangler secret put CLOUDFLARE_R2_SECRET_ACCESS_KEY
wrangler secret put IMGBB_API_KEY

# 验证配置
wrangler deploy --dry-run
```

#### Railway 部署
```bash
# 设置 Railway 环境变量
railway env set KIE_AI_API_KEY=your_key
railway env set KIE_AI_USER_ID=your_user_id
railway env set IMGBB_API_KEY=your_imgbb_key

# 部署
railway deploy
```

### 2. 部署架构选择

#### 方案A: 混合部署 (推荐)
```
┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │     Railway     │
│   Pages/Workers │◄───┤   Node.js API   │
│   (前端)        │    │   (后端API)     │
└─────────────────┘    └─────────────────┘
```

**配置:**
- 前端: Cloudflare Pages
- API: Railway Node.js runtime
- 存储: R2 + ImgBB fallback
- 优势: 无超时限制，完整Node.js支持

#### 方案B: 纯Cloudflare Workers
```bash
# 更新 wrangler.jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "KIE_AI_API_KEY": "", // 使用secret
    "IMGBB_API_KEY": ""   // 使用secret
  }
}
```

### 3. 立即验证脚本

创建测试脚本 `test-production.js`:
```javascript
const endpoints = [
  'https://your-domain.com/api/test-env',
  'https://your-domain.com/api/upload-image',
  'https://your-domain.com/api/generate-image',
  'https://your-domain.com/api/poll-task?taskId=test',
  'https://your-domain.com/api/share/list'
]

async function testEndpoints() {
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint)
      console.log(`✅ ${endpoint}: ${response.status}`)
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`)
    }
  }
}

testEndpoints()
```

### 4. 前端配置更新

#### 更新环境变量
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://your-railway-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

#### 更新前端轮询逻辑
```typescript
// 在 Workspace.tsx 中更新轮询逻辑
const pollProgress = async (taskId: string) => {
  const maxDuration = 4 * 60 * 1000 // 4分钟
  const interval = 2000 // 2秒
  
  const poll = async () => {
    try {
      const response = await fetch(`/api/poll-task?taskId=${taskId}`)
      const data = await response.json()
      
      if (data.status === 'SUCCESS') {
        // 处理成功结果
        return data.urls[0]
      } else if (data.status === 'FAILED') {
        throw new Error(data.error)
      } else {
        // 继续轮询
        setTimeout(poll, interval)
      }
    } catch (error) {
      // 处理错误
    }
  }
  
  // 设置超时保护
  setTimeout(() => {
    // 超时处理
  }, maxDuration)
  
  poll()
}
```

## 🎯 部署验证清单

### 预部署检查
- [ ] 所有环境变量已配置
- [ ] Railway 服务运行正常
- [ ] Cloudflare Workers KV 已绑定
- [ ] R2 存储桶已创建并配置权限

### 功能测试
- [ ] 图片上传 (R2/ImgBB)
- [ ] 任务创建 (KIE AI)
- [ ] 轮询状态 (poll-task)
- [ ] 分享生成
- [ ] 画廊筛选 (文生图/图生图)

### 性能测试
- [ ] 4分钟内完成生成
- [ ] 重复请求5秒内检测
- [ ] 错误回退机制
- [ ] 缓存生效

### 监控设置
```bash
# 健康检查
curl https://your-domain.com/api/health

# 性能监控
curl https://your-domain.com/api/share/monitor
```

## 📊 生产环境配置

### Railway 部署配置
```yaml
# railway.yaml
services:
  web:
    build: npm run build
    start: npm start
    env:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      path: /api/health
      interval: 30s
```

### Cloudflare Workers 配置
```javascript
// wrangler.toml 更新
[env.production]
vars = { 
  NODE_ENV = "production"
  NEXT_PUBLIC_APP_URL = "https://your-domain.com"
}

[[env.production.kv_namespaces]]
binding = "SHARE_DATA_KV"
id = "your-kv-id"
```

## 🔍 调试工具

### 快速诊断命令
```bash
# 环境检查
node scripts/check-production-config.js

# API 连通性测试
node test-kie-connection.js

# 上传测试
node scripts/test-upload.js

# 分享系统测试
node scripts/test-share-r2-integration.js

# 性能测试
node scripts/test-optimizations.js
```

### 实时监控
```bash
# 设置监控脚本
npm run monitor:status

# 日志查看
railway logs --service web
```

## 🚨 回滚计划

### 紧急回滚
如果出现严重问题：
1. 立即切换到 Railway 备份部署
2. 更新 DNS 指向 Railway 域名
3. 回滚代码到上一个稳定版本

### 回滚验证
```bash
# 验证回滚
curl https://backup-domain.com/api/test-env
```

## 📈 性能优化

### 1. 缓存策略
- **KV缓存**: 分享列表缓存5分钟
- **CDN缓存**: 静态资源缓存1小时
- **API缓存**: 任务状态缓存30秒

### 2. 错误处理优化
- **重试机制**: 3次重试，指数退避
- **超时保护**: 4分钟最大轮询时间
- **回退策略**: R2 → ImgBB → 错误提示

### 3. 监控告警
```javascript
// 添加监控钩子
if (data.error) {
  // 发送到监控服务
  fetch('/api/monitor/error', {
    method: 'POST',
    body: JSON.stringify({
      error: data.error,
      taskId: taskId,
      timestamp: new Date().toISOString()
    })
  })
}
```

## 📝 部署后验证

### 完整链路测试
1. 上传测试图片
2. 创建生成任务
3. 监控轮询状态
4. 验证分享页面
5. 检查画廊筛选

### 生产验证命令
```bash
# 测试完整链路
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"测试生成","mode":"text-to-image"}' \
  https://your-domain.com/api/generate-image

# 测试轮询
curl "https://your-domain.com/api/poll-task?taskId=YOUR_TASK_ID"

# 测试分享
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"generatedUrl":"test.jpg","prompt":"test","style":"test"}' \
  https://your-domain.com/api/share
```

## ✅ 部署成功标准

### 功能验证
- [ ] 文生图生成成功
- [ ] 图生图生成成功  
- [ ] 分享页面创建
- [ ] 画廊筛选正常
- [ ] 重复生成防止

### 性能标准
- [ ] 任务创建 < 5秒
- [ ] 轮询间隔 < 2秒
- [ ] 总生成时间 < 4分钟
- [ ] 错误率 < 1%

### 监控指标
- [ ] API响应时间 < 1秒
- [ ] 上传成功率 > 99%
- [ ] 任务完成率 > 95%
- [ ] 用户反馈良好

## 🔄 持续优化

### 每周检查
- 监控错误日志
- 性能指标分析
- 用户反馈收集
- 资源使用优化

### 每月更新
- API密钥轮换
- 依赖包更新
- 性能优化迭代
- 功能增强

---

**部署完成后，请使用提供的验证脚本进行全面测试，确保所有链路正常工作。**