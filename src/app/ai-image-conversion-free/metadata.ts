import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI画像変換 比較 - 2kawaii',
  description: '複数のAI画像変換手法を比較。用途別の使い分けや実運用のコツを解説。',
  openGraph: {
    title: 'AI画像変換 比較 - 2kawaii',
    description: 'AI画像変換の実用比較とワークフローのベストプラクティス。',
    url: 'https://2kawaii.com/ai-image-conversion-free',
    locale: 'ja_JP',
    type: 'article',
  },
  alternates: {
    canonical: 'https://2kawaii.com/ai-image-conversion-free',
    languages: {
      ja: 'https://2kawaii.com/ai-image-conversion-free',
      en: 'https://2kawaii.com/en/ai-image-conversion-free',
      'x-default': 'https://2kawaii.com/ai-image-conversion-free',
    },
  },
}

export default function Meta() { return null }

