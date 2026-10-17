# Search Console audit - 17 Oct 2026 (suryassolar.com)

Source: Search Console exports in this folder (performance 3m/16m, indexing drilldowns, sitemaps, links, URL inspection).

## Headline numbers
- Last 3 months: 890 clicks, 75.7k impressions, CTR 1.2%, avg position 6.2. 76% mobile, 91% India.
- Monthly clicks: Dec 26 > Mar 86 > Jun 270 > **Jul 349 / Aug 342 (peak)** > Sep 215 > Oct 106 (to 17th). The drop follows the end of the summer "EB bill high" search season, which is the #1 page.
- Indexing: **22 indexed, 65 not indexed.** No manual actions. 13 backlinks (mostly enfsolar.com).

## Indexing breakdown
| Reason | Pages | Meaning | Action |
|---|---|---|---|
| Discovered - currently not indexed | 36 | www pages Google knows about but never crawled (last crawl N/A) | Internal links + request indexing + better crawl signals |
| Page with redirect | 20 | non-www / http variants | Expected. Nothing to fix except make apex redirect 308 |
| Redirect error | 8 | Apex URLs last crawled 23 Apr (old Cloudflare loop) | Click "Validate fix" |
| Crawled - not indexed | 1 | voltage-fluctuation-hybrid-solar | Improve/merge content |

**Not indexed but important:** all 4 `/service-areas/*` pages, `/systems/3kw-solar-system-with-subsidy`, most Jan 2026 posts, most Apr-May 2026 posts. URL Inspection on `/service-areas/cuddalore`: "URL is unknown to Google", no referring sitemap or page detected.

**Sitemaps:** two submitted - `https://suryassolar.com/sitemap.xml` (apex, redirects) and the www one. Remove the apex one.

## Biggest opportunities (from Queries.csv)
1. **"X kW solar how many units" cluster** - ~4,000+ impressions over 3 months at position 8-10 with almost 0 clicks (1kW/2kW/3kW/5kW units per day/month). The generation-units post has 21k impressions at 0.4% CTR. Fix: rewrite its title/meta, add a units table at the top, and create dedicated sections or pages per size.
2. **"EB slab rate Tamil Nadu 2026"** - ~900 impressions, position 6-9. A dedicated slab-rate post (the existing EB bill calculation post is not indexed).
3. **"why EB bill high"** - the top page (254 clicks). Seasonal; refresh before next summer (Feb 2027).
4. **"bifacial vs monocrystalline", "premier vs adani"** - position 5-6. Comparison content works; add more brand comparisons (Waaree vs Tata vs Adani vs Premier vs Rayzon).
5. **Brand "surya solar panel" ranks only #9.** Needs Google Business Profile + consistent NAP + Organization schema + an About page that's indexed.

## Plan (order)
### Phase 1 - Technical fixes (code + dashboards, ~1 day)
- Vercel: apex -> www redirect 307 -> 308.
- GSC: remove apex sitemap; "Validate fix" on Redirect error; request indexing for the top ~10 unindexed money pages (quota ~10/day).
- Canonical on privacy/terms; fix llms.txt NAP and prices; pincode consistency; remove fake aggregateRating.
- Stronger internal linking: homepage + blog sidebar/footer "Popular guides" and service-area links in every post; related-posts block per category; breadcrumbs (+ BreadcrumbList schema).
- Sitemap: real `lastmod` per page (not today's date for every page on every build).
- 301s for junk URLs seen in GSC (`/blog/20-mono-vs-bifacial-...` etc.).

### Phase 2 - CTR rewrites on already-ranking pages (~2 days)
- Titles/meta for generation-units, mono-vs-bifacial, AC-on-solar (3.2k impressions, 0.25% CTR), 3kW price, homepage.

### Phase 3 - New content (ongoing, 2 posts/week)
- EB slab rates 2026, 1kW/2kW/3kW/5kW units per day, brand comparisons, town pages (Chidambaram, Villupuram, Nellikuppam), case studies with real install photos.
