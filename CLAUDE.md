# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development
npm run dev                    # Start local dev server
npm run build                  # Build for production
npm run lint                   # Run ESLint
npm run pages:build           # Build for Cloudflare Workers

# Testing & Debugging
npm run test:r2-config        # Test R2 configuration
npm run test:kv-storage       # Test KV storage
npm run test:share-r2         # Test share system
npm run check:production      # Validate production config
npm run monitor:status        # Monitor production status

# Deployment
npm run deploy:dev            # Deploy to development
npm run deploy                # Deploy to production
npm run deploy:safe           # Safe deployment with checks
```

## Project Overview

**FuryCode** is a Next.js 15 application providing AI-powered anime image transformation services. The app transforms photos into anime styles using KIE AI GPT-4o API, deployed on Cloudflare Workers with R2 storage and KV sharing.

## Core Development Workflow

### 1. Local Development Setup

**Prerequisites:** Node.js >=20.0.0, npm >=10.0.0

1. Copy environment variables: `cp env.example .env.local`
2. Configure required variables (see Environment Variables section)
3. Run `npm install`
4. Start dev server: `npm run dev`

### 2. Key Development Files

**Main Application Flow:**
- `src/components/Workspace.tsx` - Main orchestrator for all user interactions
- `src/store/useAppStore.ts` - Centralized state management
- `src/app/api/generate-image/route.ts` - KIE AI integration
- `src/app/api/upload-image/route.ts` - Image storage (R2 + ImgBB fallback)

**Component Architecture:**
- `TemplateGallery.tsx` - 20+ predefined anime styles
- `StyleGallery.tsx` - Custom prompt interface
- `BeforeAfterSlider.tsx` - Interactive image comparison
- `ShareGallery.tsx` - Public transformations gallery
- `ProgressIndicator.tsx` - Real-time generation progress

### 3. API Development

**Core Endpoints:**
- `/api/generate-image` - Async image generation with KIE AI
- `/api/upload-image` - Image upload to R2 + ImgBB fallback
- `/api/image-details` - Task status polling
- `/api/share/*` - Share functionality with KV storage

**Testing Endpoints:**
- `/api/test-env` - Environment validation
- `/api/test-kie-connection` - KIE AI connectivity test
- `/api/share/debug` - Debug share data issues

### 4. Image Processing Workflow

1. **Upload**: Images go to R2 bucket (`kemono-uploadimage`) with ImgBB fallback
2. **Processing**: KIE AI async task creation via `/api/generate-image`
3. **Polling**: Status updates via `/api/image-details` or `/api/poll-task`
4. **Storage**: Generated images saved to `kemono-afterimage` bucket
5. **Sharing**: Share data stored in Cloudflare KV with 30-day TTL

### 5. Storage Architecture

**Cloudflare R2:**
- Primary: `kemono-uploadimage` (original images)
- Generated: `kemono-afterimage` (transformed images)
- Presigned URLs for secure access
- CDN integration via Cloudflare

**Cloudflare KV:**
- Namespace: `SHARE_DATA_KV`
- Key format: `share:{id}`
- TTL: 30 days
- Fallback: LocalStorage + memory caching

## Environment Variables

```bash
# Required for basic functionality
KIE_AI_API_KEY=your_kie_ai_key
KIE_AI_USER_ID=your_user_id
KIE_AI_BASE_URL=https://api.kie.ai

# Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=kemono-uploadimage
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.r2.dev
CLOUDFLARE_R2_AFTERIMAGE_BUCKET_NAME=kemono-afterimage
CLOUDFLARE_R2_AFTERIMAGE_PUBLIC_URL=https://your-afterimage-bucket.r2.dev

# Optional
IMGBB_API_KEY=your_imgbb_key  # Fallback storage
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Common Development Tasks

### Adding New Anime Style
1. Edit `src/config/images.ts` - add new template configuration
2. Add Japanese translation in `messages/ja.json`
3. Test with: `npm run dev` → select new style

### Debugging Image Upload Issues
1. Test R2 config: `npm run test:r2-config`
2. Check upload endpoint: `curl -X POST http://localhost:3000/api/upload-image`
3. Debug share data: `node scripts/debug-share-list.js`

### Testing Share System
1. Test KV storage: `npm run test:kv-storage`
2. Test share integration: `npm run test:share-r2`
3. Monitor production: `npm run monitor:status`

### Performance Optimization
1. Test gallery performance: `node scripts/test-gallery-performance.js`
2. Check duplicate prevention: `npm run test:duplicate-prevention`
3. Verify optimizations: `npm run test:optimizations`

## Deployment

**Development:**
```bash
npm run deploy:dev  # Deploys to kemono-shares-api-dev.y2983236233.workers.dev
```

**Production:**
```bash
npm run deploy:safe  # Runs checks before deployment
npm run deploy       # Direct deployment
```

**Build Process:**
1. `npm run pages:build` - Builds for Cloudflare Workers
2. Uses `@cloudflare/next-on-pages` for Edge Runtime compatibility
3. Static assets deployed to `.vercel/output/static`

## Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Storage**: Cloudflare R2 + KV
- **AI**: KIE GPT-4o Image API
- **I18n**: next-intl (Japanese)
- **Deployment**: Cloudflare Workers

## Troubleshooting

**Common Issues:**
- **R2 Upload Fails**: Check environment variables with `node test-env.js`
- **KV Storage Issues**: Verify with `npm run test:kv-storage`
- **Build Errors**: Ensure Node.js >=20.0.0, run `npm run lint`
- **Deployment Issues**: Use `npm run check:production` before deployment

**Debug Scripts:**
- `node debug-share-data.js` - Debug share functionality
- `node debug-gallery.js` - Debug gallery issues
- `node debug-image-to-image.js` - Debug image-to-image mode

## File Structure Quick Reference

```
src/
├── app/
│   ├── api/           # API routes (Edge Runtime compatible)
│   ├── [locale]/      # Japanese routes (ja)
│   └── middleware.ts  # Locale routing
├── components/        # Reusable React components
├── lib/              # Utility functions (R2, KV, image processing)
├── store/            # Zustand state management
└── config/           # Image processing configuration
```

## Development Environment

- **OS**: Windows 10.0.26100 (Git Bash recommended)
- **Node**: >=20.0.0
- **Package Manager**: npm >=10.0.0
- **Shell**: Use forward slashes in Git Bash
- **Line Endings**: CRLF (Git autocrlf configured)