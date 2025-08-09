import { Metadata } from 'next'

// 注意：由于数据来自 KV/API，这里仅提供静态兜底元信息。
// 真正的动态 SEO 建议迁移到同级 generateMetadata.ts（需要 node 端拿到数据）。

export const metadata: Metadata = {
  title: 'AI画像生成 無料 | 作品詳細 - 2kawaii',
  description: 'GPT-4oで生成されたAI画像の詳細ページ。プロンプト付きで学べるギャラリー。',
  openGraph: {
    title: 'AI画像生成 無料 | 作品詳細 - 2kawaii',
    description: 'GPT-4oで生成されたAI画像の詳細ページ。プロンプト付きで学べるギャラリー。',
    type: 'article',
  },
}


