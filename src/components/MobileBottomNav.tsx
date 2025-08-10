'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon, SparklesIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolidIcon, SparklesIcon as SparklesSolidIcon, PhotoIcon as PhotoSolidIcon } from '@heroicons/react/24/solid'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(pathname || '')
  }, [pathname])

  // 使用媒体查询来检测移动端，而不是props
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  const navItems = [
    {
      name: 'ホーム',
      href: '/',
      icon: HomeIcon,
      iconSolid: HomeSolidIcon,
      color: 'text-brand'
    },
    {
      name: 'ワークスペース',
      href: '/workspace',
      icon: SparklesIcon,
      iconSolid: SparklesSolidIcon,
      color: 'text-brand'
    },
    {
      name: 'お題一覧',
      href: '/share',
      icon: PhotoIcon,
      iconSolid: PhotoSolidIcon,
      color: 'text-brand'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.href || 
            (item.href === '/share' && currentPath.startsWith('/share')) ||
            (item.href === '/workspace' && currentPath.startsWith('/workspace')) ||
            (item.href === '/' && currentPath === '/')
          
          const Icon = isActive ? item.iconSolid : item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors duration-200 ${
                isActive ? item.color : 'text-text-muted'
              } hover:text-brand`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}