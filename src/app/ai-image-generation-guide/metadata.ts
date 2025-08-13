import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI画像生成 初心者ガイド - 2kawaii',
  description: 'AIでアニメ風画像を作るためのステップバイステップ入門。プロンプトのコツやベストプラクティスを紹介。',
  openGraph: {
    title: 'AI画像生成 初心者ガイド - 2kawaii',
    description: 'AIでアニメ風画像を作成する手順とプロンプトのコツを分かりやすく解説。',
    url: 'https://2kawaii.com/ai-image-generation-guide',
    locale: 'ja_JP',
    type: 'article',
  },
  alternates: {
    canonical: 'https://2kawaii.com/ai-image-generation-guide',
    languages: {
      ja: 'https://2kawaii.com/ai-image-generation-guide',
      en: 'https://2kawaii.com/en/ai-image-generation-guide',
      'x-default': 'https://2kawaii.com/ai-image-generation-guide',
    },
  },
}

export default function Meta() { return null }

