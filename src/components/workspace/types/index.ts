export interface Template {
  id: string
  name: string
  beforeImage: string
  afterImage: string
  prompt: string
  category: string
}

export interface GenerationResult {
  id: string
  original_url: string
  generated_url: string
  prompt: string
  timestamp: number
  status?: string
  progress?: number
}

export interface WorkspaceState {
  selectedTemplate: Template | null
  currentResult: GenerationResult | null
  isGenerating: boolean
  generationError: string
  mode: 'image-to-image' | 'template-mode' | 'text-to-image'
  prompt: string
  fileUrl: string | null
  imagePreview: string | null
  isUploading: boolean
  uploadProgress: number
  enhancePrompt: boolean
  autoShareUrl: string
  publishState: 'idle' | 'publishing' | 'published'
  stopReason: null | 'TIMEOUT' | 'MAX_FAILURES' | 'URL_TIMEOUT' | 'NETWORK'
}
