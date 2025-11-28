# Surya's Solar - Static Website with Netlify CMS

A production-ready, mobile-first static website for Surya's Solar built with Next.js, Tailwind CSS, and Netlify CMS. Features a 3-slide hero carousel, booking form with webhook integration, SEO optimization, and a headless CMS for content management.

## 🚀 Features

- ✨ **Modern Tech Stack**: Next.js 14, React 18, Tailwind CSS 3
- 📱 **Mobile-First Design**: Fully responsive with sticky navigation and mobile-optimized UI
- 🎨 **3-Slide Hero Carousel**: Separate, editable slides with auto-play and swipe support
- 📝 **Smart Booking Form**: Validation, Netlify Forms integration, webhook to Zapier/Google Sheets
- 📊 **Key Stats Section**: Animated stats strip with custom icons
- 🔄 **6-Step Timeline**: Installation process visualization with scroll animations
- 💬 **Testimonials**: Carousel on mobile, grid on desktop
- 🤝 **Partner Logos**: Trusted brand showcase
- 🎯 **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, LocalBusiness schema
- 📄 **Netlify CMS**: Git-backed headless CMS for non-technical content editing
- ⚡ **Static Export**: Fast, CDN-ready static site generation
- ♿ **Accessible**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation

## 📁 Project Structure

```
/
├── package.json
├── next.config.js (static export config)
├── tailwind.config.js
├── netlify.toml
├── CHECKLIST.md (asset replacement guide)
├── README.md
├── /public
│   ├── /images (hero slides, partners, testimonials)
│   ├── /admin (Netlify CMS admin UI)
│   ├── sitemap.xml
│   └── robots.txt
├── /src
│   ├── /components
│   │   ├── Header.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── StatsStrip.jsx
│   │   ├── BookingForm.jsx
│   │   ├── TimelineSteps.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Partners.jsx
│   │   └── Footer.jsx
│   ├── /pages
│   │   ├── index.jsx
│   │   ├── _app.jsx
│   │   ├── _document.jsx
│   │   └── /api
│   │       └── form-handler.js
│   └── /styles
│       └── globals.css
├── /content
│   ├── /blog (markdown blog posts)
│   ├── /pages (home.md - CMS editable)
│   └── /settings (general.md - site settings)
├── /static-admin
│   └── config.yml (Netlify CMS configuration)
└── /netlify/functions
    └── form-handler.js (serverless webhook handler)
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone or navigate to the project directory:**

```bash
cd /Users/jj29/Personal/Web
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Export static site
npm run export

# Serve static build locally
npm run start

# Netlify dev (for testing functions locally)
npm run netlify
```

## 📦 Build & Export

To generate the static site for deployment:

```bash
# Build and export
npm run build && npm run export
```

This creates an `out/` directory with static HTML, CSS, and JS files ready for deployment.

## 🚢 Deployment to Netlify

### Step 1: Push to GitHub

1. **Initialize Git repository (if not already):**

```bash
git init
git add .
git commit -m "Initial commit - Surya's Solar website"
```

2. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Name it `suryas-solar`
   - Don't initialize with README (already exists)

3. **Push to GitHub:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/suryas-solar.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. **Sign up/Login to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or login with GitHub

2. **Create New Site:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select the `suryas-solar` repository

3. **Configure Build Settings:**
   ```
   Build command: npm run build && npm run export
   Publish directory: out
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Step 3: Enable Netlify CMS

1. **Enable Identity:**
   - In Netlify dashboard, go to "Identity" tab
   - Click "Enable Identity"

2. **Configure Git Gateway:**
   - In Identity settings, scroll to "Services" → "Git Gateway"
   - Click "Enable Git Gateway"

3. **Invite Yourself:**
   - Go to Identity → "Invite users"
   - Enter your email
   - Check email and accept invitation

4. **Access CMS:**
   - Visit `https://YOUR-SITE.netlify.app/admin/`
   - Login with your email
   - Start editing content!

### Step 4: Configure Environment Variables

For form webhooks and email notifications:

1. **In Netlify Dashboard:**
   - Go to "Site settings" → "Environment variables"

2. **Add these variables:**

```
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID
SENDGRID_API_KEY=SG.your_sendgrid_api_key (optional)
ADMIN_EMAIL=info@suryassolar.com (optional)
```

### Step 5: Enable Netlify Forms

Forms are already configured with `data-netlify="true"`. In Netlify:

1. Go to "Forms" tab after first deployment
2. Forms will appear after first submission
3. Set up email notifications if desired
4. All submissions saved in Netlify dashboard

## 🌐 DNS Configuration (Hostinger → Netlify)

To point your Hostinger domain to Netlify:

### Option 1: Use Netlify DNS (Recommended)

1. **In Netlify Dashboard:**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter `suryassolar.com`
   - Netlify will provide nameservers (e.g., `dns1.p01.nsone.net`)

2. **In Hostinger Control Panel:**
   - Login to [hostinger.com](https://hostinger.com)
   - Go to "Domains" → Select `suryassolar.com`
   - Click "DNS / Nameservers"
   - Select "Change nameservers"
   - Enter Netlify's nameservers
   - Save changes

3. **Wait for DNS Propagation:**
   - Usually takes 2-24 hours
   - Check status at [dnschecker.org](https://dnschecker.org)

### Option 2: Keep Hostinger DNS (CNAME/A Records)

If you want to keep Hostinger as your DNS provider:

1. **Get Netlify's IP Address:**
   - In Netlify: "Domain settings" → "HTTPS" → Note the load balancer IP

2. **In Hostinger DNS Zone Editor:**

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: YOUR-SITE.netlify.app
   TTL: 3600
   ```

   **For root domain (@):**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's load balancer IP)
   TTL: 3600
   ```

   **Alternative (if ALIAS/ANAME supported):**
   ```
   Type: ALIAS or ANAME
   Name: @
   Value: YOUR-SITE.netlify.app
   ```

3. **In Netlify:**
   - Add custom domain `suryassolar.com`
   - Enable HTTPS (automatic with Let's Encrypt)

### Verify DNS Setup

```bash
# Check DNS records
dig suryassolar.com
dig www.suryassolar.com

# Check if pointing to Netlify
nslookup suryassolar.com
```

## 📝 Content Management (Netlify CMS)

### Accessing the CMS

1. Visit: `https://suryassolar.com/admin/` (or your Netlify URL)
2. Login with your email
3. Edit content directly in the browser

### What You Can Edit:

#### Home Page (`/admin/#/collections/pages/entries/home`)
- **Hero Slides**: Edit all 3 slides independently
  - Headlines, subheads, images, CTA buttons
- **Stats**: Update numbers and labels
- **Timeline Steps**: Modify installation process
- **Partners**: Add/remove partner logos
- **Testimonials**: Add/remove customer reviews

#### Blog Posts (`/admin/#/collections/blog`)
- Create new blog posts
- Edit existing posts
- Add featured images
- Set publish dates and authors
- SEO meta tags

#### Site Settings (`/admin/#/collections/settings`)
- Contact information
- Social media links
- Business hours
- Address

### CMS Workflow

1. **Login** to `/admin/`
2. **Edit** content in visual editor
3. **Save** (creates Git commit)
4. **Publish** (Netlify auto-rebuilds site)
5. **Live** in 2-3 minutes!

**No developer needed** for content updates after initial setup.

## 📧 Form Submission Workflow

### Current Setup

1. **User submits booking form**
2. **Netlify Forms** captures submission (visible in dashboard)
3. **Serverless function** triggers webhook to Zapier/Make
4. **Optional**: Sends confirmation email via SendGrid

### Zapier Integration (Recommended)

1. **Create Zapier Account:** [zapier.com](https://zapier.com)

2. **Create New Zap:**
   - Trigger: "Webhooks by Zapier" → "Catch Hook"
   - Copy webhook URL

3. **Add to Netlify Environment Variables:**
   ```
   ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
   ```

4. **Add Actions:**
   - **Google Sheets**: Add row to spreadsheet
   - **Gmail/Email**: Send notification to sales team
   - **SMS**: Send SMS alert (Twilio)
   - **CRM**: Create lead in CRM

### Formspree Alternative (Simpler)

If you prefer a simpler form solution:

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form, get endpoint
3. Update `BookingForm.jsx`:

```jsx
// Replace fetch to /api/form-handler with:
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

## 🎨 Customization

### Update Brand Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: '#YOUR_PRIMARY_COLOR',
    // ... other shades
  },
  accent: {
    DEFAULT: '#YOUR_ACCENT_COLOR',
    // ... other shades
  },
}
```

### Replace Images

See `CHECKLIST.md` for complete asset list. Key images:

- **Hero slides**: `/public/images/hero-slide-[1-3].jpg` (1920x1080px)
- **Partners**: `/public/images/partner-logos/*.png` (200x100px)
- **OG Image**: `/public/images/og-home.jpg` (1200x630px)

### Update Contact Info

Edit `/content/settings/general.md` or via CMS at `/admin/`.

## 🔍 SEO Checklist

- ✅ Semantic HTML with proper heading hierarchy
- ✅ Meta descriptions and title tags
- ✅ Open Graph and Twitter Cards
- ✅ LocalBusiness JSON-LD schema
- ✅ Sitemap.xml and robots.txt
- ✅ Responsive images with lazy loading
- ✅ Fast load times (static export)
- ✅ HTTPS enabled
- ✅ Mobile-friendly design

### Submit to Search Engines

After deployment:

1. **Google Search Console:**
   - Add property for `suryassolar.com`
   - Submit sitemap: `https://suryassolar.com/sitemap.xml`

2. **Google Business Profile:**
   - Verify business listing
   - Add website URL

## ♿ Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Focus states on interactive elements
- Alt text for all images
- Semantic HTML
- Color contrast meets WCAG AA
- Screen reader tested

## 📊 Performance

Expected Lighthouse scores:

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

Optimizations:
- Static export (no SSR overhead)
- Image lazy loading
- Minimal JavaScript
- CSS purging with Tailwind
- CDN delivery via Netlify

## 🐛 Troubleshooting

### Build Fails on Netlify

- Check build logs in Netlify dashboard
- Ensure Node version is 18+ (set in `netlify.toml`)
- Verify all dependencies in `package.json`

### CMS Not Loading

- Ensure Identity and Git Gateway are enabled
- Check if logged in at `/admin/`
- Clear browser cache

### Forms Not Submitting

- Check "Forms" tab in Netlify
- Ensure `data-netlify="true"` on form element
- Verify webhook URL in environment variables

### DNS Not Updating

- Wait 24-48 hours for propagation
- Check with `dig suryassolar.com`
- Verify nameservers or A records

## 📞 Support

For issues with:
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## 📄 License

© 2025 Surya's Solar. All rights reserved.

---

## Quick Start Summary

```bash
# 1. Install
npm install

# 2. Develop
npm run dev

# 3. Build
npm run build && npm run export

# 4. Deploy to Netlify
# - Push to GitHub
# - Connect to Netlify
# - Enable Identity + Git Gateway
# - Configure DNS
# - Access CMS at /admin/

# 5. Go Live! 🚀
```

**Need help?** Refer to the sections above for detailed instructions on deployment, DNS configuration, and content management.
