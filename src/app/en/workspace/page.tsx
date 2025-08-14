import Workspace from "@/components/Workspace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Image from 'next/image'

// Additional SEO metadata for English workspace
export const metadata = {
  title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
  description: "Free AI image generator with no registration required. Supports GPT-4o Image and Flux Kontext; converts photos to anime style in seconds. Studio Ghibli, VTuber, chibi styles supported.",
  openGraph: {
    title: "Free AI Image Generator | Convert Photos to Anime Style - 2kawaii",
    description: "Free AI image generator with no registration required. Supports GPT-4o Image and Flux Kontext; converts photos to anime style in seconds. Studio Ghibli, VTuber, chibi styles supported.",
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
    description: "Free AI image generator with no registration required. Supports GPT-4o Image and Flux Kontext; converts photos to anime style in seconds.",
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
  name: '2kawaii Image Generator (GPT-4o / Flux Kontext)',
  description: 'Free AI tool supporting GPT-4o Image and Flux Kontext to convert photos to anime style in seconds',
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
    'Generation completed in seconds',
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black font-cute mb-2">
              Photo → Anime in Seconds (GPT‑4o / Flux Kontext)
            </h1>
            <h2 className="text-lg sm:text-xl text-black max-w-2xl mx-auto">
              Upload your image, pick model and aspect ratio. Fast, high‑quality, no signup.
            </h2>
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
            How it works (3 steps) — AI image conversion in seconds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides1-choosemodelandeuploadimage.jpg" 
                  alt="AI Image Conversion Model Selection and Image Upload - Free Tool" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI Image Conversion Model Selection and Image Upload Guide"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">1-2. Select Model and Upload Image</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">Choose your preferred AI model and upload JPEG/PNG format photos</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides2-choosesizeandchoosetemplate.jpg" 
                  alt="AI Image Conversion Size Selection and Template Selection - Free Tool" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI Image Conversion Size Selection and Template Selection"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">3-4. Select Size and Template</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">Choose aspect ratio and select your preferred anime style template</p>
            </div>
            <div className="text-center card p-6 sm:p-8 lg:p-10 h-full flex flex-col">
              <div className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 mx-auto mb-6">
                <Image 
                  src="https://fury-template-1363880159.cos.ap-guangzhou.myqcloud.com/guides3-clickstartandgetfinialimage.jpg" 
                  alt="AI Image Conversion Success - Click Start and Get Final Image Download Available Commercial Use" 
                  width={224}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  title="AI Image Conversion Success - Click Start and Get Final Image"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text)] mb-4 lg:mb-6">5. Click Start and Get Final Image</h3>
              <p className="text-[var(--text-muted)] text-sm sm:text-base lg:text-lg leading-relaxed">Click the "Start" button to begin AI conversion! Download high-quality anime images and share on social media</p>
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