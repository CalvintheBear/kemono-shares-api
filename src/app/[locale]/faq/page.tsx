import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

// FAQページSEOメタデータ
export const metadata = {
  title: "よくある質問 - kemono-mimi AI画像生成についてのご質問にお答えします",
  description: "kemono-mimi.comのAI画像生成サービスについてのよくある質問と回答をまとめました。無料AI画像変換・写真アニメ化・商用利用可能など、ユーザー様からのご質問に詳しくお答えします。",
  keywords: "kemono-mimi FAQ, AI画像生成 使い方, 写真 アニメ風 変換 質問, 無料 AI画像変換 よくある質問, LINEスタンプ作り方 方法, chibiキャラクター作成 解説, 商用利用可能 AI画像, 1-3分 高速生成, プライバシー 保護, 登録不要 無料ツール",
  openGraph: {
    title: "よくある質問 - kemono-mimi AI画像生成",
    description: "kemono-mimi AI画像生成サービスについてのよくある質問と回答まとめ",
    url: "https://kemono-mimi.com/faq",
    siteName: "kemono-mimi AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-faq.jpg",
        width: 1200,
        height: 630,
        alt: "kemono-mimi AI画像生成 FAQ",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "よくある質問 - kemono-mimi AI画像生成",
    description: "AI画像生成サービスについてのよくある質問と回答まとめ",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-faq.jpg"],
  },
  alternates: {
    canonical: "https://kemono-mimi.com/faq",
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

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: "サービスについて",
    question: "kemono-mimi.comはどのようなサービスですか？",
    answer: "kemono-mimi.comは、AI技術を使って写真や画像を可愛いアニメ調に変換するサービスです。22種類以上のスタイルから選んで、あなたの写真を魅力的なアニメキャラクターに変身させることができます。"
  },
  {
    category: "サービスについて",
    question: "どのようなスタイルがありますか？",
    answer: "擬人化、ジブリ風、可愛い壁紙、ウマ娘、ちびキャラ、萌え化、LINEスタンプ風、異世界、病娇、厚塗り、3D CG、乙女ゲーム、クレヨンしんちゃん、証明写真加工など、22種類以上のスタイルをご用意しています。各スタイルは独特の特徴を持ち、様々な雰囲気に変換できます。"
  },
  {
    category: "利用方法",
    question: "どのように使いますか？",
    answer: "1. シンプルモードで好きなスタイルテンプレートを選ぶか、マニュアルモードでカスタムプロンプトを入力します。2. 変換したい画像をアップロードします。3. 画像サイズを選択します。4. 「変身させる」ボタンを押して、1-3分で完了です！"
  },
  {
    category: "利用方法",
    question: "どのような画像がアップロードできますか？",
    answer: "JPG、PNG、WebP形式の画像で、最大10MBまでアップロード可能です。人物写真、風景、イラストなど、様々な種類の画像に対応しています。ただし、他人の肖像権を侵害する画像や不適切なコンテンツのアップロードは禁止です。"
  },
  {
    category: "料金・無料",
    question: "このサービスは無料ですか？",
    answer: "現在、基本機能はすべて無料でご利用いただけます。ただし、1日の生成回数に制限を設けています。将来的にプレミアム機能を追加する可能性がありますが、基本機能は引き続き無料で提供する予定です。"
  },
  {
    category: "技術的な質問",
    question: "AIはどのように画像を変換するのですか？",
    answer: "最新のGPT-4o Vision AI技術を使用して、画像の特徴を分析し、選択されたスタイルに基づいて新しいアニメ画像を生成します。このプロセスは完全に自動で、ユーザーは1-3分で高品質な結果を得ることができます。"
  },
  {
    category: "技術的な質問",
    question: "生成された画像のクオリティはどうですか？",
    answer: "高品質な4K解像度の画像が生成されます。細部まで美しく描かれ、プロフェッショナルな仕上がりを実現しています。各スタイルは専門的に調整されており、自然で魅力的な結果を提供します。"
  },
  {
    category: "プライバシー",
    question: "アップロードした画像はどうなりますか？",
    answer: "アップロードされた画像はAI処理のためだけに一時的に使用され、処理完了後は完全に削除されます。画像は当社のサーバーに保存されることはありませんので、プライバシーは完全に保護されます。"
  },
  {
    category: "プライバシー",
    question: "個人情報はどのように扱われますか？",
    answer: "IPアドレスやブラウザ情報などの基本的な情報のみをサービス運営のために収集し、個人を特定できる情報は一切保存しません。詳細はプライバシーポリシーをご確認ください。"
  },
  {
    category: "トラブルシューティング",
    question: "画像がうまく変換されない場合はどうすればいいですか？",
    answer: "以下をお試しください：1. 画像サイズを10MB以下にする。2. 画像フォーマットをJPG、PNG、WebPにする。3. ネットワーク接続を確認する。4. しばらく待ってから再試行する。それでも解決しない場合は、お問い合わせフォームからご連絡ください。"
  },
  {
    category: "トラブルシューティング",
    question: "生成に時間がかかる場合がありますか？",
    answer: "通常1-3分で完了しますが、サーバー混雑時は5分程度かかる場合があります。5分以上経過しても完了しない場合は、ページを更新してもう一度お試しください。"
  },
  {
    category: "著作権",
    question: "生成された画像の著作権は誰にありますか？",
    answer: "生成された画像の著作権はユーザーに帰属します。ユーザーは自由に使用、ダウンロード、共有することができます。ただし、生成された画像を商業目的で使用する際は、第三者の権利を侵害しないようご注意ください。"
  },
  {
    category: "著作権",
    question: "有名人の写真を使っても大丈夫ですか？",
    answer: "有名人の写真を使用する際は、肖像権に十分ご注意ください。個人のSNS等での使用は問題ありませんが、商業目的での使用や公の場での配布は肖像権侵害となる可能性があります。"
  },
  {
    category: "著作権",
    question: "AI生成画像と実在の人物や作品との類似性について",
    answer: "当サイトで生成されるすべての画像はAI技術により作成されたものです。実在の人物や作品との類似性は偶然であり、意図的な模倣ではありません。生成画像の使用により第三者との間で紛争が生じた場合、当サイトは一切の責任を負いません。詳細は利用規約の第6条の2をご確認ください。"
  },
  {
    category: "技術仕様",
    question: "対応している画像サイズは？",
    answer: "1:1（正方形）、3:2（横長）、2:3（縦長）の3種類から選択可能です。元画像のアスペクト比に応じて最適なサイズをお選びください。"
  },
  {
    category: "技術仕様",
    question: "最大何枚の画像を処理できますか？",
    answer: "現在、1日あたり10枚まで無料で処理可能です。この制限は混雑状況により変更される場合があります。"
  },
  {
    category: "モバイル対応",
    question: "スマートフォンでも使えますか？",
    answer: "はい、完全にモバイル対応しています。スマートフォンやタブレットからでも、PCと同じようにすべての機能をご利用いただけます。"
  },
  {
    category: "今後のアップデート",
    question: "新しいスタイルは追加されますか？",
    answer: "はい、定期的に新しいスタイルを追加していく予定です。ユーザーの要望も取り入れながら、より多様な表現ができるように進化させていきます。"
  }
]

// const categories = [...new Set(faqData.map(item => item.category))]

export default function FAQPage() {
  // サーバーコンポーネントとして動作

  return (
    <div className="min-h-screen bg-[#fff7ea]">
      {/* JSON-LD 構造化データ埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            name: 'よくある質問 - kemono-mimi AI画像生成',
            description: 'kemono-mimi.comのAI画像生成サービスについてのよくある質問と回答',
            url: 'https://kemono-mimi.com/faq',
            mainEntity: faqData.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          }),
        }}
      />
      
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-amber-800 mb-4 font-cute">
            よくある質問
          </h1>
          <p className="text-lg text-amber-700 font-cute max-w-2xl mx-auto">
            kemono-mimi.comのサービスについて、よくいただくご質問にお答えします。
            お困りごとがあれば、まずこちらをご確認ください。
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="w-full px-6 py-4 text-left">
                <div className="flex-1 pr-4 mb-4">
                  <p className="font-semibold text-amber-800 font-cute">{faq.question}</p>
                  <p className="text-xs text-amber-600 mt-1">{faq.category}</p>
                </div>
                <div className="px-0 py-4 border-t border-amber-100">
                  <p className="text-gray-700 leading-relaxed font-cute">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 追加情報 */}
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-amber-800 mb-4 font-cute">
            ご質問が解決しませんでしたか？
          </h2>
          <p className="text-amber-700 mb-6 font-cute">
            その他のご質問やお困りごとがございましたら、お気軽にお問い合わせください。
          </p>
          <div className="space-y-4"
          >
            <a
              href="mailto:support@kemono-mimi.com"
              className="inline-block bg-gradient-to-r from-pink-500 to-amber-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
            >
              📧 メールでお問い合わせ
            </a>
            <p className="text-sm text-amber-600"
            >
              通常24時間以内にご返信いたします
            </p>
          </div>
        </div>

        {/* クイックリンク */}
        <div className="mt-8 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50"
          >
            <h3 className="text-lg font-bold text-amber-800 mb-3 font-cute">📖 重要なリンク</h3>
            <ul className="space-y-2 text-amber-700"
            >
              <li><Link href="/privacy" className="hover:text-pink-600 transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="hover:text-pink-600 transition-colors">利用規約</Link></li>
              <li><Link href="/workspace" className="hover:text-pink-600 transition-colors">サービスを始める</Link></li>
            </ul>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50"
          >
            <h3 className="text-lg font-bold text-amber-800 mb-3 font-cute">🚀 今すぐ始める</h3>
            <p className="text-amber-700 text-sm mb-3"
            >
              まずは無料でお試しください！簡単3ステップであなたの写真をアニメに。
            </p>
            <Link
              href="/workspace"
              className="inline-block bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-md transition-all"
            >
              今すぐ変換する
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}