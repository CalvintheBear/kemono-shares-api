/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com',
  generateRobotsTxt: true,
  exclude: ['/robots.txt', '/icon', '/icon.ico'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}/api/sitemap-share`
    ]
  },
  transform: async (config, path) => {
    const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'
    const isEn = path === '/en' || path.startsWith('/en/')
    const basePath = isEn ? (path === '/en' ? '' : path.replace(/^\/en/, '')) : path
    const jaHref = `${origin}${basePath || '/'}`
    const enHref = `${origin}/en${basePath || ''}`

    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: jaHref, hreflang: 'ja' },
        { href: enHref, hreflang: 'en' },
        { href: jaHref, hreflang: 'x-default' },
      ],
    }
  },
}


