import Workspace from "@/components/Workspace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 追加SEOメタデータ
export const metadata = {
  title: "AI画像生成 無料 登録不要 | gpt4o image でアニメ風に即変換 - 2kawaii",
  description: "ai画像生成 サイト 無料 登録不要。gpt4o image でプロンプト自動生成、1-3分でアニメ風に変換。ジブリ風・VTuber・chibi対応。",
  openGraph: {
    title: "AI画像生成 無料 登録不要 | gpt4o image - 2kawaii",
    description: "ai画像生成 サイト 無料 登録不要。プロンプト自動生成で写真をアニメ風に即変換。ジブリ風・VTuber・chibi対応。",
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
    title: "AI画像生成 無料 登録不要 | gpt4o image - 2kawaii",
    description: "ai画像生成 サイト 無料 登録不要。gpt4o image でプロンプト自動生成、1-3分でアニメ風に変換。",
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
  name: '2kawaii GPT-4o画像生成',
  description: 'GPT-4o Imageでプロンプト自動生成により写真をアニメ風に即変換できる無料AIツール',
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
    'AI画像生成 無料',
    'プロンプト自動生成',
    '写真をアニメ風に即変換',
    'ジブリ風・VTuber風・chibi対応',
    '1-3分で高速生成',
    '商用利用可能'
  ],
  screenshot: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/workspace-screenshot.jpg',
}

export default function WorkspacePage() {
  // 进入移动端自动滚动到核心区域
  if (typeof window !== 'undefined') {
    try {
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        // 延迟到内容渲染后滚动
        setTimeout(() => {
          const el = document.getElementById('workspace-mobile-core')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 400)
      }
    } catch {}
  }
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
          {/* 页面标题区域 */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-700 font-cute mb-4">
              AI画像変換スタート！
            </h1>
            <p className="text-lg sm:text-xl text-amber-700 max-w-2xl mx-auto">
              写真をアップロードして、好きなアニメスタイルを選択するだけ
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-4"></div>
          </div>

          {/* Workspaceコンポーネント */}
          <Workspace />
        </div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
} 