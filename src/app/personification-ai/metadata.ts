import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '擬人化 AI 使い方ガイド - 2kawaii',
  description: 'AIで擬人化キャラクターを作るためのプロンプト例とワークフロー。',
  openGraph: {
    title: '擬人化 AI 使い方ガイド - 2kawaii',
    description: '擬人化キャラクター生成のコツと実用的なプロンプト事例。',
    url: 'https://2kawaii.com/personification-ai',
    locale: 'ja_JP',
    type: 'article',
  },
  alternates: {
    canonical: 'https://2kawaii.com/personification-ai',
    languages: {
      ja: 'https://2kawaii.com/personification-ai',
      en: 'https://2kawaii.com/en/personification-ai',
      'x-default': 'https://2kawaii.com/personification-ai',
    },
  },
}

export default function Meta() { return null }

