/**
 * 分享系统监控和日志管理
 * 用于跟踪分享系统的性能、数据统计和错误处理
 */

interface ShareStats {
  totalShares: number
  r2StoredCount: number
  cacheHitRate: number
  averageProcessingTime: number
  errorRate: number
  lastUpdated: string
}

interface ShareEvent {
  type: 'create' | 'view' | 'error' | 'cache_hit' | 'cache_miss'
  shareId?: string
  timestamp: number
  details: any
}

class ShareMonitor {
  private events: ShareEvent[] = []
  private processingTimes: number[] = []
  private errors: ShareEvent[] = []
  private cacheHits = 0
  private cacheMisses = 0
  private readonly MAX_EVENTS = 1000 // 最多保存1000个事件

  /**
   * 记录事件
   */
  logEvent(type: ShareEvent['type'], details: any, shareId?: string) {
    const event: ShareEvent = {
      type,
      shareId,
      timestamp: Date.now(),
      details
    }

    this.events.push(event)
    
    // 限制事件数量
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS)
    }

    // 记录错误
    if (type === 'error') {
      this.errors.push(event)
    }

    // 记录缓存统计
    if (type === 'cache_hit') {
      this.cacheHits++
    } else if (type === 'cache_miss') {
      this.cacheMisses++
    }

    console.log(`📊 [ShareMonitor] ${type}:`, details)
  }

  /**
   * 记录处理时间
   */
  logProcessingTime(timeMs: number) {
    this.processingTimes.push(timeMs)
    
    // 限制处理时间记录数量
    if (this.processingTimes.length > 100) {
      this.processingTimes = this.processingTimes.slice(-100)
    }
  }

  /**
   * 获取统计信息
   */
  getStats(): ShareStats {
    const totalShares = this.events.filter(e => e.type === 'create').length
    const r2StoredCount = this.events.filter(e => 
      e.type === 'create' && e.details?.isR2Stored
    ).length
    
    const cacheHitRate = this.cacheHits + this.cacheMisses > 0 
      ? (this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100 
      : 0
    
    const averageProcessingTime = this.processingTimes.length > 0
      ? this.processingTimes.reduce((sum, time) => sum + time, 0) / this.processingTimes.length
      : 0
    
    const errorRate = this.events.length > 0
      ? (this.errors.length / this.events.length) * 100
      : 0

    return {
      totalShares,
      r2StoredCount,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      averageProcessingTime: Math.round(averageProcessingTime * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * 获取最近事件
   */
  getRecentEvents(limit: number = 10): ShareEvent[] {
    return this.events.slice(-limit).reverse()
  }

  /**
   * 获取错误事件
   */
  getErrors(limit: number = 10): ShareEvent[] {
    return this.errors.slice(-limit).reverse()
  }

  /**
   * 清除旧数据
   */
  cleanup() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    this.events = this.events.filter(e => e.timestamp > oneHourAgo)
    this.errors = this.errors.filter(e => e.timestamp > oneHourAgo)
    
    console.log('🧹 ShareMonitor 清理完成')
  }

  /**
   * 导出监控数据
   */
  exportData() {
    return {
      stats: this.getStats(),
      recentEvents: this.getRecentEvents(50),
      errors: this.getErrors(20)
    }
  }
}

// 创建全局监控实例
export const shareMonitor = new ShareMonitor()

// 监控函数
export const monitor = {
  /**
   * 监控分享创建
   */
  shareCreated: (shareId: string, details: any) => {
    shareMonitor.logEvent('create', details, shareId)
  },

  /**
   * 监控分享查看
   */
  shareViewed: (shareId: string) => {
    shareMonitor.logEvent('view', { shareId }, shareId)
  },

  /**
   * 监控错误
   */
  error: (error: any, context?: string) => {
    shareMonitor.logEvent('error', { error: error.message || error, context })
  },

  /**
   * 监控缓存命中
   */
  cacheHit: (key: string) => {
    shareMonitor.logEvent('cache_hit', { key })
  },

  /**
   * 监控缓存未命中
   */
  cacheMiss: (key: string) => {
    shareMonitor.logEvent('cache_miss', { key })
  },

  /**
   * 监控处理时间
   */
  processingTime: (timeMs: number) => {
    shareMonitor.logProcessingTime(timeMs)
  },

  /**
   * 获取统计信息
   */
  getStats: () => shareMonitor.getStats(),

  /**
   * 获取最近事件
   */
  getRecentEvents: (limit?: number) => shareMonitor.getRecentEvents(limit),

  /**
   * 获取错误
   */
  getErrors: (limit?: number) => shareMonitor.getErrors(limit)
}

/**
 * 定期清理监控数据
 */
export function startMonitoringCleanup() {
  setInterval(() => {
    shareMonitor.cleanup()
  }, 30 * 60 * 1000) // 每30分钟清理一次
}

/**
 * 打印监控统计
 */
export function printMonitoringStats() {
  const stats = shareMonitor.getStats()
  console.log('📊 分享系统监控统计:')
  console.log(`  总分享数: ${stats.totalShares}`)
  console.log(`  R2存储数: ${stats.r2StoredCount}`)
  console.log(`  缓存命中率: ${stats.cacheHitRate}%`)
  console.log(`  平均处理时间: ${stats.averageProcessingTime}ms`)
  console.log(`  错误率: ${stats.errorRate}%`)
  console.log(`  最后更新: ${stats.lastUpdated}`)
} 