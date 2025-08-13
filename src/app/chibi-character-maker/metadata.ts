import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ちびキャラ作成（AI） - 2kawaii',
  description: 'AIでちびキャラを生成するための入門ガイド。プロンプト例とベストプラクティス。',
  openGraph: {
    title: 'ちびキャラ作成（AI） - 2kawaii',
    description: 'AIで可愛いちびキャラを作るための実践ヒントとプロンプト例。',
    url: 'https://2kawaii.com/chibi-character-maker',
    locale: 'ja_JP',
    type: 'article',
  },
  alternates: {
    canonical: 'https://2kawaii.com/chibi-character-maker',
    languages: {
      ja: 'https://2kawaii.com/chibi-character-maker',
      en: 'https://2kawaii.com/en/chibi-character-maker',
      'x-default': 'https://2kawaii.com/chibi-character-maker',
    },
  },
}

export default function Meta() { return null }

