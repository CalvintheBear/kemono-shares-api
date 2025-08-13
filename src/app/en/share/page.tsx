import type { Metadata } from 'next';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import EnShareClientRouter from './router-client'

// Share page SEO metadata for English - aligned with Japanese structure
export const metadata: Metadata = {
  title: "AI Image Generation Gallery | Free Anime Conversion Showcase - 2kawaii",
  description: "Browse our gallery of AI-generated anime images. See examples of photos converted to anime style using GPT-4o. Free to view, get inspired for your own creations.",
  alternates: {
    canonical: "https://2kawaii.com/en/share",
    languages: {
      ja: "https://2kawaii.com/share",
      en: "https://2kawaii.com/en/share",
      "x-default": "https://2kawaii.com/share",
    },
  },
  openGraph: {
    title: "AI Image Generation Gallery | Free Anime Conversion Showcase - 2kawaii",
  description: "Browse our gallery of AI-generated anime images. See examples of photos converted to anime style using GPT-4o and Flux Kontext.",
    url: "https://2kawaii.com/en/share",
    siteName: "2kawaii AI Image Gallery",
    images: [{
      url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-share.jpg",
      width: 1200,
      height: 630,
      alt: "AI Image Generation Gallery",
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Generation Gallery | Free Anime Conversion Showcase - 2kawaii",
    description: "Browse our gallery of AI-generated anime images. See examples of photos converted to anime style using GPT-4o.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-gallery.jpg"],
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
}

export default function SharePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <EnShareClientRouter />
      <Footer />
      <MobileBottomNav />
    </div>
  )
}