import Workspace from "@/components/Workspace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl";

// 追加SEOメタデータ
export const metadata = {
  title: "kemono-mimi ワークスペース｜AI画像変換・アニメ化・イラスト化を無料で体験",
  description: "kemono-mimiワークスペースでAI画像生成を体験！写真をジブリ風・VTuber風・chibi・美少女など多彩なスタイルに1-3分で自動変換。完全無料・登録不要・商用利用OK。SNSアイコンやLINEスタンプ作成にも最適な高画質AIイラスト変換ツール。",
  keywords: "kemono-mimi, AI画像生成, AIイラスト, アニメ化, 写真 変換, ジブリ風, VTuber風, chibi, 美少女, LINEスタンプ, SNSアイコン, 商用利用, 登録不要, 高画質, AI自動化, ワークスペース",
  openGraph: {
    title: "kemono-mimi ワークスペース｜AI画像変換・アニメ化・イラスト化を無料で体験",
    description: "AIで写真をアニメ・イラスト・VTuber風に自動変換！20+スタイル・1-3分で高画質画像を無料生成。登録不要・商用利用OK。",
    url: "https://kemono-mimi.com/workspace",
    siteName: "kemono-mimi AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-workspace.jpg",
        width: 1200,
        height: 630,
        alt: "kemono-mimi AI画像生成 ワークスペース",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kemono-mimi ワークスペース｜AI画像変換・アニメ化・イラスト化を無料で体験",
    description: "AIで写真をアニメ・イラスト・VTuber風に自動変換！20+スタイル・1-3分で完成・完全無料・登録不要",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-workspace.jpg"],
  },
  alternates: {
    canonical: "https://kemono-mimi.com/workspace",
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
  name: 'kemono-mimi AI画像生成',
  description: 'GPT-4o Image で写真をアニメ風に即変換できる無料ツール',
  url: 'https://kemono-mimi.com/workspace',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    '写真をアニメ風に変換',
    '20種類以上のスタイル選択',
    '1-3分で高速生成',
    '商用利用可能',
    '登録不要・完全無料'
  ],
  screenshot: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/workspace-screenshot.jpg',
}

export default async function WorkspacePage() {
  // const t = await getTranslations("workspace");
  const messages = (await import("../../../../messages/ja.json")).default; // 仅使用日语

  return (
    <div className="min-h-screen bg-[#fff7ea]">
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
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* ヒーローセクション with SEO keywords */}
          <div className="text-center mb-12 animate-scale-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-6 font-cute float">
              kemono-mimi AI画像生成
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-3 text-amber-700">
                GPT-4o Image で写真をアニメ風に即変換
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-amber-800 mb-4 font-cute">
              写真をアニメ風に即変換！登録不要・商用利用可能・完全無料
            </p>
            <p className="text-base sm:text-lg text-amber-700 max-w-3xl mx-auto leading-relaxed mb-6">
              最新のGPT-4o Image FluxMax技術により、ジブリ風・VTuber風・美少女・chibiキャラクター作成・LINEスタンプ作り方など、20種類以上のスタイルから選択可能。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/share" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center">
                <span className="mr-2">🖼️</span>
                ギャラリーを見る
              </a>
            </div>
          </div>

          {/* Workspaceコンポーネント */}
          <NextIntlClientProvider locale="ja" messages={messages}>
            <Workspace />
          </NextIntlClientProvider>
        </div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
} 