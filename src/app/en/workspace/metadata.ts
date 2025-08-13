import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Workspace - 2kawaii',
  description: 'Start generating anime-style images with AI. Free, fast, and no registration required.',
  openGraph: {
    title: 'AI Image Workspace - 2kawaii',
    description: 'Generate anime-style images with AI in minutes. Try for free.',
    url: 'https://2kawaii.com/en/workspace',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/en/workspace',
    languages: {
      ja: 'https://2kawaii.com/workspace',
      en: 'https://2kawaii.com/en/workspace',
      'x-default': 'https://2kawaii.com/workspace',
    },
  },
}

export default function Meta() { return null }

