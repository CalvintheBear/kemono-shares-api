import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplateGallery from "@/components/TemplateGallery";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import Image from 'next/image'

// ホームページSEOメタデータ
export const metadata = {
  title: "2kawaii｜無料AI画像生成ツール - プロンプト自動生成で写真をアニメ・イラスト・可愛い壁紙に1-3分で変換",
  description: "【完全無料・登録不要】2kawaiiは最新AIでプロンプト自動生成により写真をジブリ風・可愛い壁紙・chibi・美少女・証明写真加工など20種類以上のアニメイラストに自動変換！商用利用OK・高画質・スマホ対応。SNSアイコンやLINEスタンプも簡単作成。1-3分で高品質なアニメ画像を生成します。",
      keywords: "2kawaii, AI画像生成 無料, プロンプト生成, AIイラスト, アニメ化, 写真 変換, ジブリ風, 可愛い壁紙, 証明写真加工, chibi, 美少女, LINEスタンプ, SNSアイコン, 商用利用, 登録不要, 高画質, AI自動化, AIプロンプト",
      openGraph: {
          title: "2kawaii｜無料AI画像生成ツール - プロンプト自動生成で写真をアニメ・イラスト・可愛い壁紙に1-3分で変換",
    description: "プロンプト自動生成で写真をアニメ・イラスト・可愛い壁紙・証明写真加工に即変換！2kawaiiのAIで1-3分で高画質画像を無料生成。登録不要・商用利用OK。",
    url: "https://2kawaii.com",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "2kawaii AI画像生成 ホームページ",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2kawaii｜無料AI画像生成ツール - プロンプト自動生成で写真をアニメ・イラスト・可愛い壁紙に1-3分で変換",
    description: "プロンプト自動生成でAI写真をアニメ・イラスト・可愛い壁紙・証明写真加工に自動変換！20+スタイル・1-3分で完成・完全無料・登録不要",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-homepage.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD 構造化データ
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '2kawaii AI画像生成',
  description: 'GPT-4o Image でプロンプト自動生成により写真をアニメ風に即変換できる無料ツール',
      url: 'https://2kawaii.com',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'プロンプト自動生成',
    '写真をアニメ風に変換',
    '20種類以上のスタイル選択',
    '1-3分で高速生成',
    '商用利用可能',
    '登録不要・完全無料'
  ],
  screenshot: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/homepage-screenshot.jpg',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff7ea]">
      {/* JSON-LD 構造化データ埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <Header />

      {/* 英雄区域 */}
      <HomeHero />

      {/* 12个模板样式展示 - 减少顶部间距 */}
      <div className="pt-8 pb-20 lg:pt-12 lg:pb-24">
        <TemplateGallery />
      </div>

      {/* 使い方ガイド - 优化间距和响应式 */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#fff7ea]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-12 lg:mb-16 animate-fade-in-up">
            AI画像変換の使い方 - 3ステップで簡単操作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-uploadimage" 
                  alt="AI画像変換 写真アップロード方法 - JPEG PNG対応 無料ツール" 
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover rounded-full shadow-lg"
                  title="AI画像変換 写真アップロードガイド"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">1. 写真をアップロード</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">JPEG/PNG形式の写真をドラッグ&ドロップまたはクリックして選択してください</p>
            </div>
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-choosetem" 
                  alt="アニメスタイル選択 - ジブリ風 VTuber風 chibi 美少女 無料" 
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover rounded-full shadow-lg"
                  title="AI画像変換 アニメスタイル選択"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">2. アニメスタイルを選択</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">ジブリ風・VTuber風・美少女・chibi・擬人化など20種類以上のアニメスタイルからお選びください</p>
            </div>
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-finalimage" 
                  alt="AI画像変換完了 - アニメ画像作成 ダウンロード可能 商用利用" 
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover rounded-full shadow-lg"
                  title="AI画像変換完了"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">3. AI画像生成完了</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">最新のAI技術で1-3分で高品質なアニメ画像を生成！ダウンロードしてSNSにシェア可能</p>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション - 优化间距和布局 */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#fff7ea]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-12 lg:mb-16 animate-fade-in-up">
            AI画像変換ツールが選ばれる理由
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">✨ AI画像生成 完全無料</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">登録不要・隠れた課金なし。商用利用可能なAI画像変換ツールを完全無料でご利用いただけます。</p>
            </div>
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">🚀 AI画像変換 高速処理</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">最新のAI技術により、1-3分で高品質なアニメ画像を生成。写真加工アプリよりも速くて簡単！</p>
            </div>
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">🔒 プライバシー保護</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">アップロードした画像は処理後すぐに削除。安心してご利用ください。</p>
            </div>
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">📱 AI画像変換 どこでも利用</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">PC・スマホ・タブレット、どのデバイスでも快適に利用可能。VTuberやアイコン作成にも最適！</p>
            </div>
          </div>
        </div>
      </section>

      {/* 無料AI画像変換サービス比較表 - 优化排版 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fff7ea]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-8 lg:mb-12 animate-fade-in-up">
            無料AI画像変換サービス比較表
          </h2>
          <div className="card-kawaii p-6 sm:p-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-amber-200">
                    <th className="py-4 px-4 font-bold text-amber-800 text-sm sm:text-base">サービス名</th>
                    <th className="py-4 px-4 font-bold text-amber-800 text-sm sm:text-base">無料利用</th>
                    <th className="py-4 px-4 font-bold text-amber-800 text-sm sm:text-base">登録必要</th>
                    <th className="py-4 px-4 font-bold text-amber-800 text-sm sm:text-base">商用利用</th>
                    <th className="py-4 px-4 font-bold text-amber-800 text-sm sm:text-base">使いやすさ</th>
                    <th className="py-4 px-4 font-bold text-amber-800 text-sm sm:text-base">画質</th>
                  </tr>
                </thead>
                <tbody className="text-amber-700">
                  <tr className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-sm sm:text-base">2kawaii</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 完全無料</td>
                    <td className="py-4 px-4 text-sm sm:text-base">❌ 不要</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 可能</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐ 超簡単</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Canva</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🆓 一部無料</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 必要</td>
                    <td className="py-4 px-4 text-sm sm:text-base">📄 条件付き</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐ 簡単</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Midjourney</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🎁 25回無料</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 必要</td>
                    <td className="py-4 px-4 text-sm sm:text-base">📄 条件付き</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐ 普通</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Stable Diffusion</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🆓 基本無料</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 必要</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⚠️ 複雑</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐⭐ 困難</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 内部リンク戦略：長尾キーワードセクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-12">
            関連コンテンツ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/ai-image-generation-guide" className="card-kawaii p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-amber-800 mb-3">AI画像生成 初心者ガイド</h3>
              <p className="text-amber-700 text-sm">写真をアニメ風に変換する完全ガイド</p>
            </Link>
            
            <Link href="/line-sticker-creation" className="card-kawaii p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-amber-800 mb-3">LINEスタンプ作り方</h3>
              <p className="text-amber-700 text-sm">写真を可愛いLINEスタンプに無料変換</p>
            </Link>
            
            <Link href="/chibi-character-maker" className="card-kawaii p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-amber-800 mb-3">Chibiキャラクター作成</h3>
              <p className="text-amber-700 text-sm">可愛いchibiキャラをAIで作る</p>
            </Link>
            
            <Link href="/ai-image-conversion-free" className="card-kawaii p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-amber-800 mb-3">AI画像変換 無料比較</h3>
              <p className="text-amber-700 text-sm">無料AI画像変換ツールを徹底比較</p>
            </Link>
            
            <Link href="/personification-ai" className="card-kawaii p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-amber-800 mb-3">擬人化 AI 活用術</h3>
              <p className="text-amber-700 text-sm">ペットやオブジェクトを擬人化する方法</p>
            </Link>
            
            <Link href="/anime-icon-creation" className="card-kawaii p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-amber-800 mb-3">アイコン作成 無料</h3>
              <p className="text-amber-700 text-sm">SNS用アニメアイコンを無料で作成</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ セクション - 增加间距 */}
      <div className="py-20 lg:py-24">
        <FAQ />
      </div>

      {/* CTA セクション - 优化间距和响应式 */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-800 font-cute mb-6 lg:mb-8 animate-fade-in-up">
            今すぐアニメキャラクターに変身！
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-amber-700 mb-10 lg:mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            あなたの写真が可愛いアニメキャラクターに生まれ変わります
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link href="/workspace" className="btn-kawaii text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 lg:py-5 animate-glow-pulse">
              無料で始める 🎀
            </Link>
            <Link href="/share" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 lg:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              ギャラリーを見る 🖼️
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 