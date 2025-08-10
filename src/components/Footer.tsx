import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold mb-4 text-text font-sans hover:text-brand transition-colors">
              <Image 
                src="/favicon.ico" 
                alt="Kemono Mimi" 
                width={28} 
                height={28} 
                className="w-7 h-7"
              />
              <span>2kawaii.com</span>
            </Link>
            <p className="text-text-muted mb-4 max-w-md">
              無料で使える画像変身ツール。あなたの画像を可愛いアニメキャラクターに変身させましょう！
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text">製品</h4>
            <ul className="space-y-2">
              <li><Link href="/workspace" className="text-text-muted hover:text-text transition-colors">機能特性</Link></li>
              <li><Link href="/faq" className="text-text-muted hover:text-text transition-colors">よくある質問</Link></li>
              <li><Link href="/workspace" className="text-text-muted hover:text-text transition-colors">サービスを始める</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-text">サポート</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-text-muted hover:text-text transition-colors">ヘルプセンター</Link></li>
              <li><Link href="/faq" className="text-text-muted hover:text-text transition-colors">お問い合わせ</Link></li>
              <li>
                <a
                  href="mailto:support@2kawaii.com"
                  className="text-text-muted hover:text-text transition-colors"
                >
                  📧 support@2kawaii.com
                </a>
              </li>
              <li><Link href="/privacy" className="text-text-muted hover:text-text transition-colors">プライバシー</Link></li>
              <li><Link href="/terms" className="text-text-muted hover:text-text transition-colors">利用規約</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-text-muted border-t border-gray-300">
          <p>&copy; 2025 2kawaii.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 