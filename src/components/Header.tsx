'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Domain - Now on the left */}
          <div className="flex items-center order-1">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-amber-800 font-cute hover:text-amber-900 transition-colors">
                <Image 
                  src="/favicon.ico" 
                  alt="Kemono Mimi" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8"
                />
                                 <span>2kawaii.com</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:block order-2 flex-1">
            <div className="flex items-baseline justify-center space-x-8">
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">FAQ</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">プライバシー</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">利用規約</Link>
            </div>
          </nav>
          
          {/* CTA Button and Mobile Menu - Now on the right */}
          <div className="flex items-center space-x-2 sm:space-x-4 order-3">
            {/* 移动端按钮 - 优化显示 */}
            <div className="flex items-center space-x-1 sm:space-x-2">
                             <Link 
                 href="/workspace" 
                 className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-medium transition-all duration-300 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap"
               >
                 体験
               </Link>
              
              <Link 
                href="/share" 
                className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-medium transition-all duration-300 px-2 sm:px-4 py-2 sm:py-3 rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap"
              >
                ギャラリー
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {/* 其他链接 */}
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium">FAQ</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium">プライバシー</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium">利用規約</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 