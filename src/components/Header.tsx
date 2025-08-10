'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                  alt="Kemono Mimi" 
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
              <Link href="/faq" className="text-text-muted hover:text-text px-3 py-2 text-sm font-medium transition-colors">FAQ</Link>
              <Link href="/privacy" className="text-text-muted hover:text-text px-3 py-2 text-sm font-medium transition-colors">プライバシー</Link>
              <Link href="/terms" className="text-text-muted hover:text-text px-3 py-2 text-sm font-medium transition-colors">利用規約</Link>
            </div>
          </nav>
          
          {/* CTA Button and Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                href="/workspace" 
                className="btn-primary text-sm whitespace-nowrap"
              >
                体験
              </Link>
              <Link 
                href="/share" 
                className="btn-outline text-sm whitespace-nowrap"
              >
                お題一覧
              </Link>
            </div>
            
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
              <Link href="/workspace" className="btn-primary block w-full text-center text-sm">体験</Link>
              <Link href="/share" className="btn-outline block w-full text-center text-sm">お題一覧</Link>
              <Link href="/faq" className="text-text-muted hover:text-text block px-3 py-2 text-base font-medium">FAQ</Link>
              <Link href="/privacy" className="text-text-muted hover:text-text block px-3 py-2 text-base font-medium">プライバシー</Link>
              <Link href="/terms" className="text-text-muted hover:text-text block px-3 py-2 text-base font-medium">利用規約</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 