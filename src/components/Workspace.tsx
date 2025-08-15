'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { PhotoIcon, PaperAirplaneIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import { useAppStore } from '@/store/useAppStore'
import { ImageSize, ModelType } from '@/store/useAppStore'
import ShareButton from './ShareButton'
import MobileBottomNav from './MobileBottomNav'
import Footer from './Footer'
import TemplateGallery from './TemplateGallery'
import Link from 'next/link'
import Image from 'next/image'
import OptimizedImage from './OptimizedImage'


// 比例小图标（用于尺寸按钮与折叠摘要）
const renderRatioIcon = (ratio: ImageSize, maxSide: number) => {
  const [wStr, hStr] = (ratio || '1:1').split(':')
  const w = Math.max(1, parseInt(wStr, 10) || 1)
  const h = Math.max(1, parseInt(hStr, 10) || 1)
  const scale = Math.min(maxSide / w, maxSide / h)
  const dw = Math.round(w * scale)
  const dh = Math.round(h * scale)
  const vw = dw + 4
  const vh = dh + 4
  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true">
      <rect x="2" y="2" width={dw} height={dh} rx="2" ry="2" fill="currentColor" opacity="0.2" />
      <rect x="2" y="2" width={dw} height={dh} rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

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
    id: '1',
    name: '擬人化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-after',
    prompt: '[対象物]を擬人化したキャラクター。特徴は[素材]、[形状]、[機能]、[色]に基づいてデザイン。髪型や服装に[対象物]の要素を取り入れた[少女／少年]の姿。アニメ風、中心構図、清潔な背景、細部まで丁寧に描写、ソフトな色調',
    category: '擬人化'
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
    id: '25',
    name: 'リアルなアニメ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/flux-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/flux-after',
    prompt: '超高精细なアニメーションイラスト、フラックス風の傑作。極限まで鮮明なフォーカス、刃物のようにクリーンな線画。太い輪郭線。劇的な陰影と強いハイライト（スタジオ照明の逆光）のコントラスト。滑らかなグラデーションのセル塗り。細部描写が異様に緻密で、8K解像度。クリーンでモダン、鋭い審美眼。明るい色彩、寒色トーン。「現代アニメキービジュアル」。--style raw--v 6.0',
    category: 'リアルなアニメ'
  },
  {
    id: '22',
    name: '証明写真加工',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E9%9F%A9%E5%BC%8F%E8%AF%81%E4%BB%B6%E7%85%A7-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E9%9F%A9%E5%BC%8F%E8%AF%81%E4%BB%B6%E7%85%A7-after',
    prompt: '画像生成AI 無料で韓国風証明写真を作成！自然な美肌補正、清潔な背景の可愛い証明写真をチャットGPT 画像生成で無料作成。登録不要で即座にダウンロード可能、SNSプロフィルや身分証明写真としても使える',
    category: '証明写真加工'
  },
  {
    id: '9',
    name: 'chibi',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after',
    prompt: 'ちびキャラクター、Q版デフォルメ、ベクターアイコン風、可愛らしい小さな体、大きな頭、ふわふわした雰囲気、癒し系。',
    category: 'chibi'
  },
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
    prompt: '超高精细なアニメーションイラスト、フラックス風の傑作。eva effect，明るい色調、デジタルアニメスタイルのイラスト，二次元アニメの超高精細イラストスタイル、細部描写が異様に緻密で、8K解像度。質の高いディテール。',
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
const SizeButton = ({ size, isSelected, onClick, isMobile = false, isEnglish = false }: {
  size: ImageSize
  isSelected: boolean
  onClick: () => void
  isMobile?: boolean
  isEnglish?: boolean
}) => {
  const getSizeIcon = (ratio: ImageSize, isMobileLocal: boolean = false) => {
    const [wStr, hStr] = (ratio || '1:1').split(':')
    const w = Math.max(1, parseInt(wStr, 10) || 1)
    const h = Math.max(1, parseInt(hStr, 10) || 1)
    const maxSide = isMobileLocal ? 18 : 24
    const scale = Math.min(maxSide / w, maxSide / h)
    const dw = Math.round(w * scale)
    const dh = Math.round(h * scale)
    const vw = dw + 4
    const vh = dh + 4
    return (
      <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true">
        <rect x="2" y="2" width={dw} height={dh} rx="2" ry="2" fill="currentColor" opacity="0.2" />
        <rect x="2" y="2" width={dw} height={dh} rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }

  const getSizeLabel = (size: ImageSize) => {
    switch (size) {
      case '1:1':
        return isEnglish ? 'Square' : '正方形'
      case '3:2':
        return isEnglish ? 'Landscape' : '横長'
      case '2:3':
        return isEnglish ? 'Portrait' : '縦長'
      default:
        return size
    }
  }

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={`min-w-0 px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
          isSelected
            ? 'btn-primary text-white'
            : 'bg-surface text-text-muted border border-border hover:bg-surface-hover'
        }`}
        aria-label={`${isEnglish ? 'Size' : 'サイズ'} ${size}`}
      >
        {getSizeIcon(size, true)}
        <span className="font-medium">{size}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-md border transition-colors flex flex-col items-center justify-center gap-2 ${
        isSelected
          ? 'btn-primary text-white'
          : 'border-border bg-surface text-text-muted hover:bg-surface'
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center">{getSizeIcon(size, false)}</div>
      <div className="text-xs font-medium">{size}</div>
      <div className="text-xs text-text-muted">{getSizeLabel(size)}</div>
    </button>
  )
}

export default function WorkspaceRefactored() {
  const isEnglish = typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null)
  const [isVisible] = useState(true)

  const [mode, setMode] = useState<'image-to-image' | 'template-mode' | 'text-to-image'>('template-mode')
  const [enhancePrompt, setEnhancePrompt] = useState(false)
  const [generationError, setGenerationError] = useState<string>('')
  const [stopReason, setStopReason] = useState<null | 'TIMEOUT' | 'MAX_FAILURES' | 'URL_TIMEOUT' | 'NETWORK'>(null)
  const [autoShareUrl, setAutoShareUrl] = useState<string>('')
  const publishInfoRef = useRef<{ id: string; token: string } | null>(null)
  const [publishState, setPublishState] = useState<'idle' | 'publishing' | 'published'>('idle')

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const templatesPerPage = isMobile ? 3 : 5
  // const [selectedCategory, setSelectedCategory] = useState<string>('擬人化')


  const { selectedSize, setSelectedSize, selectedModel, setSelectedModel } = useAppStore()

  // 英文名称映射（与 TemplateGallery 保持一致）
  const nameMap: Record<string, string> = {
    'emoji 絵文字風': 'emoji sticker style',
    'lineスタンプ': 'LINE stickers',
    chibi: 'chibi',
    '可愛い壁紙': 'Cute wallpaper',
    'リアルなアニメ': 'Realistic anime',
    '証明写真加工': 'ID photo retouch',
    irasutoya: 'irasutoya',
    '萌え化': 'Moe style',
    'ブルーアーカイブ': 'Blue Archive',
    vtuber: 'VTuber',
    'ウマ娘': 'Uma Musume',
    '少女': 'Girl',
    '可愛line アイコン': 'Cute LINE icon',
    'ジブリ風': 'Ghibli style',
    'SDキャラ': 'SD chibi',
    '原神異世界': 'Genshin Isekai',
    'ゴシック地雷女': 'Gothic Y2K Girl',
    '乙女ゲーム': 'Otome game',
    '厚塗': 'Thick paint',
    '3D CG': '3D CG',
    '擬人化': 'Anthropo morphism',
    'クレヨンしんちゃん': 'Crayon Shin-chan',
    '写真 アニメ風': 'Photo to anime',
    '獣耳': 'Animal ears',
  }

  // 模型尺寸集合
  const availableSizesByModel: Record<ModelType, ImageSize[]> = useMemo(() => ({
    'gpt4o-image': ['1:1','3:2','2:3'],
    'flux-kontext-pro': ['1:1','4:3','3:4','16:9','9:16'],
    'flux-kontext-max': ['1:1','4:3','3:4','16:9','9:16']
  }), [])
  const derivedSizes = availableSizesByModel[selectedModel]

  // 模型切换时校正尺寸默认值
  useEffect(() => {
    if (!derivedSizes.includes(selectedSize)) {
      const fallback = selectedModel === 'gpt4o-image' ? '1:1' : '16:9'
      setSelectedSize(fallback as ImageSize)
    }
  }, [selectedModel])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearPollTimer = () => {
    if (pollIntervalRef.current) {
      clearTimeout(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }

  const stopWithReason = (reason: 'TIMEOUT' | 'MAX_FAILURES' | 'URL_TIMEOUT' | 'NETWORK', message: string) => {
    clearPollTimer()
    setStopReason(reason)
    setGenerationError(message)
    setIsGenerating(false)
  }

  const handleRetry = () => {
    clearPollTimer()
    setStopReason(null)
    setGenerationError('')
    setCurrentResult(null)
    // 保持现有的 fileUrl/prompt/mode，直接重新生成
    generateImage()
  }
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

  // 取消移动端进入自动滚动

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
 // 初始化状态恢复
useEffect(() => {
  if (hasInitializedRef.current) return;

  const savedTemplateId =
    typeof window !== 'undefined' ? localStorage.getItem('selectedTemplateId') : null;

  if (savedTemplateId) {
    const foundTemplate = templates.find(t => t.id === savedTemplateId);
    if (foundTemplate) {
      setSelectedTemplate(foundTemplate);
      setPrompt(foundTemplate.prompt);
      setMode('template-mode');
      hasInitializedRef.current = true;
      return;
    }
  }

  // 默认选择第一行模板
  const first = templates[0];
  if (first) {
    setSelectedTemplate(first);
    setPrompt(first.prompt);
    setMode('template-mode');
    try {
      localStorage.setItem('selectedTemplateId', first.id);
    } catch {}
  }

  hasInitializedRef.current = true;
}, []);

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

    throw new Error(isEnglish ? 'All upload methods failed' : 'すべてのアップロード方法が失敗しました')
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
      setUploadProgress(0)
      
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
      
      const xhr = new XMLHttpRequest()
      const promise = new Promise<string>((resolve, reject) => {
        xhr.open('POST', '/api/upload-image', true)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(percent)
          }
        }
        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText)
              if (data.success && data.fileUrl) {
                resolve(data.fileUrl)
              } else {
                reject(new Error(data.error || '上传响应格式错误'))
              }
            } else {
              reject(new Error(`上传失败: ${xhr.status}`))
            }
          } catch (err) {
            reject(err)
          }
        }
        xhr.onerror = () => reject(new Error('网络错误'))
        xhr.send(formData)
      })

      const fileUrl = await promise
      return fileUrl
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
      alert(isEnglish ? 'Please select a template' : 'テンプレートを選択してください')
      return
    }
    if (mode !== 'text-to-image' && !fileUrl) {
      alert(isEnglish ? 'Please upload an image' : '画像をアップロードしてください')
      return
    }
    if ((mode === 'image-to-image' || mode === 'text-to-image') && !prompt.trim()) {
      alert(isEnglish ? 'Please enter a prompt' : 'プロンプトを入力してください')
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
      original_url: mode === 'text-to-image' ? '' : imagePreview!, // 文生图不需要原图
      generated_url: '',
      prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
      timestamp: Date.now()
    }

    setCurrentResult(newResult)
    console.log('[generateImage] 设置currentResult:', newResult.id)

    // 模型分流：GPT‑4o Image vs Flux Kontext
    const isFlux = selectedModel === 'flux-kontext-pro' || selectedModel === 'flux-kontext-max'
    const requestBody = isFlux ? {
      prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
      aspectRatio: selectedSize,
      inputImage: mode === 'text-to-image' ? undefined : fileUrl,
      model: selectedModel,
      enableTranslation: true,
      outputFormat: 'jpeg',
      promptUpsampling: enhancePrompt
    } : {
      fileUrl: mode === 'text-to-image' ? undefined : fileUrl,
      prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
      enhancePrompt,
      size: selectedSize,
      mode: mode,
      style: selectedTemplate?.name || 'default'
    }
    
    console.log('[generateImage] 请求体:', JSON.stringify(requestBody, null, 2))

    try {
      const response = await fetch(isFlux ? '/api/flux-kontext/generate' : '/api/generate-image', {
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
        if (isFlux) {
          await pollFluxProgress(taskId, newResult.id)
        } else {
          await pollProgress(taskId, newResult.id)
        }
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
    console.log('[handleShare] 分享数据:', {
      generatedUrl: result.generated_url,
      originalUrl: result.original_url,
      prompt: result.prompt,
      mode: mode
    })
    // 重置分享状态，确保每次都能创建新分享
    shareCreatedRef.current = false
    setAutoShareUrl('')
    try {
      // 直接使用result中的数据，不再重新判断
      const originalUrl = result.original_url && result.original_url.trim() !== '' ? result.original_url : null
      
      // 检查生成图URL类型
      const isR2Url = result.generated_url.startsWith('https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/')
      
      console.log('[handleShare] URL类型检查:', {
        generatedUrl: result.generated_url,
        isR2Url: isR2Url,
        originalUrl: originalUrl
      })

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generatedUrl: result.generated_url,
          originalUrl: originalUrl,
          prompt: result.prompt,
          style: selectedTemplate?.name || 'カスタム',
          model: selectedModel,
          timestamp: Date.now(),
          isR2Stored: isR2Url // 标记是否使用R2永久URL
        })
      })

      if (response.ok) {
        const shareData = await response.json()
        if (shareData.success && shareData.shareUrl) {
          shareCreatedRef.current = true
          console.log('✅ 自动分享创建成功:', shareData.shareUrl)
          if (shareData.shareId && shareData.publishToken) {
            publishInfoRef.current = { id: shareData.shareId, token: shareData.publishToken }
            setPublishState('idle')
          }
          return shareData.shareUrl
        } else {
          console.error('❌ 自动分享创建失败:', shareData.error || '未知错误')
          return null
        }
      } else {
        const errorText = await response.text()
        console.error('❌ 自动分享创建失败:', response.status, response.statusText, errorText)
        return null
      }
    } catch (error) {
      console.warn('❌ 自动分享处理失败:', error)
      return null
    }
  }

  const handleContribute = async () => {
    try {
      if (!publishInfoRef.current) return
      if (publishState === 'published' || publishState === 'publishing') return
      setPublishState('publishing')
      const { id, token } = publishInfoRef.current
      const res = await fetch(`/api/share/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', token })
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `HTTP ${res.status}`)
      }
      setPublishState('published')
    } catch (e) {
      console.error('贡献失败:', e)
      setPublishState('idle')
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
        const progressRaw = responseData.progress || responseData.progressPercent || responseData.percentage || 0
        const progress = Math.max(0, Math.min(100, Math.floor(progressRaw)))
        const generatedUrl = responseData.response?.result_urls?.[0] || responseData.response?.resultUrls?.[0] || null
        const successFlag = responseData.successFlag
        const errorMessage = responseData.errorMessage || responseData.error || null
        
        console.log('[pollProgress] === 调试数据解析 ===')
        console.log('[pollProgress] 原始响应:', data)
        console.log('[pollProgress] data.data:', data.data)
        console.log('[pollProgress] data.data.data:', data.data?.data)
        console.log('[pollProgress] 解析后的 kieApiData:', kieApiData)
        console.log('[pollProgress] === 状态信息 ===')
        console.log('[pollProgress] 状态检查:', { status, successFlag, generatedUrl, errorMessage, progress })
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
            
            // 检查是否已经是R2的永久URL
            const isR2Url = generatedUrl.startsWith('https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/')
            
            if (isR2Url) {
              console.log('[pollProgress] 已经是R2永久URL，直接使用:', generatedUrl)
              finalImageUrl = generatedUrl
            } else if (generatedUrl.includes('tempfile.aiquickdraw.com')) {
              // 如果是KIE AI的临时URL，必须转换为R2永久URL
              console.log('[pollProgress] 检测到KIE临时URL，转换为R2永久URL...')
              try {
                // 1. 获取下载URL
                const downloadResponse = await fetch('/api/download-url', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: generatedUrl, taskId })
                })

                if (downloadResponse.ok) {
                  const downloadData = await downloadResponse.json()
                  const directUrl = downloadData.downloadUrl
                  console.log('[pollProgress] 获取到直接下载URL:', directUrl)
                  
                  // 2. 下载并上传到R2，等待完成
                  console.log('[pollProgress] 开始上传到R2获取永久URL...')
                  const uploadResponse = await fetch('/api/download-and-upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      url: directUrl,  // 使用正确的参数名
                      taskId,
                      fileName: `generated_${taskId}.png`
                    })
                  })
                  
                  if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json()
                    if (uploadData.success && uploadData.publicUrl) {
                      finalImageUrl = uploadData.publicUrl
                      console.log('[pollProgress] ✅ 成功获取R2永久URL:', finalImageUrl)
                    } else {
                      console.warn('[pollProgress] ❌ R2上传失败，回退到临时URL')
                      finalImageUrl = directUrl
                    }
                  } else {
                    console.warn('[pollProgress] ❌ R2上传请求失败，回退到临时URL')
                    finalImageUrl = directUrl
                  }
                } else {
                  console.warn('[pollProgress] ❌ 下载URL获取失败，使用原始URL')
                  finalImageUrl = generatedUrl
                }
              } catch (error) {
                console.error('[pollProgress] ❌ URL转换过程失败:', error)
                finalImageUrl = generatedUrl
              }
            } else {
              console.log('[pollProgress] 未知URL格式，直接使用:', generatedUrl)
              finalImageUrl = generatedUrl
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
                      stopWithReason('URL_TIMEOUT', '画像は生成されましたがURLの反映に時間がかかっています。少し待ってから「再試行」してください。')
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
                  stopWithReason('URL_TIMEOUT', '生成結果の取得に時間がかかっています。少し待ってから「再試行」してください。')
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
                stopWithReason('URL_TIMEOUT', '生成結果の確認中にエラーが発生しました。少し待ってから「再試行」してください。')
                return
              }
              pollIntervalRef.current = setTimeout(loop, 2000)
              return
            }
          }

          const completedResult = {
            id: resultId,
            original_url: mode === 'text-to-image' ? '' : (fileUrl || ''), // 使用原始fileUrl而不是base64
            generated_url: finalImageUrl,
            prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
            timestamp: Date.now()
          }

          console.log('[pollProgress] 设置完成结果:', completedResult)
          setCurrentResult(completedResult)
          
          // 自动分享处理 - 只有当获取到有效URL时才创建分享
          if (finalImageUrl && finalImageUrl.trim() !== '') {
            try {
              // 检查是否是R2永久URL
              const isR2Url = finalImageUrl.startsWith('https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/')
              
              if (isR2Url) {
                console.log('[pollProgress] 使用R2永久URL创建分享:', finalImageUrl)
                const shareResponse = await handleShare(completedResult)
                if (shareResponse) {
                  setAutoShareUrl(shareResponse)
                  console.log('[pollProgress] ✅ 自动分享成功（R2永久URL）:', shareResponse)
                } else {
                  console.log('[pollProgress] ⚠️ 自动分享创建失败')
                }
              } else {
                console.log('[pollProgress] ⚠️ 非R2永久URL，暂不创建分享，等待URL转换完成')
                console.log('[pollProgress] 当前URL:', finalImageUrl)
                // 可以选择延迟分享，或者不自动分享
                // setAutoShareUrl('') // 清空自动分享URL
              }
            } catch (shareError) {
              console.error('[pollProgress] ❌ 自动分享处理失败:', shareError)
            }
          } else {
            console.warn('[pollProgress] ⚠️ 没有有效的图片URL，跳过自动分享')
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
          // 更新UI中的进度（仅在生成中）
          if (typeof progress === 'number' && !Number.isNaN(progress)) {
            setCurrentResult(prev => {
              if (!prev) return prev
              return { ...prev, progress }
            })
          }
          
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
            setCurrentResult(null)
            stopWithReason('TIMEOUT', 'お待たせしています。処理が5分を超えたため中断しました。時間をおいて「再試行」してください。')
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
          setCurrentResult(null)
          stopWithReason('MAX_FAILURES', 'ネットワーク状態が不安定です。少し待ってから「再試行」してください。')
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

  // Flux Kontext 轮询（使用统一后的服务端结构）
  const pollFluxProgress = async (taskId: string, resultId: string) => {
    console.log('[pollFluxProgress] 启动, taskId:', taskId, 'resultId:', resultId)
    const startTime = Date.now()
    const timeout = 5 * 60 * 1000
    let errorCount = 0
    let consecutiveFailures = 0
    if (!isGenerating) {
      setIsGenerating(true)
    }
    const loop = async () => {
      if (!isMountedRef.current) return
      if (Date.now() - startTime >= timeout) {
        setGenerationError('タイムアウトしました')
        setCurrentResult(null)
        setIsGenerating(false)
        return
      }
      try {
        const response = await fetch(`/api/flux-kontext/image-details?taskId=${taskId}`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const payload = await response.json()
        const info = payload?.data || {}
        const status: 'GENERATING'|'SUCCESS'|'FAILED' = info.status || 'GENERATING'
        const urls: string[] = Array.isArray(info.resultUrls) ? info.resultUrls : []
        const errorMessage: string = info.errorMessage || ''
        const hasUrl = urls.length > 0

        if (status === 'SUCCESS') {
          consecutiveFailures = 0
          let finalImageUrl = ''
          const generatedUrl = hasUrl ? urls[0] : ''
          if (generatedUrl) {
            const isR2Url = generatedUrl.startsWith('https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/')
            if (isR2Url) {
              finalImageUrl = generatedUrl
            } else {
              try {
                const uploadResponse = await fetch('/api/download-and-upload', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: generatedUrl, taskId, fileName: `generated_${taskId}.png` })
                })
                if (uploadResponse.ok) {
                  const uploadData = await uploadResponse.json()
                  if (uploadData.success && uploadData.publicUrl) {
                    finalImageUrl = uploadData.publicUrl
                  } else {
                    finalImageUrl = generatedUrl
                  }
                } else {
                  finalImageUrl = generatedUrl
                }
              } catch {
                finalImageUrl = generatedUrl
              }
            }
          } else {
            // 无 URL，尝试 R2 反查
            try {
              const r2UrlResponse = await fetch(`/api/get-generated-url?taskId=${taskId}`)
              if (r2UrlResponse.ok) {
                const r2 = await r2UrlResponse.json()
                if (r2.found && r2.url) finalImageUrl = r2.url
              }
            } catch {}
          }
          const completedResult = {
            id: resultId,
            original_url: mode === 'text-to-image' ? '' : (fileUrl || ''),
            generated_url: finalImageUrl,
            prompt: mode === 'template-mode' && selectedTemplate ? selectedTemplate.prompt : prompt,
            timestamp: Date.now()
          }
          setCurrentResult(completedResult)
          if (finalImageUrl && finalImageUrl.trim() !== '') {
            try {
              const isR2Url = finalImageUrl.startsWith('https://pub-d00e7b41917848d1a8403c984cb62880.r2.dev/')
              if (isR2Url) {
                const shareResponse = await handleShare(completedResult)
                if (shareResponse) setAutoShareUrl(shareResponse)
              }
            } catch {}
          }
          setTimeout(() => setIsGenerating(false), 2000)
          return
        }

        if (status === 'FAILED') {
          consecutiveFailures++
          setGenerationError(errorMessage || '生成に失敗しました')
          setCurrentResult(null)
          setIsGenerating(false)
          return
        }

        // 继续轮询（生成中）
        pollIntervalRef.current = setTimeout(loop, 2000)
      } catch (e) {
        errorCount++
        consecutiveFailures++
        if (errorCount >= 3 || consecutiveFailures >= 5) {
          setCurrentResult(null)
          stopWithReason('MAX_FAILURES', 'ネットワーク状態が不安定です。少し待ってから「再試行」してください。')
          return
        }
        pollIntervalRef.current = setTimeout(loop, 3000)
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
      alert(isEnglish ? 'Please select an image file' : '画像ファイルを選択してください')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
      alert(isEnglish ? 'Image size cannot exceed 10MB' : '画像サイズは10MBを超えることはできません')
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
    const [isSizePickerOpen, setIsSizePickerOpen] = useState(false)
    const isUploadDisabled = mode === 'text-to-image'
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col">
        {/* 中间结果展示区 - 限高自适应，避免小屏溢出 */}
        <div className="flex-1 mb-16 overflow-visible relative z-10">
          <div id="workspace-mobile-core" className="p-3 space-y-3">
            
            {/* 顶部标题 */}
              <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2">
                <span className="text-sm font-bold text-text">{isEnglish ? 'AI Image Conversion' : 'AI画像変換'}</span>
                {/* 模型选择（移动端 顶部补充一处快捷入口） */}
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                  className="px-2 py-1 rounded-md text-xs bg-white border border-border"
                  aria-label={isEnglish ? 'Model' : 'モデル'}
                >
                  <option value="gpt4o-image">{isEnglish ? 'GPT-4o Image' : 'GPT-4o Image'}</option>
                  <option value="flux-kontext-pro">{isEnglish ? 'Flux Kontext Pro' : 'Flux Kontext Pro'}</option>
                  <option value="flux-kontext-max">{isEnglish ? 'Flux Kontext Max' : 'Flux Kontext Max'}</option>
                </select>
              </div>
            </div>

            {/* 移动端“使い方ガイドを見る”按钮，滚动到 guides-section */}
            <div className="text-center mb-3">
              <button
                onClick={() => {
                  const guidesSection = document.getElementById('guides-section')
                  if (guidesSection) {
                    guidesSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="inline-flex items-center gap-2 btn-primary text-sm"
              >
                <span>{isEnglish ? 'View how-to guide' : '使い方ガイドを見る'}</span>
                <span>↓</span>
              </button>
            </div>

            {/* モバイル用エラーパネル */}
            {generationError && (
              <div className="mx-auto max-w-md bg-surface border border-border rounded-lg p-3 mb-3 text-center">
                <p className="text-red-600 text-sm mb-3">{generationError}</p>
                <div className="flex justify-center gap-2">
                  <button onClick={handleRetry} className="btn-primary px-4 py-2 rounded-full text-white text-sm">{isEnglish ? 'Retry' : '再試行'}</button>
                  <button onClick={() => setGenerationError('')} className="bg-white border border-border text-text px-4 py-2 rounded-full text-sm">{isEnglish ? 'Close' : '閉じる'}</button>
                </div>
              </div>
            )}

            {!currentResult ? (
              <div className="flex flex-col items-center justify-center">
                {mode === 'text-to-image' ? (
                  <div className="w-full max-w-full px-0 sm:px-2 md:max-w-md mx-auto">
                    <div className="relative card w-full max-w-full mx-auto max-h-[65vh] sm:max-h-[70vh] overflow-auto">
                      <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-[var(--text)] mb-3">
                          {isEnglish ? 'Text-to-Image mode is ready!' : 'テキストからイラストモード、始まるよ！'}
                        </h3>
                        <p className="text-[var(--text-muted)] mb-6">
                          {isEnglish ? 'Create images with text only!' : 'テキストだけで、画像を作れるよ！'}
                        </p>
                        <div className="bg-[var(--surface)] rounded-lg p-4 mb-6">
                          <p className="text-sm text-[var(--text)] mb-2">{isEnglish ? 'Tips:' : 'コツ：'}</p>
                          <ul className="text-sm text-[var(--text-muted)] space-y-1 text-left">
                            <li>{isEnglish ? '• Describe character features for better results' : '• 具体的なキャラクター特徴を書くと綺麗に生成されるよ'}</li>
                            <li>{isEnglish ? '• You can specify background and outfit colors' : '• 背景や服装の色も指定できる'}</li>
                            <li>{isEnglish ? '• Both Japanese and English prompts are OK' : '• 日本語でも英語でもOK！'}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : imagePreview ? (
                  <div className="relative">
                    <div className="relative card max-h-[65vh] sm:max-h-[70vh] overflow-auto">
                      <div className="p-3">
                        <Image
                          src={imagePreview}
                          alt="アップロード画像"
                          width={300}
                          height={300}
                          className="max-w-full h-auto rounded-lg"
                        />
                        <div className="mt-4 text-center">
                          <h3 className="text-lg font-bold text-text mb-1">{isEnglish ? 'Image ready!' : '画像準備完了！'}</h3>
                    <p className="text-sm text-text-muted">{isEnglish ? 'Your photo has been uploaded' : '写真がアップロードされました'}</p>
                    <p className="text-[11px] text-text-muted mt-1">{isEnglish ? 'Up to 10MB supported' : '10MBまでの画像OK！'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-full px-0 sm:px-2 md:max-w-md mx-auto cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="relative card w-full max-w-full mx-auto max-h-[65vh] sm:max-h-[70vh] overflow-auto">
                      <div className="text-center p-4">
                          <h3 className="text-xl font-bold text-text mb-3">
                            {isEnglish ? 'Upload your photo' : '写真をアップロード'}
                          </h3>
                          <p className="text-text-muted mb-6">
                            {isEnglish ? 'Let’s transform your photo into anime style!' : '写真をアニメ風に変身させましょう！'}
                          </p>
                        <div className="bg-surface rounded-lg p-4 mb-6">
                          <p className="text-sm text-text mb-2">{isEnglish ? 'Tips:' : 'コツ：'}</p>
                            <ul className="text-sm text-text-muted space-y-1 text-left">
                              <li>{isEnglish ? '• Bright, clear face photos work best' : '• 明るくて顔がはっきりしている写真がおすすめ'}</li>
                              <li>{isEnglish ? '• Simple backgrounds produce better results' : '• 背景がシンプルだと綺麗に変身できるよ'}</li>
                            <li>{isEnglish ? '• Up to 10MB' : '• 10MBまでの画像OK！'}</li>
                            </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          ) : (
            <div className="space-y-4">
              {currentResult.generated_url ? (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="relative card overflow-hidden max-h-[58vh] sm:max-h-[62vh] overflow-y-auto">
                      <div className="pt-4 p-4">
                        {(!currentResult.original_url || currentResult.original_url.trim() === '') ? (
                          <div className="text-center">
                            <div className="relative inline-block">
                              <OptimizedImage
                                src={currentResult.generated_url}
                                alt="生成された画像"
                                width={400}
                                height={400}
                                className="w-full h-auto rounded-lg"
                              />
                            </div>
                            
                            <div className="mt-4 bg-surface rounded-lg p-4">
                              <h4 className="text-sm font-bold text-text mb-2">{isEnglish ? 'Prompt:' : 'プロンプト：'}</h4>
                              <p className="text-xs text-text-muted leading-relaxed">{currentResult.prompt.substring(0, 100)}...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="relative inline-block">
                              <OptimizedImage
                                src={currentResult.generated_url}
                                alt="生成された画像"
                                width={400}
                                height={400}
                                className="w-full h-auto rounded-lg"
                              />
                            </div>
                            <div className="mt-4 bg-surface rounded-lg p-4">
                              <h4 className="text-sm font-bold text-text mb-2">{isEnglish ? 'Prompt:' : 'プロンプト：'}</h4>
                              <p className="text-xs text-text-muted leading-relaxed">{currentResult.prompt.substring(0, 100)}...</p>
                            </div>
                          </div>
                        )}

                        {/* Sticky actions inside the result panel for mobile users */}
                        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-border -mx-4 px-4 py-3">
                          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
                            <a
                              href={currentResult.generated_url}
                              download={`anime-magic-${Date.now()}.png`}
                              className="w-full sm:w-auto btn-primary py-3 px-6 flex items-center justify-center gap-2"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={isEnglish ? 'Download' : 'ダウンロード'}
                            >
                              {isEnglish ? 'Download' : 'ダウンロード'}
                            </a>
                            <button
                              onClick={handleContribute}
                              disabled={!publishInfoRef.current || publishState !== 'idle'}
                              className="w-full sm:w-auto btn-primary py-3 px-6 flex items-center justify-center gap-2 disabled:opacity-60"
                              aria-label={isEnglish ? 'Contribute' : '公開する'}
                            >
                              {publishState === 'publishing' ? (isEnglish ? 'Publishing…' : '公開中…') : publishState === 'published' ? (isEnglish ? 'Contributed' : '公開済み') : (isEnglish ? 'Contribute' : '公開する')}
                            </button>
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
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative">
                    <div className="relative card max-w-sm mx-auto text-center">
                      <span className="relative inline-flex items-center justify-center mb-3">
                        <svg
                          className="cat-bounce h-10 w-10"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                          shapeRendering="crispEdges"
                        >
                          <rect x="3" y="3" width="2" height="2" fill="#F6BBD0" />
                          <rect x="11" y="3" width="2" height="2" fill="#F6BBD0" />
                          <rect x="4" y="4" width="8" height="8" rx="1" ry="1" fill="#F6BBD0" />
                          <rect x="6" y="7" width="1" height="1" fill="#2B2B2B" />
                          <rect x="9" y="7" width="1" height="1" fill="#2B2B2B" />
                          <rect x="7" y="9" width="2" height="1" fill="#2B2B2B" />
                        </svg>
                        <style jsx>{`
                          .cat-bounce { animation: squishy-bounce 1.2s ease-in-out infinite; transform-origin: center bottom; }
                          @keyframes squishy-bounce {
                            0%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
                            20% { transform: translateY(0) scaleX(1.12) scaleY(0.88); }
                            40% { transform: translateY(-8px) scaleX(0.94) scaleY(1.06); }
                            60% { transform: translateY(0) scaleX(1.06) scaleY(0.94); }
                            80% { transform: translateY(-3px) scaleX(0.98) scaleY(1.02); }
                          }
                        `}</style>
                      </span>
                       <h3 className="text-lg font-bold text-text mb-2">{isEnglish ? 'Generating image...' : '画像生成中...'}</h3>
                       <p className="text-sm text-text-muted mb-4">{isEnglish ? 'AI is generating your image' : 'AIが画像を生成しています'}</p>
                      <div className="bg-surface rounded-lg p-4">
                          <p className="text-sm text-text-muted">{isEnglish ? 'Completed in seconds' : '数秒で完了します'}</p>
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
      <div className="fixed bottom-16 left-0 right-0 bg-white shadow-lg z-40 border-t border-border">
        <div className="flex items-center justify-between p-2 sm:p-3">
          <div className="flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              onClick={() => { if (!isUploadDisabled) fileInputRef.current?.click() }}
              disabled={isUploadDisabled}
              aria-disabled={isUploadDisabled}
              title={isUploadDisabled ? (isEnglish ? 'Text-to-Image mode: upload disabled' : '文→図モードではアップロード不可') : undefined}
              className={`btn-primary p-3 rounded-full ${isUploadDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              <PhotoIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 mx-2 sm:mx-3">
            {/* 始终渲染输入框，避免条件渲染导致的卸载重建 */}
            <input
              ref={promptMobileInputRef}
              type="text"
              value={prompt}
              onChange={handlePromptChange}
              className={`w-full p-2 bg-white border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand focus:outline-none ${
                mode === 'template-mode' ? 'hidden' : ''
              }`}
              placeholder={isEnglish ? 'Enter prompt...' : 'プロンプトを入力...'}
            />
            {/* 模板模式的显示文本 */}
            <div className={`text-sm font-medium text-text truncate ${
              mode === 'template-mode' ? '' : 'hidden'
            }`}>
              {selectedTemplate ? selectedTemplate.name : (isEnglish ? 'Select a template' : 'テンプレートを選択')}
            </div>
            {mode === 'template-mode' && (
              <div className="mt-1 text-[11px] leading-snug text-text-muted">
                 <p>
                  {isEnglish
                    ? 'Tip: We recommend GPT‑4o Image for better quality, but it may take a bit longer.'
                    : 'ヒント：より良い品質のためにGPT-4o画像を推奨しますが、少し時間がかかる場合があります。'}
                </p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={generateImage}
              disabled={isGenerating || 
                (mode === 'template-mode' && (!fileUrl || !selectedTemplate)) || 
                (mode === 'image-to-image' && (!fileUrl || !prompt.trim())) ||
                (mode === 'text-to-image' && !prompt.trim())
              }
              className="btn-primary p-3 rounded-full disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </span>
              ) : (
                <PaperAirplaneIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mode === 'template-mode' && (
          <div className="px-2 sm:px-3 pb-2 sm:pb-3">
            <div 
              ref={templateScrollRef}
              className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 touch-pan-x"
            >
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleMobileTemplateSelect(template)}
                  className={`flex-none min-w-[4.75rem] max-w-[4.75rem] w-[4.75rem] h-28 p-1.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-brand active:border-brand active:shadow-sm ${
                    selectedTemplate?.id === template.id
                      ? 'border-brand bg-surface shadow-sm'
                      : 'border-border bg-white hover:border-brand'
                  }`}
                >
                  <div className="h-16 flex items-center justify-center mb-1">
                    <Image
                      src={template.afterImage}
                      alt={isEnglish ? (nameMap[template.name] || template.name) : template.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-text leading-snug px-0.5 text-center break-words min-h-[28px]">{isEnglish ? (nameMap[template.name] || template.name) : template.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 简洁三列：模型 / 模式 / 尺寸（无折叠） */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 border-t border-border">
          <div className="p-2 border border-border rounded-lg">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelType)}
              className="w-full px-2.5 py-1.5 rounded-lg text-sm bg-white border border-border"
            >
              <option value="gpt4o-image">{isEnglish ? 'GPT-4o Image' : 'GPT-4o Image'}</option>
              <option value="flux-kontext-pro">{isEnglish ? 'Flux Kontext Pro' : 'Flux Kontext Pro'}</option>
              <option value="flux-kontext-max">{isEnglish ? 'Flux Kontext Max' : 'Flux Kontext Max'}</option>
            </select>
          </div>
          <div className="p-2 border border-border rounded-lg">
            <select
              value={mode}
              onChange={(e) => {
                const v = e.target.value as 'template-mode'|'image-to-image'|'text-to-image'
                setMode(v)
                if (v === 'image-to-image' || v === 'text-to-image') {
                  setPrompt('')
                  if (v === 'text-to-image') {
                    setFileUrl(null)
                    setImagePreview(null)
                  }
                  setSelectedTemplate(null)
                  localStorage.removeItem('selectedTemplateId')
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg text-sm bg-white border border-border"
            >
              <option value="template-mode">{isEnglish ? 'Easy' : '簡単'}</option>
              <option value="image-to-image">{isEnglish ? 'Image→Image' : '図→図'}</option>
              <option value="text-to-image">{isEnglish ? 'Text→Image' : '文→図'}</option>
            </select>
          </div>
          <div className="p-2 border border-border rounded-lg">
            <button
              onClick={() => setIsSizePickerOpen(true)}
              className="w-full px-2.5 py-1.5 rounded-lg text-sm bg-white border border-border flex items-center justify-between"
              aria-haspopup="dialog"
              aria-expanded={isSizePickerOpen}
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex items-center justify-center">{renderRatioIcon(selectedSize, 16)}</span>
                <span className="font-medium">{selectedSize}</span>
              </span>
              <span className="text-text-muted">▾</span>
            </button>

            {isSizePickerOpen && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
                onClick={() => setIsSizePickerOpen(false)}
              >
                <div
                  className="w-full sm:w-[420px] max-h-[70vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-border overflow-hidden mb-16 sm:mb-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text">{isEnglish ? 'Select size' : 'サイズを選択'}</h3>
                    <button onClick={() => setIsSizePickerOpen(false)} className="text-text-muted">✕</button>
                  </div>
                  <div className="p-3 overflow-auto max-h-[60vh] pb-20 sm:pb-4">
                    <div className="flex flex-col gap-1.5">
                      {(derivedSizes as ImageSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => { setSelectedSize(size); setIsSizePickerOpen(false) }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border ${selectedSize === size ? 'btn-primary text-white' : 'bg-white text-text border-border'}`}
                          aria-label={`size-${size}`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex items-center justify-center">{renderRatioIcon(size, 16)}</span>
                            <span className="font-medium">{size}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )
  }

  // 桌面布局组件
  const DesktopLayout = () => {
    return (
      <div className="max-w-7xl mx-auto bg-[var(--bg)] rounded-lg shadow border border-[var(--border)] p-6 lg:p-8">

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <div className="bg-[var(--surface)] rounded-lg p-5 card border border-[var(--border)]">
              <div className="mb-4">
              <div className="flex justify-center flex-wrap gap-3 mb-3">
                {/* 模型选择（桌面端） */}
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-border"
                  aria-label={isEnglish ? 'Model' : 'モデル'}
                >
                  <option value="gpt4o-image">{isEnglish ? 'GPT-4o Image' : 'GPT-4o Image'}</option>
                  <option value="flux-kontext-pro">{isEnglish ? 'Flux Kontext Pro' : 'Flux Kontext Pro'}</option>
                  <option value="flux-kontext-max">{isEnglish ? 'Flux Kontext Max' : 'Flux Kontext Max'}</option>
                </select>
                <button
                  onClick={() => {
                  setMode('template-mode')
                  if (!selectedTemplate) setPrompt('')
                }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'template-mode'
                      ? 'btn-primary text-white'
                      : 'btn-outline'
                  }`}
                >
                  {isEnglish ? 'Easy' : '簡単'}
                </button>
                <button
                  onClick={() => {
                    setMode('image-to-image')
                    setPrompt('')
                    setSelectedTemplate(null)
                    localStorage.removeItem('selectedTemplateId')
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'image-to-image'
                      ? 'btn-primary text-white'
                      : 'btn-outline'
                  }`}
                >
                  {isEnglish ? 'Image→Image' : '図→図'}
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'text-to-image'
                      ? 'btn-primary text-white'
                      : 'btn-outline'
                  }`}
                >
                  {isEnglish ? 'Text→Image' : '文→図'}
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
                className="inline-flex items-center gap-2 btn-primary text-sm"
              >
                <span>{isEnglish ? 'View how-to guide' : '使い方ガイドを見る'}</span>
                <span>↓</span>
              </button>
            </div>

            {mode === 'template-mode' && (
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                     title={isEnglish ? 'Previous' : '前のページ'}
                    className="flex-shrink-0 p-2 rounded-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          className={`p-1.5 h-36 rounded-lg border transition-colors flex flex-col focus:outline-none focus:ring-2 focus:ring-brand active:border-brand active:shadow-sm ${
                            selectedTemplate?.id === template.id
                              ? 'border-brand bg-surface shadow-sm'
                              : 'border-border bg-white hover:border-brand hover:shadow-sm'
                          }`}
                        >
                          <div className="flex-1 flex items-center justify-center mb-1">
                            <Image
                              src={template.afterImage}
                              alt={isEnglish ? (nameMap[template.name] || template.name) : template.name}
                              width={128}
                              height={128}
                              className="w-full max-w-28 aspect-square object-cover rounded shadow-sm"
                            />
                          </div>
                          <p className="text-xs font-bold text-text leading-tight px-0.5 text-center h-8 flex items-center justify-center">{isEnglish ? (nameMap[template.name] || template.name) : template.name}</p>
                        </button>
                      ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(templates.length / templatesPerPage) - 1}
                     title={isEnglish ? 'Next' : '次のページ'}
                    className="flex-shrink-0 p-2 rounded-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-center mt-2">
                  <span className="text-xs text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
                    ページ {currentPage + 1} / {Math.ceil(templates.length / templatesPerPage)}
                  </span>
                </div>
              </div>
            )}

            {mode !== 'text-to-image' && (
              <div
                className={`border-2 border-dashed border-border rounded-[28px] p-8 text-center hover:border-brand cursor-pointer bg-surface/50 backdrop-blur-lg hover:bg-surface/70 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden transition-all duration-1000 delay-900 ${
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
                      className="text-text-muted hover:text-text text-sm bg-surface px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      🗑️ 別の写真にするね
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-bounce-slow">
                    <PhotoIcon className="w-16 h-16 mx-auto text-text-muted animate-pulse" />
                    <p className="text-lg text-text-muted">{isEnglish ? 'Drop your photo here! 📸' : '写真をドロップしてね！ 📸'}</p>
                    <p className="text-sm text-text-muted">{isEnglish ? 'Or click here to select ✨' : 'またはここをクリックして選んでね ✨'}</p>
                    <p className="text-xs text-text">{isEnglish ? 'Up to 10MB supported' : '10MBまでの画像OK！'}</p>
                  </div>
                )}
              </div>
            )}

            {mode === 'template-mode' && (
              <div className="mt-2 text-center">
                  <p className="text-xs text-text-muted">
                  {isEnglish
                    ? 'Tip: We recommend GPT‑4o Image for better quality, but it may take a bit longer.'
                    : 'ヒント：より良い品質のためにGPT-4o画像を推奨しますが、少し時間がかかる場合があります。'}
                </p>
              </div>
            )}

            {mode === 'text-to-image' && (
              <div className={`border-2 border-dashed border-border rounded-[28px] p-6 text-center bg-surface backdrop-blur-lg shadow-lg overflow-hidden transition-all duration-1000 delay-900 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="space-y-4">
                  <div className="text-6xl mb-4 animate-pulse">✍️✨</div>
                  <h3 className="text-xl font-bold text-text mb-2">{isEnglish ? '🎨 Text-to-Image mode is ready!' : '🎨 テキストからイラストモード、始まるよ！'}</h3>
                  <p className="text-text-muted mb-3">{isEnglish ? 'Create cute images with only text!' : 'テキストだけで、可愛い画像を作れるよ！'}</p>
                  <div className="bg-surface rounded-2xl p-4 mx-2 border border-border">
                    <p className="text-sm text-text mb-2">{isEnglish ? '💡 Tips:' : '💡 おすすめの使い方：'}</p>
                    <ul className="text-xs text-text-muted space-y-1 text-left">
                      <li>{isEnglish ? '• Describe character features for better results' : '• 具体的なキャラクター特徴を書くと綺麗に生成されるよ'}</li>
                      <li>{isEnglish ? '• You can specify background and outfit colors' : '• 背景や服装の色も指定できる'}</li>
                      <li>{isEnglish ? '• Both Japanese and English are OK!' : '• 日本語でも英語でもOK！'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="mt-4 text-center">
                    <div className="w-full max-w-xs mx-auto bg-gray-2 00 rounded-full h-2 overflow-hidden">
                  <div className="bg-pink-500 h-2" style={{ width: `${uploadProgress}%` }} />
                </div>
                    <p className="mt-2 text-sm text-text-muted">{isEnglish ? 'Uploading...' : 'アップロード中...'} {uploadProgress}%</p>
              </div>
            )}

            <div className={`mt-6 space-y-4 transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div>
                <label className="block text-lg font-bold text-text mb-3">{isEnglish ? '📐 Choose image size ✨' : '📐 画像サイズを選んでね ✨'}</label>
                <div className="grid grid-cols-3 gap-5">
                  {(derivedSizes as ImageSize[]).map((size) => (
                    <SizeButton
                      key={size}
                      size={size}
                      isSelected={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      isMobile={false}
                      isEnglish={isEnglish}
                    />
                  ))}
                </div>
              </div>

              {/* 始终渲染输入区域，避免条件渲染导致的卸载重建 */}
              <div className={`${
                (mode === 'image-to-image' || mode === 'text-to-image') ? '' : 'hidden'
              }`}>
                <label className="block text-lg font-bold text-text mb-3">{isEnglish ? 'Write your prompt ✨' : 'プロンプトを書いてね ✨'}</label>
                <textarea
                  ref={promptDesktopTextareaRef}
                  value={prompt}
                  onChange={handlePromptChange}
                  className="w-full p-4 border-2 border-border rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent focus:outline-none text-text"
                  placeholder={isEnglish ? 'Enter your prompt...' : 'プロンプトを入力...'}
                  rows={4}
                />
                
                {/* おすすめの呪文ブロックはPCでは非表示にしました */}
              </div>

              {mode === 'template-mode' && selectedTemplate && (
                <div className="bg-surface p-4 rounded-2xl shadow-lg">
                  <h4 className="font-bold text-text mb-2 text-base">{isEnglish ? '🎀 Selected magic:' : '🎀 選択中の魔法：'}{selectedTemplate.name}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{selectedTemplate.prompt}</p>
                </div>
              )}

              <div className="flex items-center bg-surface p-4 rounded-2xl shadow-md">
                <input
                  type="checkbox"
                  id="enhancePrompt"
                  checked={enhancePrompt}
                  onChange={(e) => setEnhancePrompt(e.target.checked)}
                  className="rounded border-border text-brand focus:ring-brand h-5 w-5"
                />
                <label htmlFor="enhancePrompt" className="ml-3 text-sm text-text">
                  {isEnglish ? 'Enhance prompt effect' : 'プロンプト効果を強化する'}
                </label>
              </div>

              <button
                onClick={generateImage}
                disabled={isGenerating || 
                  (mode === 'template-mode' && (!fileUrl || !selectedTemplate)) || 
                  (mode === 'image-to-image' && (!fileUrl || !prompt.trim())) ||
                  (mode === 'text-to-image' && !prompt.trim())
                }
                className="w-full btn-primary py-4 px-6 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <span className="relative inline-flex items-center justify-center mr-3">
                      <svg
                        className="cat-bounce h-6 w-6 lg:h-7 lg:w-7"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        shapeRendering="crispEdges"
                      >
                        {/* ears */}
                        <rect x="3" y="3" width="2" height="2" fill="#F6BBD0" />
                        <rect x="11" y="3" width="2" height="2" fill="#F6BBD0" />
                        {/* head */}
                        <rect x="4" y="4" width="8" height="8" rx="1" ry="1" fill="#F6BBD0" />
                        {/* eyes */}
                        <rect x="6" y="7" width="1" height="1" fill="#2B2B2B" />
                        <rect x="9" y="7" width="1" height="1" fill="#2B2B2B" />
                        {/* mouth */}
                        <rect x="7" y="9" width="2" height="1" fill="#2B2B2B" />
                      </svg>
                    </span>
                    {mode === 'text-to-image' ? (isEnglish ? 'Generating image... ✨' : '画像を生成しているよ... ✨') : (isEnglish ? 'Working magic... ✨' : '魔法をかけているよ... ✨')}
                    <style jsx>{`
                      .cat-bounce {
                        animation: squishy-bounce 1.2s ease-in-out infinite;
                        transform-origin: center bottom;
                      }
                      @keyframes squishy-bounce {
                        0%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
                        20% { transform: translateY(0) scaleX(1.12) scaleY(0.88); }
                        40% { transform: translateY(-6px) scaleX(0.94) scaleY(1.06); }
                        60% { transform: translateY(0) scaleX(1.06) scaleY(0.94); }
                        80% { transform: translateY(-2px) scaleX(0.98) scaleY(1.02); }
                      }
                    `}</style>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-6 h-6 mr-3" />
                    {mode === 'text-to-image' ? (isEnglish ? 'Generate image! 🎨' : '画像を生成する！ 🎨') : (isEnglish ? 'Transform! 🎀' : '変身させる！ 🎀')}
                  </>
                )}
              </button>
            </div>


            {generationError && (
              <div className="mt-6 p-6 bg-surface backdrop-blur-sm border border-border rounded-[24px] shadow-lg overflow-hidden">
                <p className="text-pink-800 font-cute mb-3">{generationError}</p>
                <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={handleRetry} className="btn-primary text-white px-4 py-2 rounded-full font-bold shadow hover:shadow-md transition">{isEnglish ? 'Retry' : '再試行'}</button>
              <button onClick={() => setGenerationError('')} className="bg-white border border-border text-text px-4 py-2 rounded-full font-bold shadow-sm hover:shadow transition">{isEnglish ? 'Close' : '閉じる'}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`lg:w-1/2 space-y-8 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 card border border-white/40 overflow-hidden">
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-bold text-text">
                {isGenerating 
                  ? (mode === 'text-to-image' ? (isEnglish ? 'Generating...' : '画像生成中...') : (isEnglish ? 'Transforming...' : '変身中...')) 
                  : currentResult?.status === 'SUCCESS' 
                    ? (mode === 'text-to-image' ? (isEnglish ? 'Generation complete! 🎉' : '画像生成完了！🎉') : (isEnglish ? 'Transformation complete! 🎉' : '変身完了！🎉')) 
                    : (isEnglish ? 'Result Preview ✨' : '結果プレビュー ✨')
                }
              </h3>
              {isGenerating && null}

            </div>

            {!currentResult && (
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-surface rounded-[36px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-[36px] shadow-2xl border-2 border-dashed border-pink-300/30 hover:border-pink-400 transition-all group-hover:shadow-xl overflow-hidden">
                    {mode === 'text-to-image' ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4 animate-pulse">✍️✨</div>
                        <h3 className="text-xl font-bold text-text mb-2">{isEnglish ? '🎨 Text-to-Image mode is ready!' : '🎨 テキストからイラストモード、始まるよ！'}</h3>
                        <p className="text-text-muted mb-3">{isEnglish ? 'Create cute images with only text!' : 'テキストだけで、可愛い画像を作れるよ！'}</p>
                        <div className="bg-surface rounded-2xl p-4 mx-4 border border-border">
                          <p className="text-sm text-text mb-2">{isEnglish ? '💡 Tips:' : '💡 おすすめの使い方：'}</p>
                          <ul className="text-xs text-text-muted space-y-1 text-left">
                            <li>{isEnglish ? '• Describe character features for better results' : '• 具体的なキャラクター特徴を書くと綺麗に生成されるよ'}</li>
                            <li>{isEnglish ? '• You can specify background and outfit colors' : '• 背景や服装の色も指定できる'}</li>
                            <li>{isEnglish ? '• Both Japanese and English are OK!' : '• 日本語でも英語でもOK！'}</li>
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
                        
                          <div className="bg-surface rounded-2xl p-4 mx-4 border border-border"
                          role="alert"
                        >
                          <h4 className="text-sm font-bold text-green-800 mb-1">{isEnglish ? '✅ Image ready!' : '✅ 画像準備完了！'}</h4>
                          <p className="text-xs text-green-700">{isEnglish ? 'Nice photo uploaded' : '綺麗な写真がアップロードされました'}</p>
                          <p className="text-xs text-green-600 mt-1">{isEnglish ? 'You can start the magic transformation!' : '魔法の変身を開始できます！'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="text-6xl mb-4 animate-bounce-slow">📸✨</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 font-cute">{isEnglish ? '📱 Upload a cute photo!' : '📱 可愛い写真をアップロードしよう！'}</h3>
                        <p className="text-gray-600 mb-4 font-cute">
                          {isEnglish ? 'Let\'s transform your photo into anime style!' : 'あなたの写真を、可愛いアニメ風に変身させましょう！'}
                        </p>
                        
                        <div className="bg-surface rounded-2xl p-4 mx-8 mb-4 border border-border"
                          role="note"
                        >
                          <p className="text-sm text-gray-700 mb-2">{isEnglish ? '📌 Tips:' : '📌 コツ：'}</p>
                          <ul className="text-xs text-gray-600 space-y-1 text-left"
                            role="list"
                          >
                            <li role="listitem">{isEnglish ? '• Bright, clear face photos are recommended' : '• 明るくて顔がはっきりしている写真がおすすめ'}</li>
                            <li role="listitem">{isEnglish ? '• Simple backgrounds produce better results' : '• 背景がシンプルだと綺麗に変身できるよ'}</li>
                            <li role="listitem">{isEnglish ? '• Drag & drop is OK too!' : '• ドラッグ&ドロップでもアップロードOK！'}</li>
                            <li role="listitem">{isEnglish ? '• Up to 10MB supported' : '• 10MBまでの画像ファイル対応'}</li>
                          </ul>
                        </div>
                        
                        <button
                          className="btn-primary text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold"
                          aria-label="画像ファイルを選択"
                        >
                          {isEnglish ? '📁 Select image' : '📁 画像を選択する'}
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
                    {(!(currentResult as GenerationResult).original_url || (currentResult as GenerationResult).original_url.trim() === '') ? (
                      <div className="text-center">
                        <a href={(currentResult as GenerationResult).generated_url} target="_blank" rel="noopener noreferrer">
                          <OptimizedImage
                            src={(currentResult as GenerationResult).generated_url}
                            alt="生成された画像"
                            width={400}
                            height={400}
                            className="max-w-full h-auto rounded-2xl mx-auto shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                            style={{ cursor: 'pointer' }}
                          />
                        </a>
                        <p className="text-sm text-text font-cute mt-3">✨ 生成された画像</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <a href={(currentResult as GenerationResult).generated_url} target="_blank" rel="noopener noreferrer">
                          <OptimizedImage
                            src={(currentResult as GenerationResult).generated_url}
                            alt="生成された画像"
                            width={400}
                            height={400}
                            className="max-w-full h-auto rounded-2xl mx-auto shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                            style={{ cursor: 'pointer' }}
                          />
                        </a>
                        <p className="text-sm text-text font-cute mt-3">✨ 生成された画像</p>
                      </div>
                    )}

                    <div className="bg-[var(--surface)] rounded-lg p-6 border border-[var(--border)]">
                      <div className="text-center mb-4">
                        <div className="text-2xl mb-2">🎊</div>
                        <h4 className="font-bold text-[var(--text)] mb-1">🎉 おめでとう！</h4>
                        <p className="text-sm text-[var(--text-muted)]">あなたの魔法の変身が完成しました！</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <a
                          href={(currentResult as GenerationResult).generated_url}
                          download={`anime-magic-${Date.now()}.png`}
                          className="w-full sm:w-auto btn-primary py-3 px-6 sm:px-8 font-bold flex items-center justify-center space-x-2 min-w-[140px]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>📥</span>
                          <span>ダウンロード</span>
                        </a>
                        <button
                          onClick={handleContribute}
                          disabled={!publishInfoRef.current || publishState !== 'idle'}
                          className="w-full sm:w-auto btn-primary py-3 px-6 sm:px-8 font-bold flex items-center justify-center space-x-2 min-w-[140px] disabled:opacity-60"
                        >
                          {publishState === 'publishing' ? '公開中…' : publishState === 'published' ? '公開済み' : '公開する'}
                        </button>
                        
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
                    <span className="relative inline-flex items-center justify-center">
                      <svg
                        className="cat-bounce h-10 w-10"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        shapeRendering="crispEdges"
                      >
                        <rect x="9" y="7" width="1" height="1" fill="#2B2B2B" />
                        <rect x="7" y="9" width="2" height="1" fill="#2B2B2B" />
                      </svg>
                      <style jsx>{`
                        .cat-bounce { animation: squishy-bounce 1.2s ease-in-out infinite; transform-origin: center bottom; }
                        @keyframes squishy-bounce {
                          0%, 100% { transform: translateY(0) scaleX(1) scaleY(1); }
                          20% { transform: translateY(0) scaleX(1.12) scaleY(0.88); }
                          40% { transform: translateY(-8px) scaleX(0.94) scaleY(1.06); }
                          60% { transform: translateY(0) scaleX(1.06) scaleY(0.94); }
                          80% { transform: translateY(-3px) scaleX(0.98) scaleY(1.02); }
                        }
                      `}</style>
                    </span>
                    <p className="mt-4 text-text-muted">
                     2kawaiiのAIで画像生成中... 数秒で完成！✨
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
    <div className="min-h-screen bg-[var(--bg)]">
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
{/* 選べる変身スタイル セクション（页面底部） */}
<div className="pt-6 pb-12 lg:pt-8 lg:pb-20">
  <TemplateGallery />
</div>

      {/* 内部リンク戦略：長尾キーワードセクション - 优化移动端 */}
      <section className="py-12 lg:py-16 px-3 sm:px-4 lg:px-6 bg-surface">
        <div className="max-w-7xl mx-auto px-2">
        </div>
      </section>
      
    </div>
  )
}