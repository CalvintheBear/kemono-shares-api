import type { Metadata } from "next";
import { Quicksand, Comic_Neue } from "next/font/google";
import "./globals.css";

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
  title: "アニメ変身ツール | 写真を可愛いアニメキャラクターに変身",
  description: "あなたの写真を可愛いアニメキャラクターに変身させる無料ツール。6種類のスタイルから選択可能。登録不要・簡単操作。",
  keywords: "アニメ, 変身, AI, 写真, キャラクター, 無料, ツール",
  openGraph: {
    title: "アニメ変身ツール",
    description: "写真を可愛いアニメキャラクターに変身させよう！",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${quicksand.variable} ${comicNeue.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
