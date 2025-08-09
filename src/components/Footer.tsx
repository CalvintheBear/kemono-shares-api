import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-amber-200 text-amber-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold mb-4 text-purple-600 font-cute hover:text-purple-500 transition-colors">
              <Image 
                src="/favicon.ico" 
                alt="Kemono Mimi" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
                              <span>2kawaii.com</span>
            </Link>
            <p className="text-amber-700 mb-4 max-w-md">
              無料で使える画像変身ツール。あなたの画像を可愛いアニメキャラクターに変身させましょう！
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-700">製品</h4>
            <ul className="space-y-2">
              <li><Link href="/workspace" className="text-amber-600 hover:text-amber-800 transition-colors">機能特性</Link></li>
              <li><Link href="/faq" className="text-amber-600 hover:text-amber-800 transition-colors">よくある質問</Link></li>
              <li><Link href="/workspace" className="text-amber-600 hover:text-amber-800 transition-colors">サービスを始める</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-700">サポート</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-amber-600 hover:text-amber-800 transition-colors">ヘルプセンター</Link></li>
              <li><Link href="/faq" className="text-amber-600 hover:text-amber-800 transition-colors">お問い合わせ</Link></li>
              <li>
                <a
                  href="mailto:support@2kawaii.com"
                  className="text-amber-600 hover:text-amber-800 transition-colors"
                >
                  📧 support@2kawaii.com
                </a>
              </li>
              <li><Link href="/privacy" className="text-amber-600 hover:text-amber-800 transition-colors">プライバシー</Link></li>
              <li><Link href="/terms" className="text-amber-600 hover:text-amber-800 transition-colors">利用規約</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-amber-300 mt-8 pt-8 text-center text-amber-600">
          <p>&copy; 2025 2kawaii.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 