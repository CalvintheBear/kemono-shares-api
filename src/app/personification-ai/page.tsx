import type { Metadata } from 'next';
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image'

// 生成静态参数
export function generateStaticParams() {
  return [
    { locale: 'ja' }
  ];
}

export const metadata: Metadata = {
  title: "Nanobanana AI 擬人化 | ペット・キャラを美少女に無料変換",
  description: "【Nanobanana AI】写真をアップロードするだけでペット・キャラクターを美少女に擬人化！猫・犬・モノなどを数秒で可愛いアニメキャラに。無料で商用利用可能。",
  alternates: {
    canonical: "https://2kawaii.com/personification-ai",
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

export default function PersonificationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-8 text-center">
              Nanobanana AI 擬人化 活用術 - ペットやキャラクターを可愛いアニメキャラに変換
            </h1>
            
            <div className="card-kawaii p-8 mb-8">
              <h2 className="text-2xl font-bold text-text mb-6 text-center">擬人化 変身前後の比較</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* 变身前 */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3 font-bold">変身前</p>
                  <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg inline-block">
                    <Image
                      src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-before"
                      alt="擬人化 変身前"
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-auto h-auto max-w-full max-h-96 object-contain"
                      unoptimized
                    />
                  </div>
                </div>
                
                {/* 箭头 */}
                <div className="text-center">
                  <div className="text-3xl text-text-muted font-bold animate-pulse">
                    →
                  </div>
                  <p className="text-sm text-text-muted mt-3 font-cute">
                    AI擬人化
                  </p>
                </div>
                
                {/* 变身后 */}
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-3 font-bold">変身後</p>
                  <div className="bg-surface rounded-lg overflow-hidden border-2 border-border shadow-lg inline-block">
                    <Image
                      src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-after"
                      alt="擬人化 変身後"
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-auto h-auto max-w-full max-h-96 object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  擬人化キャラクター、画像中のオブジェクトの美少女化、創造的なデザイン、可愛い擬人化、個性的な表現
                </p>
              </div>
            </div>
          
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Nanobanana AI 擬人化とは？</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Nanobanana AI 擬人化は、ペットやキャラクター、モノなどを人間のような可愛いアニメキャラクターに変換する最新技術です。
              Nanobanana AI画像生成を使って、あなたの大切なペットやお気に入りのキャラクターを魅力的な擬人化キャラに生まれ変わらせます。
            </p>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Nanobanana AI 擬人化でできること</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li><strong>ペットの擬人化</strong>：愛犬・愛猫を可愛いアニメキャラに</li>
              <li><strong>キャラクター擬人化</strong>：オリジナルキャラを美少女/美少年化</li>
              <li><strong>モノ擬人化</strong>：スマホやパソコンなどを擬人化キャラに</li>
              <li><strong>植物擬人化</strong>：お花や植物を可愛い妖精に変身</li>
              <li><strong>食べ物擬人化</strong>：ケーキやお菓子をキャラクター化</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Nanobanana AI ペット擬人化の作り方</h2>
            <ol className="list-decimal list-inside space-y-3 text-text-muted">
              <li><strong>ペットの写真を準備する</strong>：正面を向いた明るい写真がおすすめ</li>
              <li><strong>Nanobanana AI擬人化スタイルを選択する</strong>：美少女系、美少年系、chibi系など</li>
              <li><strong>Nanobanana AI画像生成を実行する</strong>：数秒で完成</li>
              <li><strong>仕上がりを確認する</strong>：気に入らなければ別スタイルで再生成</li>
              <li><strong>ダウンロードして活用する</strong>：SNSやグッズ制作に活用可能</li>
            </ol>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">人気の擬人化ジャンル</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold text-text mb-2">基本擬人化</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>擬人化 - 基本的な擬人化技術</li>
                  <li>チャットgpt擬人化 - AIキャラクター化</li>
                  <li>擬人化イラスト - イラスト風擬人化</li>
                  <li>擬人化とは - 擬人化の基礎知識</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-text mb-2">動物擬人化</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>猫擬人化 - ツンデレ系美少女/美少年</li>
                  <li>犬擬人化 - 忠犬系キャラクター</li>
                  <li>ペット擬人化 - 愛らしいペットキャラ</li>
                  <li>スライムがあらわれた擬人化 - ファンタジー系</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-2">キャラクター擬人化</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>ポケモン擬人化 - 人気ゲームキャラ化</li>
                  <li>サンリオ擬人化 - 可愛いキャラクター化</li>
                  <li>ちいかわ擬人化 - 人気キャラクター化</li>
                  <li>擬人化アプリ - アプリケーション化</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">擬人化キャラの活用方法</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li><strong>SNSプロフィール画像</strong>：Twitter、Instagram、TikTokのアイコンに</li>
              <li><strong>LINEスタンプ作成</strong>：オリジナルスタンプを制作・販売</li>
              <li><strong>VTuber立ち絵</strong>：配信用のキャラクターとして活用</li>
              <li><strong>同人誌制作</strong>：オリジナルキャラの物語を創作</li>
              <li><strong>グッズ制作</strong>：Tシャツ、マグカップ、ステッカーなど</li>
              <li><strong>ゲームキャラ</strong>：インディーゲームのキャラクターとして</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Nanobanana AI 擬人化の魅力</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li><strong>無料で利用</strong>：完全無料でNanobanana AI擬人化キャラを作成</li>
              <li><strong>商用利用OK</strong>：創作活動やビジネスに活用可能</li>
              <li><strong>高品質</strong>：最新Nanobanana AI技術で美麗な擬人化キャラを生成</li>
              <li><strong>簡単操作</strong>：写真をアップロードするだけで完成</li>
              <li><strong>多様なスタイル</strong>：美少女系からchibi系まで選択可能</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Nanobanana AI 擬人化を使った人気プロジェクト例</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-border pl-4">
                <h3 className="font-bold text-text">ペット擬人化プロジェクト</h3>
                <p className="text-text-muted text-sm">飼い主の愛犬・愛猫を美少女キャラに擬人化し、LINEスタンプとして販売</p>
              </div>
              
              <div className="border-l-4 border-border pl-4">
                <h3 className="font-bold text-text">地方キャラ擬人化</h3>
                <p className="text-text-muted text-sm">地域の名物や観光地を美少女キャラに擬人化、地域活性化に貢献</p>
              </div>
              
              <div className="border-l-4 border-border pl-4">
                <h3 className="font-bold text-text">VTuber立ち絵制作</h3>
                <p className="text-text-muted text-sm">オリジナルキャラクターを擬人化し、VTuberとして配信開始</p>
              </div>
            </div>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Nanobanana AI 擬人化の使い方ガイド</h2>
            <div className="bg-surface p-4 rounded-lg">
              <ol className="list-decimal list-inside space-y-2 text-text-muted text-sm">
                <li>擬人化したい対象の写真を準備（ペット、キャラクター、モノ）</li>
                <li>好みのNanobanana AI擬人化スタイルを選択（美少女、美少年、chibiなど）</li>
                <li>Nanobanana AI画像生成を実行（数秒）</li>
                <li>完成した擬人化キャラをダウンロード</li>
                <li>SNSや創作活動で活用</li>
              </ol>
            </div>
          </section>

          <section className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/workspace" className="btn-kawaii text-xl px-8 py-4">
                今すぐNanobanana AI擬人化キャラを作る 🎭
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