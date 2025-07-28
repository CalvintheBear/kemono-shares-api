import fs from 'fs'
import path from 'path'

export interface ShareData {
  id: string
  generatedUrl: string
  originalUrl: string | null
  prompt: string
  style: string
  timestamp: number
  createdAt: string
  isR2Stored?: boolean
  isTextToImage?: boolean
}

// Cloudflare KV 存储类
export class ShareKVStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private kv: any = null // KVNamespace 类型在 Cloudflare Workers 环境中可用
  private memoryCache = new Map<string, ShareData>() // 内存缓存
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存
  private isInitialized = false

  constructor() {
    this.initializeKV()
  }

  // 初始化KV存储
  private initializeKV() {
    try {
      // 检查是否在 Cloudflare Workers 环境
      if (typeof globalThis !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const globalAny = globalThis as any
        
        // 检查多种可能的KV绑定名称
        if (globalAny.SHARE_DATA_KV) {
          this.kv = globalAny.SHARE_DATA_KV
          console.log('✅ Cloudflare KV 存储已初始化 (SHARE_DATA_KV)')
        } else if (globalAny.KV) {
          this.kv = globalAny.KV
          console.log('✅ Cloudflare KV 存储已初始化 (KV)')
        } else if (globalAny.__KV__) {
          this.kv = globalAny.__KV__
          console.log('✅ Cloudflare KV 存储已初始化 (__KV__)')
        } else {
          // 只在非生产环境下显示警告
          if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️ 未检测到 Cloudflare KV 绑定，将使用内存存储')
          }
        }
      }
      
      this.isInitialized = true
    } catch (error) {
      console.error('❌ KV 初始化失败:', error)
      this.isInitialized = false
    }
  }

  // 检查是否在 Cloudflare Workers 环境
  private isCloudflareWorkers(): boolean {
    if (!this.isInitialized) {
      this.initializeKV()
    }
    
    // 检查多种环境标识
    const isWorkers = typeof globalThis !== 'undefined' && (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).SHARE_DATA_KV !== undefined ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).KV !== undefined ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__KV__ !== undefined ||
      // 检查环境变量
      process.env.NODE_ENV === 'production' ||
      process.env.CF_WORKER === 'true' ||
      // 检查用户代理
      (typeof navigator !== 'undefined' && navigator.userAgent.includes('Cloudflare'))
    )
    
    return isWorkers && this.kv !== null
  }

  // 生成 KV 键名
  private getKey(shareId: string): string {
    return `share:${shareId}`
  }

  // 生成列表键名
  private getListKey(): string {
    return 'share:list'
  }

  async set(shareId: string, data: ShareData): Promise<void> {
    try {
      // 更新内存缓存
      this.memoryCache.set(shareId, data)
      console.log('💾 数据已保存到内存缓存:', shareId, '当前缓存大小:', this.memoryCache.size)

      if (this.isCloudflareWorkers() && this.kv) {
        // 存储到 KV
        await this.kv.put(this.getKey(shareId), JSON.stringify(data), {
          expirationTtl: 60 * 60 * 24 * 30 // 30天过期
        })

        // 更新分享列表
        await this.updateShareList(shareId, data)
        
        console.log('✅ 数据已存储到 Cloudflare KV:', shareId)
      } else {
        console.log('⚠️ 不在 Cloudflare Workers 环境，仅使用内存存储:', shareId)
        // 在开发环境中，也尝试保存到本地存储作为备份
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const key = `share_backup_${shareId}`
            window.localStorage.setItem(key, JSON.stringify({
              data,
              timestamp: Date.now()
            }))
            console.log('💾 数据已备份到本地存储:', shareId)
          } catch (e) {
            console.warn('⚠️ 本地存储备份失败:', e)
          }
        }
      }
      if (isDev()) {
        // 本地持久化
        const all = readDevJson()
        all[shareId] = data
        writeDevJson(all)
      }
    } catch (error) {
      console.error('❌ 存储数据失败:', error)
      // 即使KV存储失败，也要保持内存缓存
      console.log('🔄 回退到内存存储:', shareId)
      throw error
    }
  }

  // 获取分享数据
  async get(shareId: string): Promise<ShareData | null> {
    try {
      // 先检查内存缓存
      const cached = this.memoryCache.get(shareId)
      if (cached) {
        console.log('📦 从内存缓存获取数据:', shareId)
        return cached
      }

      if (this.isCloudflareWorkers() && this.kv) {
        // 从 KV 获取
        const data = await this.kv.get(this.getKey(shareId))
        if (data) {
          const shareData = JSON.parse(data) as ShareData
          // 更新内存缓存
          this.memoryCache.set(shareId, shareData)
          console.log('📦 从 KV 获取数据:', shareId)
          return shareData
        }
      }

      // 如果KV中没有数据，尝试从本地存储恢复
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const key = `share_backup_${shareId}`
          const backupData = window.localStorage.getItem(key)
          if (backupData) {
            const parsed = JSON.parse(backupData)
            if (parsed.data && parsed.timestamp) {
              // 检查备份数据是否过期（7天）
              const isExpired = Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000
              if (!isExpired) {
                console.log('🔄 从本地存储恢复数据:', shareId)
                this.memoryCache.set(shareId, parsed.data)
                return parsed.data
              } else {
                // 删除过期的备份数据
                window.localStorage.removeItem(key)
              }
            }
          }
        } catch (e) {
          console.warn('⚠️ 本地存储恢复失败:', e)
        }
      }
      if (isDev()) {
        const all = readDevJson()
        return all[shareId] || null
      }

      return null
    } catch (error) {
      console.error('❌ 获取数据失败:', error)
      return null
    }
  }

  // 获取所有分享数据
  async getAll(): Promise<ShareData[]> {
    try {
      if (this.isCloudflareWorkers() && this.kv) {
        // 从 KV 获取列表
        const listData = await this.kv.get(this.getListKey())
        if (listData) {
          const shareIds = JSON.parse(listData) as string[]
          
          // 并行获取所有分享数据
          const promises = shareIds.map(id => this.get(id))
          const shareDataList = await Promise.all(promises)
          
          // 过滤掉空值并按时间排序
          return shareDataList
            .filter((data): data is ShareData => data !== null)
            .sort((a, b) => b.timestamp - a.timestamp)
        }
      }

      // 在开发环境中，从本地JSON文件加载数据
      if (isDev()) {
        const devData = readDevJson()
        const devDataArray = Object.values(devData)
          .sort((a, b) => b.timestamp - a.timestamp)
        
        console.log('📦 从本地JSON文件获取所有数据:', devDataArray.length, '个分享')
        return devDataArray
      }

      // 回退到内存缓存
      const memoryData = Array.from(this.memoryCache.values())
        .sort((a, b) => b.timestamp - a.timestamp)
      
      console.log('📦 从内存缓存获取所有数据:', memoryData.length, '个分享')
      return memoryData
    } catch (error) {
      console.error('❌ 获取所有数据失败:', error)
      return []
    }
  }

  // 删除分享数据
  async delete(shareId: string): Promise<boolean> {
    try {
      // 从内存缓存删除
      this.memoryCache.delete(shareId)

      if (this.isCloudflareWorkers() && this.kv) {
        // 从 KV 删除
        await this.kv.delete(this.getKey(shareId))
        
        // 从列表中删除
        await this.removeFromShareList(shareId)
        
        console.log('✅ 数据已从 KV 删除:', shareId)
        return true
      }

      // 删除本地存储备份
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const key = `share_backup_${shareId}`
          window.localStorage.removeItem(key)
        } catch (e) {
          console.warn('⚠️ 删除本地存储备份失败:', e)
        }
      }
      if (isDev()) {
        const all = readDevJson()
        delete all[shareId]
        writeDevJson(all)
        return true
      }

      return true
    } catch (error) {
      console.error('❌ 删除数据失败:', error)
      return false
    }
  }

  // 更新分享列表
  private async updateShareList(shareId: string, _data: ShareData): Promise<void> {
    if (!this.kv) return

    try {
      const listData = await this.kv.get(this.getListKey())
      let shareIds: string[] = []
      
      if (listData) {
        shareIds = JSON.parse(listData)
      }

      // 添加新的分享ID（如果不存在）
      if (!shareIds.includes(shareId)) {
        shareIds.unshift(shareId) // 添加到开头
        
        // 限制列表长度（最多1000个）
        if (shareIds.length > 1000) {
          shareIds = shareIds.slice(0, 1000)
        }

        await this.kv.put(this.getListKey(), JSON.stringify(shareIds), {
          expirationTtl: 60 * 60 * 24 * 30 // 30天过期
        })
      }
    } catch (error) {
      console.error('❌ 更新分享列表失败:', error)
    }
  }

  // 从分享列表中删除
  private async removeFromShareList(shareId: string): Promise<void> {
    if (!this.kv) return

    try {
      const listData = await this.kv.get(this.getListKey())
      if (listData) {
        let shareIds = JSON.parse(listData) as string[]
        shareIds = shareIds.filter(id => id !== shareId)
        
        await this.kv.put(this.getListKey(), JSON.stringify(shareIds), {
          expirationTtl: 60 * 60 * 24 * 30
        })
      }
    } catch (error) {
      console.error('❌ 从分享列表删除失败:', error)
    }
  }

  // 获取存储大小
  async size(): Promise<number> {
    if (this.isCloudflareWorkers() && this.kv) {
      try {
        const listData = await this.kv.get(this.getListKey())
        if (listData) {
          const shareIds = JSON.parse(listData) as string[]
          return shareIds.length
        }
      } catch (error) {
        console.error('❌ 获取存储大小失败:', error)
      }
    }
    
    return this.memoryCache.size
  }

  // 清理过期数据
  async cleanup(): Promise<void> {
    try {
      const allData = await this.getAll()
      const now = Date.now()
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
      
      const expiredData = allData.filter(data => data.timestamp < thirtyDaysAgo)
      
      for (const data of expiredData) {
        await this.delete(data.id)
      }
      
      console.log(`🧹 清理了 ${expiredData.length} 个过期数据`)
    } catch (error) {
      console.error('❌ 清理数据失败:', error)
    }
  }

  // 获取存储状态信息
  getStorageInfo() {
    return {
      isWorkers: this.isCloudflareWorkers(),
      isInitialized: this.isInitialized,
      hasKV: this.kv !== null,
      memoryCacheSize: this.memoryCache.size,
      environment: process.env.NODE_ENV || 'unknown'
    }
  }
}

const DEV_JSON_PATH = path.resolve(process.cwd(), 'local-storage/shares-dev.json')

function isDev() {
  return process.env.NODE_ENV === 'development'
}

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

function writeDevJson(data: Record<string, ShareData>) {
  try {
    fs.writeFileSync(DEV_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8')
    console.log('💾 已写入本地持久化分享数据:', DEV_JSON_PATH)
  } catch (e) {
    console.warn('⚠️ 写入本地持久化分享数据失败:', e)
  }
}

// 创建全局实例
export const shareKVStore = new ShareKVStore()

// 兼容性接口
export const shareDataStore = {
  set: (key: string, value: ShareData) => shareKVStore.set(key, value),
  get: (key: string) => shareKVStore.get(key),
  delete: (key: string) => shareKVStore.delete(key),
  size: () => shareKVStore.size(),
  clear: () => shareKVStore.cleanup()
}

// 初始化函数 - 移除模拟数据，完全依赖真实数据
export const initializeSampleData = async () => {
  const size = await shareKVStore.size()
  const storageInfo = shareKVStore.getStorageInfo()
  
  console.log('📊 分享存储初始化完成:', {
    storageSize: size,
    ...storageInfo
  })
  
  // 在开发环境中，可以添加一些测试数据（可选）
  if (process.env.NODE_ENV === 'development' && size === 0) {
    console.log('🔧 开发环境：存储为空，可以添加测试数据')
  }
} 