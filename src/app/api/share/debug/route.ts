import { NextRequest, NextResponse } from 'next/server'
import { shareKVStore } from '@/lib/share-store-kv'

// 配置为动态路由，避免静态导出错误
export const dynamic = 'force-dynamic'

// 禁用静态生成，确保只在运行时执行
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    
    switch (action) {
      case 'list':
        // 获取所有分享数据
        const allShares = await shareKVStore.getAll()
        const storageInfo = shareKVStore.getStorageInfo()
        
        // 分析数据
        const analysis = {
          total: allShares.length,
          textToImage: allShares.filter(share => {
            return !share.originalUrl || 
                   share.originalUrl === '' || 
                   share.originalUrl === null || 
                   share.originalUrl === undefined ||
                   share.originalUrl.trim() === ''
          }).length,
          imageToImage: allShares.filter(share => {
            return share.originalUrl && 
                   share.originalUrl !== '' && 
                   share.originalUrl !== null && 
                   share.originalUrl !== undefined &&
                   share.originalUrl.trim() !== ''
          }).length,
          storageInfo,
                      shares: allShares.map(share => ({
              id: share.id,
              style: share.style,
              originalUrl: share.originalUrl,
              isTextToImage: !share.originalUrl || 
                             share.originalUrl === '' || 
                             share.originalUrl === null || 
                             share.originalUrl === undefined ||
                             share.originalUrl.trim() === '',
              timestamp: share.timestamp,
              createdAt: share.createdAt
            }))
        }
        
        return NextResponse.json({
          success: true,
          data: analysis
        })
        
      case 'clear':
        // 清空存储（仅开发环境）
        if (process.env.NODE_ENV === 'development') {
          // 这里可以添加清空逻辑
          return NextResponse.json({
            success: true,
            message: '开发环境清空功能待实现'
          })
        } else {
          return NextResponse.json({
            success: false,
            error: '仅开发环境可用'
          }, { status: 403 })
        }
        
      default:
        return NextResponse.json({
          success: false,
          error: '无效的操作'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('调试API错误:', error)
    return NextResponse.json(
      { success: false, error: '调试API执行失败' },
      { status: 500 }
    )
  }
} 