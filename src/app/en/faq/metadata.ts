import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - 2kawaii',
  description: 'Frequently asked questions about 2kawaii AI image generation service.',
  openGraph: {
    title: 'FAQ - 2kawaii',
    description: 'Common questions and quick answers about 2kawaii AI.',
    url: 'https://2kawaii.com/en/faq',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/en/faq',
    languages: {
      ja: 'https://2kawaii.com/faq',
      en: 'https://2kawaii.com/en/faq',
      'x-default': 'https://2kawaii.com/faq',
    },
  },
}

export default function Meta() { return null }

