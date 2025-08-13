import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplateGallery from "@/components/TemplateGallery";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import MobileBottomNav from "@/components/MobileBottomNav";
import HomeLatestShares from "@/components/HomeLatestShares";
import Image from 'next/image'

// Homepage SEO metadata for English - aligned with Japanese structure
export const metadata = {
  title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
  description: "Free AI image generator with no registration required. Supports GPT-4o Image and Flux Kontext; converts photos to anime style in seconds. Studio Ghibli, VTuber, chibi styles and 20+ templates supported.",
  openGraph: {
    title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
    description: "Free AI image generator with no registration required. Supports GPT-4o Image and Flux Kontext; converts photos to anime style in seconds. Studio Ghibli, VTuber, chibi styles supported.",
    url: "https://2kawaii.com/en",
    siteName: "2kawaii AI Image Generator",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Free AI Image Generator No Registration - 2kawaii GPT-4o",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
    description: "Free AI image generator with no registration required. Supports GPT-4o Image and Flux Kontext; converts photos to anime style in seconds.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-homepage.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/en",
    languages: {
      ja: "https://2kawaii.com",
      en: "https://2kawaii.com/en",
      "x-default": "https://2kawaii.com",
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
};

// JSON-LD structured data - aligned with Japanese version
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '2kawaii GPT-4o Image Generator',
  description: 'Free AI tool that automatically generates prompts and converts photos to anime style instantly using GPT-4o Image',
  url: 'https://2kawaii.com/en',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Free AI image generation with no registration required',
    'Automatic prompt generation',
    'Convert photos to anime style instantly',
    'Studio Ghibli, chibi, VTuber styles supported',
    'Generation completed in seconds',
    'Commercial use allowed'
  ],
  screenshot: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/homepage-screenshot.jpg',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* JSON-LD structured data embed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <Header />

      {/* Hero section */}
      <HomeHero />

      {/* Today's latest works (below CTA) */}
      <div className="animate-fade-in">
        <HomeLatestShares />
      </div>

      {/* 12 template styles display - optimized mobile spacing */}
      <div className="pt-6 pb-12 lg:pt-8 lg:pb-20 animate-fade-in">
        <TemplateGallery />
      </div>

      {/* How to use guide - optimized mobile spacing and responsive */}
      <section className="py-12 lg:py-20 px-3 sm:px-4 lg:px-6 bg-[var(--bg)] animate-fade-in">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-[var(--text)] mb-8 lg:mb-12 animate-fade-in-up">
            How to Use AI Image Conversion - 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center card p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up h-full flex flex-col" style={{animationDelay: '0.2s'}}>
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guide-step1" 
                  alt="AI Image Conversion Model and Template Selection - Free Tool" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI Image Conversion Model and Template Selection Guide"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">1. Select Model and Template</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">Choose your preferred AI model and anime style template</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up h-full flex flex-col" style={{animationDelay: '0.4s'}}>
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-step2" 
                  alt="AI Image Conversion Image Upload and Start - Free Tool" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI Image Conversion Image Upload and Start"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">2. Upload Image and Start</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">Upload your photo and click the start button to begin AI conversion</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 animate-scale-in animate-fade-in-up h-full flex flex-col" style={{animationDelay: '0.6s'}}>
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides-success_gain_final_image" 
                  alt="AI Image Conversion Success - Final Image Download Available Commercial Use" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI Image Conversion Success - Final Image Download"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">3. Success! Get Final Image</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">AI conversion complete! Download high-quality anime images and share on social media</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free AI Image Conversion Services Comparison Table - optimized mobile layout */}
      <section className="py-12 lg:py-16 px-3 sm:px-4 lg:px-6 bg-[var(--bg)] animate-fade-in">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-[var(--text)] mb-6 lg:mb-8 animate-fade-in-up">
            Free AI Image Conversion Services Comparison
          </h2>
          <div className="card p-3 sm:p-4 lg:p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 px-2 font-bold text-[var(--text)]">Service Name</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">Free Usage</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">Registration Required</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">Commercial Use</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">Ease of Use</th>
                    <th className="py-2 px-2 font-bold text-[var(--text)]">Quality</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-muted)]">
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-4 px-4 font-semibold text-sm sm:text-base">2kawaii</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ Completely Free</td>
                    <td className="py-4 px-4 text-sm sm:text-base">❌ Not Required</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ Allowed</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐ Super Easy</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Canva</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🆓 Partially Free</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ Required</td>
                    <td className="py-4 px-4 text-sm sm:text-base">📄 Conditional</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐ Easy</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Midjourney</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🎁 25 Free Uses</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ Required</td>
                    <td className="py-4 px-4 text-sm sm:text-base">📄 Conditional</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐ Moderate</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-4 px-4 text-sm sm:text-base">Stable Diffusion</td>
                    <td className="py-4 px-4 text-sm sm:text-base">🆓 Basic Free</td>
                    <td className="py-4 px-4 text-sm sm:text-base">✅ Required</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⚠️ Complex</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐⭐ Difficult</td>
                    <td className="py-4 px-4 text-sm sm:text-base">⭐⭐⭐⭐</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Internal linking strategy - long-tail keyword section - optimized mobile */}
      <section className="py-12 lg:py-16 px-3 sm:px-4 lg:px-6 bg-[var(--surface)] animate-fade-in">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-[var(--text)] mb-8">
            Related Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <Link href="/en/ai-image-generation-guide" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%90%89%E5%8D%9C%E5%8A%9B%E9%A3%8E-after" 
                    alt="AI Image Generation Beginner Guide" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">AI Image Generation Beginner Guide</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">Complete guide to convert photos to anime style</p>
                </div>
              </div>
            </Link>
            
            <Link href="/en/line-sticker-creation" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E8%A1%A8%E6%83%85%E5%8C%85-after" 
                    alt="LINE Sticker Creation Guide" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">LINE Sticker Creation Guide</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">Convert photos to cute LINE stickers for free</p>
                </div>
              </div>
            </Link>
            
            <Link href="/en/chibi-character-maker" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/chibi-after" 
                    alt="Chibi Character Creation" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">Chibi Character Creation</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">Create cute chibi characters with AI</p>
                </div>
              </div>
            </Link>
            
            <Link href="/en/ai-image-conversion-free" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%8E%9A%E6%B6%82-after" 
                    alt="AI Image Conversion Free Comparison" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">AI Image Conversion Free Comparison</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">Comprehensive comparison of free AI image conversion tools</p>
                </div>
              </div>
            </Link>
            
            <Link href="/en/personification-ai" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8B%9F%E4%BA%BA%E5%8C%96-after" 
                    alt="Anthropomorphism AI Usage Guide" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">Anthropomorphism AI Usage Guide</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">How to anthropomorphize pets and objects</p>
                </div>
              </div>
            </Link>
            
            <Link href="/en/anime-icon-creation" className="card p-3 sm:p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image 
                    src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/line%E5%A4%B4%E5%83%8F-afterr" 
                    alt="Anime Icon Creation Free" 
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg shadow-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] mb-1">Anime Icon Creation Free</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">Create free anime icons for social media</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - optimized mobile spacing */}
      <div className="py-12 lg:py-20 animate-fade-in">
        <FAQ />
      </div>

      {/* CTA Section - optimized mobile spacing and responsive */}
      <section className="py-12 lg:py-20 px-3 sm:px-4 lg:px-6 animate-fade-in">
        <div className="max-w-5xl mx-auto text-center px-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6 animate-fade-in-up">
            Transform into Anime Character Now!
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--text-muted)] mb-6 lg:mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Your photo will be reborn as a cute anime character
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link href="/en/workspace" className="btn-primary text-base sm:text-lg px-6 sm:px-8 lg:px-10 py-3 lg:py-4">
              Start for Free 🎀
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}