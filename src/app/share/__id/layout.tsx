export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  return []
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

