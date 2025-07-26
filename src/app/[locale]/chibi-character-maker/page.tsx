import type { Metadata } from 'next';
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chibiキャラクター作成 - AIで可愛いchibiキャラを無料作成",
  description: "【完全無料】AIで写真を可愛いchibiキャラクターに変換！頭が大きくて体が小さいデフォルメ表現が特徴的なchibiキャラが簡単に作成できます。LINEスタンプやSNSアイコンに最適。",
  keywords: "chibiキャラクター作成, chibi化 AI, AIでchibiキャラ作成, chibiキャラ 作り方 無料, 写真をchibiに変換, 可愛いキャラクター作成 AI, chibiアイコン作成",
  alternates: {
    canonical: "https://kemono-mimi.com/chibi",
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
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-8 text-center">
              Chibiキャラクター作成 - AIで可愛いchibiキャラを無料作成
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <img 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after" 
                  alt="Chibiキャラクターサンプル" 
                  className="mx-auto rounded-lg shadow-lg w-48 h-48 object-cover"
                />
                <p className="text-sm text-amber-700 mt-2">Chibiキャラクター</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/SD-after" 
                  alt="SDキャラクターサンプル" 
                  className="mx-auto rounded-lg shadow-lg w-48 h-48 object-cover"
                />
                <p className="text-sm text-amber-700 mt-2">SDキャラクター</p>
              </div>
            </div>
          
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">AIでChibiキャラを作る方法</h2>
            <p className="text-amber-700 leading-relaxed mb-4">
              頭が大きくて体が小さく、可愛らしいchibiキャラクターは、AI画像生成技術で簡単に作成できます。
              あなたの写真をアップロードするだけで、かわいいchibiキャラクターが生成されます。
            </p>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Chibiキャラ作成の特徴</h2>
            <ul className="list-disc list-inside space-y-2 text-amber-700">
              <li>頭が大きくて可愛らしいデフォルメ表現</li>
              <li>簡略化された特徴で個性を表現</li>
              <li>スタンプやアイコンとして使いやすい</li>
              <li>商用利用可能</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Chibiキャラの使い道</h2>
            <ul className="list-disc list-inside space-y-2 text-amber-700">
              <li>LINEスタンプ作成</li>
              <li>SNSプロフィール画像</li>
              <li>スマホ壁紙</li>
              <li>オリジナルグッズ</li>
            </ul>
          </section>

          <section className="text-center mt-12">
            <Link href="/workspace" className="btn-kawaii text-xl px-8 py-4">
              今すぐChibiキャラ作成を始める 🎨
            </Link>
          </section>
        </article>
      </div>
      </main>
      
      <Footer />
    </div>
  )
}