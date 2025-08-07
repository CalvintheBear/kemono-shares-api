import SharePageClient from './SharePageClient'

// 移除静态参数生成，支持动态路由
// export function generateStaticParams() {
//   return [
//     { id: 'example' }
//   ];
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
    },
  }
}

export default async function SharePage({ params }: PageProps) {
  const { id: shareId } = await params
  return <SharePageClient shareId={shareId} />
} 