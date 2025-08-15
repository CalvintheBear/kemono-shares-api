'use client'

import { useState, useEffect } from 'react'
// import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqDataJa = [
  {
    id: 1,
    question: "AI画像変換は本当に無料で使えるの？",
    answer: "はい、AI画像生成は完全無料です。登録不要・隠れ課金なし。生成した画像は商用利用も可能です。"
  },
  {
    id: 2,
    question: "対応ファイルと制限は？",
    answer: "JPG / PNG / WebP に対応、最大10MB。サイズ比率は 1:1 / 3:2 / 2:3 のほか、Flux Kontext では 16:9 / 9:16 / 4:3 / 3:4  にも対応しています。"
  },
  {
    id: 3,
    question: "アップロードした画像は安全？",
    answer: "プライバシー最優先。処理後は自動削除され第三者と共有しません。生成画像は14日で期限切れ（外部API仕様）ですが、公開用URLはR2へ安全に保存します。"
  },
  {
    id: 4,
    question: "どれくらいで完了する？",
    answer: "通常は数秒で完了します（Flux Kontext）。混雑時でも概ね1分以内。GPT‑4o Image も対応しています。"
  },
  {
    id: 5,
    question: "商用利用はできる？",
    answer: "はい、可能です。SNSアイコン、プロフィール、VTuber立ち絵、擬人化キャラ、LINEスタンプなど幅広く利用できます（権利侵害は不可）。"
  },
  {
    id: 6,
    question: "スマホでも使える？",
    answer: "はい。スマホ/タブレット/PC すべてで快適に使えます。UI はモバイル最適化済みで、テンプレート選択も直感的です。"
  },
  {
    id: 7,
    question: "人物以外も変換できる？",
    answer: "できます。動物やオブジェクトの擬人化、chibi 化、壁紙パターン生成など多用途に対応します。"
  },
  {
    id: 8,
    question: "結果が微妙だったら？",
    answer: "別のテンプレートへ切替、またはプロンプト微調整がおすすめ。Flux Kontext では縦横比を変えて再生成すると改善することがあります。"
  },
  {
    id: 9,
    question: "複数同時に処理できる？",
    answer: "現在は1枚ずつです。複数画像の一括処理は今後のアップデートで検討中です。"
  },
  {
    id: 10,
    question: "解像度や縦横比は？",
    answer: "縦横比はモデルにより選択可能。GPT‑4o Image は 1:1 / 3:2 / 2:3、Flux Kontext は 1:1 / 4:3 / 3:4 / 16:9 / 9:16  を提供します。"
  },
  {
    id: 11,
    question: "他サービスと比べた強みは？",
    answer: "Flux Kontext による数秒生成、豊富な縦横比、R2 永久URLへの自動保存、シェア機能、登録不要が特長です。"
  },
  {
    id: 12,
    question: "うまくいかない時は？",
    answer: "画像サイズ（≤10MB）と形式（JPG/PNG/WebP）を確認し、ネットワークを見直してください。1分以上完了しない場合は再実行をお試しください。"
  }
]

const faqDataEn = [
  {
    id: 1,
    question: "Is it really free?",
    answer: "Yes. Completely free, no signup, no hidden fees. You can use generated images commercially."
  },
  {
    id: 2,
    question: "File formats and limits?",
    answer: "JPG / PNG / WebP up to 10MB. Aspect ratios: GPT‑4o Image supports 1:1 / 3:2 / 2:3; Flux Kontext also supports 16:9 / 9:16 / 4:3 / 3:4."
  },
  {
    id: 3,
    question: "Is my upload safe?",
    answer: "We prioritize privacy. Source files are deleted after processing and never shared. Generated images expire in 14 days on the external API, and public URLs are safely stored on R2."
  },
  {
    id: 4,
    question: "How long does it take?",
    answer: "Usually seconds with Flux Kontext; typically within a minute even under load. GPT‑4o Image is also supported."
  },
  {
    id: 5,
    question: "Commercial use?",
    answer: "Allowed. Use for SNS icons, profiles, VTuber models, personified characters, LINE stickers, etc. (no infringement)."
  },
  {
    id: 6,
    question: "Mobile support?",
    answer: "Yes. Works great on smartphone / tablet / PC. Mobile‑first UI with intuitive template selection."
  },
  {
    id: 7,
    question: "Non‑human subjects?",
    answer: "Yes. Pet/object personification, chibi, wallpaper patterns and more are supported."
  },
  {
    id: 8,
    question: "Not satisfied with the result?",
    answer: "Try a different template or tweak the prompt. With Flux Kontext, changing the aspect ratio often improves results."
  },
  {
    id: 9,
    question: "Batch processing?",
    answer: "Currently one image at a time. Batch mode is under consideration for future updates."
  },
  {
    id: 10,
    question: "Resolution and aspect ratio?",
    answer: "Aspect ratios vary by model: GPT‑4o Image (1:1 / 3:2 / 2:3) and Flux Kontext (1:1 / 4:3 / 3:4 / 16:9 / 9:16)."
  },
  {
    id: 11,
    question: "Why 2kawaii?",
    answer: "Seconds‑fast Flux Kontext, rich aspect ratios, automatic R2 permanent URLs, built‑in share pages, and no signup."
  },
  {
    id: 12,
    question: "Troubleshooting?",
    answer: "Check file size (≤10MB) and type (JPG/PNG/WebP), then network. If it doesn’t finish within a minute, try again."
  }
]

export default function FAQ() {
  const [isVisible, setIsVisible] = useState(false)
  const isEnglish = typeof window !== 'undefined' && /^\/en(\/|$)/.test(window.location.pathname)
  const faqData = isEnglish ? faqDataEn : faqDataJa

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
            {isEnglish ? 'FAQ — AI Image Conversion' : 'AI画像変換 よくある質問'}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-text-muted leading-relaxed">
            {isEnglish ? 'Frequently asked questions about photo‑to‑anime AI conversion' : 'AI画像変換・写真アニメ化についてのよくある質問をまとめました'}
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