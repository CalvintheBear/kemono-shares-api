import Workspace from "@/components/Workspace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Image from 'next/image'

// 追加SEOメタデータ
export const metadata = {
  title: "Nanobanana AI画像生成 無料 | 写真をアニメ風に変換 - 2kawaii",
  description: "Nanobanana AI画像生成 サイト 無料 登録不要。Nanobanana Editモデルで写真を数秒でアニメ風に変換。高品質・商用利用可。",
  openGraph: {
    title: "Nanobanana AI画像生成 無料 | 写真をアニメ風に変換 - 2kawaii",
    description: "Nanobanana AI画像生成 サイト 無料 登録不要。Nanobanana Editモデルで写真を数秒でアニメ風に即変換。高品質・商用利用可。",
    url: "https://2kawaii.com/workspace",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-workspace.jpg",
        width: 1200,
        height: 630,
        alt: "AI画像生成 無料 - 2kawaii GPT-4o",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanobanana AI画像生成 無料 | 写真をアニメ風に変換 - 2kawaii",
    description: "Nanobanana AI画像生成 サイト 無料 登録不要。Nanobanana Editモデルで数秒でアニメ風に変換。",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-workspace.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/workspace",
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
}

// JSON-LD 構造化データ
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '2kawaii Nanobanana AI画像生成',
  description: 'Nanobanana Editモデルに対応。プロンプト自動生成により写真を数秒でアニメ風に即変換できる無料AIツール',
  url: 'https://2kawaii.com/workspace',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Nanobanana AI画像生成 無料',
    'プロンプト自動生成',
    '写真をアニメ風に即変換',
    'Nanobanana Editモデル対応',
    '数秒で高速生成',
    '商用利用可能'
  ],
  screenshot: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/workspace-screenshot.jpg',
}

export default function WorkspacePage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD 構造化データ埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* 顶部导航栏 */}
      <Header />

      {/* 页面主体，顶部预留导航栏高度 */}
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题区域 */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black font-cute mb-2">
              数秒で写真をアニメ化（Nanobanana AI）
            </h1>
            <h2 className="text-lg sm:text-xl text-black max-w-2xl mx-auto">
              画像をアップロード → Nanobananaモデルと縦横比を選ぶだけ。高速・高品質・登録不要。
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-4"></div>
          </div>

          {/* Workspaceコンポーネント */}
          <Workspace />
        </div>
      </main>

      {/* 使い方ガイド - 3ステップで簡単操作（从首页复制） */}
      <section id="guides-section" className="py-12 lg:py-20 px-3 sm:px-4 lg:px-6 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-[var(--text)] mb-8 lg:mb-12">
            Nanobanana AI画像変換（3ステップ）— 数秒で仕上がる
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides1-choosemodelandeuploadimage.jpg" 
                  alt="AI画像変換 モデル選択と画像アップロード - 無料ツール" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換 モデル選択と画像アップロードガイド"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">1-2. Nanobananaモデル選択と画像アップロード</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">Nanobanana Editモデルを選択し、JPEG/PNG形式の写真をアップロードしてください</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides2-choosesizeandchoosetemplate.jpg" 
                  alt="AI画像変換 サイズ選択とテンプレート選択 - 無料ツール" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換 サイズ選択とテンプレート選択"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">3-4. サイズとテンプレート選択</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">縦横比を選択し、お好みのアニメスタイルテンプレートを選択してください</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides3-clickstartandgetfinialimage.jpg" 
                  alt="AI画像変換成功 - 開始して最終画像取得 ダウンロード可能 商用利用" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI画像変換成功 - 開始して最終画像取得"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">5. 開始して最終画像取得</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">「開始」ボタンをクリックしてNanobanana AI変換を開始！高品質なアニメ画像をダウンロードしてSNSにシェアできます</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚固定在底部 */}
      <Footer />
      <MobileBottomNav />
    </div>
  );
} 