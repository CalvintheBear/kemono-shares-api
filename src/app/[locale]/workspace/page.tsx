import Workspace from "@/components/Workspace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl";

// 追加SEOメタデータ
export const metadata = {
  title: "2kawaii ワークスペース｜プロンプト自動生成・AI画像変換・アニメ化・イラスト化を無料で体験",
  description: "2kawaiiワークスペースでプロンプト自動生成によるAI画像生成を体験！写真をジブリ風・VTuber風・chibi・美少女など多彩なスタイルに1-3分で自動変換。完全無料・登録不要・商用利用OK。SNSアイコンやLINEスタンプ作成にも最適な高画質AIイラスト変換ツール。",
  keywords: "2kawaii, AI画像生成, プロンプト生成, AIイラスト, アニメ化, 写真 変換, ジブリ風, VTuber風, chibi, 美少女, LINEスタンプ, SNSアイコン, 商用利用, 登録不要, 高画質, AI自動化, ワークスペース, AIプロンプト",
      openGraph: {
          title: "2kawaii ワークスペース｜プロンプト自動生成・AI画像変換・アニメ化・イラスト化を無料で体験",
    description: "プロンプト自動生成でAI写真をアニメ・イラスト・VTuber風に自動変換！20+スタイル・1-3分で高画質画像を無料生成。登録不要・商用利用OK。",
    url: "https://2kawaii.com/workspace",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-workspace.jpg",
        width: 1200,
        height: 630,
        alt: "2kawaii AI画像生成 ワークスペース",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2kawaii ワークスペース｜プロンプト自動生成・AI画像変換・アニメ化・イラスト化を無料で体験",
    description: "プロンプト自動生成でAI写真をアニメ・イラスト・VTuber風に自動変換！20+スタイル・1-3分で完成・完全無料・登録不要",
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
  name: '2kawaii AI画像生成',
  description: 'GPT-4o Image でプロンプト自動生成により写真をアニメ風に即変換できる無料ツール',
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
    'プロンプト自動生成',
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
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 装饰性元素区域 - 添加更多填充内容 */}
          <div className="text-center mb-4 sm:mb-6">
            {/* 浮动装饰元素 */}
            <div className="relative h-32 mb-6">
              {/* 左上角装饰 */}
              <div className="absolute top-0 left-4 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute top-2 left-6 text-2xl animate-bounce">🌸</div>
              
              {/* 中间装饰 */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full animate-spin-slow opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl">✨</div>
              </div>
              
              {/* 右上角装饰 */}
              <div className="absolute top-0 right-4 w-12 h-12 bg-gradient-to-br from-blue-300 to-teal-400 rounded-full opacity-70 animate-pulse delay-300"></div>
              <div className="absolute top-1 right-5 text-xl animate-ping">💫</div>
              
              {/* 底部装饰云 */}
              <div className="absolute bottom-0 left-1/4 w-24 h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-60 blur-sm"></div>
              <div className="absolute bottom-0 right-1/4 w-20 h-10 bg-gradient-to-r from-blue-200 to-teal-200 rounded-full opacity-60 blur-sm"></div>
            </div>
            
            {/* 小装饰条 */}
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
              <div className="text-lg">🎀</div>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
              <div className="text-lg">🌟</div>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></div>
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