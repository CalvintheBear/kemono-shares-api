import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nanobanana AI画像生成 ギャラリー | AI プロンプト 作例集 - 2kawaii",
  description: "Nanobanana AI プロンプトで作られた画像生成の最新作例を毎日公開。Nanobanana AI画像生成 サイト 無料・登録不要、数秒で完成。高品質・多彩なスタイル。",
  openGraph: {
    title: "Nanobanana AI画像生成 ギャラリー | AI プロンプト 作例集 - 2kawaii",
    description: "Nanobanana AI プロンプトを活用した画像生成の作例集。無料・登録不要、数秒で完成。高品質・多彩なスタイル。",
    url: "https://2kawaii.com/share",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-gallery.jpg",
        width: 1200,
        height: 630,
    alt: "AI画像生成 ギャラリー | ai プロンプト 作例 - 2kawaii GPT-4o",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanobanana AI画像生成 ギャラリー | AI プロンプト 作例集",
    description: "Nanobanana AI プロンプト × 画像生成の作例が充実。無料・登録不要、数秒で完成。",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-gallery.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/share",
    languages: {
      ja: "https://2kawaii.com/share",
      en: "https://2kawaii.com/en/share",
      "x-default": "https://2kawaii.com/share",
    },
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