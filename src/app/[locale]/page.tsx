'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplateGallery from "@/components/TemplateGallery";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 页面加载后触发渐入效果
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />

      {/* 英雄区域 - 减少底部间距 */}
      <section className={`pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gradient font-cute mb-6 lg:mb-8 float transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            アニメ変身ツール
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-800 mb-6 lg:mb-8 font-cute leading-relaxed transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            あなたの画像を可愛いアニメキャラクターに変身させよう！
          </p>
          <p className={`text-base sm:text-lg lg:text-xl text-amber-700 opacity-80 mb-10 lg:mb-12 leading-relaxed transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            無料・登録不要・簡単操作
          </p>
          <Link href="/workspace" className={`btn-kawaii text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 lg:py-5 animate-pulse-custom transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            今すぐ変身させる ✨
          </Link>
        </div>
      </section>

      {/* 12个模板样式展示 - 减少顶部间距 */}
      <div className="pt-8 pb-20 lg:pt-12 lg:pb-24">
        <TemplateGallery />
      </div>

      {/* 使い方ガイド - 优化间距和响应式 */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#fff7ea]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-12 lg:mb-16 animate-fade-in-up">
            使い方はとても簡単！
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <img 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-uploadimage" 
                  alt="画像アップロードガイド" 
                  className="w-full h-full object-cover rounded-full shadow-lg"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">画像をアップロード</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">写真をドラッグ&ドロップまたはクリックして選択</p>
            </div>
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <img 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-choosetem" 
                  alt="スタイル選択ガイド" 
                  className="w-full h-full object-cover rounded-full shadow-lg"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">スタイルを選択</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">お好みのアニメスタイルを選んでください</p>
            </div>
            <div className="text-center card-kawaii p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 mx-auto mb-6 lg:mb-8">
                <img 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-finalimage" 
                  alt="変身完了ガイド" 
                  className="w-full h-full object-cover rounded-full shadow-lg"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">変身完了！</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">数秒で可愛いアニメキャラクターに変身</p>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション - 优化间距和布局 */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#fff7ea]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-amber-800 font-cute mb-12 lg:mb-16 animate-fade-in-up">
            なぜ選ばれるのか？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">✨ 完全無料</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">登録不要・隠れた課金なし。完全に無料でご利用いただけます。</p>
            </div>
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">🚀 高速処理</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">最新のAI技術により、数秒で高品質な変身画像を生成。</p>
            </div>
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">🔒 プライバシー保護</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">アップロードした画像は処理後すぐに削除。安心してご利用ください。</p>
            </div>
            <div className="card-kawaii p-6 sm:p-8 lg:p-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-4 lg:mb-6 font-cute">📱 どこでも利用</h3>
              <p className="text-amber-700 text-sm sm:text-base lg:text-lg leading-relaxed">PC・スマホ・タブレット、どのデバイスでも快適に利用可能。</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ セクション - 增加间距 */}
      <div className="py-20 lg:py-24">
        <FAQ />
      </div>

      {/* CTA セクション - 优化间距和响应式 */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-800 font-cute mb-6 lg:mb-8 animate-fade-in-up">
            今すぐアニメキャラクターに変身！
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-amber-700 mb-10 lg:mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            あなたの写真が可愛いアニメキャラクターに生まれ変わります
          </p>
          <Link href="/workspace" className="btn-kawaii text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 lg:py-5 animate-glow-pulse animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            無料で始める 🎀
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
} 