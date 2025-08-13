export const structuredData = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Free AI Image Converter - 2kawaii',
    alternateName: 'Turn your photos into anime style',
    url: 'https://2kawaii.com/en',
    description: 'Free AI image generator to convert photos into anime style. No signup needed. Multiple styles including Ghibli, VTuber, chibi.',
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://2kawaii.com/en/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '2kawaii AI Image Converter',
    url: 'https://2kawaii.com',
    logo: 'https://2kawaii.com/logo.png',
    description: 'Free AI tool to convert your photos into anime style.',
    sameAs: [
      'https://twitter.com/furycode_ai',
      'https://instagram.com/furycode_ai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+81-xxx-xxx-xxxx',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  },
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Image Converter - 2kawaii',
    applicationCategory: 'GraphicsApplication',
    description: 'Turn photos into anime-style images for free.',
    url: 'https://2kawaii.com/en',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Photo to Anime',
      'Create VTuber',
      'Chibi Character',
      'Commercial use allowed',
      'No registration',
    ],
    screenshot: 'https://2kawaii.com/screenshot.jpg',
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is it really free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, it is completely free. No registration required and no hidden fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which image formats are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We support JPG, PNG, and WebP up to 10MB. Higher resolution images produce better results.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use images for commercial purposes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, AI-generated images can be used commercially for social icons, profiles, VTuber models, etc.',
        },
      },
    ],
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://2kawaii.com/en',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'AI Image Converter',
        item: 'https://2kawaii.com/en/workspace',
      },
    ],
  },
}

export default structuredData

