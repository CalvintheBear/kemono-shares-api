// API 接口类型定义

export interface GenerateImageRequest {
  fileUrl?: string
  prompt: string
  enhancePrompt?: boolean
  size?: string
  mode?: 'txt2img' | 'img2img' | 'template'
  style?: string
  originalUrl?: string | null
}

export interface GenerateImageResponse {
  success: boolean
  taskId?: string
  error?: string
  message?: string
}

export interface DownloadUrlRequest {
  url: string
}

export interface DownloadUrlResponse {
  downloadUrl: string
  expiresAt?: string
  success: boolean
}

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

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}