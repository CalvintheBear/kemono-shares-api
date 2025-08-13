import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'よくある質問（FAQ） - 2kawaii',
  description: '2kawaiiのAI画像生成サービスに関するよくある質問をまとめました。',
  openGraph: {
    title: 'よくある質問（FAQ） - 2kawaii',
    description: 'AI画像生成に関する一般的な質問と回答。',
    url: 'https://2kawaii.com/faq',
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/faq',
    languages: {
      ja: 'https://2kawaii.com/faq',
      en: 'https://2kawaii.com/en/faq',
      'x-default': 'https://2kawaii.com/faq',
    },
  },
}

export default function Meta() { return null }

