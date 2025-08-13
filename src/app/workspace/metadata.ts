import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI画像変換 ワークスペース - 2kawaii',
  description: 'AIでアニメ風画像を生成。無料・登録不要で今すぐ体験。',
  openGraph: {
    title: 'AI画像変換 ワークスペース - 2kawaii',
    description: '数分でAIアニメ画像を生成。無料体験できます。',
    url: 'https://2kawaii.com/workspace',
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/workspace',
    languages: {
      ja: 'https://2kawaii.com/workspace',
      en: 'https://2kawaii.com/en/workspace',
      'x-default': 'https://2kawaii.com/workspace',
    },
  },
}

export default function Meta() { return null }

