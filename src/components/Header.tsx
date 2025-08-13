'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [queryString, setQueryString] = useState('')
  const [hashString, setHashString] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const qs = window.location.search
      setQueryString(qs.startsWith('?') ? qs.slice(1) : qs)
      const hs = window.location.hash || ''
      setHashString(hs.startsWith('#') ? hs : (hs ? `#${hs}` : ''))
    }
  }, [pathname])
  
  // Detect current language
  const isEnglish = pathname?.startsWith('/en/') || pathname === '/en'
  
  // Create language switch URLs
  const getLanguageSwitchUrl = () => {
    if (!pathname) return '/'
    const withQueryAndHash = (p: string) => {
      const base = queryString && queryString.length > 0 ? `${p}?${queryString}` : p
      return `${base}${hashString || ''}`
    }
    const qs = new URLSearchParams(queryString)
    const shareId = qs.get('id')
    if (isEnglish) {
      // Remove /en prefix safely
      let toJa = pathname === '/en' ? '/' : pathname.replace(/^\/en(\/|$)/, '/')
      // Special case: English share list with query id → map to Japanese detail path
      if ((pathname === '/en/share' || pathname === '/en/share/') && shareId) {
        toJa = `/share/${shareId}`
        return withQueryAndHash(toJa.split('?')[0])
      }
      return withQueryAndHash(toJa)
    }
    // Add /en prefix
    if ((pathname === '/share' || pathname === '/share/') && shareId) {
      const toDetail = `/en/share/${shareId}`
      return withQueryAndHash(toDetail)
    }
    const toEn = pathname === '/' ? '/en' : pathname.startsWith('/en') ? pathname : `/en${pathname}`
    return withQueryAndHash(toEn)
  }
  
  const getOtherLanguageLabel = () => isEnglish ? '日本語' : 'English'
  const getCurrentLanguageLabel = () => isEnglish ? 'English' : '日本語'

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-100 border-b border-gray-300 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Domain */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-text font-sans hover:text-brand transition-colors">
                <Image 
                  src="/favicon.ico" 
                  alt="2kawaii icon" 
                  width={28} 
                  height={28} 
                  className="w-7 h-7"
                />
                <span>2kawaii.com</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href={isEnglish ? '/en/faq' : '/faq'} className="text-text-muted hover:text-text px-3 py-2 text-sm font-medium transition-colors">FAQ</Link>
              <Link href={isEnglish ? '/en/privacy' : '/privacy'} className="text-text-muted hover:text-text px-3 py-2 text-sm font-medium transition-colors">{isEnglish ? 'Privacy' : 'プライバシー'}</Link>
              <Link href={isEnglish ? '/en/terms' : '/terms'} className="text-text-muted hover:text-text px-3 py-2 text-sm font-medium transition-colors">{isEnglish ? 'Terms' : '利用規約'}</Link>
            </div>
          </nav>
          
          {/* CTA Button and Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                href={isEnglish ? '/en/workspace' : '/workspace'} 
                className="btn-primary text-sm whitespace-nowrap"
              >
                {isEnglish ? 'Start' : '体験'}
              </Link>
              <Link 
                href={isEnglish ? '/en/share' : '/share'} 
                className="btn-outline text-sm whitespace-nowrap"
              >
                {isEnglish ? 'Gallery' : 'お題一覧'}
              </Link>
              {/* Language Switch */}
              <Link 
                href={getLanguageSwitchUrl()}
                className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md text-text-muted hover:text-text hover:bg-surface transition-colors"
                aria-label={`Language: ${getCurrentLanguageLabel()}`}
                title={`Language: ${getCurrentLanguageLabel()}`}
              >
                <ArrowsRightLeftIcon className="h-4 w-4" />
                <span>{getCurrentLanguageLabel()}</span>
              </Link>
            </div>
            
            {/* Mobile Language Switch - Always visible */}
            <Link 
              href={getLanguageSwitchUrl()}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-text hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
              aria-label={`Language: ${getCurrentLanguageLabel()}`}
              title={`Language: ${getCurrentLanguageLabel()}`}
            >
              <ArrowsRightLeftIcon className="h-6 w-6" />
              <span className="ml-1 text-sm">{getCurrentLanguageLabel()}</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-text hover:bg-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
          {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-gray-100 border-t border-gray-300">
              <Link href={isEnglish ? '/en/workspace' : '/workspace'} className="btn-primary block w-full text-center text-sm">{isEnglish ? 'Start' : '体験'}</Link>
              <Link href={isEnglish ? '/en/share' : '/share'} className="btn-outline block w-full text-center text-sm">{isEnglish ? 'Gallery' : 'お題一覧'}</Link>
              <Link href={isEnglish ? '/en/faq' : '/faq'} className="text-text-muted hover:text-text block px-3 py-2 text-base font-medium">FAQ</Link>
              <Link href={isEnglish ? '/en/privacy' : '/privacy'} className="text-text-muted hover:text-text block px-3 py-2 text-base font-medium">{isEnglish ? 'Privacy' : 'プライバシー'}</Link>
              <Link href={isEnglish ? '/en/terms' : '/terms'} className="text-text-muted hover:text-text block px-3 py-2 text-base font-medium">{isEnglish ? 'Terms' : '利用規約'}</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 