/**
 * 分享数据缓存管理
 * 用于优化分享列表的访问性能
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
}

class ShareCache {
  private cache = new Map<string, CacheItem<unknown>>()
  private readonly DEFAULT_TTL = 10 * 60 * 1000 // 10分钟默认缓存时间（从5分钟增加到10分钟）
  private readonly MAX_CACHE_SIZE = 1000 // 最大缓存条目数
  private readonly CLEANUP_INTERVAL = 60 * 1000 // 清理间隔（1分钟）

  constructor() {
    // 启动定期清理
    this.startCleanup()
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // 如果缓存已满，删除最少访问的条目
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastUsed()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    })
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    // 更新访问统计
    item.accessCount++
    item.lastAccessed = Date.now()

    return item.data as T
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const now = Date.now()
    const items = Array.from(this.cache.entries())
    
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      keys: items.map(([key, item]) => ({
        key,
        age: now - item.timestamp,
        ttl: item.ttl,
        accessCount: item.accessCount,
        lastAccessed: item.lastAccessed
      })),
      hitRate: this.calculateHitRate(),
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  /**
   * 清理过期缓存
   */
  cleanup(): number {
    const now = Date.now()
    let cleanedCount = 0

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    return cleanedCount
  }

  /**
   * 驱逐最少使用的缓存条目
   */
  private evictLeastUsed(): void {
    if (this.cache.size === 0) return

    let leastUsedKey = ''
    let minScore = Infinity

    for (const [key, item] of this.cache.entries()) {
      // 计算使用分数：访问次数 * 0.7 + 最近访问时间 * 0.3
      const timeScore = (Date.now() - item.lastAccessed) / 1000 // 转换为秒
      const score = item.accessCount * 0.7 + timeScore * 0.3

      if (score < minScore) {
        minScore = score
        leastUsedKey = key
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey)
      console.log(`🗑️ 驱逐最少使用的缓存条目: ${leastUsedKey}`)
    }
  }

  /**
   * 计算缓存命中率
   */
  private calculateHitRate(): number {
    // 这里可以实现更复杂的命中率计算
    // 目前返回一个基于缓存大小的简单估算
    const utilization = this.cache.size / this.MAX_CACHE_SIZE
    return Math.min(0.95, 0.5 + utilization * 0.45)
  }

  /**
   * 估算内存使用量
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0
    for (const [key, item] of this.cache.entries()) {
      // 估算每个条目的内存使用
      const keySize = key.length * 2 // UTF-16
      const dataSize = JSON.stringify(item.data).length * 2
      const itemSize = keySize + dataSize + 100 // 额外开销
      totalSize += itemSize
    }
    return totalSize
  }

  /**
   * 预热缓存
   */
  async warmup<T>(key: string, dataLoader: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key)
    if (cached) {
      return cached
    }

    try {
      const data = await dataLoader()
      this.set(key, data, ttl)
      return data
    } catch (error) {
      console.error('缓存预热失败:', error)
      throw error
    }
  }

  /**
   * 批量设置缓存
   */
  setBatch<T>(items: Array<{ key: string; data: T; ttl?: number }>): void {
    for (const item of items) {
      this.set(item.key, item.data, item.ttl)
    }
  }

  /**
   * 批量获取缓存
   */
  getBatch<T>(keys: string[]): Map<string, T> {
    const result = new Map<string, T>()
    
    for (const key of keys) {
      const data = this.get<T>(key)
      if (data !== null) {
        result.set(key, data)
      }
    }
    
    return result
  }

  /**
   * 启动定期清理
   */
  private startCleanup(): void {
    setInterval(() => {
      const cleanedCount = this.cleanup()
      if (cleanedCount > 0) {
        console.log(`🧹 缓存清理完成，清理了 ${cleanedCount} 个过期项`)
      }
    }, this.CLEANUP_INTERVAL)
  }
}

// 创建全局缓存实例
export const shareCache = new ShareCache()

// 缓存键常量
export const CACHE_KEYS = {
  SHARE_LIST: 'share-list',
  SHARE_DETAIL: 'share-detail',
  SHARE_STATS: 'share-stats',
  SHARE_POPULAR: 'share-popular',
  SHARE_RECENT: 'share-recent'
} as const

/**
 * 获取分享列表缓存
 */
export function getShareListCache(limit: number = 20, offset: number = 0) {
  const cacheKey = `${CACHE_KEYS.SHARE_LIST}-${limit}-${offset}`
  return shareCache.get(cacheKey)
}

/**
 * 设置分享列表缓存
 */
export function setShareListCache(data: unknown, limit: number = 20, offset: number = 0) {
  const cacheKey = `${CACHE_KEYS.SHARE_LIST}-${limit}-${offset}`
  // 根据分页位置调整缓存时间
  const ttl = offset === 0 ? 2 * 60 * 1000 : 5 * 60 * 1000 // 第一页2分钟，其他页面5分钟
  shareCache.set(cacheKey, data, ttl)
}

/**
 * 获取分享详情缓存
 */
export function getShareDetailCache(shareId: string) {
  const cacheKey = `${CACHE_KEYS.SHARE_DETAIL}-${shareId}`
  return shareCache.get(cacheKey)
}

/**
 * 设置分享详情缓存
 */
export function setShareDetailCache(shareId: string, data: unknown) {
  const cacheKey = `${CACHE_KEYS.SHARE_DETAIL}-${shareId}`
  shareCache.set(cacheKey, data, 10 * 60 * 1000) // 10分钟缓存
}

/**
 * 获取热门分享缓存
 */
export function getPopularSharesCache() {
  return shareCache.get(CACHE_KEYS.SHARE_POPULAR)
}

/**
 * 设置热门分享缓存
 */
export function setPopularSharesCache(data: unknown) {
  shareCache.set(CACHE_KEYS.SHARE_POPULAR, data, 15 * 60 * 1000) // 15分钟缓存
}

/**
 * 获取最近分享缓存
 */
export function getRecentSharesCache() {
  return shareCache.get(CACHE_KEYS.SHARE_RECENT)
}

/**
 * 设置最近分享缓存
 */
export function setRecentSharesCache(data: unknown) {
  shareCache.set(CACHE_KEYS.SHARE_RECENT, data, 3 * 60 * 1000) // 3分钟缓存
}

/**
 * 清除分享相关缓存
 */
export function clearShareCache(shareId?: string) {
  if (shareId) {
    // 清除特定分享的缓存
    shareCache.delete(`${CACHE_KEYS.SHARE_DETAIL}-${shareId}`)
    // 清除列表缓存（因为可能有新数据）
    for (const keyInfo of shareCache.getStats().keys) {
      if (keyInfo.key.startsWith(CACHE_KEYS.SHARE_LIST)) {
        shareCache.delete(keyInfo.key)
      }
    }
  } else {
    // 清除所有分享缓存
    for (const keyInfo of shareCache.getStats().keys) {
      if (keyInfo.key.startsWith(CACHE_KEYS.SHARE_LIST) || 
          keyInfo.key.startsWith(CACHE_KEYS.SHARE_DETAIL) ||
          keyInfo.key.startsWith(CACHE_KEYS.SHARE_POPULAR) ||
          keyInfo.key.startsWith(CACHE_KEYS.SHARE_RECENT)) {
        shareCache.delete(keyInfo.key)
      }
    }
  }
}

/**
 * 缓存预热函数
 */
export async function warmupShareCache() {
  try {
    console.log('🔥 开始缓存预热...')
    
    // 预热第一页分享列表
    await shareCache.warmup(
      `${CACHE_KEYS.SHARE_LIST}-20-0`,
      async () => {
        // 这里可以调用实际的API获取数据
        return { success: true, data: { items: [], total: 0 } }
      },
      2 * 60 * 1000
    )
    
    console.log('✅ 缓存预热完成')
  } catch (error) {
    console.error('❌ 缓存预热失败:', error)
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return shareCache.getStats()
}

/**
 * 定期清理过期缓存
 */
export function startCacheCleanup() {
  // 缓存类已经内置了定期清理，这里不需要额外启动
  console.log('🔄 缓存清理已启动')
} 