"use client";

import Link from "next/link";

export default function HomeHero() {
  const isEnglish = typeof window !== 'undefined' && (window.location.pathname === '/en' || window.location.pathname.startsWith('/en/'))
  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 lg:mb-8">
          <span className="block">{isEnglish ? 'Free AI Image Conversion' : 'AI画像変換 完全無料'}</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">{isEnglish ? 'Convert photos to anime instantly' : '写真をアニメ風に即変換'}</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-text-muted mb-4 lg:mb-6 leading-relaxed">
          {isEnglish ? 'No registration required · Commercial use allowed · High-quality AI image tool' : '登録不要・商用利用可能・高画質なAI画像生成ツール'}
        </p>
        
        {/* 按钮区域 */}
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href={isEnglish ? '/en/workspace' : '/workspace'} 
              className="btn-primary text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 lg:py-5"
            >
              {isEnglish ? 'Start for free now' : '今すぐ無料で始める'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 