import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "../globals.css";
import { structuredData } from "./structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
  description: "Free AI image generator with no registration required. GPT-4o image automatically generates prompts and converts photos to anime style in 2-5 minutes. ChatGPT image generation support.",
  alternates: {
    canonical: "https://2kawaii.com/en",
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
    title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
    description: "Free AI image generator with no registration required. GPT-4o image automatically generates prompts and converts photos to anime style in 2-5 minutes.",
    type: "website",
    url: "https://2kawaii.com/en",
    siteName: "AI Image Converter Tool",
    locale: "en_US",
    images: [
      {
        url: "https://2kawaii.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Free AI Image Converter Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
    description: "Free AI image generator with no registration required. GPT-4o image automatically generates prompts and converts photos to anime style in 2-5 minutes.",
    images: ["https://2kawaii.com/og-image.jpg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        className={`${inter.variable} antialiased font-sans bg-bg text-text`}
      >
        {children}
      </body>
    </html>
  );
}