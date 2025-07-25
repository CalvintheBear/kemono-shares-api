'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fff7ea]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 lg:p-12 border border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-amber-800 mb-4 font-cute">
              プライバシーポリシー
            </h1>
            <p className="text-lg text-amber-700 font-cute">
              kemono-mimi.com の個人情報保護方針
            </p>
          </div>

          <div className="space-y-8 text-gray-700 font-cute">
            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">1. 基本方針</h2>
              <p className="leading-relaxed">
                kemono-mimi.com（以下「当サイト」といいます）は、ユーザーの皆様の個人情報の重要性を深く認識し、
                個人情報保護に関する法律およびその他の関連法令を遵守し、適切な取り扱いと保護に努めます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">2. 収集する情報</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">2.1 アップロード画像</h3>
                  <p className="leading-relaxed">
                    当サイトでは、AI画像生成サービスを提供するために、ユーザーがアップロードする画像データを一時的に処理します。
                    これらの画像データは処理完了後、当社のサーバーには保存されません。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">2.2 使用ログ</h3>
                  <p className="leading-relaxed">
                    サービス品質向上のため、IPアドレス、ブラウザ情報、アクセス日時などの使用ログを自動的に収集することがあります。
                    これらの情報は個人を特定する目的では使用しません。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">3. 情報の利用目的</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>AI画像生成サービスの提供</li>
                <li>サービス品質の向上と改善</li>
                <li>不正アクセスや不正利用の防止</li>
                <li>システムの保守・管理</li>
                <li>法令に基づく対応</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">4. 第三者への提供</h2>
              <p className="leading-relaxed">
                当サイトは、ユーザーの同意なく個人情報を第三者に提供することはありません。
                ただし、以下の場合を除きます：
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 leading-relaxed">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要な場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために必要な場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">5. データの保存期間</h2>
              <p className="leading-relaxed">
                アップロードされた画像データは、AI処理完了後すぐに削除されます。
                使用ログはサービス改善のため最大90日間保存されます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">6. Cookieの使用</h2>
              <p className="leading-relaxed">
                当サイトでは、ユーザーエクスペリエンス向上のため、Cookieを使用することがあります。
                Cookieの使用により、サービスの利用状況を分析し、改善することができます。
                ユーザーはブラウザの設定によりCookieの受け入れを拒否することができますが、
                その場合サービスの一部機能が利用できなくなることがあります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">7. セキュリティ対策</h2>
              <p className="leading-relaxed">
                当サイトは、個人情報の漏洩、滅失またはき損の防止と是正のために、
                適切なセキュリティ対策を講じています。アップロードされた画像データは、
                暗号化された通信経路を通じて転送され、処理後は完全に削除されます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">8. プライバシーポリシーの変更</h2>
              <p className="leading-relaxed">
                当サイトは、必要に応じて本プライバシーポリシーの内容を変更することがあります。
                変更後のプライバシーポリシーは、当サイトに掲載したときから効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">9. お問い合わせ</h2>
              <p className="leading-relaxed">
                本プライバシーポリシーに関するお問い合わせは、以下のメールアドレスまでお願いいたします。
              </p>
              <p className="mt-2 font-semibold text-amber-700">
                メール: privacy@kemono-mimi.com
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-amber-200 text-center">
              <p className="text-sm text-gray-500">
                最終更新日: 2025年7月24日
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}