# Premier Tours & Travels — Production Platform

A modern luxury travel and booking platform crafted with React, TypeScript, Tailwind CSS, Express, and MongoDB Atlas.

---

## 🏛️ Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Lucide Icons + Motion
- **Backend**: Node.js + Express + Mongoose + JWT Authentication + Multer
- **Database**: MongoDB Atlas Cluster (`premier_tours`)
- **Hosting Target**: Hostinger Linux / LiteSpeed VPS or Web Server with SPA rewrite support
- **Canonical Asset Engine**: High-performance WebP assets with binary validation

---

## 📁 Project Structure & Organization Guide

```
├── public/                     # Static Web Assets (served directly by web server)
│   ├── .htaccess              # Hostinger LiteSpeed / Apache SPA Routing & Security Rules
│   ├── robots.txt             # Search Engine Directives
│   ├── sitemap.xml            # SEO Sitemap
│   └── assets/                # Local Image Fallbacks and Brand Assets
│       ├── brand/             # Official Logos (logo.jpg)
│       ├── banners/           # Banner Imagery (.webp)
│       └── heroes/            # Hero Imagery (.webp)
├── src/                        # Main Application Source Code
│   ├── components/            # React UI Components
│   │   ├── admin/             # Admin portal modals, tables & managers
│   │   ├── common/            # ErrorBoundary, OptimizedImage
│   │   ├── dashboard/         # Customer profile, recent activity, stats
│   │   ├── reviews/           # StarRating, ReviewCard, ReviewCarousel
│   │   ├── ui/                # Base UI primitives (SafeImage)
│   │   ├── Navbar.tsx         # Primary responsive navigation bar
│   │   ├── Footer.tsx         # Universal footer with legal links & licensing
│   │   ├── WhatsAppConcierge.tsx # 24/7 WhatsApp customer support overlay
│   │   ├── HeroSearchEngine.tsx  # Multi-tab search bar (Tours, Hotels, Cars, Flights)
│   │   ├── TourPackageCard.tsx   # Tour card with price, rating & duration
│   │   ├── SriLankaInteractiveMap.tsx # Leaflet interactive island map
│   │   └── ...                # Modals, SEO helpers & cards
│   ├── context/               # React Context Providers (Global State)
│   │   ├── AuthContext.tsx    # JWT login, registration & session management
│   │   ├── CurrencyContext.tsx # Multi-currency exchange rate conversions
│   │   ├── LanguageContext.tsx # 10-language switching & persistence
│   │   └── ThemeContext.tsx   # Dark / Light theme toggle
│   ├── data/                  # Seed catalogs & in-memory fallbacks
│   │   ├── mockData.ts        # Comprehensive tours, hotels, cars, flights data
│   │   └── seedReviews.ts     # Curated initial reviews
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useCatalogData.ts  # Catalog data fetching with offline fallback
│   │   └── useLocalizedContent.ts # Dynamic content translation hook
│   ├── i18n/                  # Multi-Language Localization System
│   │   ├── index.ts           # Central translation helper
│   │   └── translations/      # Language dictionaries (en, si, ae, cn, de, fr, etc.)
│   ├── pages/                 # Full Page Views (React Router Routes)
│   │   ├── HomePage.tsx       # Landing page with hero & featured packages
│   │   ├── ToursPage.tsx      # Tour package search & filter catalog
│   │   ├── TourDetailPage.tsx # Tour itinerary, highlights & booking modal
│   │   ├── HotelsPage.tsx     # Luxury hotel & villa catalog
│   │   ├── HotelDetailPage.tsx # Hotel amenities, rooms & gallery
│   │   ├── CarsPage.tsx       # Fleet rental & chauffeur services
│   │   ├── FlightsPage.tsx    # Domestic charters & sea plane routes
│   │   ├── BlogPage.tsx       # Travel guides & articles
│   │   ├── CheckoutPage.tsx   # Bank transfer checkout & receipt upload
│   │   ├── CustomerDashboard.tsx # Customer bookings, vouchers & profile
│   │   ├── AdminDashboard.tsx # Administrator management console
│   │   └── ContactUsPage.tsx  # Direct inquiry form & office details
│   ├── server/                # Backend API Server (Express + MongoDB)
│   │   ├── app.ts             # Express application setup, CORS & routes
│   │   ├── config/            # Database (database.ts) & JWT configurations
│   │   ├── controllers/       # Route controllers (tour, hotel, booking, auth, upload)
│   │   ├── middleware/        # Authentication & admin authorization guards
│   │   ├── models/            # Mongoose schemas (Tour, Hotel, Car, Flight, User, Review)
│   │   ├── routes/            # Express route endpoints (/api/tours, /api/auth, etc.)
│   │   └── scripts/           # Server-side seeding scripts
│   ├── services/              # Client-Side API Clients
│   │   ├── api.ts             # Typed fetch wrapper for all REST endpoints
│   │   └── dataService.ts     # Data access layer with offline catalog fallback
│   ├── types/                 # TypeScript interfaces and type definitions
│   └── utils/                 # Helpers (imageUrl, imageUtils, localization)
├── scripts/                   # Verification, seeding & maintenance scripts
├── server.ts                  # Production & dev server entry point (port 3000)
├── vite.config.ts             # Vite build & plugin configuration
└── package.json               # Dependencies, scripts & project metadata
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
# MongoDB Atlas Connection
MONGODB_URI="mongodb+srv://username:password@cluster0.example.mongodb.net/premier_tours?retryWrites=true&w=majority"

# JWT Secret for Session Tokens
JWT_ACCESS_SECRET="your_production_jwt_secret_key"

# Server Port
PORT=3000

# Client Configuration
VITE_API_URL="/api"
VITE_ENABLE_DEMO_REVIEWS="false"
```

---

## 🚀 Running & Building

### 1. Development Mode
```bash
npm run dev
```

### 2. Build for Production
```bash
npm run build
```
This will:
1. Compile the React client via `vite build` into `dist/`.
2. Bundle the backend server with `esbuild` into `dist/server.cjs`.
3. Verify all image assets and binary MIME types.

### 3. Start Production Server
```bash
npm start
```

### 4. Verification Suite
```bash
# Verify production architecture readiness
npm run verify:production
```

---

## 🌐 Hostinger Deployment Guide

1. Run `npm run build` locally or in CI/CD.
2. Upload the `dist/` directory contents along with `package.json` to your Hostinger Node.js app root.
3. Configure the environment variables (`MONGODB_URI`, `JWT_ACCESS_SECRET`, `NODE_ENV=production`) in the Hostinger Node.js control panel.
4. Set the startup file to `dist/server.cjs`.
5. Start the Node.js application.

---

## 🛡️ License

Private & Confidential — Premier Tours & Travels. All Rights Reserved.
