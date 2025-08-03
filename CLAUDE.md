# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FuryCode** is a Next.js 15 application that provides an AI-powered anime image transformation service. Users can upload photos and transform them into various anime styles using the KIE AI GPT-4o Image API. The application is deployed on Cloudflare Workers with R2 storage for images and KV storage for sharing functionality.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Internationalization**: next-intl (Japanese locale)
- **Icons**: Heroicons
- **Image Processing**: KIE AI GPT-4o Image API
- **Image Storage**: Cloudflare R2 + ImgBB API (fallback)
- **Share Storage**: Cloudflare KV + Local fallback
- **Deployment**: Cloudflare Workers (Edge Runtime)

## Key Architecture Components

### 1. Application Structure

The app is organized around a single workspace interface (`src/components/Workspace.tsx`) that handles:
- Image upload (drag-drop or file selection)
- Style selection via 20+ predefined templates or custom prompts
- Real-time generation progress monitoring with WebSocket-style polling
- Before/after image comparison with interactive slider
- Download functionality with direct URL generation
- Queue management with position tracking and ETA
- Share functionality with Cloudflare KV storage

**Core Components (exact file paths):**
- `src/components/Workspace.tsx:67` - Main orchestrator component managing all user interactions
- `src/components/TemplateGallery.tsx` - Predefined style selection with 20+ anime styles
- `src/components/StyleGallery.tsx` - Custom prompt interface for advanced users
- `src/components/BeforeAfterSlider.tsx` - Interactive comparison component
- `src/components/ProgressIndicator.tsx` - Real-time progress display with ETA
- `src/components/ShareGallery.tsx` - Public gallery of shared transformations
- `src/components/HomeHero.tsx` - Landing page hero section
- `src/components/FAQ.tsx` - FAQ page component
- `src/components/MobileBottomNav.tsx` - Mobile-specific navigation component

### 2. State Management (`src/store/useAppStore.ts`)

Centralized state management using Zustand for:
- Application state flow (initial → uploading → processing → completed)
- Image data and processing results
- Loading states and error handling
- Queue management
- Share data synchronization

### 3. Storage Architecture

**Cloudflare R2 Integration:**
- **Primary Storage**: Direct image storage in Cloudflare R2 buckets
- **Dual Buckets**: `kemono-uploadimage` (originals) + `kemono-afterimage` (generated)
- **Access Pattern**: Presigned URLs for secure upload/download
- **Configuration**: `src/lib/r2-client.ts` for S3-compatible API access

**Cloudflare KV Storage:**
- **Share Data**: `SHARE_DATA_KV` namespace for persistent sharing
- **Data Structure**: ShareData interface with metadata
- **Caching**: Multi-tier caching (KV → Memory → LocalStorage fallback)
- **Implementation**: `src/lib/share-store-kv.ts` with Edge Runtime compatibility

### 4. API Integration (`src/app/api/*`)

**Primary Endpoints:**
- `/api/generate-image` - Image transformation via KIE AI (async task creation)
- `/api/upload-image` - Image upload to Cloudflare R2 + ImgBB fallback
- `/api/image-details` - Task status polling with progress updates
- `/api/download-url` - Get direct download URLs from R2
- `/api/task-status` - Alternative polling endpoint with queue position
- `/api/share/*` - Share functionality with KV storage
- `/api/temp-file` - Temporary file handling for local development
- `/api/test-env` - Environment validation endpoint

**Share System Endpoints:**
- `/api/share` - Create new share records
- `/api/share/list` - Retrieve paginated share gallery
- `/api/share/monitor` - Storage health monitoring
- `/api/share/debug` - Debug share data issues

**External Services:**
- **KIE AI**: GPT-4o Image API for anime transformation (async task-based)
- **Cloudflare R2**: Primary image storage with CDN
- **ImgBB**: Fallback image hosting when R2 unavailable
- **Cloudflare KV**: Persistent share data storage

### 5. Internationalization

- **Language**: Japanese (ja)
- **Files**: `messages/ja.json` for translations
- **Middleware**: `src/middleware.ts` handles locale routing
- **Configuration**: `src/i18n.ts` sets up next-intl

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Build for Cloudflare Workers
npm run pages:build

# Deploy to Cloudflare Workers
npm run deploy

# Deploy to development environment
npm run deploy:dev

# Safe deployment with pre-checks
npm run deploy:safe

# Lint code
npm run lint

# Type checking
npm run build  # TypeScript checks run during build

# Test R2 configuration
npm run test:r2-config

# Test share system
npm run test:share-r2

# Test KV storage
npm run test:kv-storage

# Monitor production status
npm run monitor:status
```

## Environment Variables

**Required for API integration:**
```bash
# KIE AI Configuration
KIE_AI_API_KEY=your_kie_ai_key
KIE_AI_USER_ID=your_user_id
KIE_AI_BASE_URL=https://api.kie.ai

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=kemono-uploadimage
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.r2.dev
CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://your-afterimage-bucket.r2.dev

# ImgBB Fallback (optional)
IMGBB_API_KEY=your_imgbb_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

**Environment Validation:**
Use `node test-env.js` to verify all required environment variables are set correctly.

## Cloudflare Workers Deployment

**Deployment Targets:**
- **Production**: `kemono-shares-api.y2983236233.workers.dev`
- **Development**: `kemono-shares-api-dev.y2983236233.workers.dev`

**Configuration Files:**
- `wrangler.jsonc` - Worker configuration with KV bindings
- `.next/static` - Static assets for Cloudflare Pages

**Edge Runtime Compatibility:**
- **No Node.js modules** in Edge Runtime
- **Environment detection** for KV/R2 access
- **Memory caching** with KV persistence
- **LocalStorage fallback** for development

## Key Features

- **Dual Mode Interface**: Template-based (simple) vs custom prompt (advanced)
- **Triple Mode Support**: Text-to-image, image-to-image, and template modes
- **Real-time Progress**: WebSocket-style polling for generation status
- **Multiple Styles**: 20+ predefined anime styles (Ghibli, VTuber, Blue Archive, etc.)
- **Image Comparison**: Before/after slider for results
- **Share System**: Cloudflare KV-backed sharing with public gallery
- **Mobile Navigation**: Dedicated mobile bottom navigation
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Error Handling**: Comprehensive error states and retry mechanisms
- **SEO Optimization**: Sitemap, robots.txt, and metadata optimization
- **CDN Integration**: Cloudflare R2 for global image delivery
- **Storage Fallback**: ImgBB fallback when R2 unavailable

## Storage Architecture Details

### Cloudflare R2 Integration
```typescript
// R2 Client Configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey }
});

// Usage Pattern
- Original images: kemono-uploadimage bucket
- Generated images: kemono-afterimage bucket  
- Public URLs: Generated via presigned URLs
- CDN: Automatic Cloudflare CDN integration
```

### Cloudflare KV Storage
```typescript
// KV Namespace: SHARE_DATA_KV
// Key Format: share:{id}
// Data Structure: ShareData interface
// TTL: 30 days expiration
// Cache: Memory + LocalStorage fallback

interface ShareData {
  id: string
  generatedUrl: string
  originalUrl: string | null
  prompt: string
  style: string
  timestamp: number
  createdAt: string
  isR2Stored?: boolean
  isTextToImage?: boolean
}
```

## File Structure

```
src/
├── app/
│   ├── api/           # API routes for all integrations
│   │   ├── share/     # Share system endpoints
│   │   ├── generate-image/  # KIE AI integration
│   │   └── upload-image/    # R2 + ImgBB upload
│   ├── [locale]/      # Internationalized routes
│   ├── globals.css    # Global styles with custom fonts
│   ├── layout.tsx     # Root layout with providers
│   └── middleware.ts  # Locale routing middleware
├── components/        # Reusable UI components
│   ├── Workspace.tsx  # Main orchestrator
│   ├── ShareGallery.tsx  # Public share gallery
│   ├── TemplateGallery.tsx  # Style templates
│   ├── BeforeAfterSlider.tsx  # Image comparison
│   └── MobileBottomNav.tsx  # Mobile navigation
├── store/            # Zustand state management
│   └── useAppStore.ts  # Centralized state
├── lib/              # Utility functions and API clients
│   ├── api-key-rotation.ts  # Key management
│   ├── r2-client.ts  # Cloudflare R2 integration
│   ├── share-store-kv.ts  # KV storage implementation
│   ├── share-cache.ts  # Multi-tier caching
│   └── image-utils.ts  # Image processing utilities
├── config/           # Configuration files
│   └── images.ts     # Image processing config
└── i18n/             # Internationalization setup
    ├── request.ts    # Locale detection
    └── ja.json       # Japanese translations
```

## Testing & Debugging

**Cloudflare-Specific Testing:**
```bash
# Test R2 configuration
node scripts/test-r2-config.js

# Test KV storage
node scripts/test-kv-storage.js

# Test share system integration
node scripts/test-share-r2-integration.js

# Check production configuration
node scripts/check-production-config.js

# Debug share data issues
node scripts/debug-share-list.js
```

**API Testing:**
```bash
# Test KIE AI connectivity
node test-kie-connection.js

# Test image upload (R2 + ImgBB)
node test-upload.mjs

# Test polling mechanism
node test-polling.js

# Test share functionality
node test-share.js
```

**Environment Debugging:**
```bash
# Validate environment setup
node test-env.js

# Test API endpoints via HTTP
curl https://your-worker.dev/api/test-env

# Monitor share system health
curl https://your-worker.dev/api/share/monitor
```

## Advanced Features

### Storage Architecture
- **Multi-tier caching**: KV → Memory → LocalStorage → Memory-only fallback
- **Automatic cleanup**: 30-day TTL for share data
- **R2 image lifecycle**: Original + generated image management
- **Storage monitoring**: Real-time storage health checks

### Edge Runtime Optimizations
- **Zero Node.js dependencies** in production paths
- **Environment detection** for optimal storage selection
- **Memory-efficient caching** with automatic cleanup
- **CDN-optimized image delivery** via Cloudflare

### Share System Features
- **Public gallery**: Infinite scroll with responsive masonry layout
- **Direct sharing**: Unique URLs for each transformation
- **Metadata preservation**: Full prompt/style information
- **Social sharing**: Optimized OpenGraph tags

## Performance Optimizations

- **Image Compression**: Automatic optimization before R2 upload
- **Progressive Loading**: Blur-up technique for large images
- **CDN Integration**: Cloudflare R2 + global CDN
- **Caching**: Multi-tier caching with intelligent invalidation
- **Edge Runtime**: Zero-cold-start with Workers

## Deployment Checklist

1. **Environment Variables**: All required vars configured
2. **Cloudflare Setup**: KV namespace + R2 buckets configured
3. **Domain Configuration**: DNS + SSL certificates
4. **Build Testing**: `npm run pages:build` succeeds
5. **Pre-deployment Check**: `npm run check:production`
6. **Safe Deployment**: `npm run deploy:safe`

## Development Environment

- **OS**: Windows 10.0.26100
- **Shell**: Git Bash
- **Path format**: Windows (use forward slashes in Git Bash)
- **File system**: Case-insensitive
- **Line endings**: CRLF (configure Git autocrlf)
- **Node.js**: >=20.0.0
- **Cloudflare Wrangler**: Required for Workers deployment