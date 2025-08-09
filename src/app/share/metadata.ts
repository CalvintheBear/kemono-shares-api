import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI画像生成 ギャラリー | チャットGPT 画像生成・無料サイト - 2kawaii",
  description: "チャットGPT 画像生成の最新作品を毎日公開。ai画像生成 サイト 無料 登録不要で1-3分。ジブリ風・VTuber・chibiなど多彩な作例をチェック。写真加工アプリ無料の代わりにブラウザだけでOK。",
  openGraph: {
    title: "AI画像生成 ギャラリー | チャットGPT 画像生成・無料サイト - 2kawaii",
    description: "ai画像生成 サイト 無料 登録不要。チャットGPT 画像生成の作例集。ジブリ風・VTuber・chibiなど多彩なスタイル。写真加工アプリ無料の代替として1-3分で完成。",
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
    title: "AI画像生成 ギャラリー | チャットGPT 画像生成・無料サイト",
    description: "ai画像生成 サイト 無料 登録不要。チャットGPT 画像生成の作例が充実。写真加工アプリ無料の代わりにブラウザで完結。",
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