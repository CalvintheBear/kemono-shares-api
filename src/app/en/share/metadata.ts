import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Gallery | ChatGPT AI Prompt Examples - 2kawaii',
  description: 'Daily updated AI image generation examples with prompts. Free, no registration required. Anime styles, VTuber, chibi and more.',
  openGraph: {
    title: 'AI Image Gallery | ChatGPT AI Prompt Examples - 2kawaii',
    description: 'Explore AI image generation examples with detailed prompts. Free and fast, no sign-up.',
    url: 'https://2kawaii.com/en/share',
    siteName: '2kawaii AI Image Generation',
    images: [
      {
        url: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Image Gallery | AI Prompt Examples - 2kawaii GPT-4o',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Gallery | ChatGPT AI Prompt Examples',
    description: 'AI prompts × ChatGPT image generation examples. Free, no registration required.',
    images: ['https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-gallery.jpg'],
  },
  alternates: {
    canonical: 'https://2kawaii.com/en/share',
    languages: {
      ja: 'https://2kawaii.com/share',
      en: 'https://2kawaii.com/en/share',
      'x-default': 'https://2kawaii.com/share',
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
}

export default function Meta() {
  return null
}

