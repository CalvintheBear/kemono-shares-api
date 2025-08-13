import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Generation Beginner Guide - 2kawaii',
  description: 'Step-by-step guide to generate anime-style images with AI. Tips, prompts, and best practices for beginners.',
  openGraph: {
    title: 'AI Image Generation Beginner Guide - 2kawaii',
    description: 'Learn how to create anime images with AI. Prompt tips and workflow for beginners.',
    url: 'https://2kawaii.com/en/ai-image-generation-guide',
    locale: 'en_US',
    type: 'article',
  },
  alternates: {
    canonical: 'https://2kawaii.com/en/ai-image-generation-guide',
    languages: {
      ja: 'https://2kawaii.com/ai-image-generation-guide',
      en: 'https://2kawaii.com/en/ai-image-generation-guide',
      'x-default': 'https://2kawaii.com/ai-image-generation-guide',
    },
  },
}

export default function Meta() { return null }

