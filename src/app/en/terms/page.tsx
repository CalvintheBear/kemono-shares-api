import type { Metadata } from 'next';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

// Terms of service SEO metadata for English - aligned with Japanese structure
export const metadata: Metadata = {
  title: "Terms of Service AI Image Generation | 2kawaii.com Usage Guidelines",
  description: "2kawaii.com AI image generation service terms of service. Image usage rights, commercial use, prohibited matters, liability limitations, service content, user obligations explained in detail. Free, no registration required.",
  alternates: {
    canonical: "https://2kawaii.com/en/terms",
    languages: {
      ja: "https://2kawaii.com/terms",
      en: "https://2kawaii.com/en/terms",
      "x-default": "https://2kawaii.com/terms",
    },
  },
  openGraph: {
    title: "Terms of Service AI Image Generation | 2kawaii.com Usage Guidelines",
    description: "2kawaii AI image generation service terms of service. Image usage rights, commercial use, prohibited matters, liability limitations explained in detail.",
    url: "https://2kawaii.com/en/terms",
    siteName: "2kawaii AI Image Generation",
    images: [{
      url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-terms.jpg",
      width: 1200,
      height: 630,
      alt: "2kawaii Terms of Service",
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service AI Image Generation | 2kawaii.com Usage Guidelines",
    description: "2kawaii AI image generation service terms of service. Image usage rights, commercial use, prohibited matters, liability limitations explained in detail.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-terms.jpg"],
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

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 lg:p-12 border border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-text mb-4 font-cute">
              Terms of Service
            </h1>
            <p className="text-lg text-text-muted font-cute">
              2kawaii.com Usage Guidelines
            </p>
          </div>

          <div className="space-y-8 text-gray-700 font-cute">
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By using 2kawaii.com (hereinafter referred to as "this site"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">2. Service Description</h2>
              <p className="leading-relaxed">
                This site provides AI image generation services that convert uploaded photos into anime-style images. 
                The service is provided free of charge and does not require user registration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">3. User Responsibilities</h2>
              <p className="leading-relaxed mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Ensuring they have the right to use uploaded images</li>
                <li>Complying with applicable laws and regulations</li>
                <li>Not uploading inappropriate or illegal content</li>
                <li>Using generated images responsibly and ethically</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">4. Prohibited Activities</h2>
              <p className="leading-relaxed mb-4">
                The following activities are strictly prohibited:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Uploading images that infringe on others' rights</li>
                <li>Using the service for illegal purposes</li>
                <li>Attempting to reverse engineer the AI system</li>
                <li>Uploading explicit or harmful content</li>
                <li>Using the service to harass or harm others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">5. Image Usage Rights</h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  <strong>5.1 User Rights:</strong> Users retain full rights to images they generate using this service.
                </p>
                <p className="leading-relaxed">
                  <strong>5.2 Commercial Use:</strong> Generated images may be used for commercial purposes, provided they do not infringe on third-party rights.
                </p>
                <p className="leading-relaxed">
                  <strong>5.3 Attribution:</strong> While not required, attribution to 2kawaii.com is appreciated when sharing generated images.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">6. Disclaimer of Warranties</h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  <strong>6.1 Service Availability:</strong> This service is provided "as is" without any warranties of any kind.
                </p>
                <p className="leading-relaxed">
                  <strong>6.2 Image Quality:</strong> While we strive for high-quality results, we do not guarantee specific image quality or accuracy.
                </p>
                <p className="leading-relaxed">
                  <strong>6.3 AI Limitations:</strong> AI-generated images may contain unexpected results or artifacts. Users acknowledge these limitations.
                </p>
                <p className="leading-relaxed">
                  <strong>6.4 Third-party Rights:</strong> Users are responsible for ensuring their use of generated images does not infringe on third-party rights.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">7. Limitation of Liability</h2>
              <p className="leading-relaxed">
                This site shall not be liable for any direct, indirect, incidental, special, or consequential damages 
                arising from the use or inability to use this service, including but not limited to damages for loss of profits, 
                goodwill, use, data, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">8. Service Modifications</h2>
              <p className="leading-relaxed">
                We reserve the right to modify or discontinue the service at any time without notice. 
                We are not liable to users or any third party for any modification, price change, suspension, or discontinuation of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">9. Intellectual Property</h2>
              <p className="leading-relaxed">
                The service, including its AI models, algorithms, and website content, is protected by intellectual property laws. 
                Users may not copy, modify, or distribute any part of the service without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">10. Governing Law</h2>
              <p className="leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of Japan, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">11. Contact Information</h2>
              <p className="leading-relaxed">
                For questions about these Terms of Service, please contact us at:
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