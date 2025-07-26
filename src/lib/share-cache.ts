/**
 * 分享数据缓存管理
 * 用于优化分享列表的访问性能
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class ShareCache {
  private cache = new Map<string, CacheItem<unknown>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5分钟默认缓存时间

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
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
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
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
}

// 创建全局缓存实例
export const shareCache = new ShareCache()

// 缓存键常量
export const CACHE_KEYS = {
  SHARE_LIST: 'share-list',
  SHARE_DETAIL: 'share-detail',
  SHARE_STATS: 'share-stats'
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
  shareCache.set(cacheKey, data, 2 * 60 * 1000) // 2分钟缓存
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
 * 清除分享相关缓存
 */
export function clearShareCache(shareId?: string) {
  if (shareId) {
    // 清除特定分享的缓存
    shareCache.delete(`${CACHE_KEYS.SHARE_DETAIL}-${shareId}`)
    // 清除列表缓存（因为可能有新数据）
    for (const key of shareCache.getStats().keys) {
      if (key.startsWith(CACHE_KEYS.SHARE_LIST)) {
        shareCache.delete(key)
      }
    }
  } else {
    // 清除所有分享缓存
    for (const key of shareCache.getStats().keys) {
      if (key.startsWith(CACHE_KEYS.SHARE_LIST) || key.startsWith(CACHE_KEYS.SHARE_DETAIL)) {
        shareCache.delete(key)
      }
    }
  }
}

/**
 * 定期清理过期缓存
 */
export function startCacheCleanup() {
  setInterval(() => {
    const cleanedCount = shareCache.cleanup()
    if (cleanedCount > 0) {
      console.log(`🧹 缓存清理完成，清理了 ${cleanedCount} 个过期项`)
    }
  }, 60 * 1000) // 每分钟清理一次
} 