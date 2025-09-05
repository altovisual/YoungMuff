# Project Structure

## Next.js App Router Structure
```
youngmuff-nextjs/
├── app/                          # App Router (Next.js 13+)
│   ├── layout.tsx               # Root layout with player
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── providers.tsx            # Context providers
│   ├── merchandise/             # Merchandise section
│   │   ├── page.tsx            # Catalog page
│   │   └── [id]/page.tsx       # Product detail
│   ├── api/                     # API routes
│   │   ├── tracks/route.ts     # Tracks API
│   │   ├── auth/               # Authentication
│   │   └── stripe/             # Payment processing
│   └── not-found.tsx           # 404 page
├── components/                  # React components
│   ├── Player/                 # Audio player components
│   ├── layout/                 # Layout components
│   ├── sections/               # Page sections
│   ├── ui/                     # Reusable UI components
│   └── PWA/                    # PWA-specific components
├── lib/                        # Utilities and configurations
│   ├── stores/                 # Zustand stores
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── api/                    # API client functions
│   └── validations/            # Zod schemas
├── public/                     # Static assets
│   ├── images/                 # Images and artwork
│   ├── audio/                  # Local audio files (fallback)
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
└── prisma/                     # Database schema
    ├── schema.prisma
    └── migrations/
```

## Component Architecture

### Player Components (`/components/Player/`)
- `AudioPlayer.tsx` - Main persistent player
- `TrackList.tsx` - Track listing with controls
- `ProgressBar.tsx` - Playback progress
- `VolumeControl.tsx` - Volume slider
- `PlayerControls.tsx` - Play/pause/skip buttons

### Layout Components (`/components/layout/`)
- `Navigation.tsx` - Main navigation
- `Footer.tsx` - Site footer
- `Sidebar.tsx` - Mobile sidebar menu

### UI Components (`/components/ui/`)
- `Button.tsx` - Reusable button component
- `Modal.tsx` - Modal dialogs
- `Toast.tsx` - Notification system
- `Slider.tsx` - Custom slider component

## State Management

### Zustand Stores (`/lib/stores/`)
- `player-store.ts` - Audio player state
- `cart-store.ts` - Shopping cart state
- `user-store.ts` - User session state

### React Context
- `PlayerProvider` - Global player context
- `CartProvider` - Shopping cart context
- `AuthProvider` - Authentication context

## Naming Conventions

### Files and Folders
- **PascalCase** for React components (`AudioPlayer.tsx`)
- **kebab-case** for utilities and configs (`player-store.ts`)
- **camelCase** for hooks and functions (`usePlayer.ts`)
- **lowercase** for API routes (`route.ts`)

### React Components
- **PascalCase** for component names
- **camelCase** for props and state variables
- **SCREAMING_SNAKE_CASE** for constants

### CSS Classes (Tailwind)
- Utility-first approach with Tailwind CSS
- Custom component classes in `@layer components`
- CSS variables for theme colors

### TypeScript
- **PascalCase** for interfaces and types (`Track`, `PlayerState`)
- **camelCase** for variables and functions
- Strict typing with proper exports/imports

## API Structure

### REST Endpoints (`/app/api/`)
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/[id]` - Get specific track
- `POST /api/auth/login` - User authentication
- `GET /api/merchandise` - Get products
- `POST /api/stripe/checkout` - Create payment session

### Data Flow
- Server Components fetch data at build/request time
- Client Components use React Query for caching
- Zustand for client-side state management
- API routes handle server-side logic

## Asset Organization

### `/public/images/`
- `artwork/` - Track and album artwork
- `products/` - Merchandise images
- `ui/` - Interface icons and graphics
- `brand/` - Logos and brand assets

### `/public/audio/` (Fallback)
- Local audio files for offline functionality
- Compressed versions for preview

## Key Architectural Patterns

### Server-Side Rendering (SSR)
- Static generation for product pages
- Server components for initial data loading
- Incremental Static Regeneration (ISR) for dynamic content

### Progressive Web App (PWA)
- Service worker for offline functionality
- Audio caching for offline playback
- App-like experience on mobile devices

### Performance Optimization
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Bundle analysis and optimization
- Lazy loading for non-critical components

### Responsive Design
- Mobile-first Tailwind CSS approach
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-friendly controls for mobile devices
- Safe area handling for iOS devices