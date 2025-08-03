// Edge Runtime 兼容：移除 Node.js 模块

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
  private kv: KVNamespace | null = null // KVNamespace 类型在 Cloudflare Workers 环境中可用
  private memoryCache = new Map<string, ShareData>() // 内存缓存
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存
  private isInitialized = false
  private shareIdList: string[] = [] // 分享ID列表（用于非Cloudflare环境）

  constructor() {
    this.initializeKV()
  }

  // 初始化KV存储
  private initializeKV() {
    try {
      // 检查是否在 Cloudflare Workers 环境
      if (typeof globalThis !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const globalAny = globalThis as Record<string, unknown>
        
        // 检查多种可能的KV绑定名称
        const possibleBindings = [
          'SHARE_DATA_KV',
          'KV',
          '__KV__',
          'KV_NAMESPACE'
        ]
        
        for (const binding of possibleBindings) {
          if (globalAny[binding]) {
            this.kv = globalAny[binding]
            break
          }
        }
      }
      
      this.isInitialized = true
    } catch (_error) {
      this.isInitialized = false
    }
  }

  // 检查是否在 Cloudflare Workers 环境
  private isCloudflareWorkers(): boolean {
    // 避免递归调用，使用简单检查
    try {
      // 检查CF_WORKER环境变量
      if (typeof process !== 'undefined' && process.env.CF_WORKER === 'true') {
        return true
      }
      
      // 检查全局变量
      if (typeof globalThis !== 'undefined') {
        const globalAny = globalThis as Record<string, unknown>
        return (
          globalAny.SHARE_DATA_KV !== undefined ||
          globalAny.KV !== undefined ||
          globalAny.__KV__ !== undefined ||
          globalAny.KV_NAMESPACE !== undefined ||
          globalAny.CF_WORKER === true
        )
      }
      
      return false
    } catch (_error) {
      return false
    }
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

      // 确保isTextToImage字段正确设置
      if (data.isTextToImage === undefined) {
        data.isTextToImage = !data.originalUrl || data.originalUrl === null || data.originalUrl === ''
        console.log('🔧 自动设置isTextToImage:', data.isTextToImage)
      }

      const isWorkers = this.isCloudflareWorkers()
      
      if (isWorkers) {
        if (this.kv) {
          // 存储到 KV
          await this.kv.put(this.getKey(shareId), JSON.stringify(data), {
            expirationTtl: 60 * 60 * 24 * 30 // 30天过期
          })

          // 更新分享列表
          await this.updateShareList(shareId, data)
          
          console.log('✅ 数据已存储到 Cloudflare KV:', shareId)
        } else {
          console.log('⚠️ Cloudflare Workers环境中但KV不可用，使用内存存储:', shareId)
          // 仍然更新列表，以便后续可能迁移到KV
          await this.updateShareList(shareId, data)
        }
      } else {
        console.log('⚠️ 不在 Cloudflare Workers 环境，使用内存存储:', shareId)
        // 确保内存模式下也能维护分享ID列表
        await this.updateShareList(shareId, data)
        
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
      // 不要抛出错误，保持内存缓存可用
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

      // 非Cloudflare环境：使用内存列表
      if (!this.isCloudflareWorkers()) {
        // 使用内存中的分享ID列表，确保顺序正确
        const shareDataList = this.shareIdList.map(id => this.memoryCache.get(id))
          .filter((data): data is ShareData => data !== undefined)
          .sort((a, b) => b.timestamp - a.timestamp)
        
        console.log('📦 从内存列表获取所有数据:', shareDataList.length, '个分享')
        console.log('📋 内存中的分享ID列表:', this.shareIdList)
        console.log('📊 内存缓存内容:', Array.from(this.memoryCache.keys()))
        return shareDataList
      }

      // 在开发环境中，从本地JSON文件加载数据
      if (isDev()) {
        const devData = readDevJson()
        const devDataArray = Object.values(devData)
          .sort((a, b) => b.timestamp - a.timestamp)
        
        console.log('📦 从本地JSON文件获取所有数据:', devDataArray.length, '个分享')
        return devDataArray
      }

      // 最终回退：直接返回内存缓存所有数据
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
    try {
      if (this.isCloudflareWorkers() && this.kv) {
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
      } else {
        // 内存环境：直接更新内存列表
        if (!this.shareIdList.includes(shareId)) {
          this.shareIdList.unshift(shareId)
          
          // 限制列表长度（最多1000个）
          if (this.shareIdList.length > 1000) {
            this.shareIdList = this.shareIdList.slice(0, 1000)
          }
        }
      }
    } catch (error) {
      console.error('❌ 更新分享列表失败:', error)
    }
  }

  // 从分享列表中删除
  private async removeFromShareList(shareId: string): Promise<void> {
    try {
      if (this.isCloudflareWorkers() && this.kv) {
        const listData = await this.kv.get(this.getListKey())
        if (listData) {
          let shareIds = JSON.parse(listData) as string[]
          shareIds = shareIds.filter(id => id !== shareId)
          
          await this.kv.put(this.getListKey(), JSON.stringify(shareIds), {
            expirationTtl: 60 * 60 * 24 * 30
          })
        }
      } else {
        // 内存环境：从内存列表中移除
        this.shareIdList = this.shareIdList.filter(id => id !== shareId)
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

// Edge Runtime 兼容：禁用本地文件系统操作
function isDev() {
  return false // Edge Runtime 中始终返回 false
}

function readDevJson(): Record<string, ShareData> {
  // Edge Runtime 中不支持文件系统操作，返回空对象
  return {}
}

function writeDevJson(_data: Record<string, ShareData>) {
  // Edge Runtime 中不支持文件系统操作，空操作
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