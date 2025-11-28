# Asset Checklist for Surya's Solar Website

This file lists all the placeholder assets that need to be replaced with actual brand assets before going live.

## 🎨 Branding Assets Required

### Logo & Brand Identity
- [ ] **Logo (SVG format preferred)** - Replace `SS` placeholder in header
  - Primary logo with text
  - Icon-only version for mobile
  - Recommended size: 200x50px (horizontal), 100x100px (icon)

- [ ] **Favicon** - `/public/favicon.ico`
  - 16x16px and 32x32px

- [ ] **Brand Colors** (update in `tailwind.config.js`)
  - [ ] Primary color (currently: `#0f4bd6`)
  - [ ] Accent color (currently: `#ff8a00`)
  - [ ] Additional brand colors if needed

## 📸 Hero Carousel Images (3 slides)

Replace these placeholder paths with actual high-quality images:

- [ ] **Slide 1**: `/public/images/hero-slide-1.jpg`
  - Recommended: Residential rooftop installation during daytime
  - Size: 1920x1080px minimum
  - Format: JPG/WebP optimized

- [ ] **Slide 2**: `/public/images/hero-slide-2.jpg`
  - Recommended: Happy family in front of solar-powered home
  - Size: 1920x1080px minimum
  - Format: JPG/WebP optimized

- [ ] **Slide 3**: `/public/images/hero-slide-3.jpg`
  - Recommended: Close-up of premium solar panels
  - Size: 1920x1080px minimum
  - Format: JPG/WebP optimized

## 🏠 Booking Form Section

- [ ] **Installation Image**: `/public/images/default-installation.jpg`
  - Professional team installing solar panels
  - Size: 800x600px minimum
  - Format: JPG/WebP optimized

## 🤝 Partner Logos (5 logos)

Create folder and add partner logos:

- [ ] `/public/images/partner-logos/adani.png`
- [ ] `/public/images/partner-logos/tata.png`
- [ ] `/public/images/partner-logos/vikram.png`
- [ ] `/public/images/partner-logos/waaree.png`
- [ ] `/public/images/partner-logos/luminous.png`

**Specifications:**
- Format: PNG with transparent background
- Size: 200x100px (horizontal logos)
- Keep aspect ratio, padding if needed

## 💬 Testimonial Images (4 customer photos)

- [ ] `/public/images/testimonials/customer-1.jpg`
- [ ] `/public/images/testimonials/customer-2.jpg`
- [ ] `/public/images/testimonials/customer-3.jpg`
- [ ] `/public/images/testimonials/customer-4.jpg`

**Specifications:**
- Format: JPG
- Size: 200x200px (square, for avatars)
- Professional headshots or home photos
- **Note**: Can use placeholder initials (current default) if photos unavailable

## 🌐 SEO & Social Media

- [ ] **Open Graph Image**: `/public/images/og-home.jpg`
  - Used when sharing website on social media
  - Size: 1200x630px
  - Format: JPG
  - Include: Logo, tagline, hero visual

## 📝 Blog Assets

- [ ] `/public/images/blog/` folder
  - Create folder for blog featured images
  - Example: `/public/images/blog/solar-cuddalore.jpg`

## 📂 Additional Folders to Create

```
/public/images/
  ├── hero-slide-1.jpg
  ├── hero-slide-2.jpg
  ├── hero-slide-3.jpg
  ├── default-installation.jpg
  ├── og-home.jpg
  ├── logo.png
  ├── /partner-logos/
  │   ├── adani.png
  │   ├── tata.png
  │   ├── vikram.png
  │   ├── waaree.png
  │   └── luminous.png
  ├── /testimonials/
  │   ├── customer-1.jpg
  │   ├── customer-2.jpg
  │   ├── customer-3.jpg
  │   └── customer-4.jpg
  ├── /blog/
  │   └── solar-cuddalore.jpg
  └── /uploads/ (for CMS uploads)
```

## 🎯 Optimization Guidelines

For all images:
- **Compress** images using tools like TinyPNG or Squoosh
- Use **WebP format** for better compression when possible
- Include **meaningful alt text** for accessibility
- **Lazy load** non-critical images (already implemented)
- Target file size: <200KB for hero images, <50KB for logos

## 📞 Contact Information to Update

Update in `/content/settings/general.md` and components:

- [ ] Phone number (currently: `+919876543210`)
- [ ] Email (currently: `info@suryassolar.com`)
- [ ] Physical address (currently: `123 Main Street, Cuddalore`)
- [ ] Social media URLs:
  - [ ] Facebook
  - [ ] Instagram
  - [ ] LinkedIn
  - [ ] WhatsApp business number

## ✅ Before Going Live

- [ ] Replace all placeholder images
- [ ] Update all contact information
- [ ] Test all forms and submissions
- [ ] Verify Netlify CMS is connected
- [ ] Set up Zapier webhook for form submissions
- [ ] Configure DNS with Hostinger
- [ ] Enable HTTPS
- [ ] Submit sitemap to Google Search Console
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target 90+ score)

---

**Note**: Until actual assets are provided, the site will use placeholder values. All functionality is fully operational and ready for content updates via Netlify CMS once deployed.
