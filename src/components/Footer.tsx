"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Footer() {
  const pathname = usePathname()
  const isEnglish = pathname === '/en' || pathname?.startsWith('/en/')
  const [queryString, setQueryString] = useState('')
  const [hashString, setHashString] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const qs = window.location.search || ''
      const params = new URLSearchParams(qs)
      // 避免把分享详情页的 id 透传到所有链接
      params.delete('id')
      const filtered = params.toString()
      setQueryString(filtered)
      const hs = window.location.hash || ''
      setHashString(hs.startsWith('#') ? hs : (hs ? `#${hs}` : ''))
    }
  }, [pathname])

  const appendQueryHash = (p: string) => {
    const base = queryString && queryString.length > 0 ? `${p}?${queryString}` : p
    return `${base}${hashString || ''}`
  }

  const withLang = (p: string) => {
    if (isEnglish) {
      if (p === '/') return appendQueryHash('/en')
      return appendQueryHash(p.startsWith('/en') ? p : `/en${p}`)
    }
    if (p === '/en') return appendQueryHash('/')
    return appendQueryHash(p.replace(/^\/en(\/|$)/, '/'))
  }
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href={withLang('/')} className="flex items-center space-x-2 text-xl font-bold mb-4 text-text font-sans hover:text-brand transition-colors">
              <Image 
                src="/favicon.ico" 
                alt="2kawaii icon" 
                width={28} 
                height={28} 
                className="w-7 h-7"
              />
              <span>2kawaii.com</span>
            </Link>
            <p className="text-text-muted mb-4 max-w-md">
              {isEnglish 
                ? 'Free AI tool to turn your photos into cute anime characters.' 
                : '無料で使える画像変身ツール。あなたの画像を可愛いアニメキャラクターに変身させましょう！'}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text">{isEnglish ? 'Product' : '製品'}</h4>
            <ul className="space-y-2">
              <li><Link href={withLang('/workspace')} className="text-text-muted hover:text-text transition-colors">{isEnglish ? 'Features' : '機能特性'}</Link></li>
              <li><Link href={withLang('/faq')} className="text-text-muted hover:text-text transition-colors">{isEnglish ? 'FAQ' : 'よくある質問'}</Link></li>
              <li><Link href={withLang('/workspace')} className="text-text-muted hover:text-text transition-colors">{isEnglish ? 'Get Started' : 'サービスを始める'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text">{isEnglish ? 'Support' : 'サポート'}</h4>
            <ul className="space-y-2">
              <li><Link href={withLang('/faq')} className="text-text-muted hover:text-text transition-colors">{isEnglish ? 'Help Center' : 'ヘルプセンター'}</Link></li>
              <li><Link href={withLang('/faq')} className="text-text-muted hover:text-text transition-colors">{isEnglish ? 'Contact' : 'お問い合わせ'}</Link></li>
              <li>
                <a
                  href="mailto:support@2kawaii.com"
                  className="text-text-muted hover:text-text transition-colors"
                >
                  📧 support@2kawaii.com
                </a>
              </li>
              <li><Link href={withLang('/privacy')} className="text-text-muted hover:text-text transition-colors">{isEnglish ? 'Privacy' : 'プライバシー'}</Link></li>
              <li><Link href={withLang('/terms')} className="text-text-muted hover:text-text transition-colors">{isEnglish ? 'Terms' : '利用規約'}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-text-muted border-t border-gray-300">
          <p>{isEnglish ? '© 2025 2kawaii.com. All rights reserved.' : '© 2025 2kawaii.com. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  )
} 