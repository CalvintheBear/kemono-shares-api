import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI画像生成 ギャラリー | チャットGPT・ai プロンプト 作例集 - 2kawaii",
  description: "AI プロンプトで作られたチャットGPT 画像生成の最新作例を毎日公開。AI画像生成 サイト 無料・登録不要、1-3分で完成。ジブリ風・VTuber・chibiなど多彩なスタイル。",
  openGraph: {
    title: "AI画像生成 ギャラリー | チャットGPT・ai プロンプト 作例集 - 2kawaii",
    description: "AI プロンプトを活用したチャットGPT 画像生成の作例集。無料・登録不要、1-3分で完成。ジブリ風・VTuber・chibiなど。",
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
    title: "AI画像生成 ギャラリー | チャットGPT・ai プロンプト 作例集",
    description: "AI プロンプト × チャットGPT 画像生成の作例が充実。無料・登録不要、1-3分で完成。",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-gallery.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/share",
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