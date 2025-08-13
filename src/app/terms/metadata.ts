import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 - 2kawaii',
  description: '2kawaiiのAI画像生成サイトの利用規約。',
  openGraph: {
    title: '利用規約 - 2kawaii',
    description: '2kawaiiの利用条件。',
    url: 'https://2kawaii.com/terms',
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/terms',
    languages: {
      ja: 'https://2kawaii.com/terms',
      en: 'https://2kawaii.com/en/terms',
      'x-default': 'https://2kawaii.com/terms',
    },
  },
}

export default function Meta() { return null }

