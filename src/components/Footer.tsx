import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold mb-4 text-gradient font-cute">アニメ変身</Link>
            <p className="text-gray-400 mb-4 max-w-md">
              無料で使える画像変身ツール。あなたの画像を可愛いアニメキャラクターに変身させましょう！
            </p>

          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">製品</h4>
            <ul className="space-y-2">
              <li><Link href="/workspace" className="text-gray-400 hover:text-white transition-colors">機能特性</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">よくある質問</Link></li>
              <li><Link href="/workspace" className="text-gray-400 hover:text-white transition-colors">サービスを始める</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">サポート</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">ヘルプセンター</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシー</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">利用規約</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 アニメ変身. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 