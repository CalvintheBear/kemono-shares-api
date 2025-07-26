import { Metadata } from 'next'
import SharePageClient from './SharePageClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// 生成动态元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: shareId } = await params

  try {
    // 尝试获取分享数据来生成动态元数据
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kemono-mimi.com'
    const response = await fetch(`${baseUrl}/api/share?id=${shareId}`, {
      next: { revalidate: 3600 } // 缓存1小时
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.data) {
        const shareData = data.data
        return {
          title: `${shareData.style}スタイルでAI画像変換 - kemono-mimi`,
          description: `${shareData.style}スタイルでAI画像変換された結果をご覧ください。無料で簡単にアニメ風画像に変換できます。`,
          keywords: 'AI画像変換, アニメ風, 画像編集, 無料, kemono-mimi',
          robots: {
            index: true, // 允许收录分享页面
            follow: true, // 允许跟踪链接
            googleBot: {
              index: true,
              follow: true,
              noimageindex: false, // 允许收录图片
            },
          },
          openGraph: {
            title: `${shareData.style}スタイルでAI画像変換 - kemono-mimi`,
            description: `${shareData.style}スタイルでAI画像変換された結果をご覧ください。`,
            images: [
              {
                url: shareData.generatedUrl,
                width: 1200,
                height: 630,
                alt: `${shareData.style}スタイルで変換された画像`,
              },
            ],
            type: 'website',
            url: `https://kemono-mimi.com/share/${shareId}`,
          },
          twitter: {
            card: 'summary_large_image',
            title: `${shareData.style}スタイルでAI画像変換 - kemono-mimi`,
            description: `${shareData.style}スタイルでAI画像変換された結果をご覧ください。`,
            images: [shareData.generatedUrl],
          },
        }
      }
    }
  } catch (error) {
    console.error('获取分享数据失败:', error)
  }

  // 默认元数据（当无法获取分享数据时）
  return {
    title: 'AI画像変換結果 - kemono-mimi',
    description: 'AI画像変換された結果をご覧ください。無料で簡単にアニメ風画像に変換できます。',
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
      title: 'AI画像変換結果 - kemono-mimi',
      description: 'AI画像変換された結果をご覧ください。',
      type: 'website',
      url: `https://kemono-mimi.com/share/${shareId}`,
    },
  }
}

export default async function SharePage({ params }: PageProps) {
  const { id: shareId } = await params
  return <SharePageClient shareId={shareId} />
} 