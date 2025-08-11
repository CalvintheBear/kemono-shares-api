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
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}${path}`, hreflang: 'ja' },
        { href: `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'}${path}`, hreflang: 'x-default' }
      ],
    }
  },
}


