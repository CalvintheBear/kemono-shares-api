import type { Metadata } from 'next';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

// FAQ page SEO metadata for English - aligned with Japanese structure
export const metadata = {
  title: "FAQ Free AI Image Generator | GPT-4o & Flux Kontext Photo to Anime Conversion - 2kawaii",
  description: "2kawaii.com AI image generation service FAQ. Free photo to anime conversion, commercial use allowed, no registration required, 2-5 minute fast generation, privacy protection - detailed answers to common questions.",
  openGraph: {
    title: "FAQ Free AI Image Generator | GPT-4o & Flux Kontext Photo to Anime Conversion",
    description: "2kawaii.com AI image generation service FAQ. Free, commercial use allowed, no registration required.",
    url: "https://2kawaii.com/en/faq",
    siteName: "2kawaii AI Image Generator",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-faq.jpg",
        width: 1200,
        height: 630,
        alt: "2kawaii AI Image Generator FAQ",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ Free AI Image Generator | GPT-4o & Flux Kontext Photo to Anime Conversion",
    description: "2kawaii.com AI image generation service FAQ. Free, commercial use allowed, no registration required.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-faq.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/en/faq",
    languages: {
      ja: "https://2kawaii.com/faq",
      en: "https://2kawaii.com/en/faq",
      "x-default": "https://2kawaii.com/faq",
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

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: "About Service",
    question: "What kind of service is 2kawaii.com?",
    answer: "2kawaii.com is a service that uses AI technology to convert photos and images into cute anime style. You can choose from over 22 styles to transform your photos into attractive anime characters."
  },
  {
    category: "About Service",
    question: "What styles are available?",
    answer: "We offer over 22 styles including humanization, Ghibli style, cute wallpapers, Uma Musume, chibi characters, moe style, LINE sticker style, different world, yandere, thick paint, 3D CG, otome game, Crayon Shin-chan, ID photo processing, etc. Each style has unique characteristics and can create various atmospheres."
  },
  {
    category: "How to Use",
    question: "How do I use it?",
    answer: "1. Choose your favorite style template in simple mode or enter a custom prompt in manual mode. 2. Upload the image you want to convert. 3. Select the image size. 4. Press the 'Transform' button and it's completed in seconds!"
  },
  {
    category: "How to Use",
    question: "What images can I upload?",
    answer: "You can upload JPG, PNG, WebP format images up to 10MB. We support various types of images including people photos, landscapes, and illustrations. However, uploading images that infringe on others' portrait rights or inappropriate content is prohibited."
  },
  {
    category: "Pricing & Free",
    question: "Is this service free?",
    answer: "Currently, all basic features are available for free. However, there is a daily generation limit. While we may add premium features in the future, basic features will continue to be provided free of charge."
  },
  {
    category: "Technical Questions",
    question: "How does AI convert images?",
    answer: "We use the latest GPT-4o Image and Flux Kontext models to analyze image features and generate new anime images based on the selected style. This process is automatic and usually completes in seconds."
  },
  {
    category: "Technical Questions",
    question: "What is the quality of generated images?",
    answer: "High-quality 4K resolution images are generated. They are beautifully detailed and achieve professional-quality finishes. Each style is professionally adjusted to provide natural and attractive results."
  },
  {
    category: "Privacy",
    question: "What happens to uploaded images?",
    answer: "Uploaded images are only used temporarily for AI processing and are completely deleted after processing is complete. Images are never stored on our servers, so your privacy is fully protected."
  },
  {
    category: "Privacy",
    question: "How is personal information handled?",
    answer: "We only collect basic information such as IP addresses and browser information for service operation and do not store any personally identifiable information. Please see our privacy policy for details."
  },
  {
    category: "Troubleshooting",
    question: "What should I do if the image doesn't convert properly?",
    answer: "Please try the following: 1. Keep image size under 10MB. 2. Use JPG, PNG, WebP formats. 3. Check your network connection. 4. Wait a while and try again. If the problem persists, please contact us via the inquiry form."
  },
  {
    category: "Troubleshooting",
    question: "Can generation take a long time?",
    answer: "It usually completes in seconds, but during server congestion it may take longer. If it doesn't complete within a minute, please refresh the page and try again."
  },
  {
    category: "Copyright",
    question: "Who owns the copyright of generated images?",
    answer: "Copyright of generated images belongs to the user. Users can freely use, download, and share them. However, when using generated images for commercial purposes, please be careful not to infringe on third-party rights."
  },
  {
    category: "Copyright",
    question: "Can I use photos of celebrities?",
    answer: "When using celebrity photos, please be careful about portrait rights. Personal use on social media is fine, but commercial use or public distribution may infringe on portrait rights."
  },
  {
    category: "Copyright",
    question: "About similarity between AI-generated images and real people or works",
    answer: "All images generated on this site are created by AI technology. Similarity to real people or works is coincidental and not intentional imitation. If disputes arise with third parties due to use of generated images, this site assumes no responsibility. Please see Article 6-2 of our Terms of Service for details."
  },
  {
    category: "Technical Specifications",
    question: "What image sizes are supported?",
    answer: "You can choose from 3 types: 1:1 (square), 3:2 (landscape), and 2:3 (portrait). Please select the optimal size according to the aspect ratio of your original image."
  },
  {
    category: "Technical Specifications",
    question: "How many images can I process maximum?",
    answer: "Currently, you can process up to 10 images per day for free. This limit may change depending on congestion conditions."
  },
  {
    category: "Mobile Support",
    question: "Can I use it on smartphones?",
    answer: "Yes, it's fully mobile compatible. You can use all features just like on PC from smartphones and tablets."
  },
  {
    category: "Future Updates",
    question: "Will new styles be added?",
    answer: "Yes, we plan to add new styles regularly. We will continue to evolve to provide more diverse expressions while incorporating user requests."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD structured data embed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            name: 'FAQ - 2kawaii AI Image Generation',
            description: 'Frequently asked questions and answers about 2kawaii.com AI image generation service',
            url: 'https://2kawaii.com/en/faq',
            mainEntity: faqData.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          }),
        }}
      />
      
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-4 font-cute">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-text-muted font-cute max-w-2xl mx-auto">
            Answers to common questions about 2kawaii.com's services.
            If you have any issues, please check here first.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="w-full px-6 py-4 text-left">
                <div className="flex-1 pr-4 mb-4">
                  <p className="font-semibold text-text font-cute">{faq.question}</p>
                  <p className="text-xs text-text-muted mt-1">{faq.category}</p>
                </div>
                <div className="px-0 py-4 border-t border-border">
                  <p className="text-gray-700 leading-relaxed font-cute">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional information */}
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-text mb-4 font-cute">
            Still have questions?
          </h2>
          <p className="text-text-muted mb-6 font-cute">
            If you have any other questions or issues, please feel free to contact us.
          </p>
          <div className="space-y-4">
            <a
              href="mailto:support@2kawaii.com"
              className="inline-block bg-gradient-to-r from-pink-500 btn-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
            >
              📧 Contact by Email
            </a>
            <p className="text-sm text-text-muted">
              We usually respond within 24 hours
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
            <h3 className="text-lg font-bold text-text mb-3 font-cute">📖 Important Links</h3>
            <ul className="space-y-2 text-text-muted">
              <li><Link href="/en/privacy" className="hover:text-pink-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/en/terms" className="hover:text-pink-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/en/workspace" className="hover:text-pink-600 transition-colors">Start Service</Link></li>
            </ul>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
            <h3 className="text-lg font-bold text-text mb-3 font-cute">🚀 Start Now</h3>
            <p className="text-text-muted text-sm mb-3">
              Try it for free first! Convert your photos to anime in 3 easy steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/en/workspace"
                className="inline-block bg-gradient-to-r btn-primary to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-md transition-all"
              >
                Start Conversion
              </Link>
              <Link
                href="/en/share"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-md transition-all"
              >
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}