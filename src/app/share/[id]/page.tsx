import { Metadata } from 'next'
import SharePageClient from './SharePageClient'

// 生成静态参数 - 为静态导出提供示例ID
export function generateStaticParams() {
  return [
    { id: 'example' }
  ];
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// 生成动态元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: shareId } = await params

  // 在静态导出模式下，跳过API调用以避免构建超时
  const isStaticExport = process.env.STATIC_EXPORT === 'true'
  
  if (!isStaticExport) {
    try {
      // 只在非静态导出模式下尝试获取分享数据
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
      
      const response = await fetch(`${baseUrl}/api/share?id=${shareId}`, {
        next: { revalidate: 3600 }, // 缓存1小时
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          const shareData = data.data
          return {
            title: `${shareData.style}スタイルでAI画像変換・プロンプト生成 - 2kawaii`,
            description: `${shareData.style}スタイルでAI画像変換された結果をご覧ください。プロンプト自動生成で無料で簡単にアニメ風画像に変換できます。`,
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
              title: `${shareData.style}スタイルでAI画像変換・プロンプト生成 - 2kawaii`,
              description: `${shareData.style}スタイルでAI画像変換された結果をご覧ください。プロンプト自動生成で美しい変換結果を実現。`,
              images: [
                {
                  url: shareData.generatedUrl,
                  width: 1200,
                  height: 630,
                  alt: `${shareData.style}スタイルで変換された画像`,
                },
              ],
              type: 'website',
              url: `https://2kawaii.com/share/${shareId}`,
            },
            twitter: {
              card: 'summary_large_image',
              title: `${shareData.style}スタイルでAI画像変換・プロンプト生成 - 2kawaii`,
              description: `${shareData.style}スタイルでAI画像変換された結果をご覧ください。プロンプト自動生成で美しい変換結果を実現。`,
              images: [shareData.generatedUrl],
            },
          }
        }
      }
    } catch (error) {
      console.error('获取分享数据失败:', error)
    }
  }

  // 默认元数据（当无法获取分享数据时）
  return {
    title: 'AI画像変換結果・プロンプト生成 - 2kawaii',
    description: 'AI画像変換された結果をご覧ください。プロンプト自動生成で無料で簡単にアニメ風画像に変換できます。',
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