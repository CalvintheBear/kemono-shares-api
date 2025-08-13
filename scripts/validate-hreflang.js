/**
 * Crawl built HTML under out/ and validate hreflang/canonical/alternate consistency
 */
const fs = require('fs')
const path = require('path')

function readHtml(p) {
  try { return fs.readFileSync(p, 'utf8') } catch { return '' }
}

function extractLinks(html) {
  const links = []
  const linkRe = /<link\s+[^>]*>/gi
  const attrsRe = /([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g
  const tags = html.match(linkRe) || []
  for (const tag of tags) {
    const attrs = {}
    let m
    while ((m = attrsRe.exec(tag))) {
      attrs[m[1].toLowerCase()] = m[2]
    }
    links.push(attrs)
  }
  return links
}

function validatePage(file, origin) {
  const html = readHtml(file)
  const links = extractLinks(html)
  const canonical = links.find(l => l.rel === 'canonical')?.href
  const alternates = links.filter(l => l.rel === 'alternate')

  const report = { file, ok: true, issues: [] }

  // basic checks
  if (!canonical) {
    report.ok = false
    report.issues.push('missing canonical')
  } else if (!canonical.startsWith(origin)) {
    report.ok = false
    report.issues.push(`canonical not starting with origin: ${canonical}`)
  }

  const hreflangs = new Map()
  for (const a of alternates) {
    if (a.hreflang && a.href) hreflangs.set(a.hreflang, a.href)
  }
  const req = ['ja', 'en', 'x-default']
  for (const k of req) {
    if (!hreflangs.has(k)) {
      report.ok = false
      report.issues.push(`missing alternate ${k}`)
    }
  }

  // reciprocity check for en/ja
  const en = hreflangs.get('en')
  const ja = hreflangs.get('ja')
  if (en && ja) {
    if (!(en.endsWith('/en') || en.includes('/en/')) || (ja.endsWith('/en') || ja.includes('/en/'))) {
      // heuristics: en link should be en path; ja link should not be en path
      report.ok = false
      report.issues.push('alternate links may not map to correct language paths')
    }
  }
  return report
}

function main() {
  const outDir = path.join(process.cwd(), 'out')
  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://2kawaii.com'
  if (!fs.existsSync(outDir)) {
    console.error('out directory not found, build first')
    process.exit(1)
  }
  const pages = [
    'index.html',
    'en.html',
    'share.html',
    'en/share.html',
    'ai-image-generation-guide.html',
    'en/ai-image-generation-guide.html',
    'line-sticker-creation.html',
    'en/line-sticker-creation.html',
    'chibi-character-maker.html',
    'en/chibi-character-maker.html',
    'ai-image-conversion-free.html',
    'en/ai-image-conversion-free.html',
    'personification-ai.html',
    'en/personification-ai.html',
    'workspace.html',
    'en/workspace.html',
    'faq.html',
    'en/faq.html',
    'privacy.html',
    'en/privacy.html',
    'terms.html',
    'en/terms.html',
  ]
  const results = []
  for (const p of pages) {
    const file = path.join(outDir, p)
    if (!fs.existsSync(file)) continue
    results.push(validatePage(file, origin))
  }
  const bad = results.filter(r => !r.ok)
  for (const r of results) {
    if (r.ok) {
      console.log(`✅ hreflang ok: ${path.relative(outDir, r.file)}`)
    } else {
      console.log(`⚠️  hreflang issue: ${path.relative(outDir, r.file)} -> ${r.issues.join('; ')}`)
    }
  }
  if (bad.length > 0) process.exitCode = 1
}

main()


