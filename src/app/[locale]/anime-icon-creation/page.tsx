import type { Metadata } from 'next';
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image'

export const metadata: Metadata = {
  title: "アイコン作成 無料 AI | 写真をSNSアニメアイコンに即変換 - 2kawaii",
  description: "【完全無料】AIで写真を可愛いアニメアイコンに即変換！Twitter/Instagram/LINE/Discordプロフィール画像に最適。商用利用可能・登録不要・高画質ダウンロード。",
  alternates: {
    canonical: "https://2kawaii.com/anime-icon-creation",
  },
  openGraph: {
    title: "アイコン作成 無料 AI | 写真をSNSアニメアイコンに即変換",
    description: "【完全無料】AIで写真を可愛いアニメアイコンに即変換！Twitter/Instagram/LINE/Discordプロフィール画像に最適。商用利用可能・登録不要。",
    url: "https://2kawaii.com/anime-icon-creation",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-icon.jpg",
        width: 1200,
        height: 630,
        alt: "アニメアイコン作成 - 2kawaii AI",
      }
    ],
    locale: "ja_JP",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "アイコン作成 無料 AI | 写真をSNSアニメアイコンに即変換",
    description: "【完全無料】AIで写真を可愛いアニメアイコンに即変換！商用利用可能・登録不要。",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-icon.jpg"],
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

export default function IconCreationPage() {
  return (
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-8 text-center">
              アイコン作成 無料 - AIで可愛いアニメアイコンを即作成【SNS対応】
            </h1>
            
            <div className="text-center mb-8">
              <Image 
                src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-afterr" 
                alt="アニメアイコンサンプル" 
                className="mx-auto rounded-lg shadow-lg w-64 h-64 object-cover"
                width={256}
                height={256}
                unoptimized
              />
            </div>
          
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              アニメアイコン作成 完全無料ツール
            </h2>
            <p className="text-amber-700 leading-relaxed mb-4">
              AI画像生成技術を使って、あなたの写真から可愛いアニメアイコンを無料で作成！
              Twitter、Instagram、LINE、DiscordなどのSNSプロフィール画像に最適なアイコンが簡単に作れます。
              登録不要・商用利用可能な完全無料アイコン作成ツールです。
            </p>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              アニメアイコン作成の特徴
            </h2>
            <ul className="list-disc list-inside space-y-2 text-amber-700">
              <li><strong>完全無料</strong>：登録不要・隠れた課金なし</li>
              <li><strong>商用利用OK</strong>：ビジネス用アイコンとしても使用可能</li>
              <li><strong>高画質</strong>：最新AI技術で美麗なアイコンを生成</li>
              <li><strong>高速処理</strong>：1-3分でアイコン完成</li>
              <li><strong>多様なスタイル</strong>：20種類以上のアニメスタイルから選択</li>
              <li><strong>SNS対応</strong>：各種SNS推奨サイズで自動生成</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              対応SNSアイコンサイズ一覧
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-amber-800 mb-2">対応サイズ比率</h3>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• 1:1 (正方形) - SNSアイコンに最適</li>
                  <li>• 2:3 (縦長) - モバイル表示に最適</li>
                  <li>• 3:2 (横長) - デスクトップ表示に最適</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-amber-800 mb-2">推奨プラットフォーム</h3>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• Twitter, Instagram, LINE</li>
                  <li>• Discord, TikTok, LinkedIn</li>
                  <li>• Facebook, YouTube, Slack</li>
                  <li>• Zoom, Teams, その他SNS</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              アニメアイコン作成の手順
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-amber-700">
              <li><strong>写真をアップロード</strong>：JPEG/PNG形式、正面を向いた写真推奨</li>
              <li><strong>アイコンスタイルを選択</strong>：美少女、美少年、chibi、VTuber風など</li>
              <li><strong>背景を選択</strong>：透明背景、単色背景、グラデーション背景</li>
              <li><strong>AI画像生成</strong>：1-3分で高品質アイコン完成</li>
              <li><strong>ダウンロード</strong>：各種SNSサイズで自動生成されたアイコンを保存</li>
            </ol>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              豊富なアニメスタイル選択
            </h2>
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

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              アイコン作成の活用シーン
            </h2>
            <ul className="list-disc list-inside space-y-2 text-amber-700">
              <li><strong>SNSプロフィール画像</strong>：Twitter、Instagram、Facebookのアイコンに</li>
              <li><strong>ビジネスプロフィール</strong>：LinkedIn、Slack、Zoomのプロフィール画像</li>
              <li><strong>ゲームアバター</strong>：Steam、Discord、各種ゲームプラットフォーム</li>
              <li><strong>ブログ用アイコン</strong>：ブログ運営者のプロフィール画像</li>
              <li><strong>ECサイト</strong>：ショップオーナーのプロフィール画像</li>
              <li><strong>オンライン授業</strong>：学生・講師のプロフィール画像</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              アイコン作成のコツ
            </h2>
            <div className="bg-amber-50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm">
                <li><strong>写真選び</strong>：正面を向いた明るい写真がおすすめ</li>
                <li><strong>表情</strong>：自然な笑顔で親しみやすい印象に</li>
                <li><strong>背景</strong>：シンプルな背景で人物を際立たせる</li>
                <li><strong>解像度</strong>：高解像度の写真でより美麗なアイコンに</li>
                <li><strong>スタイル選択</strong>：SNSの用途に合ったスタイルを選択</li>
              </ul>
            </div>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              アイコン作成のQ&A
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-amber-800">Q: アイコンは本当に無料で作れますか？</h3>
                <p className="text-amber-700 text-sm">A: はい、完全無料でアイコンを作成できます。登録や課金は一切不要です。</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-800">Q: 商用利用は可能ですか？</h3>
                <p className="text-amber-700 text-sm">A: はい、作成したアイコンは商用利用可能です。ビジネス用にもご活用ください。</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-800">Q: どんな写真でも使えますか？</h3>
                <p className="text-amber-700 text-sm">A: JPEG/PNG形式の写真であれば利用可能です。正面を向いた明るい写真が最適です。</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-800">Q: アイコンのサイズは選べますか？</h3>
                <p className="text-amber-700 text-sm">A: はい、各種SNSに最適化されたサイズから選択可能です。</p>
              </div>
            </div>
          </section>



          <section className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/workspace" className="btn-kawaii text-xl px-8 py-4">
                今すぐアニメアイコンを作る ✨
              </Link>
              <Link href="/share" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                ギャラリーを見る 🖼️
              </Link>
            </div>
          </section>

          {/* 関連コンテンツ */}
          <section className="card-kawaii p-8 mt-12">
            <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center">関連コンテンツ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/ai-image-generation-guide" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-amber-800 mb-2">AI画像生成 初心者ガイド</h3>
                <p className="text-amber-700 text-sm">写真をアニメ風に変換する完全ガイド</p>
              </Link>
              
              <Link href="/line-sticker-creation" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-amber-800 mb-2">LINEスタンプ作り方</h3>
                <p className="text-amber-700 text-sm">写真を可愛いLINEスタンプに無料変換</p>
              </Link>
              
              <Link href="/chibi-character-maker" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-amber-800 mb-2">Chibiキャラクター作成</h3>
                <p className="text-amber-700 text-sm">可愛いchibiキャラをAIで作る</p>
              </Link>
              
              <Link href="/ai-image-conversion-free" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-amber-800 mb-2">AI画像変換 無料比較</h3>
                <p className="text-amber-700 text-sm">無料AI画像変換ツールを徹底比較</p>
              </Link>
              
              <Link href="/personification-ai" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-amber-800 mb-2">擬人化 AI 活用術</h3>
                <p className="text-amber-700 text-sm">ペットやオブジェクトを擬人化する方法</p>
              </Link>
              
              <Link href="/anime-icon-creation" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-amber-800 mb-2">アイコン作成 無料</h3>
                <p className="text-amber-700 text-sm">SNS用アニメアイコンを無料で作成</p>
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