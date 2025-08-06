'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { PhotoIcon, PaperAirplaneIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import { useAppStore } from '@/store/useAppStore'
import { ImageSize } from '@/store/useAppStore'
import BeforeAfterSlider from './BeforeAfterSlider'
import ShareButton from './ShareButton'
import MobileBottomNav from './MobileBottomNav'
import TemplateGallery from './TemplateGallery'
import Link from 'next/link'
import Image from 'next/image'


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
  status?: string
}

const templates: Template[] = [
  
  {
    id: '24',
    name: 'emoji 絵文字風',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/emoji-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/emoji-after',
    prompt: '写真の中の人物を、このスタイルの3Dステッカー風アバターとして生成する。体型、顔の形、肌の色、顔の表情を忠実に再現し、写真内の顔の装飾、髪型やヘアアクセサリー、服装、アクセサリー、表情、ポーズもそのまま維持する。背景は単色で、白い太めのアウトラインを追加し、人物全体がしっかり描かれていること。最終的な画像がApple公式のiOS絵文字ステッカーのように見えるようにする。',
    category: 'emoji 絵文字風'
  },
  {
    id: '19',
    name: 'lineスタンプ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85%E5%8C%85-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85%E5%8C%85-after',
    prompt: 'LINEスタンプ、可愛いキャラクター、シンプルでわかりやすい、色彩豊かで明るい、メッセージアプリに似たスタンプ感のあるデザイン、親しみやすい、感情を表すシンボルのような要素も含む、透明な背景のイラスト',
    category: 'lineスタンプ'
  },
  {
    id: '9',
    name: 'chibi',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-afterr',
    prompt: 'ちびキャラクター、Q版デフォルメ、可愛らしい小さな体、大きな頭、ふわふわした雰囲気、癒し系',
    category: 'chibi'
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
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/irasutoya-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/irasutoya-afterr',
    prompt: 'イラストはエレガントなスタイルで、穏やかで愛らしい、商用フリー素材スタイルで、シンプルで親しみやすく、柔らかな触感、可愛いキャラクター、誇張した表情、抽象芸術、フラットデザイン、親しみやすい雰囲気、清潔な背景です。',
    category: 'irasutoya'
  },
  {
    id: '8',
    name: '萌え化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-afterr',
    prompt: 'ちび風ロリータ少女、可愛いウサギ耳、フリルディテール、ふわふわの要素が特徴で。チビ、カワイイ、ソフトシェーディング、可愛いウサギ耳、フリルディテール、繊細なラインアート、パステル背景、愛らしい表情、スウィートテーマ、手描き、カートゥーン調、ミニマリスト背景、光沢のある瞳、フローラルアクセント、リボンディテール、ふわふわ要素、明るい色調、甘美なカラーパレット、魅力的',
    category: '萌え化'
  },
  {
    id: '2',
    name: 'ブルーアーカイブ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-after',
    prompt: 'ウルトラブルーアーカイブスタイル、アニメの女の子、制服の美学、柔らかなカートゥーンの影、細く綺麗な線画、半写実的な比率、柔らかなカラーパレット、フラットな照明、最小限の影、光のグラデーション、高解像度、未来的な現代学校デザイン、SF要素、光り輝くアクセサリー、スタイリッシュな武器デザイン、テクノロジーの服装のアクセント、最小限の背景、プロフェッショナルなキャラクターシートの雰囲気、活気に満ちた柔らかな色調の調和。',
    category: 'ブルーアーカイブ'
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
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%B0%91%E5%A5%B3-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%B0%91%E5%A5%B3-after',
    prompt: 'eva effect，明るい色調、デジタルアニメスタイルのイラスト，二次元アニメの超高精細イラストスタイル、4K超高解像度、質の高いディテール、かわいい日本の女の子',
    category: '少女'
  },
  
  {
    id: '18',
    name: '可愛line アイコン',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-afterr',
    prompt: 'LINEスタンプ風、可愛いアイコン、シンプルで分かりやすい、コミュニケーション用、親しみやすいキャラクター、カラフルで明るい、メッセージアプリ風、スタンプ感のあるデザイン',
    category: '可愛line アイコン'
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
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/SD%E5%B0%8F%E4%BA%BA-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/SD%E5%B0%8F%E4%BA%BA-after',
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
    name: 'ゴシック地雷女',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%93%A5%E7%89%B9%E5%9C%B0%E9%9B%B7-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%93%A5%E7%89%B9%E5%9C%B0%E9%9B%B7-after',
    prompt: 'ゴシックロリータスタイルの少女で、スウィートゴスとカワイイ要素を融合、黒白トーン、繊細なレースディテール、猫耳アクセサリー、鏡撮りのクールでカワイイ雰囲気。ゴシックロリータ、スウィートゴス、黒白トーン、繊細なレースディテール、猫耳アクセサリー、フリルテクスチャ、カワイイゴス美学、モノクロパレット、チェッカードパターン、チョーカーネックレス、ロングツインテール、ミラーセルフィー構図、エッジーでカワイイヴァイブ、テキストオーバーレイ、複雑な衣装デザイン、ゴシックアクセサリー、ムーディライティング、レースグローブ、コルセットディテール、ダークロマンス',
    category: 'ゴシック地雷女'
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
    id: '1',
    name: '擬人化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA-after',
    prompt: '[対象物]を擬人化したキャラクター。特徴は[素材]、[形状]、[機能]、[色]に基づいてデザイン。髪型や服装に[対象物]の要素を取り入れた[少女／少年]の姿。アニメ風、中心構図、清潔な背景、細部まで丁寧に描写、ソフトな色調',
    category: '擬人化'
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
    id: '23',
    name: '写真 アニメ風',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%86%99%E7%9C%9F%E6%BC%AB%E7%94%BB%E5%8C%96-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%86%99%E7%9C%9F%E6%BC%AB%E7%94%BB%E5%8C%96-after',
    prompt: 'カワイイアニメのメイドガールで、繊細なレースとフリルのディテール、ソフトなシェーディング、パステルカラー、可愛い表情、ゴシックロリータ要素、光沢のある瞳。アニメメイド、カワイイ、繊細なレース、ソフトシェーディング、パステルカラー、フリルディテール、可愛い表情、ゴシックロリータ要素、光沢のある瞳、ディテール豊かな衣装、ロマンチックな雰囲気、手描きアニメ、魅力的、女性的、複雑なデザイン、ライトバックグラウンド、甘美、エレガント、アニメ美学、メイドヘッドドレス',
    category: '写真 アニメ風'
  },
  
  {
    id: '25',
    name: '獣耳',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%85%BD%E8%80%B3-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%85%BD%E8%80%B3-after',
    prompt: 'かわいい獣耳キャラクター、猫耳または狐耳、ふわふわの耳と尻尾が特徴。自然な髪色と大きな瞳、柔らかい表情。耳と同系色の髪飾りやリボンをつけている。ファンタジー風の衣装、モフモフ感を大事にしたデザイン。背景はややぼかした自然風景、柔らかい光、アニメ風イラスト、高解像度、全身が見える構図。',
    category: '獣耳'
  },
]

// 添加尺寸按钮组件
const SizeButton = ({ size, isSelected, onClick, isMobile = false }: {
  size: ImageSize
  isSelected: boolean
  onClick: () => void
  isMobile?: boolean
}) => {
  const getSizeIcon = (size: ImageSize, isMobile: boolean = false) => {
    if (isMobile) {
      switch (size) {
        case '1:1':
          return (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-3 h-3 border-2 border-current rounded-sm bg-current opacity-20"></div>
                <div className="absolute -top-1 -right-1 text-xs"></div>
              </div>
            </div>
          )
        case '3:2':
          return (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-4 h-2.5 border-2 border-current rounded-sm bg-current opacity-20"></div>
                <div className="absolute -top-1 -right-1 text-xs"></div>
              </div>
            </div>
          )
        case '2:3':
          return (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-2.5 h-4 border-2 border-current rounded-sm bg-current opacity-20"></div>
                <div className="absolute -top-1 -right-1 text-xs"></div>
              </div>
            </div>
          )
        default:
          return null
      }
    } else {
      // 桌面端使用更精美的图标
      switch (size) {
        case '1:1':
          return (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-4 h-4 border-2 border-current rounded-sm bg-current opacity-20"></div>
                <div className="absolute -top-1 -right-1 text-xs"></div>
              </div>
            </div>
          )
        case '3:2':
          return (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-5 h-3 border-2 border-current rounded-sm bg-current opacity-20"></div>
                <div className="absolute -top-1 -right-1 text-xs"></div>
              </div>
            </div>
          )
        case '2:3':
          return (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-3 h-5 border-2 border-current rounded-sm bg-current opacity-20"></div>
                <div className="absolute -top-1 -right-1 text-xs"></div>
              </div>
            </div>
          )
        default:
          return null
      }
    }
  }

  const getSizeLabel = (size: ImageSize) => {
    switch (size) {
      case '1:1':
        return '正方形'
      case '3:2':
        return '横長'
      case '2:3':
        return '縦長'
      default:
        return size
    }
  }

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 relative ${
          isSelected
            ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {getSizeIcon(size, true)}
        <span className="font-medium">{size}</span>
        
        {/* 选中状态的指示器 */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border border-pink-500"></div>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl border-2 font-cute transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2 relative overflow-hidden ${
        isSelected
          ? 'border-pink-500 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 shadow-md'
          : 'border-pink-200 bg-white text-amber-700 hover:border-pink-400 hover:shadow-sm'
      }`}
    >
      {/* 选中状态的装饰效果 */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-pink-500"></div>
      )}
      
      <div className="w-8 h-8 flex items-center justify-center">
        {getSizeIcon(size, false)}
      </div>
      <div className="text-xs font-medium">{size}</div>
      <div className="text-xs text-gray-500">{getSizeLabel(size)}</div>
      
      {/* 悬停时的光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"></div>
    </button>
  )
}

export default function WorkspaceRefactored() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null)
  const [isVisible] = useState(true)

  const [mode, setMode] = useState<'image-to-image' | 'template-mode' | 'text-to-image'>('template-mode')
  const [enhancePrompt, setEnhancePrompt] = useState(false)
  const [generationError, setGenerationError] = useState<string>('')
  const [autoShareUrl, setAutoShareUrl] = useState<string>('')

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const templatesPerPage = isMobile ? 3 : 5
  // const [selectedCategory, setSelectedCategory] = useState<string>('擬人化')


  const { selectedSize, setSelectedSize } = useAppStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)
  const templateScrollRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)
  
  // 修复输入框光标重置问题 - 为不同类型的输入框创建独立的ref
  const promptMobileInputRef = useRef<HTMLInputElement>(null)
  const promptDesktopTextareaRef = useRef<HTMLTextAreaElement>(null)
  
  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setPrompt(newValue)
  }, [])

  // 响应式检测
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 保持输入框焦点（仅在真正失焦时重新聚焦，避免干扰输入法）
  useEffect(() => {
    if (mode === 'image-to-image' || mode === 'text-to-image') {
      if (isMobile) {
        const inputEl = promptMobileInputRef.current
        if (inputEl && document.activeElement !== inputEl) {
          inputEl.focus()
        }
      } else {
        const textareaEl = promptDesktopTextareaRef.current
        if (textareaEl && document.activeElement !== textareaEl) {
          textareaEl.focus()
        }
      }
    }
  }, [isMobile, mode])

  // 初始化状态恢复
  useEffect(() => {
    const savedFileUrl = localStorage.getItem('savedFileUrl')
    const savedMode = localStorage.getItem('savedMode')
    
    if (savedFileUrl && savedMode === 'image-to-image') {
      setFileUrl(savedFileUrl)
      setMode(savedMode as 'text-to-image' | 'image-to-image' | 'template-mode')
    }
  }, [])

  useEffect(() => {
    // 只在组件真正初始化时运行一次
    if (hasInitializedRef.current) return
    
    const savedTemplateId = localStorage.getItem('selectedTemplateId')
    if (savedTemplateId) {
      const foundTemplate = templates.find(t => t.id === savedTemplateId)
      if (foundTemplate) {
        setSelectedTemplate(foundTemplate)
        setPrompt(foundTemplate.prompt)
        setMode('template-mode')
      }
    }

    hasInitializedRef.current = true
  }, [])

  // 清理定时器
  useEffect(() => {
    console.log('[useEffect] 组件挂载，设置isMountedRef为true')
    isMountedRef.current = true
    return () => {
      console.log('[useEffect] 组件卸载，设置isMountedRef为false')
      isMountedRef.current = false
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [])

  // 移除滚动位置恢复，保持原生滚动状态

  // 直接上传到外部服务
  const uploadImageDirectly = useCallback(async (file: File): Promise<string> => {
    // 检查文件类型和大小
    if (!file.type.startsWith('image/')) {
      throw new Error('画像ファイルを選択してください')
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('画像サイズは10MBを超えることはできません')
    }

    // 尝试多种上传方式，优先使用R2
    const uploadMethods = [
      () => uploadToR2(file),
      () => uploadToImgBB(file),
      () => uploadToCloudinary(file),
      () => uploadToBase64(file) // 作为最后的回退方案
    ]

    for (const uploadMethod of uploadMethods) {
      try {
        const url = await uploadMethod()
        console.log('✅ 图片上传成功:', url)
        return url
      } catch (error) {
        console.warn('⚠️ 上传方式失败，尝试下一个:', error)
        continue
      }
    }

    throw new Error('すべてのアップロード方法が失敗しました')
  }, [])

  // 图片上传
  const handleImageSelect = useCallback(async (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setIsUploading(true)
      
      // 直接使用客户端上传，不依赖API路由
      const url = await uploadImageDirectly(file)
      setFileUrl(url)
      localStorage.setItem('savedFileUrl', url)
      localStorage.setItem('savedMode', mode)
    } catch (err) {
      console.error('文件上传失败:', err)
      const errorMessage = err instanceof Error ? err.message : '画像アップロードに失败しました'
      alert(errorMessage)
      setFileUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [mode, uploadImageDirectly])

  // 上传到 Cloudflare R2 (优先) - 使用API路由
  const uploadToR2 = async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `上传失败: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.fileUrl) {
        return data.fileUrl
      } else {
        throw new Error(data.error || '上传响应格式错误')
      }
    } catch (error) {
      console.warn('R2上传失败，尝试其他方式:', error)
      throw error
    }
  }

  // 上传到 ImgBB
  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    
    // 从环境变量获取API Key，如果没有则使用默认值
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY'
    
    if (imgbbApiKey === 'YOUR_IMGBB_API_KEY') {
      throw new Error('ImgBB API Key が設定されていません')
    }
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`ImgBB アップロード失敗: ${response.status}`)
    }

    const data = await response.json()
    if (data.success) {
      return data.data.url
    } else {
      throw new Error(data.error?.message || 'ImgBB アップロード失敗')
    }
  }

  // 上传到 Cloudinary (免费服务)
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default') // 使用默认预设
    
    const response = await fetch('https://api.cloudinary.com/v1_1/demo/image/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Cloudinary アップロード失敗: ${response.status}`)
    }

    const data = await response.json()
    return data.secure_url
  }

  // Base64 编码作为最后的回退方案
  const uploadToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        reject(new Error('Base64 エンコード失敗'))
      }
      reader.readAsDataURL(file)
    })
  }

  // 提示词安全检查函数
  const sanitizePrompt = (prompt: string): string => {
    // 替换可能被误判为违规的词汇
    const replacements: { [key: string]: string } = {
      '肌のレンダリング': '美しい質感',
      '肌': '質感',
      'スキン': 'テクスチャ',
      'nude': 'natural',
      'naked': 'simple',
      'explicit': 'detailed',
      'adult': 'mature',
      'sexy': 'elegant',
      'seductive': 'charming'
    };
    
    let sanitizedPrompt = prompt;
    Object.entries(replacements).forEach(([original, replacement]) => {
      sanitizedPrompt = sanitizedPrompt.replace(new RegExp(original, 'gi'), replacement);
    });
    
    return sanitizedPrompt;
  };

  // 图片生成
  const generateImage = async () => {
    if (mode === 'template-mode' && !selectedTemplate) {
      alert('テンプレートを選択してください')
      return
    }
    if (mode !== 'text-to-image' && !fileUrl) {
      alert('画像をアップロードしてください')
      return
    }
    if ((mode === 'image-to-image' || mode === 'text-to-image') && !prompt.trim()) {
      alert('プロンプトを入力してください')
      return
    }

    console.log('[generateImage] 开始生成流程, mode:', mode, 'selectedTemplate:', selectedTemplate?.name)
    console.log('[generateImage] fileUrl:', fileUrl)
    console.log('[generateImage] prompt:', prompt)
    console.log('[generateImage] selectedSize:', selectedSize)
    
    // 清空上一次生成的分享链接
    shareCreatedRef.current = false
    setIsGenerating(true)
    setGenerationError('')
    setCurrentResult(null)

    const newResult: GenerationResult = {
      id: `${Date.now()}`,
      original_url: mode === 'text-to-image' ? 'https://via.placeholder.com/400x400/E3F2FD/2196F3?text=Text+to+Image' : imagePreview!,
      generated_url: '',
      prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
      timestamp: Date.now()
    }

    setCurrentResult(newResult)
    console.log('[generateImage] 设置currentResult:', newResult.id)

    const requestBody = {
      fileUrl: mode === 'text-to-image' ? undefined : fileUrl,
      prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
      enhancePrompt,
      size: selectedSize,
      mode: mode,
      style: selectedTemplate?.name || 'default'
    }
    
    console.log('[generateImage] 请求体:', JSON.stringify(requestBody, null, 2))

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '图像生成失败')
      }

      const data = await response.json()
      console.log('[generateImage] API响应:', data)
      const generatedUrl = data.url || data.urls?.[0] || data.data?.url || data.data?.urls?.[0]
      const success = data.success || (data.status === 'SUCCESS') || (data.data?.status === 'SUCCESS')

      if (generatedUrl && success) {
        console.log('[generateImage] 直接完成，无需轮询')
        const completedResult = { ...newResult, generated_url: generatedUrl }
        setCurrentResult(completedResult)

        // 自动分享处理 - 确保在状态更新后调用
        try {
          const shareResponse = await handleShare(completedResult)
          if (shareResponse) {
            setAutoShareUrl(shareResponse)
          }
        } catch (shareError) {
          console.warn('自动分享失败:', shareError)
        }

        setTimeout(() => {
          setIsGenerating(false)
        }, 2000)
      }
      
      const taskId = data.taskId || data.data?.taskId
      if (taskId) {
        console.log('[generateImage] 使用taskId进行轮询, taskId:', taskId)
        // 确保isGenerating为true，防止轮询提前结束
        setIsGenerating(true)
        await pollProgress(taskId, newResult.id)
      } else {
        throw new Error('未获得有效的生成结果')
      }
    } catch (error) {
      console.error('[generateImage] 生成失败:', error)
      setGenerationError(error instanceof Error ? error.message : 'エラーが発生しました')
      setCurrentResult(null)
      setIsGenerating(false)
    }
  }


  const shareCreatedRef = useRef(false)

  const handleShare = async (result: GenerationResult): Promise<string | null> => {
    // 每次生成时强制创建新的分享页面，不复用旧链接
    console.log('[handleShare] 强制创建新分享页面，不复用旧链接')
    // 重置分享状态，确保每次都能创建新分享
    shareCreatedRef.current = false
    setAutoShareUrl('')
    try {
      let originalUrl = null
      
      // 根据模式正确处理originalUrl
      if (mode === 'text-to-image') {
        originalUrl = null
      } else if ((mode === 'image-to-image' || mode === 'template-mode') && fileUrl) {
        if (fileUrl && 
            !fileUrl.includes('placeholder.com') && 
            !fileUrl.includes('Text+to+Image') &&
            !fileUrl.startsWith('data:image/')) {
          originalUrl = fileUrl
        }
      }

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generatedUrl: result.generated_url,
          originalUrl,
          prompt: result.prompt,
          style: selectedTemplate?.name || 'カスタム',
          timestamp: Date.now()
        })
      })

      if (response.ok) {
        const shareData = await response.json()
        shareCreatedRef.current = true
        console.log('自动分享创建成功:', shareData.shareUrl)
        return shareData.shareUrl
      } else {
        console.error('自动分享创建失败:', response.statusText)
        return null
      }
    } catch (error) {
      console.warn('自动分享处理失败:', error)
      return null
    }
  }

  const pollProgress = async (taskId: string, resultId: string) => {
    console.log('[pollProgress] 启动, taskId:', taskId, 'resultId:', resultId)
    const startTime = Date.now()
    const timeout = 5 * 60 * 1000
    let errorCount = 0
    let consecutiveFailures = 0 // 添加连续失败计数
    
    if (!isGenerating) {
      setIsGenerating(true)
    }
    
    const loop = async () => {
      if (!isMountedRef.current) {
        console.log('[pollProgress] isMountedRef.current 为 false，提前 return')
        return
      }
      if (Date.now() - startTime >= timeout) {
        console.log('[pollProgress] 超时，提前 return')
        setGenerationError('タイムアウトしました')
        setCurrentResult(null)
        setIsGenerating(false)
        return
      }
      try {
        const response = await fetch(`/api/image-details?taskId=${taskId}`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        // image-details.ts 返回格式: { success: true, data: { code: 200, msg: 'success', data: {...} } }
        // 所以 KIE API 的实际数据在 data.data.data 中
        const kieApiData = data.data?.data || data.data || data
        const responseData = kieApiData
        const status = responseData.status || 'GENERATING'
        const generatedUrl = responseData.response?.result_urls?.[0] || responseData.response?.resultUrls?.[0] || null
        const successFlag = responseData.successFlag
        const errorMessage = responseData.errorMessage || responseData.error || null
        
        console.log('[pollProgress] === 调试数据解析 ===')
        console.log('[pollProgress] 原始响应:', data)
        console.log('[pollProgress] data.data:', data.data)
        console.log('[pollProgress] data.data.data:', data.data?.data)
        console.log('[pollProgress] 解析后的 kieApiData:', kieApiData)
        console.log('[pollProgress] === 状态信息 ===')
        console.log('[pollProgress] 状态检查:', { status, successFlag, generatedUrl, errorMessage })
        console.log('[pollProgress] 完整响应数据:', responseData)
        console.log('[pollProgress] response字段:', responseData.response)
        console.log('[pollProgress] resultUrls字段:', responseData.response?.resultUrls)
        console.log('[pollProgress] result_urls字段:', responseData.response?.result_urls)
        
        // 检查成功标志或状态 - 修复成功判断逻辑
        // 如果状态是SUCCESS，即使没有generatedUrl也要处理（可能是回调已处理）
        const isSuccess = (status === 'SUCCESS' || successFlag === 1)
        const isFailed = status === 'FAILED' || status === 'GENERATE_FAILED' || successFlag === 3 || successFlag === 2 || errorMessage
        
        // 添加调试日志
        console.log('[pollProgress] 成功判断详情:', {
          status,
          successFlag,
          hasGeneratedUrl: !!generatedUrl,
          isSuccess,
          isFailed
        })

        console.log('[pollProgress] 状态判断:', { isSuccess, isFailed, hasGeneratedUrl: !!generatedUrl })
        
        if (isSuccess) {
          console.log('[pollProgress] 生成成功，处理结果...')
          consecutiveFailures = 0 // 重置失败计数
          
          let finalImageUrl = ''
          
          if (generatedUrl) {
            console.log('[pollProgress] 有generatedUrl:', generatedUrl)
            // 检查是否是R2 URL，如果是则直接使用
            finalImageUrl = generatedUrl
            if (generatedUrl.includes('tempfile.aiquickdraw.com')) {
              // 如果是KIE AI的临时URL，先获取下载URL，然后下载并上传到R2
              try {
                console.log('[pollProgress] 处理KIE临时URL，获取下载链接...')
                const downloadResponse = await fetch('/api/download-url', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: generatedUrl, taskId })
                })

                if (downloadResponse.ok) {
                  const downloadData = await downloadResponse.json()
                  const directUrl = downloadData.downloadUrl
                  console.log('[pollProgress] 获取到直接下载URL:', directUrl)
                  
                  // 下载并上传到R2
                  console.log('[pollProgress] 开始下载并上传到R2...')
                  const uploadResponse = await fetch('/api/download-and-upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      kieImageUrl: directUrl, 
                      taskId,
                      fileName: `generated_${taskId}.png`
                    })
                  })
                  
                  if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json()
                    finalImageUrl = uploadData.url
                    console.log('[pollProgress] 成功上传到R2:', finalImageUrl)
                  } else {
                    console.log('[pollProgress] R2上传失败，使用直接下载URL')
                    finalImageUrl = directUrl
                  }
                } else {
                  console.log('[pollProgress] 下载URL获取失败，使用原始URL')
                }
              } catch (error) {
                console.warn('[pollProgress] 下载URL处理失败:', error)
              }
            } else {
              console.log('[pollProgress] 使用R2 URL:', finalImageUrl)
            }
          } else {
            console.log('[pollProgress] 没有generatedUrl，主动查询after桶...')
            // 主动查询after桶获取实际的公网URL
            try {
              const r2UrlResponse = await fetch(`/api/get-generated-url?taskId=${taskId}`)
              if (r2UrlResponse.ok) {
                const r2UrlData = await r2UrlResponse.json()
                if (r2UrlData.found && r2UrlData.url) {
                  finalImageUrl = r2UrlData.url
                  console.log('[pollProgress] 从after桶获取URL成功:', finalImageUrl)
                } else {
                  console.log('[pollProgress] after桶中未找到图片，等待回调处理...')
                  // 增加等待计数，避免无限轮询
                  errorCount++
                  if (errorCount > 15) { // 等待30秒后停止
                    console.log('[pollProgress] 等待after桶超时，停止轮询')
                    setGenerationError('图片生成完成但无法获取URL，请稍后刷新页面查看')
                    setIsGenerating(false)
                    return
                  }
                  pollIntervalRef.current = setTimeout(loop, 2000)
                  return
                }
              } else {
                console.log('[pollProgress] 查询after桶失败，继续等待...')
                errorCount++
                if (errorCount > 15) {
                  console.log('[pollProgress] 查询after桶失败次数过多，停止轮询')
                  setGenerationError('无法获取生成的图片URL，请稍后刷新页面查看')
                  setIsGenerating(false)
                  return
                }
                pollIntervalRef.current = setTimeout(loop, 2000)
                return
              }
            } catch (error) {
              console.warn('[pollProgress] 查询after桶出错:', error)
              errorCount++
              if (errorCount > 15) {
                console.log('[pollProgress] 查询after桶错误次数过多，停止轮询')
                setGenerationError('查询图片状态时出错，请稍后刷新页面查看')
                setIsGenerating(false)
                return
              }
              pollIntervalRef.current = setTimeout(loop, 2000)
              return
            }
          }

          const completedResult = {
            id: resultId,
            original_url: mode === 'text-to-image' ? 'https://via.placeholder.com/400x400/E3F2FD/2196F3?text=Text+to+Image' : imagePreview!,
            generated_url: finalImageUrl,
            prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
            timestamp: Date.now()
          }

          console.log('[pollProgress] 设置完成结果:', completedResult)
          setCurrentResult(completedResult)
          
          // 自动分享处理
          try {
            const shareResponse = await handleShare(completedResult)
            if (shareResponse) {
              setAutoShareUrl(shareResponse)
              console.log('[pollProgress] 自动分享成功:', shareResponse)
            }
          } catch (shareError) {
            console.warn('自动分享失败:', shareError)
          }

          setTimeout(() => {
            setIsGenerating(false)
          }, 2000)
          return // 重要：成功时直接返回，停止轮询
        } else if (isFailed) {
          consecutiveFailures++
          console.error('[pollProgress] 生成失败 (连续失败次数:', consecutiveFailures, '):', errorMessage || '生成に失敗しました')
          
          // 如果连续失败5次，停止轮询
          if (consecutiveFailures >= 5) {
            console.log('[pollProgress] 连续失败5次，停止轮询')
            setGenerationError(errorMessage || '生成に失敗しました')
            setCurrentResult(null)
            setIsGenerating(false)
            return
          }
          
          // 失败时继续轮询，但增加延迟
          if (!isMountedRef.current) {
            console.log('[pollProgress] 组件已卸载，停止轮询')
            return
          }
          
          pollIntervalRef.current = setTimeout(loop, 5000) // 失败时增加延迟到5秒
        } else {
          // 继续轮询，但检查是否应该停止
          consecutiveFailures = 0 // 重置失败计数
          
          // 如果状态是SUCCESS但没有URL，可能是回调正在处理中
          if (status === 'SUCCESS' && !generatedUrl) {
            console.log('[pollProgress] 状态为SUCCESS但无URL，等待回调处理完成...')
            pollIntervalRef.current = setTimeout(loop, 1000) // 快速轮询等待回调
            return
          }
          
          if (!isMountedRef.current) {
            console.log('[pollProgress] 组件已卸载，停止轮询')
            return
          }
          
          // 检查是否超时
          if (Date.now() - startTime >= timeout) {
            console.log('[pollProgress] 轮询超时')
            setGenerationError('タイムアウトしました')
            setCurrentResult(null)
            setIsGenerating(false)
            return
          }
          
          pollIntervalRef.current = setTimeout(loop, 2000) // 增加轮询间隔到2秒
        }
      } catch (_error) {
        console.error('[轮询] 发生异常:', _error)
        errorCount++
        consecutiveFailures++
        console.log('[轮询] 错误计数:', errorCount, '连续失败次数:', consecutiveFailures)
        
        if (errorCount >= 3 || consecutiveFailures >= 5) {
          console.log('[轮询] 达到最大错误次数或连续失败次数，停止轮询')
          setGenerationError('ネットワークエラー')
          setCurrentResult(null)
          setIsGenerating(false)
          return
        } else {
          if (!isMountedRef.current) {
            console.log('[pollProgress] isMountedRef.current 为 false，提前 return (catch)')
            return
          }
          pollIntervalRef.current = setTimeout(loop, 5000) // 错误时增加延迟到5秒
        }
      }
    }
    loop()
  }

  const handleTemplateSelect = (template: Template) => {
    // 桌面端：完全保持滑块位置，不重置
    setSelectedTemplate(template)
    setPrompt(template.prompt)
    localStorage.setItem('selectedTemplateId', template.id)
    // 不保存或设置任何滚动位置，保持原生滚动状态
  }

  // 移动端模板选择处理函数
  const handleMobileTemplateSelect = (template: Template) => {
    // 移动端：完全保持滑块位置，不做任何滚动操作
    setSelectedTemplate(template)
    setPrompt(template.prompt)
    localStorage.setItem('selectedTemplateId', template.id)
    // 不调用任何scrollTo方法，保持原生滚动状态
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    const totalPages = Math.ceil(templates.length / templatesPerPage)
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('画像サイズは10MBを超えることはできません')
        return
      }
      handleImageSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) handleImageSelect(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  // 移动端布局组件
  const MobileLayout = () => {
    return (
      <div className="min-h-screen bg-[#fff7ea] flex flex-col">
        {/* 背景装饰层 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-4 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-8 w-24 h-24 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-32 left-8 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-teal-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-16 w-16 h-16 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-xl animate-bounce delay-500"></div>
          
          {/* 浮动装饰图案 */}
          <div className="absolute top-1/4 left-1/4 text-2xl animate-float">🌸</div>
          <div className="absolute top-1/2 right-1/3 text-xl animate-float-delayed">✨</div>
          <div className="absolute bottom-1/4 left-1/3 text-2xl animate-float">🎀</div>
          <div className="absolute top-3/4 right-1/4 text-xl animate-float-delayed">💫</div>
        </div>

        {/* 中间结果展示区 */}
        <div className="flex-1 mb-16 overflow-y-auto relative z-10">
          <div className="p-4 space-y-4">
            
            {/* 顶部装饰标题 */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <span className="text-lg">🎨</span>
                <span className="text-sm font-bold text-gray-700">魔法の変身スタジオ</span>
                <span className="text-lg">✨</span>
              </div>
            </div>

            {/* 滚动到guides的按钮 */}
            <div className="text-center mb-4">
              <button
                onClick={() => {
                  const guidesSection = document.getElementById('guides-section')
                  if (guidesSection) {
                    guidesSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm font-medium"
              >
                <span>📖</span>
                <span>使い方ガイドを見る</span>
                <span>↓</span>
              </button>
            </div>

            {!currentResult ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-280px)]">
                {mode === 'text-to-image' ? (
                  <div className="relative w-full max-w-full px-0 sm:px-2 md:max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-3xl blur-2xl opacity-30 animate-pulse pointer-events-none"></div>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-blue-200/50 p-6 sm:p-8 text-center w-full max-w-full mx-auto">
                      <div className="text-6xl sm:text-7xl mb-6 animate-bounce">✍️✨</div>
                      <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3">
                        🎨 文生图モード開始！
                      </h3>
                      <p className="text-blue-700 mb-6 font-cute text-base sm:text-lg">
                        テキストだけで、可愛い画像を作れるよ！
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 mb-6 border border-blue-100">
                        <p className="text-sm sm:text-base text-blue-700 mb-2">💡 コツ：</p>
                        <ul className="text-sm text-blue-600 space-y-1 text-left">
                          <li>• 具体的なキャラクター特徴を書くと綺麗に生成されるよ</li>
                          <li>• 背景や服装の色も指定できる</li>
                          <li>• 日本語でも英語でもOK！</li>
                        </ul>
                      </div>
                      <div className="mt-6 flex justify-center space-x-4">
                        <span className="text-2xl sm:text-3xl">🌈</span>
                        <span className="text-2xl sm:text-3xl">🎨</span>
                        <span className="text-2xl sm:text-3xl">✨</span>
                      </div>
                      <div className="mt-4 text-lg text-blue-500 font-bold">テキストを入力して画像を生成！</div>
                    </div>
                  </div>
                ) : imagePreview ? (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-4 border border-white/50">
                      <Image
                        src={imagePreview}
                        alt="アップロード画像"
                        width={300}
                        height={300}
                        className="max-w-full h-auto rounded-2xl shadow-lg"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">✨ 画像準備完了！</h3>
                        <p className="text-sm text-gray-600">綺麗な写真がアップロードされました</p>
                        <p className="text-xs text-pink-500 mt-1">魔法の変身を開始できますよ！</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-full px-0 sm:px-2 md:max-w-md mx-auto cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-pink-200/50 p-6 sm:p-8 text-center w-full max-w-full mx-auto">
                      <div className="text-6xl sm:text-7xl mb-6 animate-bounce">📸✨</div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                        📱 可愛い写真をアップロード
                      </h3>
                      <p className="text-gray-600 mb-6 font-cute text-base sm:text-lg">
                        あなたの写真を、可愛いアニメ風に変身させましょう！
                      </p>
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 sm:p-6 mb-6 border border-pink-100">
                        <p className="text-sm sm:text-base text-gray-700 mb-2">📌 コツ：</p>
                        <ul className="text-sm text-gray-600 space-y-1 text-left">
                          <li>• 明るくて顔がはっきりしている写真がおすすめ</li>
                          <li>• 背景がシンプルだと綺麗に変身できるよ</li>
                          <li>• 10MBまでのアップロードOK！</li>
                        </ul>
                      </div>
                      <div className="mt-6 flex justify-center space-x-4">
                        <span className="text-2xl sm:text-3xl">🌸</span>
                        <span className="text-2xl sm:text-3xl">✨</span>
                        <span className="text-2xl sm:text-3xl">🎀</span>
                      </div>
                      <div className="mt-4 text-lg text-pink-500 font-bold">タップして画像をアップロード</div>
                    </div>
                  </div>
                )}
              </div>
          ) : (
            <div className="space-y-4">
              {currentResult.generated_url ? (
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 p-3">
                        <p className="text-white font-bold text-center">🎉 変身完了！魔法が成功しました！</p>
                      </div>
                      
                      <div className="pt-16 p-4">
                        {mode === 'text-to-image' ? (
                          <div className="text-center">
                            <div className="relative inline-block">
                              <Image
                                src={currentResult.generated_url}
                                alt="生成された画像"
                                width={400}
                                height={400}
                                className="w-full h-auto rounded-2xl shadow-lg"
                              />
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                ✨ AI 生成
                              </div>
                            </div>
                            
                            <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                              <h4 className="text-sm font-bold text-gray-800 mb-2">💭 魔法の呪文：</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">{currentResult.prompt.substring(0, 100)}...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <BeforeAfterSlider
                              beforeImage={currentResult.original_url}
                              afterImage={currentResult.generated_url}
                              beforeAlt="変身前"
                              afterAlt="変身后"
                            />
                            
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100 text-center">
                              <div className="text-2xl mb-2">🔄 → ✨</div>
                              <p className="text-sm font-bold text-gray-800">ビフォーアフター完成！</p>
                              <p className="text-xs text-gray-600">あなたの写真が可愛いアニメキャラに大変身！</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200 text-center"
                    role="alert"
                  >
                    <div className="text-2xl mb-2">🎊</div>
                    <h4 className="font-bold text-green-800 mb-1">🎉 おめでとう！</h4>
                    <p className="text-sm text-green-700 mb-3">あなたの魔法の変身が完成しました！</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center"
                      role="group"
                      aria-label="画像操作"
                    >
                      <a
                        href={currentResult.generated_url}
                        download={`anime-magic-${Date.now()}.png`}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="ダウンロード"
                      >
                        <span className="text-lg">📥</span>
                        ダウンロード
                      </a>
                      
                      <ShareButton
                        generatedImageUrl={currentResult.generated_url}
                        originalImageUrl={currentResult.original_url}
                        prompt={currentResult.prompt}
                        style={selectedTemplate?.name || 'カスタム'}
                        existingShareUrl={autoShareUrl}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-200/50 p-8 text-center max-w-sm mx-auto">
                      <div className="relative mb-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200"></div>
                        <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">✨</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-amber-800 mb-2">🎨 魔法の変身中...</h3>
                      <p className="text-sm text-amber-600 mb-4">AIが一生懸命画像を作っています！</p>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                        <p className="text-sm text-amber-700">💡 ヒント: 1-3分程度で完成します</p>
                        <p className="text-xs text-amber-600 mt-2">🌸 少しお待ちくださいね...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 底部固定编辑区 */}
      <div className="fixed bottom-16 left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-200">
        <div className="flex items-center justify-between p-3">
          <div className="flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-3 rounded-full shadow-lg"
            >
              <PhotoIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 mx-3">
            {/* 始终渲染输入框，避免条件渲染导致的卸载重建 */}
            <input
              ref={promptMobileInputRef}
              type="text"
              value={prompt}
              onChange={handlePromptChange}
              className={`w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                mode === 'template-mode' ? 'hidden' : ''
              }`}
              placeholder="プロンプトを入力..."
            />
            {/* 模板模式的显示文本 */}
            <div className={`text-sm font-medium text-gray-700 truncate ${
              mode === 'template-mode' ? '' : 'hidden'
            }`}>
              {selectedTemplate ? selectedTemplate.name : 'テンプレートを選択'}
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={generateImage}
              disabled={isGenerating || 
                (mode === 'template-mode' && (!fileUrl || !selectedTemplate)) || 
                (mode === 'image-to-image' && (!fileUrl || !prompt.trim())) ||
                (mode === 'text-to-image' && !prompt.trim())
              }
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-3 rounded-full shadow-lg disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <PaperAirplaneIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mode === 'template-mode' && (
          <div className="px-3 pb-3">
            <div 
              ref={templateScrollRef}
              className="flex gap-3 overflow-x-auto pb-2 touch-pan-x"
            >
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleMobileTemplateSelect(template)}
                  className={`flex-none min-w-[5.5rem] max-w-[5.5rem] w-[5.5rem] h-36 p-1.5 rounded-[16px] border-2 transition-all transform hover:scale-105 flex flex-col items-center ${
                    selectedTemplate?.id === template.id
                      ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                      : 'border-amber-200 bg-white/80 hover:border-amber-400 hover:shadow-md backdrop-blur-sm'
                  }`}
                >
                  <div className="flex-1 flex items-center justify-center mb-1">
                    <Image
                      src={template.afterImage}
                      alt={template.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-[12px] shadow-sm"
                    />
                  </div>
                  <p className="text-xs font-bold text-amber-800 font-cute leading-snug px-0.5 text-center break-words">{template.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 border-t border-gray-100">
          <div className="flex gap-2">
            {(['1:1', '3:2', '2:3'] as ImageSize[]).map((size) => (
              <SizeButton
                key={size}
                size={size}
                isSelected={selectedSize === size}
                onClick={() => setSelectedSize(size)}
                isMobile={true}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('template-mode')
                if (!selectedTemplate) setPrompt('')
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                mode === 'template-mode' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              簡単
            </button>
            <button
              onClick={() => {
                setMode('image-to-image')
                setPrompt('')
                setSelectedTemplate(null)
                localStorage.removeItem('selectedTemplateId')
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                mode === 'image-to-image' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              図→図
            </button>
            <button
              onClick={() => {
                setMode('text-to-image')
                setPrompt('')
                setSelectedTemplate(null)
                setFileUrl(null)
                setImagePreview(null)
                localStorage.removeItem('selectedTemplateId')
                localStorage.removeItem('savedFileUrl')
                localStorage.removeItem('savedMode')
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                mode === 'text-to-image' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              文→図
            </button>
          </div>
        </div>
      </div>
    </div>
    )
  }

  // 桌面布局组件
  const DesktopLayout = () => {
    return (
      <div className={`max-w-7xl mx-auto bg-white rounded-[40px] shadow-2xl border border-white/50 p-6 lg:p-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* 背景装饰层 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-36 h-36 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-40 left-32 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-bounce delay-500"></div>
          
          {/* 浮动装饰图案 */}
          <div className="absolute top-1/4 left-1/4 text-3xl animate-float">🌸</div>
          <div className="absolute top-1/3 right-1/3 text-2xl animate-float-delayed">✨</div>
          <div className="absolute bottom-1/3 left-1/3 text-3xl animate-float">🎀</div>
          <div className="absolute bottom-1/4 right-1/4 text-2xl animate-float-delayed">💫</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          <div className={`lg:w-1/2 space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-5 card-kawaii border border-white/40 overflow-hidden">
              <div className={`mb-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex justify-center space-x-3 mb-3 relative">
                {/* 装饰性小图标 */}
                <div className="absolute -top-3 -left-3 text-2xl animate-bounce">🌟</div>
                <div className="absolute -top-2 -right-3 text-xl animate-pulse">💫</div>
                <button
                  onClick={() => {
                  setMode('template-mode')
                  if (!selectedTemplate) setPrompt('')
                }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    mode === 'template-mode'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-white border-2 border-amber-300 text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  ✨ 簡単
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
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-white border-2 border-amber-300 text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  🎨 図→図
                </button>
                <button
                  onClick={() => {
                    setMode('text-to-image')
                    setPrompt('')
                    setSelectedTemplate(null)
                    setFileUrl(null)
                    setImagePreview(null)
                    localStorage.removeItem('selectedTemplateId')
                    localStorage.removeItem('savedFileUrl')
                    localStorage.removeItem('savedMode')
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    mode === 'text-to-image'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-white border-2 border-amber-300 text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  ✍️ 文→図
                </button>
              </div>
            </div>

            {/* 滚动到guides的按钮 */}
            <div className="text-center mb-4">
              <button
                onClick={() => {
                  const guidesSection = document.getElementById('guides-section')
                  if (guidesSection) {
                    guidesSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm font-medium"
              >
                <span>📖</span>
                <span>使い方ガイドを見る</span>
                <span>↓</span>
              </button>
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
                    className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl transform hover:scale-110"
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
                          className={`p-1.5 h-36 rounded-[16px] border-2 transition-all transform hover:scale-105 flex flex-col ${
                            selectedTemplate?.id === template.id
                              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                              : 'border-amber-200 bg-white/80 hover:border-amber-400 hover:shadow-md backdrop-blur-sm'
                          }`}
                        >
                          <div className="flex-1 flex items-center justify-center mb-1">
                            <Image
                              src={template.afterImage}
                              alt={template.name}
                              width={128}
                              height={128}
                              className="w-full max-w-28 aspect-square object-cover rounded-[12px] shadow-sm"
                            />
                          </div>
                          <p className="text-xs font-bold text-amber-800 font-cute leading-tight px-0.5 text-center h-8 flex items-center justify-center">{template.name}</p>
                        </button>
                      ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(templates.length / templatesPerPage) - 1}
                    title="次のページ"
                    className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl transform hover:scale-110"
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
                className={`border-2 border-dashed border-pink-300/30 rounded-[28px] p-8 text-center hover:border-pink-400 cursor-pointer bg-white/50 backdrop-blur-lg hover:bg-white/70 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden transition-all duration-1000 delay-900 ${
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
                    <Image
                      src={imagePreview}
                      alt="アップロードされた画像のプレビュー"
                      width={400}
                      height={256}
                      className="max-w-full h-64 object-contain rounded-2xl mx-auto shadow-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setImagePreview(null)
                        setFileUrl(null)
                        localStorage.removeItem('savedFileUrl')
                        localStorage.removeItem('savedMode')
                      }}
                      className="text-pink-600 hover:text-pink-800 text-sm bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      🗑️ 別の写真にするね
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-bounce-slow">
                    <PhotoIcon className="w-16 h-16 mx-auto text-pink-400 animate-pulse" />
                    <p className="text-lg text-amber-700 font-cute">写真をドロップしてね！ 📸</p>
                    <p className="text-sm text-amber-600 font-cute">またはここをクリックして選んでね ✨</p>
                    <p className="text-xs text-amber-500">10MBまでの画像OK！</p>
                  </div>
                )}
              </div>
            )}

            {mode === 'text-to-image' && (
              <div className={`border-2 border-dashed border-blue-300/30 rounded-[28px] p-6 text-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-lg shadow-lg overflow-hidden transition-all duration-1000 delay-900 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="space-y-4">
                  <div className="text-6xl mb-4 animate-pulse">✍️✨</div>
                  <h3 className="text-xl font-bold text-blue-700 mb-2 font-cute">🎨 文生图モード開始！</h3>
                  <p className="text-blue-600 font-cute mb-3">テキストだけで、可愛い画像を作れるよ！</p>
                  <div className="bg-blue-50 rounded-2xl p-4 mx-2 border border-blue-100">
                    <p className="text-sm text-blue-700 mb-2">💡 おすすめの使い方：</p>
                    <ul className="text-xs text-blue-600 space-y-1 text-left">
                      <li>• 具体的なキャラクター特徴を書くと綺麗に生成されるよ</li>
                      <li>• 背景や服装の色も指定できる</li>
                      <li>• 日本語でも英語でもOK！</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-2 text-sm text-amber-600 font-cute">写真を準備中... 📤</p>
              </div>
            )}

            <div className={`mt-6 space-y-4 transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div>
                <label className="block text-lg font-bold text-amber-800 mb-3 font-cute">📐 画像サイズを選んでね ✨</label>
                <div className="grid grid-cols-3 gap-5">
                  {(['1:1', '3:2', '2:3'] as ImageSize[]).map((size) => (
                    <SizeButton
                      key={size}
                      size={size}
                      isSelected={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      isMobile={false}
                    />
                  ))}
                </div>
              </div>

              {/* 始终渲染输入区域，避免条件渲染导致的卸载重建 */}
              <div className={`${
                (mode === 'image-to-image' || mode === 'text-to-image') ? '' : 'hidden'
              }`}>
                <label className="block text-lg font-bold text-amber-800 mb-3 font-cute">魔法の呪文を書いてね ✨</label>
                <textarea
                  ref={promptDesktopTextareaRef}
                  value={prompt}
                  onChange={handlePromptChange}
                  className="w-full p-4 border-2 border-pink-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none font-cute text-amber-800"
                  placeholder="プロンプトを入力..."
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

              {mode === 'template-mode' && selectedTemplate && (
                <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-4 rounded-2xl shadow-lg">
                  <h4 className="font-bold text-amber-900 mb-2 font-cute text-base">🎀 選択中の魔法：{selectedTemplate.name}</h4>
                  <p className="text-xs text-amber-700 font-cute leading-relaxed">{selectedTemplate.prompt}</p>
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
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-[36px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-[36px] shadow-2xl border-2 border-dashed border-pink-300/30 hover:border-pink-400 transition-all cursor-pointer group-hover:shadow-xl overflow-hidden"
                  >
                    {mode === 'text-to-image' ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4 animate-pulse">✍️✨</div>
                        <h3 className="text-xl font-bold text-blue-700 mb-2 font-cute">🎨 文生图モード開始！</h3>
                        <p className="text-blue-600 font-cute mb-3">テキストだけで、可愛い画像を作れるよ！</p>
                        <div className="bg-blue-50 rounded-2xl p-4 mx-4 border border-blue-100">
                          <p className="text-sm text-blue-700 mb-2">💡 おすすめの使い方：</p>
                          <ul className="text-xs text-blue-600 space-y-1 text-left">
                            <li>• 具体的なキャラクター特徴を書くと綺麗に生成されるよ</li>
                            <li>• 背景や服装の色も指定できる</li>
                            <li>• 日本語でも英語でもOK！</li>
                          </ul>
                        </div>
                      </div>
                    ) : imagePreview ? (
                      <div className="text-center py-8"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="relative inline-block">
                          <Image
                            src={imagePreview}
                            alt="変身待ち画像のプレビュー"
                            width={400}
                            height={192}
                            className="max-w-full max-h-48 object-contain rounded-2xl mx-auto mb-4 shadow-lg"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg"
                            title="画像準備完了"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mx-4 border border-green-100"
                          role="alert"
                        >
                          <h4 className="text-sm font-bold text-green-800 mb-1">✅ 画像準備完了！</h4>
                          <p className="text-xs text-green-700">綺麗な写真がアップロードされました</p>
                          <p className="text-xs text-green-600 mt-1">魔法の変身を開始できます！</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="text-6xl mb-4 animate-bounce-slow">📸✨</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 font-cute">📱 可愛い写真をアップロードしよう！</h3>
                        <p className="text-gray-600 mb-4 font-cute">
                          あなたの写真を、可愛いアニメ風に変身させましょう！
                        </p>
                        
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mx-8 mb-4 border border-pink-100"
                          role="note"
                        >
                          <p className="text-sm text-gray-700 mb-2">📌 コツ：</p>
                          <ul className="text-xs text-gray-600 space-y-1 text-left"
                            role="list"
                          >
                            <li role="listitem">• 明るくて顔がはっきりしている写真がおすすめ</li>
                            <li role="listitem">• 背景がシンプルだと綺麗に変身できるよ</li>
                            <li role="listitem">• ドラッグ&ドロップでもアップロードOK！</li>
                            <li role="listitem">• 10MBまでの画像ファイル対応</li>
                          </ul>
                        </div>
                        
                        <button
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold"
                          aria-label="画像ファイルを選択"
                        >
                          📁 画像を選択する
                        </button>
                        
                        <div className="mt-4 flex justify-center space-x-2"
                          role="img"
                          aria-label="装飾絵文字"
                        >
                          <span className="text-2xl animate-pulse">🌸</span>
                          <span className="text-2xl animate-pulse delay-100">✨</span>
                          <span className="text-2xl animate-pulse delay-200">🎀</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentResult && (
              <div className="space-y-6">
                {(currentResult as GenerationResult).generated_url ? (
                  <div className="space-y-6">
                    {mode === 'text-to-image' ? (
                      <div className="text-center">
                        <a href={(currentResult as GenerationResult).generated_url} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={(currentResult as GenerationResult).generated_url}
                            alt="生成された画像"
                            width={400}
                            height={400}
                            className="max-w-full h-auto rounded-2xl mx-auto shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                            style={{ cursor: 'pointer' }}
                          />
                        </a>
                        <p className="text-sm text-blue-700 font-cute mt-3">✨ 生成された画像</p>
                      </div>
                    ) : (
                      <BeforeAfterSlider
                        beforeImage={(currentResult as GenerationResult).original_url}
                        afterImage={(currentResult as GenerationResult).generated_url}
                        beforeAlt="変身前"
                        afterAlt="変身后"
                      />
                    )}

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                      <div className="text-center mb-4">
                        <div className="text-2xl mb-2">🎊</div>
                        <h4 className="font-bold text-green-800 mb-1">🎉 おめでとう！</h4>
                        <p className="text-sm text-green-700">あなたの魔法の変身が完成しました！</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <a
                          href={(currentResult as GenerationResult).generated_url}
                          download={`anime-magic-${Date.now()}.png`}
                          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 sm:px-8 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 min-w-[140px]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>📥</span>
                          <span>ダウンロード</span>
                        </a>
                        
                        <ShareButton
                          generatedImageUrl={(currentResult as GenerationResult).generated_url}
                          originalImageUrl={(currentResult as GenerationResult).original_url}
                          prompt={(currentResult as GenerationResult).prompt}
                          style={selectedTemplate?.name || 'カスタム'}
                          existingShareUrl={autoShareUrl}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-amber-600 font-cute">
                      2kawaiiのGPT-4o Image で画像生成中... 1-3分で完成！✨
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fff7ea]">
      {isMobile ? MobileLayout() : DesktopLayout()}
      <MobileBottomNav />
      
      {/* 選べる変身スタイル セクション */}
      <div className="pt-6 pb-12 lg:pt-8 lg:pb-20">
        <TemplateGallery />
      </div>

      {/* AI画像変換の使い方 - 3ステップで簡単操作 セクション */}
      <section id="guides-section" className="py-12 lg:py-20 px-3 sm:px-4 lg:px-6 bg-[#fff7ea]">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-amber-800 font-cute mb-8 lg:mb-12 animate-fade-in-up">
            AI画像変換の使い方 - 3ステップで簡単操作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center card-kawaii p-4 sm:p-6 lg:p-8 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-32 sm:w-48 lg:w-56 h-32 sm:h-48 lg:h-56 mx-auto mb-4 lg:mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-choose_model_and_choose_template" 
                  alt="AI画像変換 モデル選択とテンプレート選択 - 無料ツール" 
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換 モデル選択とテンプレート選択ガイド"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">1. モデルとテンプレートを選択</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">お好みのAIモデルとアニメスタイルテンプレートを選択してください</p>
            </div>
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-upload_image_and_click_start" 
                  alt="AI画像変換 画像アップロードと開始 - 無料ツール" 
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換 画像アップロードと開始"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">2. 画像をアップロードして開始</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">写真をアップロードして「開始」ボタンをクリックするとAI変換が始まります</p>
            </div>
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-success_gain_final_image" 
                  alt="AI画像変換成功 - 最終画像取得 ダウンロード可能 商用利用" 
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換成功 - 最終画像取得"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">3. 成功！最終画像を取得</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">AI変換が完了！高品質なアニメ画像をダウンロードしてSNSにシェアできます</p>
            </div>
          </div>
        </div>
      </section>

      {/* 内部リンク戦略：長尾キーワードセクション - 优化移动端 */}
      <section className="py-12 lg:py-16 px-3 sm:px-4 lg:px-6 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-amber-800 font-cute mb-8">
            関連コンテンツ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <Link href="/ai-image-generation-guide" className="card-kawaii p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%90%89%E5%8D%9C%E5%8A%9B%E9%A3%8E-after" 
                    alt="AI画像生成 初心者ガイド" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-amber-800 mb-1">AI画像生成 初心者ガイド</h3>
                  <p className="text-amber-700 text-xs sm:text-sm">写真をアニメ風に変換する完全ガイド</p>
                </div>
              </div>
            </Link>
            
            <Link href="/line-sticker-creation" className="card-kawaii p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85%E5%8C%85-after" 
                    alt="LINEスタンプ作り方" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-amber-800 mb-1">LINEスタンプ作り方</h3>
                  <p className="text-amber-700 text-xs sm:text-sm">写真を可愛いLINEスタンプに無料変換</p>
                </div>
              </div>
            </Link>
            
            <Link href="/chibi-character-maker" className="card-kawaii p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-afterr" 
                    alt="Chibiキャラクター作成" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-amber-800 mb-1">Chibiキャラクター作成</h3>
                  <p className="text-amber-700 text-xs sm:text-sm">可愛いchibiキャラをAIで作る</p>
                </div>
              </div>
            </Link>
            
            <Link href="/ai-image-conversion-free" className="card-kawaii p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-after" 
                    alt="AI画像変換 無料比較" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-amber-800 mb-1">AI画像変換 無料比較</h3>
                  <p className="text-amber-700 text-xs sm:text-sm">無料AI画像変換ツールを徹底比較</p>
                </div>
              </div>
            </Link>
            
            <Link href="/personification-ai" className="card-kawaii p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA-after" 
                    alt="擬人化 AI 活用術" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-amber-800 mb-1">擬人化 AI 活用術</h3>
                  <p className="text-amber-700 text-xs sm:text-sm">ペットやオブジェクトを擬人化する方法</p>
                </div>
              </div>
            </Link>
            
            <Link href="/anime-icon-creation" className="card-kawaii p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-afterr" 
                    alt="アイコン作成 無料" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-amber-800 mb-1">アイコン作成 無料</h3>
                  <p className="text-amber-700 text-xs sm:text-sm">SNS用アニメアイコンを無料で作成</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}