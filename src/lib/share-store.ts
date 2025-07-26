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

// 创建一个共享的存储（在实际应用中应该使用数据库）
export const shareDataStore = new Map<string, ShareData>()

// 添加一些示例数据到存储中
export const initializeSampleData = () => {
  if (shareDataStore.size === 0) {
    const sampleData: ShareData[] = [
      {
        id: 'share_1732540800000_abc123def',
        generatedUrl: 'https://example.com/generated1.jpg',
        originalUrl: 'https://example.com/original1.jpg',
        prompt: 'ジブリ風のアニメスタイルで変換してください',
        style: 'ジブリ風',
        timestamp: 1732540800000,
        createdAt: '2024-07-26T10:00:00.000Z',
        isR2Stored: true
      },
      {
        id: 'share_1732454400000_xyz789ghi',
        generatedUrl: 'https://example.com/generated2.jpg',
        originalUrl: 'https://example.com/original2.jpg',
        prompt: 'VTuber風のスタイルで変換してください',
        style: 'VTuber風',
        timestamp: 1732454400000,
        createdAt: '2024-07-25T15:30:00.000Z',
        isR2Stored: true
      },
      {
        id: 'share_1732368000000_mno456pqr',
        generatedUrl: 'https://example.com/generated3.jpg',
        originalUrl: 'https://example.com/original3.jpg',
        prompt: 'ウマ娘風のスタイルで変換してください',
        style: 'ウマ娘風',
        timestamp: 1732368000000,
        createdAt: '2024-07-24T12:15:00.000Z',
        isR2Stored: true
      },
      {
        id: 'share_1732281600000_stu123vwx',
        generatedUrl: 'https://example.com/generated4.jpg',
        originalUrl: 'https://example.com/original4.jpg',
        prompt: 'アニメ風のスタイルで変換してください',
        style: 'アニメ風',
        timestamp: 1732281600000,
        createdAt: '2024-07-23T09:45:00.000Z',
        isR2Stored: true
      },
      {
        id: 'share_1732195200000_yz123abc',
        generatedUrl: 'https://example.com/generated5.jpg',
        originalUrl: 'https://example.com/original5.jpg',
        prompt: 'ファンタジー風のスタイルで変換してください',
        style: 'ファンタジー風',
        timestamp: 1732195200000,
        createdAt: '2024-07-22T16:20:00.000Z',
        isR2Stored: true
      }
    ]

    sampleData.forEach(data => {
      shareDataStore.set(data.id, data)
    })
  }
} 