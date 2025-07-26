import { NextRequest, NextResponse } from 'next/server'
import { monitor, printMonitoringStats } from '@/lib/share-monitor'
import { shareCache } from '@/lib/share-cache'
import { shareDataStore } from '@/lib/share-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        return getStats()
      case 'events':
        const limit = parseInt(searchParams.get('limit') || '10')
        return getEvents(limit)
      case 'errors':
        const errorLimit = parseInt(searchParams.get('limit') || '10')
        return getErrors(errorLimit)
      case 'cache':
        return getCacheInfo()
      case 'storage':
        return getStorageInfo()
      case 'print':
        printMonitoringStats()
        return NextResponse.json({ success: true, message: '统计信息已打印到控制台' })
      default:
        return getAllInfo()
    }
  } catch (error) {
    console.error('监控API错误:', error)
    return NextResponse.json(
      { success: false, error: '监控数据获取失败' },
      { status: 500 }
    )
  }
}

/**
 * 获取统计信息
 */
function getStats() {
  const stats = monitor.getStats()
  return NextResponse.json({
    success: true,
    data: stats
  })
}

/**
 * 获取最近事件
 */
function getEvents(limit: number) {
  const events = monitor.getRecentEvents(limit)
  return NextResponse.json({
    success: true,
    data: events
  })
}

/**
 * 获取错误信息
 */
function getErrors(limit: number) {
  const errors = monitor.getErrors(limit)
  return NextResponse.json({
    success: true,
    data: errors
  })
}

/**
 * 获取缓存信息
 */
function getCacheInfo() {
  const cacheStats = shareCache.getStats()
  return NextResponse.json({
    success: true,
    data: {
      cacheSize: cacheStats.size,
      cacheKeys: cacheStats.keys,
      cacheHitRate: monitor.getStats().cacheHitRate
    }
  })
}

/**
 * 获取存储信息
 */
function getStorageInfo() {
  const storageStats = {
    totalShares: shareDataStore.size,
    r2StoredCount: Array.from(shareDataStore.values()).filter(s => s.isR2Stored).length,
    storageSize: shareDataStore.size,
    lastUpdated: new Date().toISOString()
  }
  
  return NextResponse.json({
    success: true,
    data: storageStats
  })
}

/**
 * 获取所有信息
 */
function getAllInfo() {
  const stats = monitor.getStats()
  const cacheStats = shareCache.getStats()
  const storageStats = {
    totalShares: shareDataStore.size,
    r2StoredCount: Array.from(shareDataStore.values()).filter(s => s.isR2Stored).length
  }
  
  return NextResponse.json({
    success: true,
    data: {
      stats,
      cache: {
        size: cacheStats.size,
        keys: cacheStats.keys.length,
        hitRate: stats.cacheHitRate
      },
      storage: storageStats,
      summary: {
        totalShares: stats.totalShares,
        r2StoredCount: stats.r2StoredCount,
        cacheHitRate: `${stats.cacheHitRate}%`,
        averageProcessingTime: `${stats.averageProcessingTime}ms`,
        errorRate: `${stats.errorRate}%`
      }
    }
  })
} 