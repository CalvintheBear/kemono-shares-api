// 生成静态参数
export async function generateStaticParams() {
  return [
    { locale: 'ja' }
  ]
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 