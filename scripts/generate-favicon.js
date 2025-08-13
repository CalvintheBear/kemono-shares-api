#!/usr/bin/env node

/**
 * Generate favicon.ico from SVG source
 * - Reads `src/app/icon-source.svg`
 * - Renders PNGs at multiple sizes using sharp
 * - Packs them into a single .ico using to-ico
 * - Writes to `src/app/favicon.ico`
 */

const fs = require('fs');
const path = require('path');

async function ensureDependencies() {
  try {
    require.resolve('sharp');
    require.resolve('to-ico');
  } catch (e) {
    console.warn('[favicon] Missing dependencies. Please run: npm i -D sharp to-ico');
    throw e;
  }
}

async function generateFavicon() {
  await ensureDependencies();
  const sharp = require('sharp');
  const toIco = require('to-ico');

  const svgPath = path.join('src', 'app', 'icon-source.svg');
  const outIcoPath = path.join('src', 'app', 'favicon.ico');

  if (!fs.existsSync(svgPath)) {
    console.warn(`[favicon] SVG source not found at ${svgPath}. Skipping.`);
    return;
  }

  const svg = fs.readFileSync(svgPath);

  const sizes = [16, 32, 48, 64];
  const pngBuffers = [];
  for (const size of sizes) {
    const png = await sharp(svg, { density: 384 })
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();
    pngBuffers.push(png);
  }

  const icoBuffer = await toIco(pngBuffers);
  fs.writeFileSync(outIcoPath, icoBuffer);
  console.log(`[favicon] Generated ${outIcoPath}`);
}

generateFavicon().catch(err => {
  console.warn('[favicon] Failed to generate favicon.ico:', err && err.message ? err.message : err);
  process.exitCode = 0; // Do not block dev/build; favicon can be generated later
});


