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
  title: "AI画像生成 完全ガイド | GPT-4oで写真をアニメ風に無料変換",
  description: "【初心者OK】GPT-4o Imageで写真を無料でアニメ風に変換する完全ガイド。プロンプト不要で1-3分完成。ジブリ風・VTuber・chibiなど20スタイルの選び方も解説。",
  alternates: {
    canonical: "https://2kawaii.com/ai-image-generation-guide",
  },
  openGraph: {
    title: "AI画像生成 完全ガイド | GPT-4oで写真をアニメ風に無料変換",
    description: "【初心者OK】GPT-4o Imageで写真を無料でアニメ風に変換。プロンプト不要で1-3分完成。ジブリ風・VTuber・chibi対応。",
    url: "https://2kawaii.com/ai-image-generation-guide",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-ai-guide.jpg",
        width: 1200,
        height: 630,
        alt: "AI画像生成 完全ガイド - 2kawaii GPT-4o",
      }
    ],
    locale: "ja_JP",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI画像生成 完全ガイド | GPT-4oで写真をアニメ風に無料変換",
    description: "【初心者OK】GPT-4o Imageで写真を無料でアニメ風に変換。プロンプト不要で1-3分完成。",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-ai-guide.jpg"],
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

export default function AIGuidePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-8 text-center">
              AI画像生成 初心者ガイド - 写真をアニメ風に変換する完全ガイド
            </h1>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-text mb-4 text-center">人気のアニメスタイル</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-afterr" 
                    alt="萌え化スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">萌え化</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%90%89%E5%8D%9C%E5%8A%9B%E9%A3%8E-after" 
                    alt="ジブリ風スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">ジブリ風</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-after" 
                    alt="VTuberスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">VTuber</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-after" 
                    alt="ブルーアーカイブスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">ブルーアーカイブ</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-text mb-4 text-center">リアル系スタイル</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%86%99%E7%9C%9F%E6%BC%AB%E7%94%BB%E5%8C%96-after" 
                    alt="写真 アニメ風スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">写真 アニメ風</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-after" 
                    alt="厚塗スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">厚塗</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/3DCG-after" 
                    alt="3D CGスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">3D CG</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E4%B9%99%E6%B8%B8-after" 
                    alt="乙女ゲームスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">乙女ゲーム</p>
                </div>
              </div>
            </div>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">AI画像生成とは？</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              AI画像生成は、人工知能を使って写真をアニメ風に変換する技術です。
              最新のAI技術により、あなたの写真を可愛いアニメキャラクターに変身させることができます。
            </p>
          </section>

          {/* 使い方ガイド - 3ステップで簡単操作 */}
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-8 text-center">AI画像変換の使い方 - 3ステップで簡単操作</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guide-step1" 
                    alt="AI画像変換 写真アップロード方法 - JPEG PNG対応 無料ツール" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    width={192}
                    height={192}
                    unoptimized
                    title="AI画像変換 写真アップロードガイド"
                  />
                </div>
                <h3 className="text-lg font-bold text-text mb-4">1. 写真をアップロード</h3>
                <p className="text-text-muted text-sm leading-relaxed">JPEG/PNG形式の写真をドラッグ&ドロップまたはクリックして選択してください</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-step2" 
                    alt="アニメスタイル選択 - ジブリ風 VTuber風 chibi 美少女 無料" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    width={192}
                    height={192}
                    unoptimized
                    title="AI画像変換 アニメスタイル選択"
                  />
                </div>
                <h3 className="text-lg font-bold text-text mb-4">2. アニメスタイルを選択</h3>
                <p className="text-text-muted text-sm leading-relaxed">ジブリ風・VTuber風・美少女・chibi・擬人化など20種類以上のアニメスタイルからお選びください</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-success_gain_final_image" 
                    alt="AI画像変換完了 - アニメ画像作成 ダウンロード可能 商用利用" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    width={192}
                    height={192}
                    unoptimized
                    title="AI画像変換完了"
                  />
                </div>
                <h3 className="text-lg font-bold text-text mb-4">3. AI画像生成完了</h3>
                <p className="text-text-muted text-sm leading-relaxed">最新のAI技術で1-3分で高品質なアニメ画像を生成！ダウンロードしてSNSにシェア可能</p>
              </div>
            </div>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">AI画像生成の基本的な使い方</h2>
            <ol className="list-decimal list-inside space-y-3 text-text-muted">
              <li>高品質な写真を用意する（正面を向いている写真がおすすめ）</li>
              <li>お好みのアニメスタイルを選択する（ジブリ風、VTuber風、美少女など）</li>
              <li>AI画像生成を開始する（1-3分で完了）</li>
              <li>生成されたアニメ画像をダウンロードする</li>
            </ol>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">豊富なアニメスタイル選択</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold text-text mb-3">🐱 ケモノミミ</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>可愛い動物の耳と尻尾</li>
                  <li>ファンタジーな獣人スタイル</li>
                  <li>萌え系ケモノキャラクター</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-text mb-3">👤 人間化</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>リアルな人間スタイル</li>
                  <li>自然な人間の特徴</li>
                  <li>写実的な人物表現</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">🎨 イラスト</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>アニメイラスト風</li>
                  <li>美しい絵画スタイル</li>
                  <li>アート性の高い表現</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">💖 萌え化</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>萌えキャラスタイル</li>
                  <li>可愛らしい特徴</li>
                  <li>アニメ萌え系</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">🌸 ジブリ風</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>ジブリアニメ風</li>
                  <li>優しく温かみのある雰囲気</li>
                  <li>自然で美しい表現</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">👧 娘化</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>美少女キャラ化</li>
                  <li>可愛い女の子スタイル</li>
                  <li>萌え系美少女</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/workspace" className="btn-kawaii text-xl px-8 py-4">
                今すぐAI画像生成を始める 🎨
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