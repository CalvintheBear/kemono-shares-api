import type { Metadata } from 'next';

// Generate static parameters
export function generateStaticParams() {
  return [
    { locale: 'en' }
  ];
}
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Complete AI Image Generation Guide | Convert Photos to Anime Free with GPT-4o",
  description: "Beginner-friendly complete guide to convert photos to anime style for free using GPT-4o Image and Flux Kontext. No prompt required, completed in seconds. Studio Ghibli, VTuber, chibi and 20+ style selection guide included.",
  alternates: {
    canonical: "https://2kawaii.com/en/ai-image-generation-guide",
    languages: {
      ja: "https://2kawaii.com/ai-image-generation-guide",
      en: "https://2kawaii.com/en/ai-image-generation-guide",
      "x-default": "https://2kawaii.com/ai-image-generation-guide",
    },
  },
  openGraph: {
    title: "Complete AI Image Generation Guide | Convert Photos to Anime Free with GPT-4o",
    description: "Beginner-friendly guide to convert photos to anime style for free using GPT-4o Image and Flux Kontext. No prompt required, completed in seconds. Studio Ghibli, VTuber, chibi supported.",
    url: "https://2kawaii.com/en/ai-image-generation-guide",
    siteName: "2kawaii AI Image Generation",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-ai-guide.jpg",
        width: 1200,
        height: 630,
        alt: "Complete AI Image Generation Guide - 2kawaii GPT-4o",
      }
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete AI Image Generation Guide | Convert Photos to Anime Free with GPT-4o",
    description: "Beginner-friendly guide to convert photos to anime style for free using GPT-4o Image and Flux Kontext. No prompt required, completed in seconds.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-ai-guide.jpg"],
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

export default function AIGuidePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-8 text-center">
              AI Image Generation Beginner Guide - Complete Guide to Convert Photos to Anime Style
            </h1>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-text mb-4 text-center">Popular Anime Styles</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%90%8C%E5%8C%96-afterr" 
                    alt="Moe Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">Moe Style</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%90%89%E5%8D%9C%E5%8A%9B%E9%A3%8E-after" 
                    alt="Ghibli Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">Ghibli Style</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/Vtuber-after" 
                    alt="VTuber Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">VTuber</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E8%93%9D%E8%89%B2%E6%A1%A3%E6%A1%88-after" 
                    alt="Blue Archive Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">Blue Archive</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-text mb-4 text-center">Realistic Styles</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%86%99%E7%9C%9F%E6%BC%AB%E7%94%BB%E5%8C%96-after" 
                    alt="Photo to Anime Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">Photo to Anime</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-after" 
                    alt="Thick Paint Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">Thick Paint</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/3DCG-after" 
                    alt="3D CG Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">3D CG</p>
                </div>
                
                <div className="text-center">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E4%B9%99%E6%B8%B8-after" 
                    alt="Otome Game Style Sample" 
                    className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover"
                    width={128}
                    height={128}
                    unoptimized
                  />
                  <p className="text-xs text-text-muted mt-2">Otome Game</p>
                </div>
              </div>
            </div>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">What is AI Image Generation?</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              AI image generation is a technology that uses artificial intelligence to convert photos into anime style.
              With the latest AI technology, you can transform your photos into cute anime characters.
            </p>
          </section>

          {/* How to use guide - 3 simple steps */}
          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-8 text-center">How to Use AI Image Conversion - 5 Simple Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides1-choosemodelandeuploadimage.jpg" 
                    alt="AI Image Conversion Model Selection and Image Upload - JPEG PNG Support Free Tool" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    width={192}
                    height={192}
                    unoptimized
                    title="AI Image Conversion Model Selection and Image Upload Guide"
                  />
                </div>
                <h3 className="text-lg font-bold text-text mb-4">1-2. Select Model and Upload Image</h3>
                <p className="text-text-muted text-sm leading-relaxed">Choose your preferred AI model and upload JPEG/PNG format photos by drag & drop or click to select</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides2-choosesizeandchoosetemplate.jpg" 
                    alt="Size Selection and Template Selection - Aspect Ratio Anime Style Free" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    width={192}
                    height={192}
                    unoptimized
                    title="AI Image Conversion Size Selection and Template Selection"
                  />
                </div>
                <h3 className="text-lg font-bold text-text mb-4">3-4. Select Size and Template</h3>
                <p className="text-text-muted text-sm leading-relaxed">Choose aspect ratio and select from over 20 anime styles including Ghibli style, VTuber style, beautiful girl, chibi, anthropomorphism, etc.</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides3-clickstartandgetfinialimage.jpg" 
                    alt="AI Image Conversion Complete - Anime Image Creation Download Available Commercial Use" 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    width={192}
                    height={192}
                    unoptimized
                    title="AI Image Conversion Complete"
                  />
                </div>
                <h3 className="text-lg font-bold text-text mb-4">5. Click Start and Get Final Image</h3>
                <p className="text-text-muted text-sm leading-relaxed">Click the "Start" button to begin AI conversion! Generate high-quality anime images in seconds with the latest AI technology! Download and share on social media</p>
              </div>
            </div>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Basic Usage of AI Image Generation</h2>
            <ol className="list-decimal list-inside space-y-3 text-text-muted">
              <li>Prepare a high-quality photo (front-facing photos are recommended)</li>
              <li>Select your preferred anime style (Ghibli style, VTuber style, beautiful girl, etc.)</li>
              <li>Start AI image generation (completed in seconds)</li>
              <li>Download the generated anime image</li>
            </ol>
          </section>

          <section className="card-kawaii p-8 mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Rich Anime Style Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold text-text mb-3">🐱 Kemonomimi</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>Cute animal ears and tail</li>
                  <li>Fantasy beastman style</li>
                  <li>Moe animal characters</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-text mb-3">👤 Humanization</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>Realistic human style</li>
                  <li>Natural human features</li>
                  <li>Realistic character representation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">🎨 Illustration</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>Anime illustration style</li>
                  <li>Beautiful painting style</li>
                  <li>High artistic expression</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">💖 Moe Style</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>Moe character style</li>
                  <li>Cute features</li>
                  <li>Anime moe style</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">🌸 Ghibli Style</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>Ghibli anime style</li>
                  <li>Gentle and warm atmosphere</li>
                  <li>Natural and beautiful expression</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text mb-3">👧 Girlification</h3>
                <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                  <li>Beautiful girl character transformation</li>
                  <li>Cute girl style</li>
                  <li>Moe beautiful girl</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/en/workspace" className="btn-kawaii text-xl px-8 py-4">
                Start AI Image Generation Now 🎨
              </Link>
              <Link href="/en/share" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Gallery 🖼️
              </Link>
            </div>
          </section>

          {/* Related content */}
          <section className="card-kawaii p-8 mt-12">
            <h2 className="text-2xl font-bold text-text mb-6 text-center">Related Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/en/ai-image-generation-guide" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">AI Image Generation Beginner Guide</h3>
                <p className="text-text-muted text-sm">Complete guide to convert photos to anime style</p>
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
                <h3 className="font-bold text-text mb-2">AI Image Conversion Free Comparison</h3>
                <p className="text-text-muted text-sm">Comprehensive comparison of free AI image conversion tools</p>
              </Link>
              
              <Link href="/en/personification-ai" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">Anthropomorphism AI Usage Guide</h3>
                <p className="text-text-muted text-sm">How to anthropomorphize pets and objects</p>
              </Link>
              
              <Link href="/en/anime-icon-creation" className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-text mb-2">Anime Icon Creation Free</h3>
                <p className="text-text-muted text-sm">Create free anime icons for social media</p>
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