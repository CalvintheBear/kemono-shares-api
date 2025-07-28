export interface ShareData {
  id: string
  generatedUrl: string
  originalUrl: string
  prompt: string
  style: string
  timestamp: number
  createdAt: string
  isR2Stored?: boolean
}

// Cloudflare KV 存储类
export class ShareKVStore {
  private kv: any = null // KVNamespace 类型在 Cloudflare Workers 环境中可用
  private memoryCache = new Map<string, ShareData>() // 内存缓存
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存

  constructor() {
    // 在 Cloudflare Workers 环境中，KV 会自动注入
    if (typeof globalThis !== 'undefined' && (globalThis as any).SHARE_DATA_KV) {
      this.kv = (globalThis as any).SHARE_DATA_KV
    }
  }

  // 检查是否在 Cloudflare Workers 环境
  private isCloudflareWorkers(): boolean {
    return typeof globalThis !== 'undefined' && 
           (globalThis as any).SHARE_DATA_KV !== undefined
  }

  // 生成 KV 键名
  private getKey(shareId: string): string {
    return `share:${shareId}`
  }

  // 生成列表键名
  private getListKey(): string {
    return 'share:list'
  }

  // 存储分享数据
  async set(shareId: string, data: ShareData): Promise<void> {
    try {
      // 更新内存缓存
      this.memoryCache.set(shareId, data)

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
      }
    } catch (error) {
      console.error('❌ 存储数据失败:', error)
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
          const results: ShareData[] = []
          
          // 并行获取所有分享数据
          const promises = shareIds.map(id => this.get(id))
          const shareDataList = await Promise.all(promises)
          
          // 过滤掉空值并按时间排序
          return shareDataList
            .filter((data): data is ShareData => data !== null)
            .sort((a, b) => b.timestamp - a.timestamp)
        }
      }

      // 回退到内存缓存
      return Array.from(this.memoryCache.values())
        .sort((a, b) => b.timestamp - a.timestamp)
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

      return true
    } catch (error) {
      console.error('❌ 删除数据失败:', error)
      return false
    }
  }

  // 更新分享列表
  private async updateShareList(shareId: string, data: ShareData): Promise<void> {
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

// 初始化函数
export const initializeSampleData = async () => {
  const size = await shareKVStore.size()
  console.log('📊 分享存储初始化完成，当前存储大小:', size)
} 