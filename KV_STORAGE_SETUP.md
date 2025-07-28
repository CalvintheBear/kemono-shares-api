# Cloudflare KV 存储设置指南

## 📋 概述

为了解决分享数据在服务器重启后丢失的问题，我们实现了基于 Cloudflare KV 的持久化存储方案。

## 🔍 问题分析

### 当前问题
- **内存存储**：分享数据仅存储在内存中
- **重启丢失**：服务器重启后数据完全丢失
- **无状态环境**：Cloudflare Workers 是无状态环境

### 解决方案
- **Cloudflare KV**：使用 Cloudflare 的键值存储服务
- **数据持久化**：数据在服务器重启后仍然保留
- **自动过期**：30天后自动清理过期数据

## 🛠️ 设置步骤

### 1. 创建 KV 命名空间

#### 使用脚本（推荐）
```bash
# Linux/macOS
./scripts/setup-kv-storage.sh

# Windows PowerShell
.\scripts\setup-kv-storage.ps1
```

#### 手动创建
```bash
# 创建生产环境 KV 命名空间
wrangler kv:namespace create "SHARE_DATA_KV" --preview=false

# 创建预览环境 KV 命名空间
wrangler kv:namespace create "SHARE_DATA_KV" --preview=true
```

### 2. 更新配置文件

脚本会自动更新 `wrangler.jsonc` 文件，添加 KV 配置：

```json
{
  "kv_namespaces": [
    {
      "binding": "SHARE_DATA_KV",
      "id": "your-production-kv-id",
      "preview_id": "your-preview-kv-id"
    }
  ]
}
```

### 3. 部署到 Cloudflare Workers

```bash
wrangler deploy
```

## 📊 存储架构

### 数据结构
```typescript
interface ShareData {
  id: string              // 分享ID
  generatedUrl: string    // 生成的图片URL
  originalUrl: string     // 原始图片URL
  prompt: string          // 提示词
  style: string           // 风格
  timestamp: number       // 时间戳
  createdAt: string       // 创建时间
  isR2Stored?: boolean    // 是否存储在R2
}
```

### 存储策略
- **键名格式**：`share:{shareId}`
- **过期时间**：30天
- **列表键**：`share:list`（存储所有分享ID）
- **内存缓存**：5分钟缓存，提高性能

## 🧪 测试验证

### 运行测试
```bash
npm run test:kv-storage
```

### 测试内容
1. ✅ 分享创建和存储
2. ✅ 分享详情获取
3. ✅ 分享列表获取
4. ✅ 监控信息获取
5. ✅ 数据持久化验证
6. ✅ 数据一致性验证

## 🔧 功能特性

### 自动回退机制
- **本地开发**：使用内存存储
- **生产环境**：使用 Cloudflare KV
- **错误处理**：KV失败时回退到内存

### 性能优化
- **内存缓存**：减少KV访问次数
- **批量操作**：并行获取数据
- **智能清理**：自动清理过期数据

### 监控和日志
- **存储统计**：总分享数、R2存储数
- **性能监控**：访问时间、错误率
- **详细日志**：存储、获取、删除操作

## 📈 性能对比

| 指标 | 内存存储 | KV存储 |
|------|----------|--------|
| 启动时间 | 快 | 中等 |
| 数据持久性 | ❌ | ✅ |
| 内存占用 | 高 | 低 |
| 扩展性 | 有限 | 高 |
| 成本 | 低 | 中等 |

## 🚀 部署检查清单

- [ ] KV 命名空间已创建
- [ ] `wrangler.jsonc` 配置已更新
- [ ] 环境变量已设置
- [ ] 本地测试已通过
- [ ] 部署到 Cloudflare Workers
- [ ] 生产环境测试已通过

## 🔍 故障排除

### 常见问题

#### 1. KV 绑定失败
```
错误：KV namespace not found
解决：检查 wrangler.jsonc 中的 KV ID 是否正确
```

#### 2. 权限错误
```
错误：Access denied
解决：确保 Cloudflare API Token 有 KV 权限
```

#### 3. 数据不持久
```
错误：重启后数据丢失
解决：检查是否在 Cloudflare Workers 环境中运行
```

### 调试命令
```bash
# 查看 KV 数据
wrangler kv:key list --binding=SHARE_DATA_KV

# 获取特定键值
wrangler kv:key get --binding=SHARE_DATA_KV "share:your-share-id"

# 删除测试数据
wrangler kv:key delete --binding=SHARE_DATA_KV "share:your-share-id"
```

## 📞 技术支持

如果遇到问题，请检查：
1. Cloudflare Workers 控制台日志
2. KV 存储状态
3. 网络连接
4. API 权限

---

**注意**：KV 存储有使用限制，请参考 [Cloudflare KV 文档](https://developers.cloudflare.com/workers/runtime-apis/kv/)。 