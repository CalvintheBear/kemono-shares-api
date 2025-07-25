// 图片配置 - 使用临时的公共图片服务
export const imageConfig = {
  // 使用临时的公共图片服务（替代腾讯云COS）
  baseUrl: 'https://picsum.photos',
  
  // 图片路径配置
  paths: {
    // 动漫样式图片路径
    animeStyles: '/anime-styles',
    
    // 其他图片路径可以在这里添加
    avatars: '/avatars',
    thumbnails: '/thumbnails'
  },
  
  // 图片格式配置
  formats: {
    default: 'jpg',
    webp: 'webp',
    png: 'png'
  },
  
  // 图片尺寸配置 (可选，如果你使用腾讯云的图片处理功能)
  sizes: {
    thumbnail: '?imageMogr2/thumbnail/200x200',
    medium: '?imageMogr2/thumbnail/500x500',
    large: '?imageMogr2/thumbnail/1000x1000'
  }
}

// 生成样式图片URL的函数
export const getStyleImageUrl = (
  styleId: string, 
  imageIndex: number, 
  _format: string = imageConfig.formats.default,
  _size?: string
) => {
  // 使用 Lorem Picsum 生成占位图片，根据样式ID和索引生成不同的图片
  const seed = `${styleId}-${imageIndex}`
  const width = 300
  const height = 300
  
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

// 样式类型定义
export const styleTypes = [
  { 
    id: 'kemonomimi', 
    name: 'ケモノミミ', 
    emoji: '🐱',
    description: '可愛い動物の耳と尻尾',
    imageCount: 5
  },
  { 
    id: 'humanization', 
    name: '人間化', 
    emoji: '👤',
    description: 'リアルな人間スタイル',
    imageCount: 5
  },
  { 
    id: 'illustration', 
    name: 'イラスト', 
    emoji: '🎨',
    description: 'アニメイラスト風',
    imageCount: 5
  },
  { 
    id: 'moe', 
    name: '萌え化', 
    emoji: '💖',
    description: '萌えキャラスタイル',
    imageCount: 5
  },
  { 
    id: 'ghibli', 
    name: 'ジブリ風', 
    emoji: '🌸',
    description: 'ジブリアニメ風',
    imageCount: 5
  },
  { 
    id: 'daughter', 
    name: '娘化', 
    emoji: '👧',
    description: '美少女キャラ化',
    imageCount: 5
  }
] as const

// 工具函数：检查图片是否存在
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

// 工具函数：获取备用图片URL
export const getFallbackImageUrl = (styleId: string): string => {
  // 返回一个简单的SVG占位图片
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <circle cx="150" cy="120" r="30" fill="#e5e7eb"/>
    <rect x="120" y="160" width="60" height="40" rx="8" fill="#e5e7eb"/>
    <text x="50%" y="75%" text-anchor="middle" font-size="16" fill="#6b7280" font-family="Arial, sans-serif">
      ${styleTypes.find(s => s.id === styleId)?.name || 'スタイル'}
    </text>
    <text x="50%" y="85%" text-anchor="middle" font-size="12" fill="#9ca3af" font-family="Arial, sans-serif">
      サンプル画像
    </text>
  </svg>`
  
  // 使用 encodeURIComponent 替代 btoa 来避免字符编码问题
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
} 