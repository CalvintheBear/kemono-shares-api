import type { Metadata } from 'next';

// 生成静态参数
export function generateStaticParams() {
  return [
    { locale: 'ja' }
  ];
}
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image'

export const metadata: Metadata = {
  title: "chibi キャラ作成 | GPT-4oで写真をSDキャラに無料変換 - 2kawaii",
  description: "【完全無料】GPT-4oで写真を可愛いchibiキャラに即変換！頭大きく体小さいSDキャラが2-5分で完成。LINEスタンプ・SNSアイコン・可愛い壁紙に最適。商用利用OK。",
  alternates: {
    canonical: "https://2kawaii.com/chibi-character-maker",
  },
  openGraph: {
    title: "chibi キャラ作成 | GPT-4oで写真をSDキャラに無料変換",
    description: "GPT-4oで写真を可愛いchibiキャラに即変換！頭大きく体小さいSDキャラが2-5分で完成。LINEスタンプに最適。",
    url: "https://2kawaii.com/chibi-character-maker",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-chibi.jpg",
        width: 1200,
        height: 630,
        alt: "chibi SDキャラ作成 - 2kawaii GPT-4o",
      }
    ],
    locale: "ja_JP",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "chibi キャラ作成 | GPT-4oで写真をSDキャラに無料変換",
    description: "GPT-4oで写真を可愛いchibiキャラに即変換！2-5分で完成。",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-chibi.jpg"],
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

export default function ChibiMakerPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-8 text-center">
              Chibiキャラクター作成 - AIで可愛いchibiキャラを無料作成
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after" 
                  alt="Chibiキャラクターサンプル" 
                  width={192}
                  height={192}
                  className="mx-auto rounded-lg shadow-lg w-48 h-48 object-cover"
                  unoptimized
                />
                <p className="text-sm text-text-muted mt-2">Chibiキャラクター</p>
              </div>
              
              <div className="text-center">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/SD%E5%B0%8F%E4%BA%BA-after" 
                  alt="SDキャラクターサンプル" 
                  width={192}
                  height={192}
                  className="mx-auto rounded-lg shadow-lg w-48 h-48 object-cover"
                  unoptimized
                />
                <p className="text-sm text-text-muted mt-2">SDキャラクター</p>
              </div>
            </div>
          
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">AIでChibiキャラを作る方法</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              頭が大きくて体が小さく、可愛らしいchibiキャラクターは、AI画像生成技術で簡単に作成できます。
              あなたの写真をアップロードするだけで、かわいいchibiキャラクターが生成されます。
            </p>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Chibiキャラ作成の特徴</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li>頭が大きくて可愛らしいデフォルメ表現</li>
              <li>簡略化された特徴で個性を表現</li>
              <li>スタンプやアイコンとして使いやすい</li>
              <li>商用利用可能</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Chibiキャラの使い道</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li>LINEスタンプ作成</li>
              <li>SNSプロフィール画像</li>
              <li>スマホ壁紙</li>
              <li>オリジナルグッズ</li>
            </ul>
          </section>

          <section className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/workspace" className="btn-kawaii text-xl px-8 py-4">
                今すぐChibiキャラ作成を始める 🎨
              </Link>
              <Link href="/share" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                お題一覧 🖼️
              </Link>
            </div>
          </section>

          {/* 関連コンテンツ */}
          <section className="card-kawaii p-8 mt-12">
            <h2 className="text-2xl font-bold text-text mb-6 text-center">関連コンテンツ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/ai-image-generation-guide" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">AI画像生成 初心者ガイド</h3>
                <p className="text-text-muted text-sm">写真をアニメ風に変換する完全ガイド</p>
              </Link>
              
              <Link href="/line-sticker-creation" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">LINEスタンプ作り方</h3>
                <p className="text-text-muted text-sm">写真を可愛いLINEスタンプに無料変換</p>
              </Link>
              
              <Link href="/chibi-character-maker" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">Chibiキャラクター作成</h3>
                <p className="text-text-muted text-sm">可愛いchibiキャラをAIで作る</p>
              </Link>
              
              <Link href="/ai-image-conversion-free" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">AI画像変換 無料比較</h3>
                <p className="text-text-muted text-sm">無料AI画像変換ツールを徹底比較</p>
              </Link>
              
              <Link href="/personification-ai" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">擬人化 AI 活用術</h3>
                <p className="text-text-muted text-sm">ペットやオブジェクトを擬人化する方法</p>
              </Link>
              
              <Link href="/anime-icon-creation" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">アイコン作成 無料</h3>
                <p className="text-text-muted text-sm">SNS用アニメアイコンを無料で作成</p>
              </Link>
            </div>
          </section>
        </article>
      </div>
      </main>
      
      <Footer />
    </div>
  )
}