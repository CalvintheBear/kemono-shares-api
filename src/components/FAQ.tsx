'use client'

import { useState, useEffect } from 'react'
// import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqData = [
  {
    id: 1,
    question: "AI画像変換は本当に無料で使えるの？",
    answer: "はい、AI画像生成が完全に無料でご利用いただけます。登録不要・隠れた課金なし、商用利用も可能なAI画像変換ツールです。"
  },
  {
    id: 2,
    question: "AI画像変換に対応している画像ファイルは？",
    answer: "JPG、PNG、WebP形式の画像ファイルに対応しており、最大10MBまでのAI画像生成が可能です。1:1、2:3、3:2のサイズ比率で高画質なアニメ画像が作成できます。"
  },
  {
    id: 3,
    question: "AI画像変換でアップロードした画像は安全？",
    answer: "お客様のプライバシーを最優先に考えています。アップロードされた画像はAI画像変換処理後すぐに自動削除され、第三者に共有されることは一切ありません。"
  },
  {
    id: 4,
    question: "写真をアニメ風に変換するのにどれくらい時間がかかる？",
    answer: "AI画像変換は通常2-5分程度で完了します。写真をアニメ風に変換する処理時間は画像サイズや複雑さにより異なりますが、写真加工アプリよりも高速です。"
  },
  {
    id: 5,
    question: "AI画像生成したアニメ画像は商用利用可能？",
    answer: "はい！AI画像生成したアニメ画像は商用利用可能です。SNSアイコン、プロフィール画像、VTuber立ち絵、擬人化キャラクター制作など、幅広くご利用ください。"
  },
  {
    id: 6,
    question: "スマートフォンからでもAI画像変換は利用可能？",
    answer: "はい、スマートフォン、タブレット、PCのどのデバイスからでもAI画像変換をご利用いただけます。レスポンシブデザインで最適化されており、chibiキャラクター作成も簡単です。"
  },
  {
    id: 7,
    question: "人物以外の画像でもアニメ風に変換できますか？",
    answer: "人物の画像で最高の結果が得られるAI画像変換ですが、動物やキャラクターの擬人化、chibi化も可能です。ペットやオリジナルキャラクターをアニメ風に変換してみてください。"
  },
  {
    id: 8,
    question: "AI画像変換の結果が気に入らない場合は？",
    answer: "別のアニメスタイルを選択して再度AI画像変換をお試しいただけます。ジブリ風、VTuber風、美少女、chibiなど20種類以上のスタイルから選択可能です。"
  },
  {
    id: 9,
    question: "一度に複数の写真をAI画像変換できますか？",
    answer: "現在のバージョンでは一度に1枚ずつのAI画像変換となります。複数の写真をアニメ風に変換したい場合は、1枚ずつ処理をお願いします。"
  },
  {
    id: 10,
    question: "AI画像生成したアニメ画像の解像度は？",
    answer: "AI画像生成するアニメ画像は1:1、2:3、3:2のサイズ比率で作成され、元画像の解像度を保持します。高解像度の写真をアップロードすることで、より鮮明なアニメ画像が作成できます。"
  },
  {
    id: 11,
    question: "チャットGPT画像生成との違いは何ですか？",
    answer: "当AI画像変換ツールは写真を直接アニメ風に変換するため、チャットGPT画像生成よりも簡単で速く、登録不要で即座にご利用いただけます。プロンプト入力も不要です。"
  },
  {
    id: 12,
    question: "AI画像変換でエラーが発生した場合はどうすればいい？",
    answer: "AI画像変換で技術的な問題が発生した場合は、画像サイズや形式を確認していただくか、お問い合わせフォームからご連絡ください。AI画像生成の改善に努めています。"
  }
]

export default function FAQ() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 页面加载后触发渐入效果
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="faq" className={`px-4 sm:px-6 lg:px-8 bg-surface transition-all duration-1000 ease-out animate-fade-in ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text font-cute mb-6 lg:mb-8">
            AI画像変換 よくある質問
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-text-muted leading-relaxed">
            AI画像変換・写真アニメ化についてのよくある質問をまとめました
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {faqData.map((faq, index) => (
            <div 
              key={faq.id} 
              className="card overflow-hidden shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.7 + index * 0.1}s` }}
            >
              <div className="w-full px-6 sm:px-8 py-4 sm:py-6 text-left hover:bg-surface transition-colors duration-200">
                <h3 className="font-semibold text-text font-cute pr-4 text-sm sm:text-base lg:text-lg leading-relaxed mb-3">
                  {faq.question}
                </h3>
                <div className="px-0 sm:px-0 pb-2 sm:pb-2">
                  <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
} 