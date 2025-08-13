/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com',
  generateRobotsTxt: true,
  exclude: [],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/api/sitemap-share`
    ]
  },
  transform: async (config, path) => {
    const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'
    // Normalize to generate reciprocal hreflang for both languages
    const isEn = path === '/en' || path.startsWith('/en/')
    const jaPath = isEn ? (path === '/en' ? '/' : path.replace(/^\/en/, '')) : path
    const enPath = isEn ? path : (path === '/' ? '/en' : `/en${path}`)

    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: `${origin}${jaPath}`, hreflang: 'ja' },
        { href: `${origin}${enPath}`, hreflang: 'en' },
        { href: `${origin}${jaPath}`, hreflang: 'x-default' }
      ],
    }
  },
}


