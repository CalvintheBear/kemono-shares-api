import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { structuredData } from "./structured-data";

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Nanobanana AI画像生成 無料 | 写真をアニメ風に変換 - 2kawaii",
  description: "Nanobanana AI画像生成 サイト 無料 登録不要。Nanobanana Editモデルで写真を数秒でアニメ風に変換。高品質・商用利用可・プロンプト自動生成対応。",
  alternates: {
    canonical: "https://2kawaii.com",
    languages: {
      ja: "https://2kawaii.com",
      en: "https://2kawaii.com/en",
      "x-default": "https://2kawaii.com",
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  openGraph: {
    title: "Nanobanana AI画像生成 無料 | 写真をアニメ風に変換 - 2kawaii",
    description: "Nanobanana AI画像生成 サイト 無料 登録不要。Nanobanana Editモデルで写真を数秒でアニメ風に即変換。高品質・商用利用可。",
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
    title: "Nanobanana AI画像生成 無料 | 写真をアニメ風に変換 - 2kawaii",
    description: "Nanobanana AI画像生成 サイト 無料 登録不要。Nanobanana Editモデルで数秒でアニメ風に変換。",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5NDBFPCYV4"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5NDBFPCYV4');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              structuredData.website,
              structuredData.organization,
              structuredData.softwareApplication,
              structuredData.breadcrumb
            ])
          }}
        />
      </head>
      <body
        className={`${notoSans.variable} antialiased font-sans bg-bg text-text`}
      >
        {children}
      </body>
    </html>
  );
}
