'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqData = [
  {
    id: 1,
    question: "アニメ変身ツールは本当に無料で使えるの？",
    answer: "はい、完全に無料でご利用いただけます。登録も不要で、隠れた課金もありません。すべての機能を制限なくお使いいただけます。"
  },
  {
    id: 2,
    question: "どのような画像ファイルに対応していますか？",
    answer: "JPG、PNG、WebP形式の画像ファイルに対応しています。最大ファイルサイズは10MBまでで、推奨解像度は512x512以上です。"
  },
  {
    id: 3,
    question: "アップロードした画像は安全に処理されますか？",
    answer: "お客様のプライバシーを最優先に考えています。アップロードされた画像は処理後すぐに自動削除され、第三者に共有されることはありません。"
  },
  {
    id: 4,
    question: "変身処理にはどのくらい時間がかかりますか？",
    answer: "通常、画像の変身処理は15〜60秒程度で完了します。画像のサイズや複雑さ、サーバーの混雑状況により多少前後する場合があります。"
  },
  {
    id: 5,
    question: "生成された画像の商用利用は可能ですか？",
    answer: "個人利用は自由にお使いいただけます。商用利用については、生成された画像の内容や用途により制限がある場合がありますので、詳細は利用規約をご確認ください。"
  },
  {
    id: 6,
    question: "スマートフォンからでも利用できますか？",
    answer: "はい、スマートフォン、タブレット、PCのどのデバイスからでもご利用いただけます。レスポンシブデザインで最適化されており、快適にお使いいただけます。"
  },
  {
    id: 7,
    question: "人物以外の画像でも変身できますか？",
    answer: "人物の画像で最高の結果が得られるよう設計されていますが、動物やキャラクターの画像でも興味深い結果が得られる場合があります。ぜひお試しください。"
  },
  {
    id: 8,
    question: "変身結果が気に入らない場合はどうすればいいですか？",
    answer: "別のスタイルを選択して再度お試しいただくか、異なる角度や明るさの画像を使用することで、より良い結果が得られる場合があります。"
  },
  {
    id: 9,
    question: "一度に複数の画像を処理できますか？",
    answer: "現在のバージョンでは一度に1枚の画像の処理となります。複数の画像を変身させたい場合は、お手数ですが1枚ずつ処理をお願いします。"
  },
  {
    id: 10,
    question: "生成された画像の解像度はどのくらいですか？",
    answer: "生成される画像の解像度は、アップロードされた元画像の解像度に依存します。高解像度の画像をアップロードすることで、より鮮明な結果が得られます。"
  },
  {
    id: 11,
    question: "インターネット接続が不安定な場合はどうなりますか？",
    answer: "処理中にネットワークが切断された場合、処理は中断されます。安定したインターネット接続環境でのご利用をお勧めします。モバイルデータをご利用の場合はデータ使用量にご注意ください。"
  },
  {
    id: 12,
    question: "技術的な問題や不具合を発見した場合はどこに報告すればいいですか？",
    answer: "技術的な問題や改善のご提案がございましたら、お問い合わせフォームからご連絡ください。皆様からのフィードバックをもとに、サービスの向上に努めています。"
  }
]

export default function FAQ() {
  // 默认展开所有FAQ项目
  const [openItems, setOpenItems] = useState<number[]>(faqData.map(item => item.id))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 页面加载后触发渐入效果
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section id="faq" className={`px-4 sm:px-6 lg:px-8 bg-[#fff7ea] transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-800 font-cute mb-6 lg:mb-8">
            よくある質問
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-amber-700 leading-relaxed">
            アニメ変身ツールについてのよくある質問をまとめました
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {faqData.map((faq, index) => (
            <div 
              key={faq.id} 
              className="card-kawaii overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.7 + index * 0.1}s` }}
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 sm:px-8 py-4 sm:py-6 text-left flex items-center justify-between hover:bg-amber-50 transition-colors"
              >
                <h3 className="font-semibold text-amber-800 font-cute pr-4 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {faq.question}
                </h3>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-amber-600 transition-transform duration-300 ${
                    openItems.includes(faq.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openItems.includes(faq.id) && (
                <div className="px-6 sm:px-8 pb-4 sm:pb-6 animate-fade-in">
                  <p className="text-sm sm:text-base text-amber-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 追加情報 */}
        <div className="text-center mt-12 card-kawaii p-6">
          <h3 className="text-xl font-bold text-amber-800 font-cute mb-3">
            他にご質問がございますか？
          </h3>
          <p className="text-amber-700 mb-4">
            上記以外のご質問やご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
          <button className="btn-kawaii">
            お問い合わせする
          </button>
        </div>
      </div>
    </section>
  );
} 