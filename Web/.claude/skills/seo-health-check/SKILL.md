---
name: seo-health-check
description: Technical SEO + indexing health check for www.suryassolar.com - live redirect chain (Cloudflare DNS -> Vercel), canonical/meta on every sitemap URL, sitemap vs real pages, and analysis of Google Search Console / Semrush CSV exports in ../Google_performance_report. Use for "why aren't my pages indexed", "check SEO", "analyze my search console export", "redirect error", "monthly SEO report", or after any domain/DNS/Vercel change.
---

# SEO health check

## 1. Live crawl check (always run)
`bash .claude/skills/seo-health-check/scripts/live_check.sh`
It checks:
- apex/http variants redirect to `https://www.suryassolar.com` in ONE hop, and whether it is 301/308 (permanent) or 307 (temporary).
- every URL in the live `sitemap.xml` returns 200 directly (no redirect), has a self-referencing canonical and a `<title>`.
Report anything that isn't `OK`.

Known state (Oct 2026): `https://suryassolar.com/*` -> www uses **307 Temporary**. That comes from the Vercel dashboard (Project -> Settings -> Domains -> `suryassolar.com` -> Redirect to www, status code). It should be **308 Permanent** so Google consolidates signals on www. `vercel.json` has a 308 host rule, but Vercel's domain-level redirect fires first.

## 2. Search Console exports
Exports live in `../Google_performance_report/<date>_console reports/` (gitignored). Each issue folder has `Chart.csv`, `Metadata.csv`, `Table.csv`.
- `Chart.csv` at the top level = daily Indexed / Not indexed / Impressions -> report the trend (first vs last row).
- `Critical issues.csv` = reasons + page counts. For each reason, read its `Table.csv` and classify:
  - **Redirect error / Page with redirect** on `suryassolar.com` (apex) or `http://` URLs: expected for non-canonical variants. Only a problem if the www URL itself is not indexed. Old "Redirect error" rows from Jan-Apr 2026 come from the Cloudflare Flexible-SSL loop that's now fixed -> tell owner to click "Validate fix" in GSC.
  - **404**: check if the slug was renamed; add a 301 in `vercel.json` + `next.config.js`.
  - **Discovered / Crawled - currently not indexed**: content quality / internal-linking problem. Suggest adding internal links from indexed, high-impression pages and the homepage, improving thin content, and requesting indexing for the top 10.
- Performance exports (Queries/Pages CSVs) -> find queries with high impressions and position 5-20 (quick wins) and pages with CTR < 1% (rewrite title/excerpt). Map each to an existing post via the Keyword Intent Map in `BLOG-AUTHORING.md`.

## 3. On-page spot checks in code
- Every page in `src/pages` has `<link rel="canonical" href="https://www.suryassolar.com/...">` without trailing slash.
- `scripts/generate-sitemap.js` lists every non-blog page (compare against `src/pages` and `src/lib/locationsData.js`).
- `public/robots.txt` points at the www sitemap.
- Blog posts: run `node .claude/skills/new-blog-post/scripts/check_posts.js`.
- JSON-LD: paste the live URL into https://search.google.com/test/rich-results when schema changed.

## 4. Output
Short report: what's broken (with exact URLs), why it matters, the fix (file + change, or dashboard click path for Vercel / Cloudflare / GSC), ordered by impact. Offer to make the code fixes. Do not change DNS or Vercel settings without the owner's explicit OK.
