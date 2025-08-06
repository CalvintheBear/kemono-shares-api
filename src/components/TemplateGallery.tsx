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
    id: '1',
    name: '擬人化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA-after',
    prompt: '画像生成AI 無料でペットやキャラクターを擬人化！猫 擬人化、犬 擬人化、ボケモン擬人化、サンリオ 擬人化も簡単に作成。チャットGPT 画像生成 無料で可愛いアイコンやLINEスタンプとして使えるアニメキャラに変身させましょう',
    category: '擬人化'
  },
  {
    id: '18',
    name: '可愛line アイコン',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-afterr',
    prompt: '無料スタンプ LINE 可愛アイコンを画像生成AIで作成！チャットGPT 画像生成 無料で作れる可愛いアイコン・プロンプト付き。iPhone壁紙にも使えるキャラクターデザイン。登録不要で即座にダウンロード可能',
    category: '可愛line アイコン'
  },
  {
    id: '19',
    name: 'lineスタンプ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85%E5%8C%85-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85%E5%8C%85-after',
    prompt: 'LINEスタンプ 無料で作れる画像生成AI！可愛いキャラクター スタンプをチャットGPT 画像生成で作成。商用利用可能な無料スタンプ、プロンプト付き。登録不要で即座にダウンロード、Canvaでも使えるアニメスタイル',
    category: 'lineスタンプ'
  },
  {
    id: '20',
    name: '可愛い壁紙',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%A3%81%E7%BA%B8-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%A3%81%E7%BA%B8-after',
    prompt: '可愛い壁紙 iPhone 壁紙 PC スマホ 壁紙を画像生成AI 無料で作成！チャットGPT 画像生成で可愛い背景画像、ジブリ風 写真加工風の壁紙を無料でダウンロード。登録不要で即座に使える高画質壁紙生成',
    category: '可愛い壁紙'
  },
  {
    id: '17',
    name: 'irasutoya',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/irasutoya-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/irasutoya-afterr',
    prompt: 'irasutoya風 画像生成AI 無料で商用利用可能な可愛いイラストを作成！チャットGPT 画像生成 無料で作れる商用フリー素材。プロンプト付きで簡単に作成、登録不要で即座にダウンロード。Canvaやローラ素材としても使える',
    category: 'irasutoya'
  },
  {
    id: '2',
    name: 'ブルーアーカイブ',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-after',
    prompt: '画像生成AI 無料でブルーアーカイブ風のキャラクターを作成！チャットGPT 画像生成でアニメの女の子を無料で作れる。制服の美学を再現した可愛いアイコン、プロンプト付き。登録不要で即座にダウンロード可能',
    category: 'ブルーアーカイブ'
  },
  {
    id: '3',
    name: 'vtuber',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-after',
    prompt: '画像生成AI 無料でVTuber風キャラクターを作成！チャットGPT 画像生成でバーチャルアイドル風の可愛いアニメキャラを無料で作れる。Live2D/3Dハイブリッドスタイル、プロンプト付き。登録不要で即座にダウンロード可能',
    category: 'vtuber'
  },
  {
    id: '5',
    name: 'ウマ娘',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%B5%9B%E9%A9%AC%E5%A8%98-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%B5%9B%E9%A9%AC%E5%A8%98-after',
    prompt: '画像生成AI 無料でウマ娘風キャラクターを作成！チャットGPT 画像生成で競馬アイドル風の可愛いアニメキャラを無料で作れる。スクールアイドル×スポーツ融合デザイン、プロンプト付き。登録不要で即座にダウンロード可能',
    category: 'ウマ娘'
  },
  {
    id: '7',
    name: '少女',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%B0%91%E5%A5%B3-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%B0%91%E5%A5%B3-after',
    prompt: '画像生成AI 無料で可愛い日本の少女アニメキャラを作成！チャットGPT 画像生成 無料で二次元美少女を作れる。4K超高画質、プロンプト付き。登録不要で即座にダウンロード可能、可愛いアイコンや壁紙としても使える',
    category: '少女'
  },
  {
    id: '8',
    name: '萌え化',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-afterr',
    prompt: '画像生成AI 無料で萌えキャラクターを作成！チャットGPT 画像生成で可愛いロリータ少女を無料で作れる。ちびキャラも簡単に、プロンプト付き。登録不要で即座にダウンロード可能、可愛いアイコンやLINEスタンプとしても使える',
    category: '萌え化'
  },
  {
    id: '9',
    name: 'chibi',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-beforer',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-afterr',
    prompt: '画像生成AI 無料でちびキャラクターを作成！チャットGPT 画像生成でQ版デフォルメの可愛いキャラを無料で作れる。癒し系アニメスタイル、プロンプト付き。登録不要で即座にダウンロード可能、可愛いアイコンやLINEスタンプとしても使える',
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
    prompt: '画像生成AI 無料でSDキャラクターを作成！スーパーデフォルメのちびキャラ、可愛い小さな体のデフォルメスタイルをチャットGPT 画像生成で無料作成。登録不要で即座にダウンロード可能、可愛いアイコンやLINEスタンプとしても使える',
    category: 'SDキャラ'
  },
  {
    id: '12',
    name: '原神異世界',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%BC%82%E4%B8%96%E7%95%8C-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%BC%82%E4%B8%96%E7%95%8C-after',
    prompt: '画像生成AI 無料で原神風キャラクターを作成！ゲームアニメ風の幻想的な世界観、美麗な色彩のキャラクターをチャットGPT 画像生成で無料作成。登録不要で即座にダウンロード可能、可愛いアイコンや壁紙としても使える',
    category: '原神異世界'
  },
  {
    id: '13',
    name: 'ゴシック地雷女',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%93%A5%E7%89%B9%E5%9C%B0%E9%9B%B7-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%93%A5%E7%89%B9%E5%9C%B0%E9%9B%B7-after',
    prompt: '画像生成AI 無料でゴシック地雷女キャラクターを作成！黒白トーンのスウィートゴススタイルをチャットGPT 画像生成で無料作成。猫耳アクセサリーやレースディテールが特徴、登録不要で即座にダウンロード可能、可愛いアイコンとしても使える',
    category: 'ゴシック地雷女'
  },
  {
    id: '14',
    name: '厚塗',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-after',
    prompt: '画像生成AI 無料で厚塗りアニメイラストを作成！滑らかな肌のレンダリング、立体感のある二次元イラストをチャットGPT 画像生成で無料作成。8K超高画質、登録不要で即座にダウンロード可能、壁紙やアイコンとしても使える',
    category: '厚塗'
  },
  {
    id: '15',
    name: '3D CG',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/3DCG-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/3DCG-after',
    prompt: '画像生成AI 無料で3D CGキャラクターを作成！美しいBJD風の超リアル3DキャラをチャットGPT 画像生成で無料作成。8K超高画質、ゲームCGレンダリング品質、登録不要で即座にダウンロード可能、高画質壁紙やアイコンとしても使える',
    category: '3D CG'
  },
  {
    id: '16',
    name: '乙女ゲーム',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E4%B9%99%E6%B8%B8-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E4%B9%99%E6%B8%B8-after',
    prompt: '画像生成AI 無料で乙女ゲーム風キャラクターを作成！美しい男性キャラクター、ロマンティックな雰囲気をチャットGPT 画像生成で無料作成。恋愛要素満載の耽美なデザイン、登録不要で即座にダウンロード可能、可愛いアイコンや壁紙としても使える',
    category: '乙女ゲーム'
  },
  {
    id: '21',
    name: 'クレヨンしんちゃん',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0-after',
    prompt: '画像生成AI 無料でクレヨンしんちゃん風キャラクターを作成！懐かしいアニメ風の可愛いキャラをチャットGPT 画像生成で無料作成。登録不要で即座にダウンロード可能、可愛いアイコンやLINEスタンプとしても使える',
    category: 'クレヨンしんちゃん'
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
    id: '23',
    name: '写真 アニメ風',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%86%99%E7%9C%9F%E6%BC%AB%E7%94%BB%E5%8C%96-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%86%99%E7%9C%9F%E6%BC%AB%E7%94%BB%E5%8C%96-after',
    prompt: '画像生成AI 無料で写真をアニメ風に変換！可愛いメイドガール風、アニメメイド、繊細なレースとパステルカラーのアニメ風写真加工をチャットGPT 画像生成で無料作成。登録不要で即座にダウンロード可能、SNSアイコンや壁紙としても使える',
    category: '写真 アニメ風'
  },
  {
    id: '24',
    name: 'emoji 絵文字風',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/emoji-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/emoji-after',
    prompt: '画像生成AI 無料でemoji風アバターを作成！写真を3Dステッカー風の可愛い絵文字に変換、チャットGPT 画像生成でiOS公式スタイルを無料作成。登録不要で即座にダウンロード可能、SNSプロフィルアイコンやLINEスタンプとしても使える',
    category: 'emoji 絵文字風'
  },
  {
    id: '25',
    name: '獣耳',
    beforeImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%85%BD%E8%80%B3-before',
    afterImage: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%85%BD%E8%80%B3-after',
    prompt: '画像生成AI 無料で可愛い獣耳キャラクターを作成！猫耳や狐耳のふわふわキャラをチャットGPT 画像生成で無料作成。ファンタジー風の衣装でモフモフ感満載、登録不要で即座にダウンロード可能、可愛いアイコンや壁紙としても使える',
    category: '獣耳'
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
                    <OptimizedImage
                      src={selectedTemplate.beforeImage}
                      alt={`${selectedTemplate.name} 変身前`}
                      width={300}
                      height={300}
                      className="w-auto h-auto max-w-full max-h-96 object-contain"
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
                    <OptimizedImage
                      src={selectedTemplate.afterImage}
                      alt={`${selectedTemplate.name} 変身後`}
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