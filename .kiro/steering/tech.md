# Technology Stack

## Frontend Framework
- **Next.js 14**: React framework with App Router
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions

## State Management & Audio
- **Zustand**: Lightweight state management for player
- **React Context**: Global state for user session
- **Web Audio API**: Advanced audio processing
- **Howler.js**: Cross-browser audio library with spatial audio
- **React Query**: Server state management and caching

## UI Components & Styling
- **Headless UI**: Unstyled, accessible UI components
- **Radix UI**: Low-level UI primitives
- **Lucide React**: Beautiful icon library
- **Swiper React**: Touch slider components
- **React Hook Form**: Performant forms with validation

## Media & Storage
- **Cloudflare R2**: Primary audio and media storage
- **Next.js Image**: Optimized image delivery
- **Sharp**: High-performance image processing
- **FFmpeg.wasm**: Client-side audio processing

## Backend & API
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Database ORM with PostgreSQL
- **NextAuth.js**: Authentication system
- **Stripe**: Payment processing for merchandise
- **Resend**: Email service for notifications

## PWA & Performance
- **next-pwa**: Progressive Web App capabilities
- **Workbox**: Service worker management
- **Web Vitals**: Performance monitoring
- **Bundle Analyzer**: Build optimization

## Development & Deployment
- **Vercel**: Hosting and deployment platform
- **ESLint + Prettier**: Code formatting and linting
- **Husky**: Git hooks for quality control
- **GitHub Actions**: CI/CD pipeline

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma studio    # Open database GUI

# Deployment
vercel --prod        # Deploy to production
npm run analyze      # Analyze bundle size
```

## Performance Optimizations
- **Static Generation**: Pre-rendered pages for better SEO
- **Incremental Static Regeneration**: Dynamic content with static benefits
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Automatic bundle optimization
- **Service Worker**: Offline functionality and caching
- **Edge Functions**: Global content delivery