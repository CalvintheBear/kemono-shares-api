import type { Metadata } from 'next';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

// Privacy policy SEO metadata for English - aligned with Japanese structure
export const metadata = {
  title: "Privacy Policy AI Image Generation | 2kawaii.com Personal Information Protection Policy",
  description: "2kawaii.com AI image generation service privacy policy. Personal information, image data protection, cookie usage, commercial use, third-party provision prohibition explained in detail. Free, no registration required, secure.",
  openGraph: {
    title: "Privacy Policy AI Image Generation | 2kawaii.com Personal Information Protection Policy",
    description: "2kawaii AI image generation service privacy policy. Personal information protection, image data deletion, commercial use, third-party provision prohibition explained in detail.",
    url: "https://2kawaii.com/en/privacy",
    siteName: "2kawaii AI Image Generation",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-privacy.jpg",
        width: 1200,
        height: 630,
        alt: "2kawaii Privacy Policy",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy AI Image Generation | 2kawaii.com Personal Information Protection Policy",
    description: "2kawaii AI image generation service privacy policy. Personal information protection, image data deletion, commercial use, third-party provision prohibition explained in detail.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-privacy.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/en/privacy",
    languages: {
      ja: "https://2kawaii.com/privacy",
      en: "https://2kawaii.com/en/privacy",
      "x-default": "https://2kawaii.com/privacy",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 lg:p-12 border border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-text mb-4 font-cute">
              Privacy Policy
            </h1>
            <p className="text-lg text-text-muted font-cute">
              2kawaii.com Personal Information Protection Policy
            </p>
          </div>

          <div className="space-y-8 text-gray-700 font-cute">
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">1. Basic Policy</h2>
              <p className="leading-relaxed">
                2kawaii.com (hereinafter referred to as "this site") deeply recognizes the importance of users' personal information, 
                complies with laws and regulations regarding personal information protection, and strives for appropriate handling and protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">2. Information Collection</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-muted mb-2">2.1 Uploaded Images</h3>
                  <p className="leading-relaxed">
                    This site temporarily processes image data uploaded by users to provide AI image generation services. 
                    These image data are not stored on our servers after processing is complete.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-muted mb-2">2.2 Usage Logs</h3>
                  <p className="leading-relaxed">
                    For service quality improvement, we may automatically collect usage logs such as IP addresses, browser information, and access times. 
                    This information is not used for personal identification purposes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">3. Purpose of Information Use</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Provision of AI image generation services</li>
                <li>Service quality improvement and enhancement</li>
                <li>Prevention of unauthorized access and misuse</li>
                <li>System maintenance and management</li>
                <li>Legal compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">4. Provision to Third Parties</h2>
              <p className="leading-relaxed">
                This site does not provide personal information to third parties without user consent, 
                except in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 leading-relaxed">
                <li>When required by law</li>
                <li>When necessary to protect human life, body or property</li>
                <li>When necessary for public health improvement or healthy child development promotion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">5. Data Retention Period</h2>
              <p className="leading-relaxed">
                Uploaded image data is deleted immediately after AI processing is complete. 
                Usage logs are retained for up to 90 days for service improvement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">6. Cookie Usage</h2>
              <p className="leading-relaxed">
                This site may use cookies to improve user experience. 
                By using cookies, we can analyze service usage and make improvements. 
                Users can refuse to accept cookies through browser settings, 
                but some service features may become unavailable in that case.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">7. Security Measures</h2>
              <p className="leading-relaxed">
                This site implements appropriate security measures to prevent leakage, loss, or damage of personal information. 
                Uploaded image data is transmitted through encrypted communication channels and is completely deleted after processing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">8. AI-Generated Image Precautions</h2>
              <div className="bg-surface border border-border rounded-lg p-4 mb-4">
                <p className="text-sm text-text-muted leading-relaxed">
                  <span className="font-semibold">※ Important Notice:</span>
                  All images generated on this site are created by AI technology. Similarity to real people or works is coincidental and not intentional imitation.
                </p>
              </div>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  Regarding this site's AI image generation service, please note the following:
                </p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Generated images are automatically created by AI technology, and similarity to real people or works is coincidental.</li>
                  <li>If disputes arise with third parties due to use of generated images, this site assumes no responsibility.</li>
                  <li>When using generated images, users should use them appropriately and be careful not to infringe on third-party rights.</li>
                  <li>For commercial use or use by public institutions, please consult with us in advance.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">9. Privacy Policy Changes</h2>
              <p className="leading-relaxed">
                This site may change the contents of this privacy policy as necessary. 
                The revised privacy policy will take effect from the time it is posted on this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">10. Contact</h2>
              <p className="leading-relaxed">
                For inquiries regarding this privacy policy, please contact us at the following email address.
              </p>
              <p className="mt-2 font-semibold text-text-muted">
                Email: <a href="mailto:support@2kawaii.com" className="underline hover:text-text">support@2kawaii.com</a>
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-sm text-gray-500 mb-6">
                Last Updated: July 24, 2025
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}