'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
    id: '1',
    name: '擬人化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA-after',
    prompt: '[対象物]を擬人化したキャラクター。特徴は[素材]、[形状]、[機能]、[色]に基づいてデザイン。髪型や服装に[対象物]の要素を取り入れた[少女／少年]の姿。アニメ風、中心構図、清潔な背景、細部まで丁寧に描写、ソフトな色調',
    category: '擬人化'
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
    id: '8',
    name: '萌え化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-afterr',
    prompt: 'ちび風ロリータ少女、可愛いウサギ耳、フリルディテール、ふわふわの要素が特徴で。チビ、カワイイ、ソフトシェーディング、可愛いウサギ耳、フリルディテール、繊細なラインアート、パステル背景、愛らしい表情、スウィートテーマ、手描き、カートゥーン調、ミニマリスト背景、光沢のある瞳、フローラルアクセント、リボンディテール、ふわふわ要素、明るい色調、甘美なカラーパレット、魅力的',
    category: '萌え化'
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
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E9%9F%A9%E5%BC%8F%E8%AF%81%E4%BB%B6%E7%85%A7-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E9%9F%A9%E5%BC%8F%E8%AF%81%E4%BB%B6%E7%85%A7-after',
    prompt: '韓国風の証明写真スタイル。自然な美肌補正、清潔な背景、ソフトなライティング、白くて滑らかな肌、ナチュラルメイク、整った髪型、正面からの顔アップ、制服は韓国の女子高校生風、整った制服スタイル、清楚で上品な雰囲気、可愛いけど控えめ、HD、証明写真構図。',
    category: '証明写真加工'
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
    id: '24',
    name: 'emoji 絵文字風',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/emoji-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/emoji-after',
    prompt: 'カワイイアニメのメイドガールで、繊細なレースとフリルのディテール、ソフトなシェーディング、パステルカラー、可愛い表情、ゴシックロリータ要素、光沢のある瞳。アニメメイド、カワイイ、繊細なレース、ソフトシェーディング、パステルカラー、フリルディテール、可愛い表情、ゴシックロリータ要素、光沢のある瞳、ディテール豊かな衣装、ロマンチックな雰囲気、手描きアニメ、魅力的、女性的、複雑なデザイン、ライトバックグラウンド、甘美、エレガント、アニメ美学、メイドヘッドドレス',
    category: 'emoji 絵文字風'
  },
]

export default function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('擬人化')
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

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
    <div className={`px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-12 lg:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          選べる変身スタイル
        </h2>
        
        {/* 分类选择按钮 */}
        <div className={`flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 lg:mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-pink-400 to-orange-400 text-white shadow-lg scale-110'
                  : 'bg-white/80 text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 分类展示内容 */}
        {selectedTemplate && (
          <div className={`card-kawaii p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-800 font-cute text-center mb-8 lg:mb-10">
              {selectedTemplate.name} - 変身前後の比較
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
              {/* 变身前 */}
              <div className="text-center animate-fade-in-left" style={{animationDelay: '0.8s'}}>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-bold">変身前</p>
                <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg inline-block">
                  {isClient && (
                    <Image
                      src={selectedTemplate.beforeImage}
                      alt={`${selectedTemplate.name} 変身前`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-auto h-auto max-w-full max-h-96 object-contain"
                      unoptimized
                    />
                  )}
                </div>
              </div>
              
              {/* 箭头 */}
              <div className="text-center animate-fade-in" style={{animationDelay: '1s'}}>
                <div className="text-3xl sm:text-4xl lg:text-5xl text-amber-600 font-bold animate-pulse">
                  →
                </div>
                <p className="text-sm sm:text-base text-amber-700 mt-3 sm:mt-4 font-cute">
                  AI変身
                </p>
              </div>
              
              {/* 变身后 */}
              <div className="text-center animate-fade-in-right" style={{animationDelay: '0.8s'}}>
                <p className="text-sm sm:text-base text-amber-700 mb-3 sm:mb-4 font-bold">変身後</p>
                <div className="bg-white rounded-lg overflow-hidden border-2 border-amber-300 shadow-lg inline-block">
                  {isClient && (
                    <Image
                      src={selectedTemplate.afterImage}
                      alt={`${selectedTemplate.name} 変身後`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-auto h-auto max-w-full max-h-96 object-contain"
                      unoptimized
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-10 text-center animate-fade-in-up" style={{animationDelay: '1.2s'}}>
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
                {isClient && (
                  <Link
                    href="/workspace"
                    className="btn-kawaii px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
                    onClick={() => {
                      localStorage.setItem('selectedTemplate', selectedTemplate.id)
                    }}
                  >
                    このスタイルで変身
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