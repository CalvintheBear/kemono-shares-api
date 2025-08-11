export const structuredData = {
  // Website structured data
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI画像変換 無料 - 2kawaii",
    "alternateName": "写真をアニメ風に変換するAIツール",
    "url": "https://2kawaii.com",
    "description": "登録不要で写真をアニメ風に無料変換できるAI画像生成ツール。ジブリ風、VTuber風、美少女など20種類以上のスタイルから選択可能。",
    "inLanguage": "ja",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
      "urlTemplate": "https://2kawaii.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },

  // Organization structured data
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "2kawaii AI画像変換",
    "url": "https://2kawaii.com",
    "logo": "https://2kawaii.com/logo.png",
    "description": "AI画像生成技術を使って写真をアニメ風に変換する無料ツール",
    "sameAs": [
      "https://twitter.com/furycode_ai",
      "https://instagram.com/furycode_ai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+81-xxx-xxx-xxxx",
      "contactType": "customer service",
      "areaServed": "JP",
      "availableLanguage": "Japanese"
    }
  },

  // Software application structured data
  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI画像変換ツール - 2kawaii",
    "applicationCategory": "GraphicsApplication",
    "description": "写真をアニメ風に変換する無料AI画像生成ツール",
    "url": "https://2kawaii.com",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "写真アニメ化",
      "VTuber作成",
      "chibiキャラクター作成",
      "商用利用可能",
      "登録不要"
    ],
    "screenshot": "https://2kawaii.com/screenshot.jpg"
  },

  // FAQ structured data
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "AI画像変換は本当に無料で使えるの？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、AI画像生成が完全に無料でご利用いただけます。登録不要・隠れた課金なし、商用利用も可能なAI画像変換ツールです。"
        }
      },
      {
        "@type": "Question",
        "name": "AI画像変換に対応している画像ファイルは？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "JPG、PNG、WebP形式の画像ファイルに対応しており、最大10MBまでのAI画像生成が可能です。推奨解像度は512x512以上で、より高画質なアニメ画像が作成できます。"
        }
      },
      {
        "@type": "Question",
        "name": "商用利用は可能ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい！AI画像生成したアニメ画像は商用利用可能です。SNSアイコン、プロフィール画像、VTuber立ち絵、擬人化キャラクター制作など、幅広くご利用ください。"
        }
      }
    ]
  },

  // Breadcrumb structured data
  breadcrumb: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ホーム",
        "item": "https://2kawaii.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI画像変換",
        "item": "https://2kawaii.com/workspace"
      }
    ]
  }
};