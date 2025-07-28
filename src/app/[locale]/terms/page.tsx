import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

// 利用規約SEOメタデータ
export const metadata = {
  title: "利用規約 - 2kawaii AI画像生成サービス",
      description: "2kawaii.comの利用規約。AI画像生成サービスの利用条件、著作権、免責事項、禁止事項について詳しく説明します。",
      keywords: "2kawaii 利用規約, AI画像生成 利用条件, 著作権 ポリシー, 商用利用 規約, 禁止事項, 免責事項, AI生成画像 権利, サービス利用規約, 無料ツール 規約, ユーザー責任",
      openGraph: {
    title: "利用規約 - 2kawaii AI画像生成",
    description: "2kawaii AI画像生成サービスの利用規約詳細",
    url: "https://2kawaii.com/terms",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-terms.jpg",
        width: 1200,
        height: 630,
        alt: "2kawaii 利用規約",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "利用規約 - 2kawaii AI画像生成",
    description: "AI画像生成サービスの利用規約詳細",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-terms.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/terms",
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fff7ea]">
      {/* JSON-LD 構造化データ埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '利用規約 - 2kawaii AI画像生成',
                description: '2kawaii.comの利用規約詳細説明',
    url: 'https://2kawaii.com/terms',
            datePublished: '2024-07-26',
            dateModified: '2024-07-26'
          }),
        }}
      />
      
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 lg:p-12 border border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-amber-800 mb-4 font-cute">
              利用規約
            </h1>
            <p className="text-lg text-amber-700 font-cute">
              2kawaii.com のご利用条件
            </p>
          </div>

          <div className="space-y-8 text-gray-700 font-cute">
            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第1条（適用）</h2>
              <p className="leading-relaxed">
                本利用規約（以下「本規約」といいます）は、2kawaii.com（以下「当サイト」といいます）
                が提供するAI画像生成サービスの利用条件を定めるものです。
                ユーザーは、本規約に同意のうえ、当サイトのサービスをご利用ください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第2条（定義）</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>「サービス」とは、当サイトが提供するAI画像生成サービスを指します。</li>
                <li>「ユーザー」とは、本規約に同意のうえ、サービスを利用する個人を指します。</li>
                <li>「コンテンツ」とは、ユーザーがアップロードする画像および生成される画像を指します。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第3条（利用登録）</h2>
              <p className="leading-relaxed">
                サービスの利用を希望する者（以下「登録希望者」といいます）は、
                本規約を遵守することに同意のうえ、当サイトの定める方法により利用登録を申請し、
                当サイトがこれを承認することによって、利用登録が完了するものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第4条（禁止事項）</h2>
              <p className="leading-relaxed mb-4">
                ユーザーは、サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
                <li>他のユーザーの個人情報等を収集または蓄積する行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>当サイトのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                <li>著作権、商標権等の知的財産権を侵害する行為</li>
                <li>肖像権、プライバシー権等の他人の権利を侵害するコンテンツのアップロード</li>
                <li>暴力的、残虐的、猥褻的、差別的なコンテンツのアップロード</li>
                <li>未成年者に不適切なコンテンツのアップロード</li>
                <li>その他、当サイトが不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第5条（サービスの内容）</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">5.1 サービス概要</h3>
                  <p className="leading-relaxed">
                    当サイトは、ユーザーがアップロードした画像をAI技術を用いてアニメ調に変換するサービスを提供します。
                    生成された画像は、ユーザーが指定したスタイルに基づいて処理されます。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">5.2 利用制限</h3>
                  <p className="leading-relaxed">
                    1日あたりの画像生成回数に制限を設ける場合があります。
                    商用利用については別途お問い合わせください。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第5条（画像の取扱い・利用権）</h2>
              <p className="leading-relaxed">
                当サイトは、ユーザーがアップロードした元画像を一切保存・収集しません。ただし、AI変換後の生成画像については、サービスの品質向上・プロモーション・事例紹介等の目的で、当サイトが無償で利用・公開できるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第6条（知的財産権）</h2>
              <p className="leading-relaxed">
                ユーザーがアップロードした画像に関する著作権は、ユーザーまたは正当な権利者に留保されます。
                ただし、ユーザーは当サイトに対し、アップロードした画像をAI処理のために必要な範囲で使用することを許諾するものとします。
                生成された画像の著作権は、ユーザーに帰属します。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第6条の2（AI生成画像に関する免責事項）</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-700 leading-relaxed">
                  <span className="font-semibold">※ 重要なお知らせ：</span>
                  当サイトで生成されるすべての画像はAI技術により作成されたものです。実在の人物や作品との類似性は偶然であり、意図的な模倣ではありません。
                </p>
              </div>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  当サイトのAI画像生成サービスにより作成される画像（以下「生成画像」といいます）に関して、以下の免責事項を定めます：
                </p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>生成画像はAI技術により自動的に作成されるものであり、実在の人物、キャラクター、作品との類似性は偶然によるもので、意図的な模倣ではありません。</li>
                  <li>生成画像の内容、品質、特定の目的への適合性について、当サイトは一切の保証を行いません。</li>
                  <li>生成画像の使用により第三者との間で紛争が生じた場合、当サイトは一切の責任を負いません。</li>
                  <li>ユーザーは生成画像を使用する際、適切な用途で利用し、第三者の権利を侵害しないよう十分ご注意ください。</li>
                  <li>商用利用や公的機関での使用については、事前に当サイトまでご相談ください。</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第7条（免責事項）</h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  当サイトは、サービスの内容、提供される画像の品質、特定の目的への適合性について、
                  いかなる保証も行いません。
                </p>
                <p className="leading-relaxed">
                  当サイトは、サービスの利用によりユーザーに生じた損害について、一切の責任を負いません。
                  ただし、当サイトの故意または重過失による場合はこの限りではありません。
                </p>
                <p className="leading-relaxed">
                  当サイトは、予告なくサービスの内容を変更、一時停止または中止することがあります。
                  これによりユーザーに生じた損害について、当サイトは一切の責任を負いません。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第8条（サービスの変更・終了）</h2>
              <p className="leading-relaxed">
                当サイトは、ユーザーに事前に通知することなく、サービスの内容を変更、追加または廃止することがあります。
                また、当サイトは、ユーザーに事前に通知することなく、サービスの提供を一時停止または終了することがあります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第9条（本規約の変更）</h2>
              <p className="leading-relaxed">
                当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                変更後の本規約は、当サイトに掲載された時点から効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第10条（準拠法・裁判管轄）</h2>
              <p className="leading-relaxed">
                本規約の解釈にあたっては、日本法を準拠法とします。
                サービスに関して紛争が生じた場合には、当サイトの本店所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">第11条（お問い合わせ）</h2>
              <p className="leading-relaxed">
                本利用規約に関するお問い合わせは、以下のメールアドレスまでお願いいたします。
              </p>
              <p className="mt-2 font-semibold text-amber-700">
                メール: support@2kawaii.com
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-amber-200 text-center">
              <p className="text-sm text-gray-500 mb-6">
                最終更新日: 2025年7月24日
              </p>
              
              {/* CTA Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mt-8">
                <h3 className="text-xl font-bold text-amber-800 mb-4">🚀 利用規約に同意して今すぐ開始</h3>
                <p className="text-amber-700 mb-6">安全で安心なAI画像変換サービスをお楽しみください</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/workspace" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    今すぐ始める
                  </Link>
                  <Link href="/share" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    ギャラリーを見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}