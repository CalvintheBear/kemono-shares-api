import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chibi Character Maker with AI - 2kawaii',
  description: 'Create chibi characters using AI. Beginner-friendly guide and prompt examples.',
  openGraph: {
    title: 'Chibi Character Maker with AI - 2kawaii',
    description: 'Generate cute chibi characters with AI prompts and best practices.',
    url: 'https://2kawaii.com/en/chibi-character-maker',
    locale: 'en_US',
    type: 'article',
  },
  alternates: {
    canonical: 'https://2kawaii.com/en/chibi-character-maker',
    languages: {
      ja: 'https://2kawaii.com/chibi-character-maker',
      en: 'https://2kawaii.com/en/chibi-character-maker',
      'x-default': 'https://2kawaii.com/chibi-character-maker',
    },
  },
}

export default function Meta() { return null }

