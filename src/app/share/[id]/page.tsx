import SharePageClient from './SharePageClient'

// 移除静态参数生成，支持动态路由
// export function generateStaticParams() {
//   return [
//     { id: 'example' },
//     { id: 'demo' },
//     { id: 'test' }
//   ]
// }

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// 动态元数据生成
export async function generateMetadata({ params }: PageProps) {
  const { id: shareId } = await params
  
  return {
    title: 'AI画像変換結果・プロンプト生成 - 2kawaii',
    description: 'AI画像変換された結果をご覧ください。プロンプト自動生成で無料で簡単にアニメ風画像に変換できます。',
    keywords: 'AI画像変換, プロンプト生成, アニメ風, 画像編集, 無料, 2kawaii, AIプロンプト',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },
    openGraph: {
      title: 'AI画像変換結果・プロンプト生成 - 2kawaii',
      description: 'AI画像変換された結果をご覧ください。プロンプト自動生成で美しい変換結果を実現。',
      type: 'website',
      url: `https://2kawaii.com/share/${shareId}`,
      images: [
        {
          url: 'https://2kawaii.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'AI画像変換結果・プロンプト生成',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI画像変換結果・プロンプト生成 - 2kawaii',
      description: 'AI画像変換された結果をご覧ください。プロンプト自動生成で美しい変換結果を実現。',
      images: ['https://2kawaii.com/og-image.jpg'],
    },
  }
}

export default async function SharePage({ params }: PageProps) {
  const { id: shareId } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <SharePageClient shareId={shareId} />
    </div>
  )
} 