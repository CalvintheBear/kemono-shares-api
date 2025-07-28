/**
 * 图片URL处理工具函数
 * 用于生成不同尺寸和质量的图片URL，实现Pinterest风格的多级图片加载
 */

export interface ImageSizes {
  thumbnail: string // 50px宽，低质量，用于占位
  small: string     // 200px宽，中等质量
  medium: string    // 600px宽，高质量
  large: string     // 1200px宽，超高质量
  original: string  // 原图
}

/**
 * 生成不同尺寸的图片URL
 * @param originalUrl 原始图片URL
 * @param sizes 自定义尺寸配置
 * @returns 包含不同尺寸URL的对象
 */
export function generateImageSizes(originalUrl: string, sizes?: Partial<ImageSizes>): ImageSizes {
  if (!originalUrl) {
    return {
      thumbnail: '',
      small: '',
      medium: '',
      large: '',
      original: originalUrl
    }
  }

  try {
    const _url = new URL(originalUrl)
    
    // 生成缩略图URL (50px宽，低质量)
    const thumbnailUrl = new URL(originalUrl)
    thumbnailUrl.searchParams.set('w', '50')
    thumbnailUrl.searchParams.set('q', '10')
    thumbnailUrl.searchParams.set('blur', '2')
    
    // 生成小图URL (200px宽，中等质量)
    const smallUrl = new URL(originalUrl)
    smallUrl.searchParams.set('w', '200')
    smallUrl.searchParams.set('q', '60')
    
    // 生成中等图URL (600px宽，高质量)
    const mediumUrl = new URL(originalUrl)
    mediumUrl.searchParams.set('w', '600')
    mediumUrl.searchParams.set('q', '80')
    
    // 生成大图URL (1200px宽，超高质量)
    const largeUrl = new URL(originalUrl)
    largeUrl.searchParams.set('w', '1200')
    largeUrl.searchParams.set('q', '90')
    
    return {
      thumbnail: sizes?.thumbnail || thumbnailUrl.toString(),
      small: sizes?.small || smallUrl.toString(),
      medium: sizes?.medium || mediumUrl.toString(),
      large: sizes?.large || largeUrl.toString(),
      original: sizes?.original || originalUrl
    }
  } catch {
    // 如果URL解析失败，返回原始URL
    return {
      thumbnail: originalUrl,
      small: originalUrl,
      medium: originalUrl,
      large: originalUrl,
      original: originalUrl
    }
  }
}

/**
 * 根据屏幕尺寸和设备像素比选择合适的图片尺寸
 * @param imageSizes 图片尺寸对象
 * @param screenWidth 屏幕宽度
 * @param pixelRatio 设备像素比
 * @returns 推荐的图片URL
 */
export function getOptimalImageUrl(
  imageSizes: ImageSizes,
  screenWidth: number = 1920,
  pixelRatio: number = 1
): string {
  const effectiveWidth = screenWidth * pixelRatio
  
  if (effectiveWidth <= 200) {
    return imageSizes.small
  } else if (effectiveWidth <= 600) {
    return imageSizes.medium
  } else if (effectiveWidth <= 1200) {
    return imageSizes.large
  } else {
    return imageSizes.original
  }
}

/**
 * 预加载图片
 * @param url 图片URL
 * @returns Promise，加载完成后resolve
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve()
      return
    }
    
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

/**
 * 批量预加载图片
 * @param urls 图片URL数组
 * @returns Promise数组
 */
export function preloadImages(urls: string[]): Promise<void>[] {
  return urls.map(url => preloadImage(url))
}

/**
 * 检查图片是否已缓存
 * @param url 图片URL
 * @returns 是否已缓存
 */
export function isImageCached(url: string): boolean {
  try {
    const img = new window.Image()
    img.src = url
    return img.complete
  } catch {
    return false
  }
}

/**
 * 获取图片的宽高比
 * @param url 图片URL
 * @returns Promise<{width: number, height: number}>
 */
export function getImageAspectRatio(url: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = () => reject(new Error(`Failed to get image dimensions: ${url}`))
    img.src = url
  })
} 