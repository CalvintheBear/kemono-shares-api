# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FuryCode** is a Next.js 15 application that provides an AI-powered anime image transformation service. Users can upload photos and transform them into various anime styles using the KIE AI GPT-4o Image API.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Internationalization**: next-intl (Japanese locale)
- **Icons**: Heroicons
- **Image Processing**: KIE AI GPT-4o Image API
- **Image Storage**: ImgBB API

## Key Architecture Components

### 1. Application Structure

The app is organized around a single workspace interface (`src/components/Workspace.tsx`) that handles:
- Image upload (drag-drop or file selection)
- Style selection via 20+ predefined templates or custom prompts
- Real-time generation progress monitoring with WebSocket-style polling
- Before/after image comparison with interactive slider
- Download functionality with direct URL generation
- Queue management with position tracking and ETA

**Core Components (exact file paths):**
- `src/components/Workspace.tsx:67` - Main orchestrator component managing all user interactions
- `src/components/TemplateGallery.tsx` - Predefined style selection with 20+ anime styles
- `src/components/StyleGallery.tsx` - Custom prompt interface for advanced users
- `src/components/BeforeAfterSlider.tsx` - Interactive comparison component
- `src/components/ProgressIndicator.tsx` - Real-time progress display with ETA
- `src/components/HomeHero.tsx` - Landing page hero section
- `src/components/FAQ.tsx` - FAQ page component
- `src/components/MobileBottomNav.tsx` - Mobile-specific navigation component

### 2. State Management (`src/store/useAppStore.ts`)

Centralized state management using Zustand for:
- Application state flow (initial → uploading → processing → completed)
- Image data and processing results
- Loading states and error handling
- Queue management

### 3. API Integration (`src/app/api/*`)

**Primary Endpoints:**
- `/api/generate-image` - Image transformation via KIE AI (async task creation)
- `/api/upload-image` - Image upload to ImgBB
- `/api/image-details` - Task status polling with progress updates
- `/api/download-url` - Get direct download URLs
- `/api/task-status` - Alternative polling endpoint with queue position
- `/api/temp-file` - Temporary file handling for local development
- `/api/test-env` - Environment validation endpoint

**External Services:**
- **KIE AI**: GPT-4o Image API for anime transformation (async task-based)
- **ImgBB**: Image hosting and CDN with direct URL generation

**API Response Patterns:**
- **Task Creation**: Returns task ID for async tracking
- **Polling**: Provides progress percentage and ETA
- **Completion**: Returns final image URLs and metadata
- **Error Handling**: Structured error codes and messages

### 4. Internationalization

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

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run build  # TypeScript checks run during build
```

## Environment Variables

Required for API integration:
```bash
KIE_AI_API_KEY=your_kie_ai_key
KIE_AI_USER_ID=your_user_id
IMGBB_API_KEY=your_imgbb_key
KIE_AI_BASE_URL=https://api.kie.ai  # Optional, defaults provided
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For development
```

**Environment Validation:**
Use `node test-env.js` to verify all required environment variables are set correctly.

**Multiple API Keys Support:**
The system supports automatic API key rotation via `src/lib/api-key-rotation.ts` for handling rate limits and failover.

## Key Features

- **Dual Mode Interface**: Template-based (simple) vs custom prompt (advanced)
- **Triple Mode Support**: Text-to-image, image-to-image, and template modes
- **Real-time Progress**: WebSocket-style polling for generation status
- **Multiple Styles**: 20+ predefined anime styles (Ghibli, VTuber, Blue Archive, etc.)
- **Image Comparison**: Before/after slider for results
- **Mobile Navigation**: Dedicated mobile bottom navigation (`src/components/MobileBottomNav.tsx`)
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Error Handling**: Comprehensive error states and retry mechanisms
- **SEO Optimization**: Sitemap, robots.txt, and metadata optimization

## File Structure

```
src/
├── app/
│   ├── api/           # API routes for KIE AI integration
│   ├── [locale]/      # Internationalized routes
│   ├── globals.css    # Global styles with custom fonts
│   ├── layout.tsx     # Root layout with providers
│   └── middleware.ts  # Locale routing middleware
├── components/        # Reusable UI components
│   ├── Workspace.tsx  # Main orchestrator
│   ├── TemplateGallery.tsx  # Style templates
│   ├── BeforeAfterSlider.tsx  # Image comparison
│   └── MobileBottomNav.tsx  # Mobile navigation
├── store/            # Zustand state management
│   └── useAppStore.ts  # Centralized state
├── lib/              # Utility functions and API clients
│   ├── api-key-rotation.ts  # Key management
│   ├── database.ts   # Local storage utilities
│   └── local-storage.ts  # File system helpers
├── config/           # Configuration files
│   └── images.ts     # Image processing config
└── i18n/             # Internationalization setup
    ├── request.ts    # Locale detection
    └── ja.json       # Japanese translations
```

## Style System

- **Fonts**: Quicksand (primary), Comic Neue (Japanese text)
- **Theme**: Kawaii/anime aesthetic with pink/purple gradients
- **Animations**: Subtle hover effects and loading animations
- **Responsive**: Mobile-first design with Tailwind breakpoints

## Testing & Debugging

The project includes comprehensive testing utilities for API connectivity and debugging:

**Core API Testing Files:**
- `test-kie-connection.js` - Tests KIE AI API connectivity with multiple fallback methods
- `test-api.js` - General API testing with error handling
- `test-upload.mjs` - Image upload testing with ImgBB integration
- `test-kie-api-key.js` - Tests API key validation
- `test-proxy.js` - Tests proxy configuration for network issues
- `test-polling.js` - Tests task status polling mechanism

**Debugging Tools:**
- `verify-polling.js` - Verifies polling response format
- `verify-final.js` - Validates final API responses
- `test-env.js` - Environment variable validation
- `test-txt2img.mjs` - Text-to-image generation testing

**Testing Commands:**
```bash
# Test API connectivity
node test-kie-connection.js

# Test image upload
node test-upload.mjs

# Test polling mechanism
node test-polling.js

# Validate environment setup
node test-env.js

# Test text-to-image generation
node test-txt2img.mjs

# Test API endpoints via HTTP
node test-api-endpoints.js

# Test with proxy configuration
node test-proxy.js
```

## Next.js 15 Specific Patterns

### App Router Structure
- Uses Next.js 15 App Router with `app/` directory
- API routes use `route.ts` files with standard web APIs (Request/Response)
- Middleware in `src/middleware.ts` handles locale routing
- Metadata and SEO handled via `metadata` exports in page files

### Server Components
- Default server components for improved performance
- Client components marked with 'use client' directive where needed
- API routes in `src/app/api/**/*` use standard Request/Response objects

## Common Debugging Scenarios

### Environment Issues
```bash
# Quick environment check
node test-env.js

# Test specific API endpoint
curl http://localhost:3000/api/test-env
```

### Image Generation Failures
1. Check API key validity: `node test-kie-api-key.js`
2. Test direct API call: `node test-txt2img.mjs`
3. Verify polling mechanism: `node test-polling.js`

### Network/Proxy Issues
```bash
# Test with proxy settings
node test-proxy.js

# Debug HTTPS/TLS issues
node test-api-tls.js
```

### Queue Position Debugging
- Check `/api/task-status` endpoint for real-time queue position
- Monitor polling responses in browser dev tools Network tab
- Use `console.log` in API routes for detailed request/response logging

## Deployment

Optimized for Vercel deployment with:
- Next.js 15 App Router
- Static asset optimization
- Image optimization via Next.js Image component
- API route caching strategies

## Advanced Features

### Text-to-Image Mode
The application supports direct text-to-image generation without requiring an input image. This mode:
- Uses the same KIE AI API but with text prompts only
- Available via `/api/generate-image` with `mode: "txt2img"`
- Supports all anime styles from the template gallery
- Includes advanced prompt engineering for anime aesthetics

### Error Recovery System
- **API Key Rotation**: Automatic fallback between multiple API keys (`src/lib/api-key-rotation.ts`)
- **Queue Management**: Real-time queue position and ETA updates
- **Retry Logic**: Exponential backoff for failed requests
- **Local Storage**: Temporary file caching for failed uploads

### Performance Optimizations
- **Image Compression**: Automatic optimization before upload
- **Progressive Loading**: Blur-up technique for large images
- **CDN Integration**: ImgBB for global image delivery
- **Caching**: API response caching with Next.js App Router

## Development Environment
- OS: Windows 10.0.26100
- Shell: Git Bash
- Path format: Windows (use forward slashes in Git Bash)
- File system: Case-insensitive
- Line endings: CRLF (configure Git autocrlf)
