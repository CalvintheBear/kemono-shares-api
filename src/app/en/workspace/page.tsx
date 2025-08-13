import Workspace from "@/components/Workspace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Image from 'next/image'

// Additional SEO metadata for English workspace
export const metadata = {
  title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
  description: "Free AI image generator with no registration required. GPT-4o image automatically generates prompts and converts photos to anime style in 2-5 minutes. Studio Ghibli, VTuber, chibi styles supported.",
  openGraph: {
    title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
    description: "Free AI image generator with no registration required. GPT-4o image automatically generates prompts and converts photos to anime style in 2-5 minutes. Studio Ghibli, VTuber, chibi styles supported.",
    url: "https://2kawaii.com/en/workspace",
    siteName: "2kawaii AI Image Generator",
    images: [
      {
        url: "https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/og-workspace.jpg",
        width: 1200,
        height: 630,
        alt: "Free AI Image Generator - 2kawaii GPT-4o",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
    description: "Free AI image generator with no registration required. GPT-4o image automatically generates prompts and converts photos to anime style in 2-5 minutes.",
    images: ["https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/twitter-workspace.jpg"],
  },
  alternates: {
    canonical: "https://2kawaii.com/en/workspace",
    languages: {
      ja: "https://2kawaii.com/workspace",
      en: "https://2kawaii.com/en/workspace",
      "x-default": "https://2kawaii.com/workspace",
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

// JSON-LD structured data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '2kawaii GPT-4o Image Generator',
  description: 'Free AI tool that automatically generates prompts and converts photos to anime style instantly using GPT-4o Image',
  url: 'https://2kawaii.com/en/workspace',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Free AI image generation',
    'Automatic prompt generation',
    'Convert photos to anime style instantly',
    'Studio Ghibli, chibi, VTuber styles supported',
    'Fast generation in 2-5 minutes',
    'Commercial use allowed'
  ],
  screenshot: 'https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/workspace-screenshot.jpg',
}

export default function WorkspacePage() {
  return (
    <div className="min-h-screen">
      {/* JSON-LD structured data embed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Top navigation */}
      <Header />

      {/* Main content with navigation height padding */}
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page title area */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black font-cute mb-4">
              Start AI Image Conversion!
            </h1>
            <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto">
              Just upload your photo and select your favorite style~
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-4"></div>
          </div>

          {/* Workspace component */}
          <Workspace />
        </div>
      </main>

      {/* How to use guide - 3 simple steps (copied from homepage and translated) */}
      <section id="guides-section" className="py-12 lg:py-20 px-3 sm:px-4 lg:px-6 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-[var(--text)] mb-8 lg:mb-12">
            How to Use AI Image Conversion - 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
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
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
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
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
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

      {/* Footer */}
      <Footer />
      <MobileBottomNav />
    </div>
  );
}