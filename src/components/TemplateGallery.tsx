'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import OptimizedImage from './OptimizedImage'

interface _Template {
  id: string
  name: string
  thumbnail: string
  fullImage: string
  prompt: string
  category: string
  beforeImage: string
  afterImage: string
}

// 新分类的模板数据，每个分类包含before/after图片
const templates = [
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
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after',
    prompt: 'ちびキャラクター、Q版デフォルメ、ベクターアイコン風、可愛らしい小さな体、大きな頭、ふわふわした雰囲気、癒し系。',
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
    id: '25',
    name: 'flux風',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/flux-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/flux-after',
    prompt: '超高精细なアニメーションイラスト、フラックス風の傑作。極限まで鮮明なフォーカス、刃物のようにクリーンな線画。太い輪郭線。劇的な陰影と強いハイライト（スタジオ照明の逆光）のコントラスト。滑らかなグラデーションのセル塗り。細部描写が異様に緻密で、8K解像度。クリーンでモダン、鋭い審美眼。明るい色彩、寒色トーン。「現代アニメキービジュアル」。--style raw--v 6.0',
    category: 'flux風'
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
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-after',
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

export default function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>(templates[0].category)
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isEnglish = typeof window !== 'undefined' && (window.location.pathname === '/en' || window.location.pathname.startsWith('/en/'))

  const translate = (ja: string, en: string) => (isEnglish ? en : ja)

  const categoryMap: Record<string, string> = {
    'emoji 絵文字風': 'emoji sticker style',
    'lineスタンプ': 'LINE stickers',
    chibi: 'chibi',
    '可愛い壁紙': 'Cute wallpaper',
    'flux風': 'Flux style',
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
    '厚塗': 'Thick paint',
    '3D CG': '3D CG',
    '擬人化': 'Anthropomorphism',
    'クレヨンしんちゃん': 'Crayon Shin-chan',
    '写真 アニメ風': 'Photo to anime',
    '獣耳': 'Animal ears',
  }

  const nameMap = categoryMap

  useEffect(() => {
    setIsClient(true)
    
    // 页面加载后触发渐入效果
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  // 获取所有唯一的分类
  const categories = [...Array.from(new Set(templates.map(t => t.category)))]
  
  // 获取选中的模板详情
  const selectedTemplate = templates.find(t => t.category === selectedCategory)

  return (
    <div className={`px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out animate-fade-in ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-text font-cute mb-12 lg:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {translate('選べる変身スタイル', 'Choose your style')}
        </h2>
        
        {/* 分类选择按钮 */}
        <div className={`flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 lg:mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-colors ${
                selectedCategory === category
                  ? 'btn-primary text-white'
                  : 'bg-surface text-text-muted border border-border hover:bg-surface'
              }`}
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              {isEnglish ? (categoryMap[category] || category) : category}
            </button>
          ))}
        </div>

        {/* 分类展示内容 */}
        {selectedTemplate && (
          <div className={`card p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text font-cute text-center mb-8 lg:mb-10">
              {(isEnglish ? (nameMap[selectedTemplate.name] || selectedTemplate.name) : selectedTemplate.name)} - {translate('変身前後の比較', 'Before vs After')}
            </h3>
            <div className="text-center mb-4 -mt-4">
              <p className="text-xs text-text-muted">
                {isEnglish
                  ? 'Tip: For Easy mode templates, we recommend GPT‑4o Image for better quality, but it may take a bit longer.'
                  : 'ヒント：簡単モードのテンプレートでは高品質のため GPT‑4o Image の利用をおすすめしますが、処理に時間がかかる場合があります。'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
              {/* 变身前 */}
              <div className="text-center animate-fade-in-left" style={{animationDelay: '0.8s'}}>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-bold">{translate('変身前', 'Before')}</p>
                <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg inline-block">
                  {isClient && (
                    <OptimizedImage
                      src={selectedTemplate.beforeImage}
                      alt={`${isEnglish ? (nameMap[selectedTemplate.name] || selectedTemplate.name) : selectedTemplate.name} ${translate('変身前','Before')}`}
                      width={300}
                      height={300}
                      className="w-auto h-auto max-w-full max-h-96 object-contain"
                    />
                  )}
                </div>
              </div>
              
              {/* 箭头 */}
              <div className="text-center animate-fade-in" style={{animationDelay: '1s'}}>
                <div className="text-3xl sm:text-4xl lg:text-5xl text-brand font-bold animate-pulse">
                  →
                </div>
                <p className="text-sm sm:text-base text-text-muted mt-3 sm:mt-4 font-cute">
                  {translate('AI変身','AI transform')}
                </p>
              </div>
              
              {/* 变身后 */}
              <div className="text-center animate-fade-in-right" style={{animationDelay: '0.8s'}}>
                <p className="text-sm sm:text-base text-text mb-3 sm:mb-4 font-bold">{translate('変身後','After')}</p>
                <div className="bg-surface rounded-lg overflow-hidden border-2 border-border shadow-lg inline-block">
                  {isClient && (
                    <OptimizedImage
                      src={selectedTemplate.afterImage}
                      alt={`${isEnglish ? (nameMap[selectedTemplate.name] || selectedTemplate.name) : selectedTemplate.name} ${translate('変身後','After')}`}
                      width={300}
                      height={300}
                      className="w-auto h-auto max-w-full max-h-96 object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-10 text-center animate-fade-in-up" style={{animationDelay: '1.2s'}}>
              <p className="text-sm sm:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed max-w-4xl mx-auto">
                {selectedTemplate.prompt}
              </p>
              
              <div className="flex gap-4 justify-center">
                {isClient && (
                  <Link
                    href={isEnglish ? '/en/workspace' : '/workspace'}
                    className="btn-primary px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
                    onClick={() => {
                      localStorage.setItem('selectedTemplateId', selectedTemplate.id)
                    }}
                  >
                    {translate('このスタイルで変身','Use this style')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}