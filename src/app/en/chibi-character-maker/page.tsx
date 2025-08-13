import type { Metadata } from 'next';
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Chibi Character Maker | Create Cute Chibi Characters with AI Free",
  description: "Free chibi character creation using AI. Convert your photos to adorable chibi-style characters instantly. No registration required, perfect for LINE stickers, SNS icons, and cute wallpapers. Commercial use allowed.",
  alternates: {
    canonical: "https://2kawaii.com/en/chibi-character-maker",
    languages: {
      ja: "https://2kawaii.com/chibi-character-maker",
      en: "https://2kawaii.com/en/chibi-character-maker",
      "x-default": "https://2kawaii.com/chibi-character-maker",
    },
  },
  openGraph: {
    title: "Chibi Character Maker | Create Cute Chibi Characters with AI Free",
    description: "Create adorable chibi characters using AI. Convert your photos to cute chibi-style characters for free. Perfect for LINE stickers and SNS icons.",
    url: "https://2kawaii.com/en/chibi-character-maker",
    siteName: "2kawaii Chibi Maker",
    images: [{
      url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-chibi.jpg",
      width: 1200,
      height: 630,
      alt: "Chibi Character Maker - 2kawaii AI",
    }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chibi Character Maker | Create Cute Chibi Characters with AI Free",
    description: "Create adorable chibi characters using AI. Free chibi character creation with no registration required.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-chibi.jpg"],
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
};

export default function ChibiMakerPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-8 text-center">
              Chibi Character Creation - Create Cute Chibi Characters Free with AI
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after" 
                  alt="Chibi Character Sample" 
                  width={192}
                  height={192}
                  className="mx-auto rounded-lg shadow-lg w-48 h-48 object-cover"
                  unoptimized
                />
                <p className="text-sm text-text-muted mt-2">Chibi Character</p>
              </div>
              
              <div className="text-center">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/SD%E5%B0%8F%E4%BA%BA-after" 
                  alt="SD Character Sample" 
                  width={192}
                  height={192}
                  className="mx-auto rounded-lg shadow-lg w-48 h-48 object-cover"
                  unoptimized
                />
                <p className="text-sm text-text-muted mt-2">SD Character</p>
              </div>
            </div>
          
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">How to Create Chibi Characters with AI</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Chibi characters with large heads and small bodies can be easily created using AI image generation technology.
              Simply upload your photo and a cute chibi character will be generated automatically.
            </p>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Chibi Character Creation Features</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li>Adorable deformed expression with large head</li>
              <li>Simplified features expressing personality</li>
              <li>Easy to use for stickers and icons</li>
              <li>Commercial use allowed</li>
            </ul>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Uses for Chibi Characters</h2>
            <ul className="list-disc list-inside space-y-2 text-text-muted">
              <li>LINE sticker creation</li>
              <li>SNS profile pictures</li>
              <li>Phone wallpapers</li>
              <li>Original merchandise</li>
            </ul>
          </section>

          <section className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/en/workspace" className="btn-kawaii text-xl px-8 py-4">
                Start Creating Chibi Characters Now 🎨
              </Link>
              <Link href="/en/share" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Gallery Examples 🖼️
              </Link>
            </div>
          </section>

          {/* Related Content */}
          <section className="card-kawaii p-8 mt-12">
            <h2 className="text-2xl font-bold text-text mb-6 text-center">Related Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/en/ai-image-generation-guide" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">AI Image Generation Beginner Guide</h3>
                <p className="text-text-muted text-sm">Complete guide to converting photos to anime style</p>
              </Link>
              
              <Link href="/en/line-sticker-creation" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">LINE Sticker Creation Guide</h3>
                <p className="text-text-muted text-sm">Convert photos to cute LINE stickers for free</p>
              </Link>
              
              <Link href="/en/chibi-character-maker" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">Chibi Character Creation</h3>
                <p className="text-text-muted text-sm">Create cute chibi characters with AI</p>
              </Link>
              
              <Link href="/en/ai-image-conversion-free" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">AI Image Conversion Comparison</h3>
                <p className="text-text-muted text-sm">Compare free AI image conversion tools</p>
              </Link>
              
              <Link href="/en/personification-ai" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">Personification AI Usage</h3>
                <p className="text-text-muted text-sm">How to personify pets and objects</p>
              </Link>
              
              <Link href="/en/anime-icon-creation" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">Free Icon Creation</h3>
                <p className="text-text-muted text-sm">Create free anime icons for SNS</p>
              </Link>
            </div>
          </section>
        </article>
      </div>
      </main>
      
      <Footer />
    </div>
  )
}