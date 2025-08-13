import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - 2kawaii',
  description: '2kawaii terms of service for the AI image generation site.',
  openGraph: {
    title: 'Terms of Service - 2kawaii',
    description: '2kawaii terms and conditions.',
    url: 'https://2kawaii.com/en/terms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/en/terms',
    languages: {
      ja: 'https://2kawaii.com/terms',
      en: 'https://2kawaii.com/en/terms',
      'x-default': 'https://2kawaii.com/terms',
    },
  },
}

export default function Meta() { return null }

