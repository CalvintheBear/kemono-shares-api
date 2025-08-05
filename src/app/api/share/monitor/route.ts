import { NextRequest, NextResponse } from 'next/server'
import { shareKVStore } from '@/lib/share-store-kv'
import { getCacheStats } from '@/lib/share-cache'
import { monitor } from '@/lib/share-monitor'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // 获取存储状态
    const storageInfo = shareKVStore.getStorageInfo()
    const storageSize = await shareKVStore.size()
    
    // 获取缓存状态
    const cacheStats = getCacheStats()
    
    // 获取监控数据
    const monitorStats = monitor.getStats()
    
    // 检查环境配置
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      CF_WORKER: process.env.CF_WORKER,
      KV_NAMESPACE_ID: process.env.KV_NAMESPACE_ID,
      R2_BUCKET: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      R2_AFTERIMAGE_BUCKET: process.env.CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME
    }
    
    // 检查KV连接
    let kvConnectionTest: { success: boolean; error?: string; message?: string } = { success: false, error: 'Not tested' }
    try {
      if (storageInfo.isWorkers && storageInfo.hasKV) {
        // 尝试写入一个测试键
        const testKey = `monitor_test_${Date.now()}`
        
        await shareKVStore.set(testKey, {
          id: testKey,
          generatedUrl: 'test',
          originalUrl: '',
          prompt: 'test',
          style: 'test',
          timestamp: Date.now(),
          createdAt: new Date().toISOString()
        })
        
        // 尝试读取
        const retrieved = await shareKVStore.get(testKey)
        if (retrieved) {
          await shareKVStore.delete(testKey)
          kvConnectionTest = { success: true, message: 'KV read/write test passed' }
        } else {
          kvConnectionTest = { success: false, error: 'KV read test failed' }
        }
      } else {
        kvConnectionTest = { success: false, error: 'KV not available in current environment' }
      }
    } catch (error) {
      kvConnectionTest = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
    
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      storage: {
        ...storageInfo,
        size: storageSize,
        kvConnectionTest
      },
      cache: {
        ...cacheStats,
        hitRate: `${(cacheStats.hitRate * 100).toFixed(1)}%`,
        memoryUsageKB: `${(cacheStats.memoryUsage / 1024).toFixed(2)}KB`
      },
      monitor: monitorStats,
      environment: envInfo,
      health: {
        storage: storageInfo.isWorkers && storageInfo.hasKV,
        cache: cacheStats.size < cacheStats.maxSize * 0.9, // 缓存未满90%
        kvConnection: kvConnectionTest.success,
        overall: storageInfo.isWorkers && storageInfo.hasKV && kvConnectionTest.success
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('监控数据获取失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '监控数据获取失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 