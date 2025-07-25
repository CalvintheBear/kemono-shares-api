'use client'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  images: Array<{
    src: string
    alt?: string
    title?: string
  }>
  currentIndex?: number
}

export default function ImageLightbox({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex = 0 
}: ImageLightboxProps) {

  const slides = images.map(img => ({
    src: img.src,
    alt: img.alt,
    title: img.title
  }))

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      index={currentIndex}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, .9)" },
        toolbar: { backgroundColor: "rgba(0, 0, 0, .8)" },
        navigationPrev: { backgroundColor: "rgba(255, 255, 255, .1)" },
        navigationNext: { backgroundColor: "rgba(255, 255, 255, .1)" }
      }}
      render={{
        buttonPrev: () => (
          <div className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        ),
        buttonNext: () => (
          <div className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ),
        buttonClose: () => (
          <div className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      }}
      animation={{ fade: 300 }}
      controller={{ closeOnBackdropClick: true }}
    />
  )
} 