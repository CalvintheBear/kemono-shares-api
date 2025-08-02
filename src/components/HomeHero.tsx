"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomeHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={`pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="max-w-6xl mx-auto text-center">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient font-cute mb-6 lg:mb-8 float transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="block">AI画像変換 完全無料</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">写真をアニメ風に即変換</span>
        </h1>
        <p className={`text-lg sm:text-xl md:text-2xl text-amber-800 mb-4 lg:mb-6 font-cute leading-relaxed transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          登録不要・商用利用可能・高画質なAI画像生成ツール
        </p>
        <p className={`text-base sm:text-lg lg:text-xl text-amber-700 opacity-90 mb-6 lg:mb-8 leading-relaxed transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          ジブリ風・VTuber・美少女・chibiLINE・スタンプ・可愛い壁紙など20+スタイルから即選べる
        </p>
        
        {/* 两排并列居中的按钮 */}
        <div className={`flex flex-col gap-4 justify-center items-center transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* 第一排按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/workspace" 
              className="btn-kawaii text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 lg:py-5 animate-pulse-custom hover:scale-110 transition-transform duration-300 ease-in-out"
              style={{
                animation: 'sizeAlternate1 2s ease-in-out infinite'
              }}
            >
              今すぐ無料で始める ✨
            </Link>
            <Link 
              href="/share" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 lg:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ease-in-out"
              style={{
                animation: 'sizeAlternate2 2s ease-in-out infinite'
              }}
            >
              ギャラリーを見る 🖼️
            </Link>
          </div>
        </div>
        
        {/* 自定义动画样式 */}
        <style jsx>{`
          @keyframes sizeAlternate1 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes sizeAlternate2 {
            0%, 100% { transform: scale(1.05); }
            50% { transform: scale(1); }
          }
        `}</style>
      </div>
    </section>
  );
} 