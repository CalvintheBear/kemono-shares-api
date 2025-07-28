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

// 创建一个共享的存储（在实际应用中应该使用数据库）
export const shareDataStore = new Map<string, ShareData>()

// 初始化存储（在实际应用中应该使用数据库）
export const initializeSampleData = () => {
  // 移除硬编码示例数据，完全依赖动态数据
  // 在实际部署中，这里应该连接数据库或外部存储
  console.log('📊 分享存储初始化完成，当前存储大小:', shareDataStore.size)
} 