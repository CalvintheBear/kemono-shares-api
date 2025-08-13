import { create } from 'zustand'

// 应用状态类型定义
export type AppState = 'initial' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'error'

export type StyleType = 'kemonomimi' | 'humanization' | 'illustration' | 'moefy' | 'ghibli' | 'daughter'

export type ImageSize = '1:1' | '3:2' | '2:3' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9' | '16:21'

export type ModelType = 'gpt4o-image' | 'flux-kontext-pro' | 'flux-kontext-max'

export interface UploadedImage {
  file: File
  url: string
  name: string
  size: number
  type: string
}

export interface ProcessedImage {
  url: string
  style: string
}

export interface GeneratedResult {
  originalUrl: string
  generatedUrl: string
  style: StyleType
  timestamp: Date
}

interface AppStore {
  // 当前应用状态
  currentState: AppState
  
  // 图片相关
  uploadedImage: UploadedImage | null
  selectedStyle: StyleType | null
  selectedSize: ImageSize
  selectedModel: ModelType
  processedImage: ProcessedImage | null
  generatedResult: GeneratedResult | null
  
  // 加载和错误状态
  isLoading: boolean
  loadingProgress: number
  loadingMessage: string
  error: string | null
  
  // 队列状态
  queuePosition: number
  estimatedTime: number
  
  // Actions
  setCurrentState: (state: AppState) => void
  setUploadedImage: (image: UploadedImage | null) => void
  setSelectedStyle: (style: StyleType | null) => void
  setSelectedSize: (size: ImageSize) => void
  setSelectedModel: (model: ModelType) => void
  setProcessedImage: (image: ProcessedImage | null) => void
  setGeneratedResult: (result: GeneratedResult | null) => void
  setAppState: (state: AppState) => void
  setLoading: (loading: boolean, message?: string) => void
  setLoadingProgress: (progress: number) => void
  setError: (error: string | null) => void
  setQueueStatus: (position: number, estimatedTime: number) => void
  
  // 重置函数
  resetApp: () => void
  startOver: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 初始状态
  currentState: 'initial',
  uploadedImage: null,
  selectedStyle: null,
  selectedSize: '1:1',
  selectedModel: 'gpt4o-image',
  processedImage: null,
  generatedResult: null,
  isLoading: false,
  loadingProgress: 0,
  loadingMessage: '',
  error: null,
  queuePosition: 0,
  estimatedTime: 0,
  
  // Actions
  setCurrentState: (state) => set({ currentState: state }),
  
  setUploadedImage: (image) => set({ 
    uploadedImage: image,
    currentState: image ? 'uploaded' : 'initial',
    error: null
  }),
  
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  
  setSelectedSize: (size) => set({ selectedSize: size }),

  setSelectedModel: (model) => set({ selectedModel: model }),
  
  setProcessedImage: (image) => set({ 
    processedImage: image,
    currentState: image ? 'completed' : get().currentState
  }),
  
  setGeneratedResult: (result) => set({ 
    generatedResult: result,
    currentState: result ? 'completed' : get().currentState,
    isLoading: false
  }),
  
  setAppState: (state) => set({ currentState: state }),
  
  setLoading: (loading, message = '') => set({ 
    isLoading: loading,
    loadingMessage: message,
    currentState: loading ? 'processing' : get().currentState
  }),
  
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  setError: (error) => set({ 
    error,
    currentState: error ? 'error' : get().currentState,
    isLoading: false
  }),
  
  setQueueStatus: (position, estimatedTime) => set({ 
    queuePosition: position,
    estimatedTime: estimatedTime
  }),
  
  // 重置所有状态
  resetApp: () => set({
    currentState: 'initial',
    uploadedImage: null,
    selectedStyle: null,
    selectedSize: '1:1',
    selectedModel: 'gpt4o-image',
    processedImage: null,
    generatedResult: null,
    isLoading: false,
    loadingProgress: 0,
    loadingMessage: '',
    error: null,
    queuePosition: 0,
    estimatedTime: 0,
  }),
  
  // 保留当前结果，但允许开始新的转换
  startOver: () => set({
    currentState: 'initial',
    uploadedImage: null,
    selectedStyle: null,
    selectedSize: '1:1',
    selectedModel: 'gpt4o-image',
    processedImage: null,
    isLoading: false,
    loadingProgress: 0,
    loadingMessage: '',
    error: null,
    queuePosition: 0,
    estimatedTime: 0,
  }),
})) 