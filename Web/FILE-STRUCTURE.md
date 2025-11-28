# 📁 Complete File Structure - Surya's Solar

## Project Root
```
/Users/jj29/Personal/Web/
│
├── 📄 package.json                    # Dependencies & scripts
├── 📄 package-lock.json               # Locked dependency versions
├── 📄 next.config.js                  # Next.js config (static export)
├── 📄 tailwind.config.js              # Tailwind CSS design system
├── 📄 postcss.config.js               # PostCSS configuration
├── 📄 netlify.toml                    # Netlify build configuration
├── 📄 .gitignore                      # Git ignore patterns
├── 📄 .env.example                    # Environment variables template
│
├── 📖 README.md                       # Main documentation
├── 📖 DEPLOYMENT.md                   # Deployment guide
├── 📖 CHECKLIST.md                    # Asset replacement checklist
├── 📖 PROJECT-SUMMARY.md              # Project overview
├── 📖 QUICK-REFERENCE.md              # Quick reference card
├── 📖 FILE-STRUCTURE.md               # This file
│
├── 📂 src/                            # Source code
│   ├── 📂 components/                 # React components
│   │   ├── Header.jsx                 # Sticky header + navigation
│   │   ├── HeroCarousel.jsx           # 3-slide auto-play carousel
│   │   ├── StatsStrip.jsx             # Key statistics section
│   │   ├── BookingForm.jsx            # Lead capture form
│   │   ├── TimelineSteps.jsx          # 6-step installation process
│   │   ├── Testimonials.jsx           # Customer testimonials carousel
│   │   ├── Partners.jsx               # Partner logos grid
│   │   └── Footer.jsx                 # Footer with LocalBusiness schema
│   │
│   ├── 📂 pages/                      # Next.js pages
│   │   ├── _app.jsx                   # App wrapper
│   │   ├── _document.jsx              # HTML document wrapper
│   │   ├── index.jsx                  # Home page (main entry)
│   │   └── 📂 api/                    # API routes
│   │       └── form-handler.js        # Form webhook handler (Next.js)
│   │
│   └── 📂 styles/                     # Stylesheets
│       └── globals.css                # Global styles + Tailwind
│
├── 📂 public/                         # Static assets (served as-is)
│   ├── favicon.ico                    # Browser favicon (16x16, 32x32)
│   ├── sitemap.xml                    # SEO sitemap
│   ├── robots.txt                     # Search engine directives
│   │
│   ├── 📂 images/                     # Image assets
│   │   ├── .gitkeep                   # Keep folder in Git
│   │   ├── hero-slide-1.jpg           # Hero carousel slide 1 (1920x1080)
│   │   ├── hero-slide-2.jpg           # Hero carousel slide 2 (1920x1080)
│   │   ├── hero-slide-3.jpg           # Hero carousel slide 3 (1920x1080)
│   │   ├── default-installation.jpg   # Booking form image (800x600)
│   │   ├── og-home.jpg                # Open Graph social share (1200x630)
│   │   ├── logo.png                   # Company logo
│   │   │
│   │   ├── 📂 partner-logos/          # Partner brand logos
│   │   │   ├── .gitkeep
│   │   │   ├── adani.png              # Adani Solar (200x100)
│   │   │   ├── tata.png               # Tata Power Solar (200x100)
│   │   │   ├── vikram.png             # Vikram Solar (200x100)
│   │   │   ├── waaree.png             # Waaree (200x100)
│   │   │   └── luminous.png           # Luminous (200x100)
│   │   │
│   │   ├── 📂 testimonials/           # Customer photos
│   │   │   ├── .gitkeep
│   │   │   ├── customer-1.jpg         # Testimonial avatar 1 (200x200)
│   │   │   ├── customer-2.jpg         # Testimonial avatar 2 (200x200)
│   │   │   ├── customer-3.jpg         # Testimonial avatar 3 (200x200)
│   │   │   └── customer-4.jpg         # Testimonial avatar 4 (200x200)
│   │   │
│   │   ├── 📂 blog/                   # Blog post images
│   │   │   ├── .gitkeep
│   │   │   └── solar-cuddalore.jpg    # Example blog featured image
│   │   │
│   │   └── 📂 uploads/                # CMS uploaded images
│   │       └── .gitkeep               # Netlify CMS saves here
│   │
│   └── 📂 admin/                      # Netlify CMS admin UI
│       └── index.html                 # CMS entry point
│
├── 📂 content/                        # CMS-editable content
│   ├── 📂 pages/                      # Page content (frontmatter)
│   │   └── home.md                    # Home page content (CMS editable)
│   │
│   ├── 📂 blog/                       # Blog posts (markdown)
│   │   └── 2025-11-20-why-solar-perfect-for-cuddalore.md
│   │
│   └── 📂 settings/                   # Site settings
│       └── general.md                 # Contact info, social links
│
├── 📂 static-admin/                   # Netlify CMS configuration
│   └── config.yml                     # CMS schema & collections
│
└── 📂 netlify/                        # Netlify serverless functions
    └── 📂 functions/
        └── form-handler.js            # Form webhook handler (Netlify)

```

## Generated Folders (Not in Git)

These folders are created during build/install:

```
├── 📂 node_modules/                   # NPM packages (ignored by Git)
├── 📂 .next/                          # Next.js build cache (ignored)
└── 📂 out/                            # Static export output (deployed to Netlify)
```

---

## 📝 File Descriptions by Category

### Configuration Files (Root Level)

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, scripts, project metadata |
| `next.config.js` | Next.js configuration (static export enabled) |
| `tailwind.config.js` | Design tokens: colors, fonts, spacing |
| `postcss.config.js` | CSS processing (Tailwind + Autoprefixer) |
| `netlify.toml` | Netlify build settings, redirects, plugins |
| `.gitignore` | Files/folders to exclude from Git |
| `.env.example` | Template for environment variables |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete technical documentation |
| `DEPLOYMENT.md` | Step-by-step deployment guide |
| `CHECKLIST.md` | Asset replacement checklist |
| `PROJECT-SUMMARY.md` | High-level project overview |
| `QUICK-REFERENCE.md` | Cheat sheet for common tasks |
| `FILE-STRUCTURE.md` | This file - project structure |

### React Components (`/src/components/`)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `Header.jsx` | ~100 | Sticky nav, mobile menu, logo, CTA |
| `HeroCarousel.jsx` | ~200 | 3-slide carousel with auto-play |
| `StatsStrip.jsx` | ~50 | Key statistics cards |
| `BookingForm.jsx` | ~400 | Lead capture form with validation |
| `TimelineSteps.jsx` | ~150 | 6-step installation timeline |
| `Testimonials.jsx` | ~150 | Customer reviews carousel |
| `Partners.jsx` | ~50 | Partner logo grid |
| `Footer.jsx` | ~200 | Footer with links, contact, social |

### Pages (`/src/pages/`)

| Page | Purpose |
|------|---------|
| `_app.jsx` | Global app wrapper, imports globals.css |
| `_document.jsx` | HTML document shell, meta tags |
| `index.jsx` | Home page - assembles all components |
| `api/form-handler.js` | Serverless webhook handler |

### Content Files (`/content/`)

| File | Format | Editable Via |
|------|--------|--------------|
| `pages/home.md` | Markdown + Frontmatter | CMS or editor |
| `blog/*.md` | Markdown + Frontmatter | CMS or editor |
| `settings/general.md` | Markdown + Frontmatter | CMS or editor |

### CMS Configuration

| File | Purpose |
|------|---------|
| `static-admin/config.yml` | Netlify CMS schema, collections, fields |
| `public/admin/index.html` | CMS admin UI loader |

### Serverless Functions

| File | Purpose |
|------|---------|
| `netlify/functions/form-handler.js` | Processes form submissions, triggers webhooks |
| `src/pages/api/form-handler.js` | Alternative Next.js API route |

---

## 🎨 Asset Organization

### Images by Purpose

```
/public/images/
│
├── 🎯 Hero Section
│   ├── hero-slide-1.jpg
│   ├── hero-slide-2.jpg
│   └── hero-slide-3.jpg
│
├── 📝 Booking Form
│   └── default-installation.jpg
│
├── 🤝 Partners
│   └── partner-logos/*.png
│
├── 💬 Testimonials
│   └── testimonials/*.jpg
│
├── 📝 Blog
│   └── blog/*.jpg
│
├── 🌐 SEO/Social
│   ├── og-home.jpg
│   └── logo.png
│
└── 📤 CMS Uploads
    └── uploads/*
```

---

## 🔄 Build Process Flow

```
1. npm install
   ↓ (installs dependencies)
   
2. npm run dev
   ↓ (development server)
   .next/ folder created
   http://localhost:3000
   
3. npm run build
   ↓ (production build)
   .next/ optimized build
   
4. npm run export
   ↓ (static export)
   out/ folder created
   
5. Deploy to Netlify
   ↓ (CI/CD pipeline)
   out/ → Netlify CDN
   ✅ Live site!
```

---

## 📂 Folder Size Estimates

| Folder | Approx Size |
|--------|-------------|
| `node_modules/` | ~200-300 MB |
| `.next/` | ~50-100 MB |
| `out/` | ~10-20 MB |
| `src/` | ~100 KB |
| `public/` | Depends on images |
| `content/` | ~50 KB |

---

## 🗂️ Git Workflow

### Tracked by Git (committed)
- ✅ All source code (`src/`)
- ✅ Configuration files
- ✅ Documentation
- ✅ Content files
- ✅ Public assets (if included)
- ✅ CMS config

### Ignored by Git (`.gitignore`)
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ `out/`
- ❌ `.env` (contains secrets)
- ❌ `.DS_Store` (macOS)

---

## 🎯 Quick File Access Cheat Sheet

**Need to edit...**

| What | Where | Method |
|------|-------|--------|
| **Hero headlines** | `content/pages/home.md` or CMS | CMS recommended |
| **Contact info** | `content/settings/general.md` or CMS | CMS recommended |
| **Blog post** | CMS → Blog Posts | CMS only |
| **Form fields** | `src/components/BookingForm.jsx` | Code editor |
| **Colors** | `tailwind.config.js` | Code editor |
| **Navigation links** | `src/components/Header.jsx` | Code editor |
| **Footer content** | `src/components/Footer.jsx` | Code editor |
| **SEO meta tags** | `src/pages/index.jsx` | Code editor |

---

## 📊 File Count Summary

- **Total files**: ~40
- **React components**: 8
- **Pages**: 3
- **Documentation**: 6
- **Configuration**: 7
- **Content files**: 3+
- **Functions**: 2

---

**Last Updated**: November 28, 2025  
**Project**: Surya's Solar Website  
**Status**: Production Ready ✅

For questions about specific files, refer to:
- Technical details: `README.md`
- Deployment: `DEPLOYMENT.md`
- Quick tasks: `QUICK-REFERENCE.md`
