'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { PhotoIcon, PaperAirplaneIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { useAppStore } from '@/store/useAppStore'
import { ImageSize } from '@/store/useAppStore'
import BeforeAfterSlider from './BeforeAfterSlider'

interface Template {
  id: string
  name: string
  beforeImage: string
  afterImage: string
  prompt: string
  category: string
}

interface GenerationResult {
  id: string
  original_url: string
  generated_url: string
  prompt: string
  timestamp: number
  progress?: number
  status?: string
}

const templates: Template[] = [
  {
    id: '1',
    name: '擬人化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-after',
    prompt: '擬人化キャラクター、画像中のオブジェクトの美少女化、創造的なデザイン、可愛い擬人化、個性的な表現',
    category: '擬人化'
  },
  {
    id: '18',
    name: '可愛line アイコン',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-after',
    prompt: 'LINEスタンプ風、可愛いアイコン、シンプルで分かりやすい、コミュニケーション用、親しみやすいキャラクター、カラフルで明るい、メッセージアプリ風、スタンプ感のあるデザイン',
    category: '可愛line アイコン'
  },
  {
    id: '19',
    name: 'lineスタンプ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85-after',
    prompt: 'LINEスタンプ、可愛いキャラクター、シンプルでわかりやすい、色彩豊かで明るい、メッセージアプリに似たスタンプ感のあるデザイン、親しみやすい、4コマ漫画（怒り、驚き、軽蔑、陰険）',
    category: 'lineスタンプ'
  },

  {
    id: '20',
    name: '可愛い壁紙',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%A3%81%E7%BA%B8-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%A3%81%E7%BA%B8-after',
    prompt: 'かわいい壁紙スタイル、かわいい背景、アニメスタイルのデザイン、シンプルな太い線の手描きスタイル、カートゥーンスタイル、かわいいフルパターン、タイル効果',
    category: '可愛い壁紙'
  },
  {
    id: '17',
    name: 'irasutoya',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/irasutoya-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/irasutoya-after',
    prompt: 'イラストはエレガントなスタイルで、穏やかで愛らしい、商用フリー素材スタイルで、シンプルで親しみやすく、柔らかな触感、可愛いキャラクター、癒し系、フラットデザイン、親しみやすい雰囲気、清潔な背景です。',
    category: 'irasutoya'
  },

  {
    id: '2',
    name: 'BlueArchive&ブルーアーカイブ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-after',
    prompt: 'ウルトラブルーアーカイブスタイル、アニメの女の子、制服の美学、柔らかなカートゥーンの影、細く綺麗な線画、半写実的な比率、柔らかなカラーパレット、フラットな照明、最小限の影、光のグラデーション、高解像度、未来的な現代学校デザイン、SF要素、光り輝くアクセサリー、スタイリッシュな武器デザイン、テクノロジーの服装のアクセント、最小限の背景、プロフェッショナルなキャラクターシートの雰囲気、活気に満ちた柔らかな色調の調和。',
    category: 'BlueArchive&ブルーアーカイブ'
  },
  {
    id: '3',
    name: 'vtuber',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-after',
    prompt: 'VTuberスタイル、アニメと3Dのハイブリッドレンダリング、セミリアルなセルシェーディング、柔らかいトーンのライティング、クリーンなデジタルキャラクターデザイン、高光沢の目、鮮やかな髪のグラデーション、磨き上げられたテクスチャ、スタジオの照明環境、バーチャルアイドルの美学、表情豊かなフェイシャルリギングの感触、Live2D/3Dのハイブリッド印象、ゲームのようなモデルシェーディング、合成色のハーモニー、平面的でありながら立体的な外観、鮮やかなエッジのハイライト、ストリーミングプレゼンスに最適化されている。',
    category: 'vtuber'
  },
  {
    id: '5',
    name: 'ウマ娘',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%B5%9B%E9%A9%AC%E5%A8%98-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%B5%9B%E9%A9%AC%E5%A8%98-after',
    prompt: 'ウマ娘、美しい競馬スタイル、高エネルギーのアニメ美学、明確なエッジのハイライトと柔らかな照明、光沢のある装飾とクリーンなラインアート、スクールアイドルとスポーツの融合デザイン、動的なポーズ、馬術をテーマにした模様、光沢のあるディテールで生き生きとした目、リボンとイヤリングを持つ精巧なヘアスタイル、動物的特徴を持つ人型キャラクター（馬の耳としっぽ）、制服と競技服の混合デザイン、動きに合わせたキャラクターデザイン、アイドルのような外見、スタイライズされたスピードと青春。',
    category: 'ウマ娘'
  },
  {
    id: '7',
    name: '少女',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%B0%91%E5%A5%B3-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%B0%91%E5%A5%B3-after',
    prompt: '新世紀エヴァンゲリオンの効果，デジタルアニメスタイルのイラスト，二次元アニメの超高精細イラストスタイル、4K超高解像度、質の高いディテール、かわいい日本の女の子',
    category: '少女'
  },
  {
    id: '8',
    name: '萌え化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-after',
    prompt: '萌え化キャラクター、可愛く魅力的なデザイン、萌え要素満載、癒し系ふわふわ、美少女アニメスタイル',
    category: '萌え化'
  },
  {
    id: '9',
    name: 'chibi',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after',
    prompt: 'ちびキャラクター、Q版デフォルメ、可愛らしい小さな体、大きな頭、ふわふわした雰囲気、癒し系',
    category: 'chibi'
  },
  {
    id: '10',
    name: 'ジブリ風',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%90%89%E5%8D%9C%E5%8A%9B%E9%A3%8E-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%90%89%E5%8D%9C%E5%8A%9B%E9%A3%8E-after',
    prompt: '柔らかな手描きタッチ、温かみのある色調、細かい背景描写、自然で幻想的な風景、絵本のような雰囲気、シンプルで生き生きしたキャラクターデザイン、空気感と光の表現に重点を置き、豊かなディテールと伝統的アニメーションの質感を持つ、ジブリ風、2Dフラット塗り技法。',
    category: 'ジブリ風'
  },
  {
    id: '11',
    name: 'SDキャラ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/SD-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/SD-after',
    prompt: 'SDキャラクター、スーパーデフォルメ、ちびキャラ、可愛らしい小さな体、頭身の短いデフォルメスタイル',
    category: 'SDキャラ'
  },
  {
    id: '12',
    name: '原神異世界',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%BC%82%E4%B8%96%E7%95%8C-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%BC%82%E4%B8%96%E7%95%8C-after',
    prompt: '原神スタイル、可愛いキャラクター、幻想的な世界観、ゲームアニメ風、美麗な色彩、魅力的なデザイン',
    category: '原神異世界'
  },
  {
    id: '13',
    name: ' ヤンデレ&地雷女',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E7%97%85%E5%A8%87-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E7%97%85%E5%A8%87-after',
    prompt: '病娇キャラクター、ヤンデレ、危険で魅力的、暗い雰囲気、複雑な感情表現、アニメ風病娇美少女、狂気と愛の境界、執着心の強いキャラクター',
    category: 'ヤンデレ&地雷女'
  },
  {
    id: '14',
    name: '厚塗',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-after',
    prompt: '滑らかな肌のレンダリング、アニメスタイルの厚塗り、Procreate、立体感、二次元イラスト、8K、透明感',
    category: '厚塗'
  },
  {
    id: '15',
    name: '3D CG',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/3DCG-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/3DCG-after',
    prompt: '3D美しいBJDキャラクター、テクノロジー感、テクノロジー感、スタイルデザイン、スタジオライト、スタイルデザイン、CGアニメーション、8K解像度、ハイビジョン、写真、撮影、ソフトライティング、最高画質、高画質、高細部、ハイビジョン、狂った詳細、超高画質、超リアル、極上のライティング、水光肌、リアルな毛穴、自然で生き生きとした目、ゲームCGレンダリング',
    category: '3D CG'
  },
  {
    id: '16',
    name: '乙女ゲーム',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E4%B9%99%E6%B8%B8-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E4%B9%99%E6%B8%B8-after',
    prompt: '乙女ゲームスタイル、美しい男性キャラクター、ロマンティックな雰囲気、優雅で洗練されたデザイン、恋愛要素、ファンタジー世界観、美形キャラクター、耽美な表現、乙女向けアート',
    category: '乙女ゲーム'
  },
  
  {
    id: '21',
    name: 'クレヨンしんちゃん',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0-after',
    prompt: 'クレヨンしんちゃん風、アニメ風',
    category: 'クレヨンしんちゃん'
  },
  {
    id: '22',
    name: '証明写真加工',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%AF%81%E4%BB%B6%E7%85%A7-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%AF%81%E4%BB%B6%E7%85%A7-after',
    prompt: '証明写真スタイルのレタッチ：背景は真っ白で清潔感があり、人物は中央配置、柔らかく均一なライティング、ナチュラルな肌質感、軽いスキントーン補正とシミ除去を行いつつリアルさを保持、瞳はクリアに、顔立ちはシャープに、全体的にプロフェッショナルかつシンプルな仕上がり。',
    category: '証明写真加工'
  },
]

export default function Workspace() {
  const t = useTranslations('workspace')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const [mode, setMode] = useState<'image-to-image' | 'template-mode' | 'text-to-image'>('template-mode')
  const [enhancePrompt, setEnhancePrompt] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<number | null>(null)
  const [generationStatusText, setGenerationStatusText] = useState<string>('')
  const [generationError, setGenerationError] = useState<string>('')
  const [_consecutiveErrors, setConsecutiveErrors] = useState<number>(0)
  const [pollCount, setPollCount] = useState<number>(0)

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const templatesPerPage = 5
  const [selectedCategory, setSelectedCategory] = useState<string>('擬人化')

  // 使用Zustand store
  const { selectedSize, setSelectedSize } = useAppStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    const savedTemplateId = localStorage.getItem('selectedTemplateId')
    if (savedTemplateId) {
      const foundTemplate = templates.find(t => t.id === savedTemplateId)
      if (foundTemplate) {
        setSelectedTemplate(foundTemplate)
        setPrompt(foundTemplate.prompt)
        setMode('template-mode')
      }
    }

    // 页面加载后触发渐入效果
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // 清理定时器和设置卸载标志
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
        console.log('🧹 组件卸载时清理轮询定时器')
      }
    }
  }, [])

  const handleImageSelect = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    const uploadFile = async () => {
      try {
        setIsUploading(true)
        const url = await uploadImageToKie(file)
        setFileUrl(url)
      } catch (err) {
        console.error('文件上传失败:', err)
        alert(t('uploadSection.uploadFailed'))
        setFileUrl(null)
      } finally {
        setIsUploading(false)
      }
    }
    uploadFile()
  }, [t])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(t('uploadSection.invalidFileType'))
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(t('uploadSection.fileTooLarge'))
        return
      }
      handleImageSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const uploadImageToKie = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '文件上传失败')
    }

    const data = await response.json()
    return data.fileUrl
  }

  const generateImage = async () => {
    if (mode === 'template-mode') {
      if (!selectedTemplate) {
        alert('テンプレートを選択してください')
        return
      }
      if (!fileUrl) {
        alert('画像をアップロードしてください')
        return
      }
    } else if (mode === 'image-to-image') {
      if (!fileUrl) {
        alert('画像をアップロードしてください')
        return
      }
      if (!prompt.trim()) {
        alert('プロンプトを入力してください')
        return
      }
    } else if (mode === 'text-to-image') {
      if (!prompt.trim()) {
        alert('プロンプトを入力してください')
        return
      }
    }

    // 清理之前的轮询
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStatusText(mode === 'text-to-image' ? '画像生成中です、しばらくお待ちください~ (2-5分お待ちください)' : '変身中です、しばらくお待ちください~ (2-5分お待ちください)')
    setGenerationError('')
    setConsecutiveErrors(0)
    setPollCount(0)
    setCurrentResult(null)

    const newResult: GenerationResult = {
      id: `${Date.now()}`,
      original_url: mode === 'text-to-image' ? 'https://via.placeholder.com/400x400/E3F2FD/2196F3?text=Text+to+Image' : imagePreview!,
      generated_url: '',
      prompt: prompt,
      timestamp: Date.now(),
      progress: 0,
      status: 'starting'
    }

    setCurrentResult(newResult)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: mode === 'text-to-image' ? undefined : fileUrl,
          prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
          enhancePrompt: enhancePrompt,
          size: selectedSize
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '图像生成失败')
      }

      const data = await response.json()
      console.log('🎉 /api/generate-image 返回数据:', data)

      // 根据API交互文档，/api/generate-image已经完成了所有轮询，直接处理结果
      const generatedUrl = data.url || data.urls?.[0] || data.data?.url || data.data?.urls?.[0] || data.generated_url
      const success = data.success || (data.status === 'SUCCESS') || (data.data?.status === 'SUCCESS')

      console.log('🔍 解析结果:', { generatedUrl, success, hasUrl: !!generatedUrl, successStatus: success })

      if (generatedUrl && success) {
        console.log('✅ 图片生成完成，直接显示结果:', generatedUrl)

        const completedResult: GenerationResult = {
          ...newResult,
          generated_url: generatedUrl,
          progress: 100,
          status: 'SUCCESS'
        }

        setCurrentResult(completedResult)
        setGenerationProgress(100)
        setGenerationStatusText(mode === 'text-to-image' ? '画像生成完了！' : '変身完了！')

        // 2秒后隐藏进度条
        setTimeout(() => {
          setGenerationProgress(null)
          setGenerationStatusText('')
          setIsGenerating(false)
        }, 2000)
      } else if (data.taskId || data.data?.taskId) {
        // 如果没有直接结果但有taskId，说明需要轮询（备用方案）
        console.log('⚠️ 未获得直接结果，启用轮询备用方案')
        const taskId = data.taskId || data.data?.taskId
        await pollProgress(taskId, newResult.id)
      } else {
        throw new Error('未获得有效的生成结果')
      }

    } catch (error) {
      console.error('生成失败:', error)
      let errorMessage = '申し訳ございません、エラーが発生しました。'

      if (error instanceof Error) {
        const errorMsg = error.message
        if (mode === 'text-to-image') {
          // 文生图模式的错误处理
          if (errorMsg.includes('Failed to fetch')) {
            errorMessage = 'ネットワーク接続エラーです。インターネット接続を確認してください。'
          } else if (errorMsg.includes('access limits')) {
            errorMessage = 'APIアクセス制限があります。しばらく待ってから再試行してください。'
          } else {
            errorMessage = errorMsg
          }
        } else {
          // 图生图模式的错误处理
          if (errorMsg.includes('Failed to fetch the image')) {
            errorMessage = '画像URLへのアクセスエラーです。画像のリンクをご確認ください。'
          } else if (errorMsg.includes('access limits')) {
            errorMessage = '画像へのアクセス制限があります。別の画像をお試しください。'
          } else if (errorMsg.includes('fetch')) {
            errorMessage = '画像の読み込みに失敗しました。画像URLを確認してください。'
          } else {
            errorMessage = errorMsg
          }
        }
      }

      setGenerationError(errorMessage)
      setCurrentResult(null)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(null)
      setGenerationStatusText('')
    }
  }

  const pollProgress = async (taskId: string, resultId: string) => {
    // 清理之前的轮询
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    const startTime = Date.now()
    const timeout = 5 * 60 * 1000 // 5分钟超时
    let errorCount = 0
    let isStop = false

    const stopPolling = () => {
      isStop = true
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      console.log('🛑 轮询已终止')
    }

    const loop = async () => {
      if (isStop || !isMountedRef.current) {
        console.log('🛑 检测到停止信号，终止轮询')
        return
      }

      const elapsedTime = Date.now() - startTime

      // 检查5分钟超时
      if (elapsedTime >= timeout) {
        stopPolling()
        setGenerationError('⏰ タイムアウトしました！5分以上かかっています。後でもう一度お試しください。')
        setCurrentResult(null)
        setIsGenerating(false)
        setGenerationProgress(null)
        setGenerationStatusText('')
        console.error(`🚫 轮询超时：${Math.round(elapsedTime/1000)}秒过去`)
        return
      }

      try {
        const response = await fetch(`/api/image-details?taskId=${taskId}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log("轮询成功:", data)

        // 重置错误计数
        errorCount = 0

        const responseData = data.data || data
        const progress = parseFloat(responseData.progress || '0') * 100
        const status = responseData.status || 'GENERATING'
        const generatedUrl = responseData.response?.resultUrls?.[0] || null

        if (status === 'SUCCESS' && generatedUrl) {
          stopPolling()

          try {
            const downloadResponse = await fetch('/api/download-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: generatedUrl })
            })

            let finalImageUrl = generatedUrl
            if (downloadResponse.ok) {
              const downloadData = await downloadResponse.json()
              finalImageUrl = downloadData.downloadUrl || generatedUrl
            }

            const completedResult: GenerationResult = {
              id: resultId,
              original_url: imagePreview!,
              generated_url: finalImageUrl,
              prompt: prompt,
              timestamp: Date.now(),
              progress: 100,
              status: 'SUCCESS'
            }

            setCurrentResult(completedResult)
            setGenerationProgress(100)
            setGenerationStatusText(mode === 'text-to-image' ? '画像生成完了！' : '変身完了！')

            setTimeout(() => {
              setGenerationProgress(null)
              setGenerationStatusText('')
              setIsGenerating(false)
            }, 2000)
          } catch (downloadError) {
            console.error('下载URL获取失败:', downloadError)
          }
        } else if (status === 'FAILED' || status === 'GENERATE_FAILED' || status === 'failed' || 
                   responseData.successFlag === 3 || responseData.successFlag === 0 || 
                   (status === 'GENERATE_FAILED' && responseData.errorMessage)) {
          // 立即终止轮询 - 任务已失败
          stopPolling()
          
          const errorMessage = responseData.errorMessage || data.error || '生成に失敗しました'
          console.error(`🚫 检测到失败状态: ${status}, 错误: ${errorMessage}`)
          console.log('🛑 终止轮询并显示错误给用户')
          
          setGenerationError(`❌ ${errorMessage}`)
          setCurrentResult(null)
          setIsGenerating(false)
          setGenerationProgress(null)
          setGenerationStatusText('')
          return
        } else {
          const currentProgress = Math.min(Math.round(progress), 99)
          setGenerationProgress(currentProgress)
          setGenerationStatusText(mode === 'text-to-image' ? `画像生成中... ${currentProgress}%` : `処理中... ${currentProgress}%`)
        }
      } catch (error) {
        console.error(`轮询失败（${errorCount+1}/3）:`, error)
        errorCount++

        if (errorCount >= 3) {
          stopPolling()
          
          let errorMsg = 'ネットワークエラーが発生しました。'
          if (error instanceof Error) {
            if (error.message.includes('Failed to fetch')) {
              errorMsg = 'ネットワーク接続エラーです。インターネット接続を確認してください。'
            } else {
              errorMsg = error.message
            }
          }
          
          setGenerationError(`⚠️ ${errorMsg}`)
          setCurrentResult(null)
          setIsGenerating(false)
          setGenerationProgress(null)
          setGenerationStatusText('')
          console.error('🚫 连续3次错误，停止轮询')
          return
        }
      }

      if (!isStop && isMountedRef.current) {
        pollIntervalRef.current = setTimeout(loop, 2000)
      }
    }

    // 开始轮询
    loop()
  }

  // 添加用于调试的useEffect来监控轮询状态
  useEffect(() => {
    console.log('🔍 轮询状态监控:', {
      pollCount,
      isGenerating,
      generationError,
      consecutiveErrors: _consecutiveErrors
    })
  }, [pollCount, isGenerating, generationError, _consecutiveErrors])

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setPrompt(template.prompt)
    localStorage.setItem('selectedTemplateId', template.id)
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    const totalPages = Math.ceil(templates.length / templatesPerPage)
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
  }



  return (
    <div className="min-h-screen bg-[#fff7ea] p-4">
      <div className={`max-w-7xl mx-auto bg-white rounded-[40px] shadow-2xl border border-white/50 p-6 lg:p-8 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
                  <div className="flex flex-col lg:flex-row gap-8">
            <div className={`lg:w-1/2 space-y-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-5 card-kawaii border border-white/40 overflow-hidden">
              <div className={`mb-4 transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex justify-center space-x-3 mb-3">
                  <button
                    onClick={() => setMode('template-mode')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                      mode === 'template-mode'
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                        : 'bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    ✨ シンプルモード
                  </button>
                  <button
                    onClick={() => {
                      setMode('image-to-image')
                      setPrompt('')
                      setSelectedTemplate(null)
                      localStorage.removeItem('selectedTemplateId')
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                      mode === 'image-to-image'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                        : 'bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    🎨 マニュアルモード
                  </button>
                  <button
                    onClick={() => {
                      setMode('text-to-image')
                      setPrompt('')
                      setSelectedTemplate(null)
                      setFileUrl(null)
                      setImagePreview(null)
                      localStorage.removeItem('selectedTemplateId')
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                      mode === 'text-to-image'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    ✍️ 文生图モード
                  </button>
                </div>
              </div>

              {mode === 'template-mode' && (
                <div className={`mb-4 transition-all duration-1000 delay-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 0}
                      title="前のページ"
                      className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl transform hover:scale-110"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>

                    <div className="flex-1 grid grid-cols-5 gap-2">
                      {templates
                        .slice(currentPage * templatesPerPage, (currentPage + 1) * templatesPerPage)
                        .map((template) => (
                          <button
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            className={`p-1.5 rounded-[16px] border-2 transition-all transform hover:scale-105 ${
                              selectedTemplate?.id === template.id
                                ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-amber-50 shadow-lg'
                                : 'border-pink-200 bg-white/80 hover:border-pink-400 hover:shadow-md backdrop-blur-sm'
                            }`}
                          >
                            <img
                              src={template.afterImage}
                              alt={`${template.name} - AI画像変換 無料 ${template.name === 'chibi' ? 'chibiキャラクター作成' : template.name === 'lineスタンプ' ? 'LINEスタンプ作り方' : template.name === '可愛line アイコン' ? 'LINEアイコン作成' : template.name === 'ジブリ風' ? 'ジブリ風アニメ変換' : 'AI画像変換'}`}
                              title={`${template.name} - 写真を${template.name}風に変換 ${template.name === 'chibi' ? '可愛いchibiキャラクターに変換' : template.name === 'lineスタンプ' ? 'LINEスタンプ風に作成' : template.name === '可愛line アイコン' ? 'LINEアイコンに最適化' : template.name === 'ジブリ風' ? 'ジブリ風アニメに変換' : 'AI画像変換'}`}
                              className="w-full aspect-square object-cover rounded-[12px] mb-1 shadow-sm"
                            />
                            <p className="text-[10px] font-bold text-amber-800 font-cute leading-tight px-0.5 text-center">{template.name}</p>
                          </button>
                        ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= Math.ceil(templates.length / templatesPerPage) - 1}
                      title="次のページ"
                      className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl transform hover:scale-110"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-center mt-2">
                    <span className="text-xs text-amber-700 font-cute bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                      ページ {currentPage + 1} / {Math.ceil(templates.length / templatesPerPage)} 🌸
                    </span>
                  </div>
                </div>
              )}

              {mode !== 'text-to-image' && (
                <div
                  className={`border-2 border-dashed border-pink-300/30 rounded-[28px] p-8 text-center hover:border-pink-400 transition-all cursor-pointer bg-white/50 backdrop-blur-lg hover:bg-white/70 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden transition-all duration-1000 delay-900 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    aria-label="画像ファイルを選択"
                  />

                  {imagePreview ? (
                    <div className="space-y-6">
                      <img
                        src={imagePreview}
                        alt="アップロードされた画像のプレビュー"
                        className="max-w-full h-64 object-contain rounded-2xl mx-auto shadow-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setImagePreview(null)
                          setFileUrl(null)
                        }}
                        className="text-pink-600 hover:text-pink-800 text-sm bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                      >
                        🗑️ 別の写真にするね
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-bounce-slow">
                      <PhotoIcon className="w-16 h-16 mx-auto text-pink-400 animate-pulse" />
                      <p className="text-lg text-amber-700 font-cute">
                        写真をドロップしてね！ 📸
                      </p>
                      <p className="text-sm text-amber-600 font-cute">
                        またはここをクリックして選んでね ✨
                      </p>
                      <p className="text-xs text-amber-500">
                        10MBまでの画像OK！
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mode === 'text-to-image' && (
                <div className={`border-2 border-dashed border-blue-300/30 rounded-[28px] p-8 text-center bg-blue-50/50 backdrop-blur-lg shadow-lg overflow-hidden transition-all duration-1000 delay-900 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  <div className="space-y-4">
                    <div className="text-4xl mb-4">✍️</div>
                    <p className="text-lg text-blue-700 font-cute">
                      文生图モード ✨
                    </p>
                    <p className="text-sm text-blue-600 font-cute">
                      画像をアップロードせずに、テキストだけで画像を生成できます
                    </p>
                    <p className="text-xs text-blue-500">
                      魔法の呪文を書いて、AIが画像を作成します！
                    </p>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-amber-600 font-cute">
                    写真を準備中... 📤
                  </p>
                </div>
              )}

              <div className={`mt-6 space-y-4 transition-all duration-1000 delay-1100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div>
                  <label className="block text-lg font-bold text-amber-800 mb-3 font-cute">
                    📐 画像サイズを選んでね ✨
                  </label>
                  <div className="grid grid-cols-3 gap-5">
                    {(['1:1', '3:2', '2:3'] as ImageSize[]).map((size) => {

                      return (
                        <button
                          key={size}
                          onClick={() => {
                            console.log('🎯 用户选择尺寸:', size)
                            setSelectedSize(size)
                          }}
                          className={`p-3 rounded-xl border-2 font-cute transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-1 ${
                            selectedSize === size
                              ? 'border-pink-500 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 shadow-md'
                              : 'border-pink-200 bg-white text-amber-700 hover:border-pink-400 hover:shadow-sm'
                          }`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center text-sm">
                            {size === '1:1' && <div className="w-4 h-4 border-2 border-current rounded-sm"></div>}
                            {size === '3:2' && <div className="w-6 h-4 border-2 border-current rounded-sm"></div>}
                            {size === '2:3' && <div className="w-4 h-6 border-2 border-current rounded-sm"></div>}
                          </div>
                          <div className="text-xs font-medium">{size}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {(mode === 'image-to-image' || mode === 'text-to-image') && (
                  <div>
                    <label className="block text-lg font-bold text-amber-800 mb-3 font-cute">
                      魔法の呪文を書いてね ✨
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={mode === 'text-to-image' ? "例：可愛い猫耳少女、ピンクの髪、笑顔、背景に桜、アニメ風..." : "例：可愛い猫耳少女、ピンクの髪、笑顔、背景に桜..."}
                      className="w-full p-4 border-2 border-pink-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent font-cute text-amber-800"
                      rows={4}
                    />
                    
                    {mode === 'text-to-image' && (
                      <div className="mt-3">
                        <p className="text-sm text-blue-600 font-cute mb-2">💡 おすすめの呪文:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            'かわいい壁紙スタイル、かわいい背景、アニメスタイルのデザイン、シンプルな太い線の手描きスタイル、カートゥーンスタイル、かわいいフルパターン、タイル効果',
                            'ちびキャラクター、Q版デフォルメ、可愛らしい小さな体、大きな頭、ふわふわした雰囲気、癒し系',
                            '新世紀エヴァンゲリオンの効果，デジタルアニメスタイルのイラスト，二次元アニメの超高精細イラストスタイル、4K超高解像度、質の高いディテール、かわいい日本の女の子',
                            'LINEスタンプ風、可愛いアイコン、シンプルで分かりやすい、コミュニケーション用、親しみやすいキャラクター、カラフルで明るい、メッセージアプリ風、スタンプ感のあるデザイン'
                          ].map((template, index) => (
                            <button
                              key={index}
                              onClick={() => setPrompt(template)}
                              className="text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors font-cute text-blue-700"
                            >
                              {template}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mode === 'template-mode' && selectedTemplate && (
                  <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-4 rounded-2xl shadow-lg">
                    <h4 className="font-bold text-amber-900 mb-2 font-cute text-base">
                      🎀 選択中の魔法：{selectedTemplate.name}
                    </h4>
                    <p className="text-xs text-amber-700 font-cute leading-relaxed">
                      {selectedTemplate.prompt}
                    </p>
                  </div>
                )}

                <div className="flex items-center bg-white p-4 rounded-2xl shadow-md">
                  <input
                    type="checkbox"
                    id="enhancePrompt"
                    checked={enhancePrompt}
                    onChange={(e) => setEnhancePrompt(e.target.checked)}
                    className="rounded border-pink-300 text-pink-500 focus:ring-pink-500 h-5 w-5"
                  />
                  <label htmlFor="enhancePrompt" className="ml-3 text-sm font-cute text-amber-800">
                    プロンプト効果を強化する
                  </label>
                </div>

                <button
                  onClick={generateImage}
                  disabled={isGenerating || 
                    (mode === 'template-mode' && (!fileUrl || !selectedTemplate)) || 
                    (mode === 'image-to-image' && (!fileUrl || !prompt.trim())) ||
                    (mode === 'text-to-image' && !prompt.trim())
                  }
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      {mode === 'text-to-image' ? '画像を生成しているよ... ✨' : '魔法をかけているよ... ✨'}
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-6 h-6 mr-3" />
                      {mode === 'text-to-image' ? '画像を生成する！ 🎨' : '変身させる！ 🎀'}
                    </>
                  )}
                </button>
              </div>

              {generationProgress && generationProgress > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2 font-cute">
                    <span className="text-purple-600">{generationStatusText}</span>
                    <span className="text-pink-600">{generationProgress}% ✨</span>
                  </div>
                  <div className="w-full bg-pink-100/70 backdrop-blur-sm rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {generationError && (
                <div className="mt-6 p-6 bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm border border-pink-200/50 rounded-[24px] shadow-lg overflow-hidden">
                  <p className="text-pink-800 font-cute">{generationError}</p>
                </div>
              )}
            </div>
          </div>

          <div className={`lg:w-1/2 space-y-8 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 card-kawaii border border-white/40 overflow-hidden">
              <h3 className="text-2xl font-bold text-amber-800 mb-6 font-cute text-center">
                {isGenerating 
                  ? (mode === 'text-to-image' ? '画像生成中、1-3分お待ちください...' : '変身中、1-3分お待ちください...') 
                  : currentResult?.status === 'SUCCESS' 
                    ? (mode === 'text-to-image' ? '画像生成完了！🎉' : '変身完了！🎉') 
                    : '結果プレビュー ✨'
                }
              </h3>

              {!currentResult && (
                <div className="space-y-6">
                  {/* 上传图片预览窗口 */}
                  <div className="bg-white/70 backdrop-blur-lg rounded-[24px] p-6 border-2 border-dashed border-gray-300/40 shadow-lg overflow-hidden">
                    {mode === 'text-to-image' ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">✍️</div>
                        <p className="text-blue-600 font-cute text-sm">
                          文生图モード
                        </p>
                        <p className="text-xs text-blue-500 mt-1">
                          テキストから画像を生成
                        </p>
                      </div>
                    ) : imagePreview ? (
                      <div className="text-center">
                        <img
                          src={imagePreview}
                          alt="変身待ち画像のプレビュー"
                          className="max-w-full max-h-48 object-contain rounded-xl mx-auto mb-3 shadow-md"
                        />
                        <p className="text-sm text-gray-700 font-cute">
                          📸 変身待ち画像
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-gray-600 font-cute text-sm">
                          画像をアップロードしてプレビュー
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* 生成结果预览窗口 */}
                  <div className="bg-white/70 backdrop-blur-lg rounded-[24px] p-6 border-2 border-dashed border-amber-300/40 shadow-lg overflow-hidden">
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">✨</div>
                      <p className="text-amber-700 font-cute text-sm mb-1">
                        {mode === 'text-to-image' ? '生成結果プレビュー' : '変身結果プレビュー'}
                      </p>
                      <p className="text-xs text-amber-500 font-cute">
                        &ldquo;{mode === 'text-to-image' ? '生成する！' : '変身させる！'}&rdquo;をクリックして{mode === 'text-to-image' ? '画像生成' : '魔法の変身'}を開始
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentResult && (
                <div className="space-y-6">
                  {currentResult.status === 'SUCCESS' && currentResult.generated_url ? (
                    <div className="space-y-6">
                      {mode === 'text-to-image' ? (
                        <div className="text-center">
                          <img
                            src={currentResult.generated_url}
                            alt="生成された画像"
                            className="max-w-full h-auto rounded-2xl mx-auto shadow-lg"
                          />
                          <p className="text-sm text-blue-700 font-cute mt-3">
                            ✨ 生成された画像
                          </p>
                        </div>
                      ) : (
                        <BeforeAfterSlider
                          beforeImage={currentResult.original_url}
                          afterImage={currentResult.generated_url}
                          beforeAlt="変身前"
                          afterAlt="変身后"
                        />
                      )}

                      <div className="flex justify-center">
                        <button
                          onClick={(event) => {
                            // 阻止默认行为和事件冒泡
                            event.preventDefault()
                            event.stopPropagation()
                            
                            try {
                              // 在新标签页打开图片
                              window.open(currentResult.generated_url, '_blank', 'noopener,noreferrer')
                              
                              // 延迟触发下载，确保新窗口先打开
                              setTimeout(() => {
                                const link = document.createElement('a')
                                link.href = currentResult.generated_url
                                link.download = `anime-magic-${Date.now()}.png`
                                link.style.display = 'none'
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }, 200)
                            } catch (error) {
                              console.error('下载操作失败:', error)
                              // 如果新窗口打开失败，至少尝试下载
                              const link = document.createElement('a')
                              link.href = currentResult.generated_url
                              link.download = `anime-magic-${Date.now()}.png`
                              link.style.display = 'none'
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }
                          }}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                        >
                          📥 ダウンロード
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                      <p className="mt-4 text-purple-600 font-cute">
                        kemono-mimiのGPT-4o Image FluxMax版で画像生成中... 1-3分で完成！✨
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

            {/* 選べる変身スタイル 模板展示部分 - 独立区域 */}
      <div className={`bg-[#fff7ea] py-20 lg:py-24 px-4 sm:px-6 lg:px-8 mt-20 transition-all duration-1000 delay-1300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-8 lg:mb-10 transition-all duration-1000 delay-1500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            kemono-mimi AI画像生成 - GPT-4o Image FluxMax版で写真をアニメ風に即変換
          </h2>
          <p className={`text-base sm:text-lg lg:text-xl text-amber-700 text-center mb-8 lg:mb-10 leading-relaxed transition-all duration-1000 delay-1600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            登録不要・商用利用可能・完全無料で20種類以上のアニメスタイルから選択
          </p>
          <p className={`text-sm sm:text-base lg:text-lg text-amber-600 text-center mb-12 lg:mb-16 leading-relaxed transition-all duration-1000 delay-1700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            最新のGPT-4o Image FluxMax技術により、ジブリ風・可愛い壁紙・美少女・chibiキャラクター作成・証明写真加工など、高品質なアニメ画像を1-3分で生成します
          </p>
          
          {/* 分类选择按钮 */}
          <div className={`flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 lg:mb-12 transition-all duration-1000 delay-1800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {[...Array.from(new Set(templates.map(t => t.category)))].map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-400 to-orange-400 text-white shadow-lg scale-110'
                    : 'bg-white/80 text-amber-700 border border-amber-200 hover:bg-amber-50'
                }`}
                style={{ animationDelay: `${1.8 + index * 0.1}s` }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 分类展示内容 */}
          {(() => {
            const selectedTemplate = templates.find(t => t.category === selectedCategory)
            return selectedTemplate && (
              <div className={`card-kawaii p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto transition-all duration-1000 delay-2000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-800 font-cute text-center mb-8 lg:mb-10">
                  {selectedTemplate.name} - 変身前後の比較
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
                  {/* 变身前 */}
                  <div className="text-center animate-fade-in-left" style={{animationDelay: '2.1s'}}>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-bold">変身前</p>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
                      <img
                        src={selectedTemplate.beforeImage}
                        alt={`${selectedTemplate.name} 変身前 - AI画像変換 無料 変身前の写真`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* 箭头 */}
                  <div className="text-center animate-fade-in" style={{animationDelay: '2.3s'}}>
                    <div className="text-3xl sm:text-4xl lg:text-5xl text-amber-600 font-bold animate-pulse">
                      →
                    </div>
                    <p className="text-sm sm:text-base text-amber-700 mt-3 sm:mt-4 font-cute">
                      AI変身
                    </p>
                  </div>
                  
                  {/* 变身后 */}
                  <div className="text-center animate-fade-in-right" style={{animationDelay: '2.1s'}}>
                    <p className="text-sm sm:text-base text-amber-700 mb-3 sm:mb-4 font-bold">変身後</p>
                    <div className="aspect-square bg-amber-100 rounded-lg overflow-hidden border-2 border-amber-300 shadow-lg">
                      <img
                        src={selectedTemplate.afterImage}
                        alt={`${selectedTemplate.name} 変身後 - AI画像変換 無料 変身後の${selectedTemplate.name === 'chibi' ? 'chibiキャラクター' : selectedTemplate.name === 'lineスタンプ' ? 'LINEスタンプ' : selectedTemplate.name === '可愛line アイコン' ? 'LINEアイコン' : 'アニメ画像'}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 lg:mt-10 text-center animate-fade-in-up" style={{animationDelay: '2.5s'}}>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-800 font-cute text-center mb-8 lg:mb-10">
                    {selectedTemplate.name} - AI画像変換 無料 変身前後の比較
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed max-w-4xl mx-auto">
                    {selectedTemplate.prompt}
                  </p>
                  
                  {/* AI生成图片免责声明 */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-6 lg:mb-8 max-w-4xl mx-auto">
                    <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
                      <span className="font-semibold">※ 免責事項：</span>
                      すべての画像はAI技術により生成されたものです。実在の人物や作品との類似性は偶然であり、意図的な模倣ではありません。ご利用の際は適切な用途でお楽しみください。
                    </p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      className="btn-kawaii px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
                      onClick={() => {
                        setSelectedTemplate(selectedTemplate)
                        setPrompt(selectedTemplate.prompt)
                        setMode('template-mode')
                        // 滚动到页面顶部
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    >
                      このスタイルで変身
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}