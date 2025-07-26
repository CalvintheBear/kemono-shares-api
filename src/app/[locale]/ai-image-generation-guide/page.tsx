import type { Metadata } from 'next';
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI画像生成 初心者ガイド | 写真をアニメ風に変換する完全ガイド",
  description: "【初心者向け】AI画像生成で写真をアニメ風に変換する完全ガイド。登録不要・無料で使えるAI画像変換の使い方を詳しく解説。ジブリ風、VTuber風、美少女、chibiなど人気スタイルの選び方も紹介。",
  keywords: "AI画像生成 初心者, 写真 アニメ風に変換, AI画像変換 使い方, アニメ風画像作成 初心者, 写真加工 アニメ風, AI 画像生成 無料 初心者",
  alternates: {
    canonical: "https://kemono-mimi.com/guide",
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
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-8 text-center">
              AI画像生成 初心者ガイド - 写真をアニメ風に変換する完全ガイド
            </h1>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-amber-800 mb-4 text-center">人気のアニメスタイル</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-after" 
                    alt="萌え化スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">萌え化</p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%90%89%E5%8D%9C%E5%8A%9B%E9%A3%8E-after" 
                    alt="ジブリ風スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">ジブリ風</p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-after" 
                    alt="VTuberスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">VTuber</p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-after" 
                    alt="ブルーアーカイブスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">ブルーアーカイブ</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-amber-800 mb-4 text-center">リアル系スタイル</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%AF%81%E4%BB%B6%E7%85%A7-after" 
                    alt="証明写真スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">証明写真</p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-after" 
                    alt="厚塗スタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">厚塗</p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/3DCG-after" 
                    alt="3D CGスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">3D CG</p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E4%B9%99%E6%B8%B8-after" 
                    alt="乙女ゲームスタイルサンプル" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                  />
                  <p className="text-xs text-amber-700 mt-2">乙女ゲーム</p>
                </div>
              </div>
            </div>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">AI画像生成とは？</h2>
            <p className="text-amber-700 leading-relaxed mb-4">
              AI画像生成は、人工知能を使って写真をアニメ風に変換する技術です。
              最新のAI技術により、あなたの写真を可愛いアニメキャラクターに変身させることができます。
            </p>
          </section>

          {/* 使い方ガイド - 3ステップで簡単操作 */}
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-8 text-center">AI画像変換の使い方 - 3ステップで簡単操作</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-uploadimage" 
                    alt="AI画像変換 写真アップロード方法 - JPEG PNG対応 無料ツール" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    title="AI画像変換 写真アップロードガイド"
                  />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-4">1. 写真をアップロード</h3>
                <p className="text-amber-700 text-sm leading-relaxed">JPEG/PNG形式の写真をドラッグ&ドロップまたはクリックして選択してください</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-choosetem" 
                    alt="アニメスタイル選択 - ジブリ風 VTuber風 chibi 美少女 無料" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    title="AI画像変換 アニメスタイル選択"
                  />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-4">2. アニメスタイルを選択</h3>
                <p className="text-amber-700 text-sm leading-relaxed">ジブリ風・VTuber風・美少女・chibi・擬人化など20種類以上のアニメスタイルからお選びください</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <img 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-finalimage" 
                    alt="AI画像変換完了 - アニメ画像作成 ダウンロード可能 商用利用" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    title="AI画像変換完了"
                  />
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-4">3. AI画像生成完了</h3>
                <p className="text-amber-700 text-sm leading-relaxed">最新のAI技術で1-3分で高品質なアニメ画像を生成！ダウンロードしてSNSにシェア可能</p>
              </div>
            </div>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">AI画像生成の基本的な使い方</h2>
            <ol className="list-decimal list-inside space-y-3 text-amber-700">
              <li>高品質な写真を用意する（正面を向いている写真がおすすめ）</li>
              <li>お好みのアニメスタイルを選択する（ジブリ風、VTuber風、美少女など）</li>
              <li>AI画像生成を開始する（1-3分で完了）</li>
              <li>生成されたアニメ画像をダウンロードする</li>
            </ol>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">豊富なアニメスタイル選択</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-3">🐱 ケモノミミ</h3>
                <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                  <li>可愛い動物の耳と尻尾</li>
                  <li>ファンタジーな獣人スタイル</li>
                  <li>萌え系ケモノキャラクター</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-3">👤 人間化</h3>
                <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                  <li>リアルな人間スタイル</li>
                  <li>自然な人間の特徴</li>
                  <li>写実的な人物表現</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-3">🎨 イラスト</h3>
                <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                  <li>アニメイラスト風</li>
                  <li>美しい絵画スタイル</li>
                  <li>アート性の高い表現</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-3">💖 萌え化</h3>
                <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                  <li>萌えキャラスタイル</li>
                  <li>可愛らしい特徴</li>
                  <li>アニメ萌え系</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-3">🌸 ジブリ風</h3>
                <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                  <li>ジブリアニメ風</li>
                  <li>優しく温かみのある雰囲気</li>
                  <li>自然で美しい表現</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-3">👧 娘化</h3>
                <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                  <li>美少女キャラ化</li>
                  <li>可愛い女の子スタイル</li>
                  <li>萌え系美少女</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="text-center mt-12">
            <Link href="/workspace" className="btn-kawaii text-xl px-8 py-4">
              今すぐAI画像生成を始める 🎨
            </Link>
          </section>
        </article>
      </div>
      </main>
      
      <Footer />
    </div>
  )
}