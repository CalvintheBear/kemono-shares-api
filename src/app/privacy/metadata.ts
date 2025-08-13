import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー - 2kawaii',
  description: '2kawaiiのプライバシーポリシーとデータ取り扱いについて。',
  openGraph: {
    title: 'プライバシーポリシー - 2kawaii',
    description: '2kawaiiのプライバシーに関する方針。',
    url: 'https://2kawaii.com/privacy',
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/privacy',
    languages: {
      ja: 'https://2kawaii.com/privacy',
      en: 'https://2kawaii.com/en/privacy',
      'x-default': 'https://2kawaii.com/privacy',
    },
  },
}

export default function Meta() { return null }

