import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - 2kawaii',
  description: 'Read the 2kawaii privacy policy about data handling and user rights.',
  openGraph: {
    title: 'Privacy Policy - 2kawaii',
    description: '2kawaii privacy policy and data practices.',
    url: 'https://2kawaii.com/en/privacy',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2kawaii.com/en/privacy',
    languages: {
      ja: 'https://2kawaii.com/privacy',
      en: 'https://2kawaii.com/en/privacy',
      'x-default': 'https://2kawaii.com/privacy',
    },
  },
}

export default function Meta() { return null }

