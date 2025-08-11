import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplateGallery from "@/components/TemplateGallery";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import MobileBottomNav from "@/components/MobileBottomNav";
import HomeLatestShares from "@/components/HomeLatestShares";
import Image from 'next/image'



// ホームページSEOメタデータ
export const metadata = {
  title: "AI画像生成 無料 登録不要 | gpt4o image で写真をアニメ風に即変換 - 2kawaii",
  description: "ai画像生成 サイト 無料 登録不要。gpt4o image でプロンプト自動生成、2-5分でアニメ風に変換。ジブリ風・VTuber・chibiなど20+スタイル対応。",
  openGraph: {
    title: "AI画像生成 無料 登録不要 | gpt4o image - 2kawaii",
    description: "ai画像生成 サイト 無料 登録不要。プロンプト自動生成で写真をアニメ風に即変換。ジブリ風・VTuber・chibi対応。",
    url: "https://2kawaii.com",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "AI画像生成 無料 登録不要 - 2kawaii GPT-4o",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI画像生成 無料 登録不要 | gpt4o image - 2kawaii",
    description: "ai画像生成 サイト 無料 登録不要。gpt4o image でプロンプト自動生成、2-5分でアニメ風に変換。",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-homepage.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com",
    languages: {
      ja: "https://2kawaii.com",
      "x-default": "https://2kawaii.com",
    },
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
  name: '2kawaii GPT-4o画像生成',
  description: 'GPT-4o Imageでプロンプト自動生成により写真をアニメ風に即変換できる無料AIツール',
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
    'AI画像生成 無料 登録不要',
    'プロンプト自動生成',
    '写真をアニメ風に即変換',
    'ジブリ風・chibi・VTuber対応',
    '2-5分で高速生成',
    '商用利用可能'
  ],
  screenshot: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/homepage-screenshot.jpg',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
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

      {/* 今日最新作品（CTA 下方） */}
      <div className="animate-fade-in">
        <HomeLatestShares />
      </div>

      {/* 12个模板样式展示 - 优化移动端间距 */}
      <div className="pt-6 pb-12 lg:pt-8 lg:pb-20 animate-fade-in">
        <TemplateGallery />
      </div>

      {/* 使い方ガイド - 优化移动端间距和响应式 */}
      <section className="py-12 lg:py-20 px-3 sm:px-4 lg:px-6 bg-[var(--bg)] animate-fade-in">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-[var(--text)] mb-8 lg:mb-12 animate-fade-in-up">
            AI画像変換の使い方 - 3ステップで簡単操作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center card p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up h-full flex flex-col" style={{animationDelay: '0.2s'}}>
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guide-step1" 
                  alt="AI画像変換 モデル選択とテンプレート選択 - 無料ツール" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換 モデル選択とテンプレート選択ガイド"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">1. モデルとテンプレートを選択</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">お好みのAIモデルとアニメスタイルテンプレートを選択してください</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up h-full flex flex-col" style={{animationDelay: '0.4s'}}>
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-step2" 
                  alt="AI画像変換 画像アップロードと開始 - 無料ツール" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換 画像アップロードと開始"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">2. 画像をアップロードして開始</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">写真をアップロードして「開始」ボタンをクリックするとAI変換が始まります</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up h-full flex flex-col" style={{animationDelay: '0.6s'}}>
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-success_gain_final_image" 
                  alt="AI画像変換成功 - 最終画像取得 ダウンロード可能 商用利用" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換成功 - 最終画像取得"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">3. 成功！最終画像を取得</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">AI変換が完了！高品質なアニメ画像をダウンロードしてSNSにシェアできます</p>
            </div>
          </div>
        </div>
      </section>

      {/* 無料AI画像変換サービス比較表 - 优化移动端排版 */}
      <section className="py-12 lg:py-16 px-3 sm:px-4 lg:px-6 bg-[var(--bg)] animate-fade-in">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-[var(--text)] mb-6 lg:mb-8 animate-fade-in-up">
            無料AI画像変換サービス比較表
          </h2>
          <div className="card p-3 sm:p-4 lg:p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 px-2 font-bold text-[var(--text)]">サービス名</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">無料利用</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">登録必要</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">商用利用</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">使いやすさ</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">画質</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-muted)]">
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-4 px-4 font-semibold text-sm sm:text-base">2kawaii</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 完全無料</td>
                    <td className="py-4 px-4 text-sm sm:text-base">❌ 不要</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 可能</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐ 超簡単</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Canva</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🆓 一部無料</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 必要</td>
                    <td className="py-4 px-4 text-sm sm:text-base">📄 条件付き</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐ 簡単</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Midjourney</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🎁 25回無料</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ 必要</td>
                    <td className="py-4 px-4 text-sm sm:text-base">📄 条件付き</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐ 普通</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
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

      {/* 内部リンク戦略：長尾キーワードセクション - 优化移动端 */}
      <section className="py-12 lg:py-16 px-3 sm:px-4 lg:px-6 bg-[var(--surface)] animate-fade-in">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-[var(--text)] mb-8">
            関連コンテンツ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <Link href="/ai-image-generation-guide" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
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
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">AI画像生成 初心者ガイド</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">写真をアニメ風に変換する完全ガイド</p>
                </div>
              </div>
            </Link>
            
            <Link href="/line-sticker-creation" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
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
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">LINEスタンプ作り方</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">写真を可愛いLINEスタンプに無料変換</p>
                </div>
              </div>
            </Link>
            
            <Link href="/chibi-character-maker" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after" 
                    alt="Chibiキャラクター作成" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">Chibiキャラクター作成</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">可愛いchibiキャラをAIで作る</p>
                </div>
              </div>
            </Link>
            
            <Link href="/ai-image-conversion-free" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
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
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">AI画像変換 無料比較</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">無料AI画像変換ツールを徹底比較</p>
                </div>
              </div>
            </Link>
            
            <Link href="/personification-ai" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-after" 
                    alt="擬人化 AI 活用術" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">擬人化 AI 活用術</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">ペットやオブジェクトを擬人化する方法</p>
                </div>
              </div>
            </Link>
            
            <Link href="/anime-icon-creation" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
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
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">アイコン作成 無料</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">SNS用アニメアイコンを無料で作成</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ セクション - 优化移动端间距 */}
      <div className="py-12 lg:py-20 animate-fade-in">
        <FAQ />
      </div>

      {/* CTA セクション - 优化移动端间距和响应式 */}
      <section className="py-12 lg:py-20 px-3 sm:px-4 lg:px-6 animate-fade-in">
        <div className="max-w-5xl mx-auto text-center px-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6 animate-fade-in-up">
            今すぐアニメキャラクターに変身！
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--text-muted)] mb-6 lg:mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            あなたの写真が可愛いアニメキャラクターに生まれ変わります
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link href="/workspace" className="btn-primary text-base sm:text-lg px-6 sm:px-8 lg:px-10 py-3 lg:py-4">
              無料で始める 🎀
            </Link>
          </div>
        </div>
      </section>

      {/* 今日最新作品（底部备份） -- 移动到上方 */}

      <Footer />
      <MobileBottomNav />
    </div>
  );
} 