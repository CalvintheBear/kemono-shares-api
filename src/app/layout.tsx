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
  title: "AI画像生成 無料 登録不要 | gpt4o image で写真をアニメ風に変換 - 2kawaii",
  description: "ai画像生成 サイト 無料 登録不要。gpt4o image でプロンプト自動生成、1-3分でアニメ風に変換。チャットgpt 画像生成・画像生成ai 無料に対応。",
  alternates: {
    canonical: "https://2kawaii.com",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  openGraph: {
    title: "AI画像生成 無料 登録不要 | gpt4o image - 2kawaii",
    description: "ai画像生成 サイト 無料 登録不要。プロンプト自動生成で写真をアニメ風に即変換。ジブリ風・VTuber・chibi対応。",
    type: "website",
    url: "https://2kawaii.com",
    siteName: "AI画像変換ツール",
    locale: "ja_JP",
    images: [
      {
        url: "https://2kawaii.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI画像変換 無料ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI画像生成 無料 登録不要 | gpt4o image - 2kawaii",
    description: "ai画像生成 サイト 無料 登録不要。gpt4o image でプロンプト自動生成、1-3分でアニメ風に変換。",
    images: ["https://2kawaii.com/og-image.jpg"],
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
