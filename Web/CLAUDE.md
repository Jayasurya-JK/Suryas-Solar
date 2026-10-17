# Surya's Solar - www.suryassolar.com

Marketing + lead-gen website for Surya's Solar, a residential/commercial rooftop solar installer in Cuddalore, Tamil Nadu (also serves Puducherry, Panruti, Neyveli). The site exists to rank on Google for local solar queries and turn visitors into home-visit bookings / WhatsApp chats / calls.

## Stack & hosting (how a change reaches production)

- **Code**: Next.js 14 (Pages Router, plain JSX, no TypeScript), Tailwind 3, Markdown blog via `gray-matter` + `marked`. All code lives in this `Web/` folder; the git root is the parent folder `Suryas-Solar/`.
- **GitHub**: `Jayasurya-JK/Suryas-Solar`, branch `main`.
- **Vercel (free/Hobby tier)**: auto-deploys on push to `main`. Builds Next.js natively (`npm run build`), NOT a static export. Root directory in Vercel = `Web`.
- **Cloudflare**: DNS only (grey cloud / DNS-only, nameservers `carter`/`leia.ns.cloudflare.com`). Records point to Vercel. Do NOT enable the orange-cloud proxy or "Flexible" SSL - that caused the 2026 redirect loop (ERR_TOO_MANY_REDIRECTS) and Search Console "Redirect error" pages.
- **Hostinger**: domain registrar only. Hosting there is no longer used.
- **Canonical host**: `https://www.suryassolar.com` (www, no trailing slash). Apex -> www redirect is handled by Vercel domain settings + `vercel.json`. Never add host redirects in `next.config.js`.
- **Forms**: Web3Forms (`api.web3forms.com/submit`) in `BookingForm.jsx` and `contact.jsx`. Analytics: GA4 `G-5C79VEBNMK` + Vercel Analytics (`_app.jsx`).

### Legacy files that do NOT run (don't "fix" them, don't trust them)
- `.github/workflows/deploy.yml` (FTP to Hostinger) - sits under `Web/.github`, not the repo root, so GitHub never runs it.
- `public/.htaccess` - Apache rules from the Hostinger era; it redirects www -> apex, the opposite of today's canonical. Vercel ignores it.
- `.env.example` mentions Netlify/Zapier/SendGrid - not used.
- The many top-level `*.md` docs (ARCHITECTURE-ANALYSIS, DEPLOYMENT, PROJECT-COMPLETE...) and one-off `*.py` scripts are from earlier phases and are often outdated. Prefer the code.

## Commands

- `npm run dev` - local dev at http://localhost:3000
- `npm run build` - regenerates `public/sitemap.xml` (via `scripts/generate-sitemap.js`) then `next build`. Run before every push.
- `npm run lint` - next lint
- Do not use `npm run export` / `next export` (removed in Next 14, and Vercel doesn't need it).
- On Windows PowerShell use `npm.cmd` if `npm` is blocked by execution policy.

## Layout

- `src/pages/` - routes: `index`, `about`, `contact`, `calc` (solar calculator), `blog/index`, `blog/[slug]`, `service-areas/[city]`, `systems/3kw-...`, `systems/5kw-...`, legal pages.
- `src/components/` - Header, Footer, BookingForm/BookingPopup, SolarCalculator, WhatsAppFloat, etc.
- `src/lib/content.js` - loads Markdown; `src/lib/blogFaqs.js` - fallback FAQ matcher; `src/lib/locationsData.js` - service-area city data.
- `content/blog/*.md` - blog posts (slug = filename). `content/pages/home.md` - homepage hero/stats/testimonials. `content/settings/general.md` - site title, phone, email, address.
- `public/sitemap.xml` (generated), `public/robots.txt`, `public/llms.txt` (hand-written AI-crawler summary - keep in sync with business facts and new posts).
- `../Google_performance_report/` - Search Console / Semrush CSV exports and SEO notes.

## Rules for working on this site

- **SEO is the business.** Every page needs: unique `<title>` (primary keyword first, ~60 chars), meta description (~150-160 chars), canonical `https://www.suryassolar.com/<path>` with no trailing slash, OG tags. Keep JSON-LD (LocalBusiness / Article / FAQPage) valid.
- **Adding a page?** Also add it to the static lists in `scripts/generate-sitemap.js`. Blog posts are picked up automatically.
- **Renaming/removing a URL?** Add a 301 in BOTH `vercel.json` and `next.config.js` `redirects()` (existing pattern), and update internal links.
- **One primary keyword per post.** Check the Keyword Intent Map in `BLOG-AUTHORING.md` before writing a new post; supporting posts link to the primary "money" page.
- **Business facts** (phone, address, prices, subsidy amounts, stats) must match everywhere: Footer, contact, about, `index.jsx` JSON-LD, `general.md`, `llms.txt`, Google Business Profile. See the `suryas-business-facts` skill. Never invent prices, stats, testimonials or certifications - ask.
- **Style**: plain hyphens, not em/en dashes (a deliberate cleanup was done). No emojis in content. Images are `.webp` in `public/images/`.
- **Audience**: Tamil Nadu homeowners; simple English, local terms (TNEB, EB bill, units, PM Surya Ghar, net meter). Rupees as `₹1.6 lakh`.
- Commit messages: short imperative sentence, like the existing history.
