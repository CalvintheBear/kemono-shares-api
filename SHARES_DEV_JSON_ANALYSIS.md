# shares-dev.json 文件格式与使用分析

## 📁 文件概述

`shares-dev.json` 是furycode项目中的本地开发数据存储文件，用于在开发环境中持久化分享数据。

**文件路径**: `local-storage/shares-dev.json`

## 🏗️ 数据结构

### 根结构
```json
{
  "share_id_1": { ShareData },
  "share_id_2": { ShareData },
  ...
}
```

### ShareData 接口定义
```typescript
interface ShareData {
  id: string                    // 分享ID，格式: share_timestamp_random
  generatedUrl: string          // 生成的图片URL
  originalUrl: string | null    // 原图URL（图生图模式）或null（文生图模式）
  prompt: string               // 生成提示词
  style: string                // 风格类型
  timestamp: number            // 时间戳（毫秒）
  createdAt: string            // 创建时间（ISO格式）
  isR2Stored?: boolean         // 是否存储在R2
  isTextToImage?: boolean      // 是否为文生图模式
}
```

### 示例数据
```json
{
  "share_1753692251015_feybsyqle": {
    "id": "share_1753692251015_feybsyqle",
    "generatedUrl": "https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/kie-downloads/share-カスタム-1753692246929.png",
    "originalUrl": null,
    "prompt": "ちびキャラクター、Q版デフォルメ、可愛らしい小さな体、大きな頭、ふわふわした雰囲気、癒し系",
    "style": "カスタム",
    "timestamp": 1753692246929,
    "createdAt": "2025-07-28T08:44:11.015Z",
    "isR2Stored": true,
    "isTextToImage": true
  }
}
```

## 🔗 引用关系

### 1. 核心存储模块
**文件**: `src/lib/share-store-kv.ts`

#### 读取函数
```typescript
function readDevJson(): Record<string, ShareData> {
  try {
    if (fs.existsSync(DEV_JSON_PATH)) {
      const raw = fs.readFileSync(DEV_JSON_PATH, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (e) {
    console.warn('⚠️ 读取本地持久化分享数据失败:', e)
  }
  return {}
}
```

#### 写入函数
```typescript
function writeDevJson(data: Record<string, ShareData>) {
  try {
    fs.writeFileSync(DEV_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8')
    console.log('💾 已写入本地持久化分享数据:', DEV_JSON_PATH)
  } catch (e) {
    console.warn('⚠️ 写入本地持久化分享数据失败:', e)
  }
}
```

#### 使用场景
- **getAll()**: 从JSON文件加载所有分享数据
- **set()**: 保存新数据到JSON文件
- **delete()**: 从JSON文件删除数据
- **get()**: 从JSON文件获取单个分享数据

### 2. 数据修复脚本
**文件**: `fix-old-share-data.js`, `fix-old-share-data-v2.js`
- 用于修复历史数据中的格式问题
- 更新 `isTextToImage` 字段
- 清理无效数据

### 3. 调试工具
**文件**: `debug-share-types.js`, `check-share-data.js`
- 分析数据分布
- 验证数据完整性
- 统计文生图vs图生图比例

### 4. 测试脚本
**文件**: `test-share-fix.js`
- 测试数据修复功能
- 验证筛选逻辑

## 🔄 数据流程

### 开发环境数据流
```
用户操作 → 内存缓存 → shares-dev.json → 持久化存储
    ↑                                    ↓
    ←─────────── 读取数据 ────────────────┘
```

### 生产环境数据流
```
用户操作 → 内存缓存 → Cloudflare KV → 持久化存储
    ↑                                    ↓
    ←─────────── 读取数据 ────────────────┘
```

## 📊 数据统计

### 当前数据分布
- **总记录数**: 约60+条
- **文生图模式**: `isTextToImage: true` (originalUrl为null)
- **图生图模式**: `isTextToImage: false` (originalUrl有值)
- **模板模式**: 特殊图生图，originalUrl包含placeholder

### 风格类型分布
- カスタム (自定义)
- irasutoya (插画屋)
- 擬人化 (拟人化)
- ウマ娘 (赛马娘)
- 原神異世界 (原神异世界)
- LINEスタンプ (LINE贴纸)
- ヤンデレ&地雷女 (病娇&地雷女)

## 🛠️ 维护操作

### 数据清理
```bash
# 清理过期数据（30天前）
node scripts/cleanup-old-data.js

# 修复数据格式
node fix-old-share-data.js
```

### 数据验证
```bash
# 检查数据完整性
node check-share-data.js

# 分析数据类型分布
node debug-share-types.js
```

### 数据备份
```bash
# 备份当前数据
cp local-storage/shares-dev.json local-storage/shares-dev-backup.json
```

## ⚠️ 注意事项

### 1. 数据一致性
- 确保 `id` 字段与对象键名一致
- 验证 `timestamp` 和 `createdAt` 的时间一致性
- 检查 `isTextToImage` 字段的准确性

### 2. 文件大小
- 当前文件约687行，包含60+条记录
- 建议定期清理过期数据
- 监控文件大小增长

### 3. 开发环境限制
- 仅在 `NODE_ENV === 'development'` 时使用
- 生产环境使用 Cloudflare KV 存储
- 本地文件作为开发时的数据备份

## 🔮 未来优化

### 1. 数据压缩
- 考虑使用压缩格式减少文件大小
- 实现增量备份机制

### 2. 数据验证
- 添加数据完整性检查
- 实现自动数据修复

### 3. 性能优化
- 实现数据分片存储
- 添加数据索引机制

---

*分析时间: 2025-07-28*
*数据版本: v1.0* 