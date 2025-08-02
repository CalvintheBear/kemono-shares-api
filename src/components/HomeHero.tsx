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
        <Link href="/workspace" className={`btn-kawaii text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 lg:py-5 animate-pulse-custom transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          今すぐ無料で始める ✨
        </Link>
      </div>
    </section>
  );
} 