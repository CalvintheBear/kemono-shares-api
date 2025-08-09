import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI画像生成 無料 ギャラリー | gpt4o image プロンプト作品 - 2kawaii",
  description: "GPT-4oで生成されたAI画像ギャラリー。プロンプト自動作成でジブリ風・VTuber・chibiなど20+スタイルの作品を無料閲覧。",
  openGraph: {
    title: "AI画像生成 無料 ギャラリー | gpt4o image プロンプト作品 - 2kawaii",
    description: "GPT-4oで生成されたAI画像ギャラリー。プロンプト自動作成でジブリ風・VTuber・chibiなどの作品を無料閲覧。",
    url: "https://2kawaii.com/share",
    siteName: "2kawaii AI画像生成",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-gallery.jpg",
        width: 1200,
        height: 630,
        alt: "AI画像生成 無料 ギャラリー - 2kawaii GPT-4o",
      }
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI画像生成 無料 ギャラリー | gpt4o image プロンプト作品 - 2kawaii",
    description: "GPT-4oで生成されたAI画像ギャラリー。プロンプト自動作成でジブリ風・VTuber・chibiなどの作品を無料閲覧。",
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