import type { Metadata } from "next";
import { Quicksand, Comic_Neue } from "next/font/google";
import "./globals.css";
import { structuredData } from "./structured-data";


const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "AI画像変換 無料 | 写真をアニメ風に変換 - 登録不要・商用利用可能",
  description: "【完全無料】AI画像生成で写真をアニメ風に変換！登録不要、商用利用可能なAI画像変換ツール。ジブリ風、VTuber風、美少女、chibiなど20種類以上のアニメスタイルから選択可能。今すぐ無料で自分の写真を可愛いアニメキャラに変身させよう！",
  keywords: "AI画像変換, AI画像生成, 写真 アニメ化, AI画像生成 無料, アニメ風画像作成, 写真 AI アニメ変換, 自分 写真 アニメ風, AI画像生成 無料 登録不要, VTuber 作り方, 擬人化 AI, アイコン 作成, チャットGPT 画像生成, AI 画像生成 サイト 無料 登録不要",
  alternates: {
    canonical: "https://kemono-mimi.com",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  openGraph: {
    title: "AI画像変換 無料 - 写真をアニメ風に即変換！",
    description: "登録不要で写真をアニメ風に無料変換！ジブリ風、VTuber風、美少女アニメなど20種類以上のスタイルから選択可能。",
    type: "website",
    url: "https://kemono-mimi.com",
    siteName: "AI画像変換ツール",
    locale: "ja_JP",
    images: [
      {
        url: "https://kemono-mimi.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI画像変換 無料ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI画像変換 無料 - 写真をアニメ風に即変換！",
    description: "登録不要で写真をアニメ風に無料変換！ジブリ風、VTuber風、美少女アニメなど20種類以上のスタイルから選択可能。",
    images: ["https://kemono-mimi.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              structuredData.website,
              structuredData.organization,
              structuredData.softwareApplication,
              structuredData.faq,
              structuredData.breadcrumb
            ])
          }}
        />
      </head>
      <body
        className={`${quicksand.variable} ${comicNeue.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
