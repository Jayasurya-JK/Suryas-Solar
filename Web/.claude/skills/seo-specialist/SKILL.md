---
name: seo-specialist
description: Senior SEO playbook for suryassolar.com - how Google (and AI answers) rank local solar content in Tamil Nadu, on-page and E-E-A-T standards, content depth/length rules, local SEO and Google Business Profile, internal linking, schema, CTR optimisation, indexing and measurement. Use when deciding what makes a page rank, auditing or scoring a post/page before publishing, answering "is this good for SEO", "how long should a blog be", "why isn't this ranking", "SEO score", or planning SEO priorities. Works with solar-content-writer (writing), seo-health-check (technical/indexing) and new-blog-post (publishing).
---

# SEO specialist - Surya's Solar

Think like Google's ranking systems: **the most helpful, trustworthy answer for this searcher, in this place, wins.** Everything below serves that.

## 1. What actually ranks (priorities, in order)
1. **Intent match** - the page answers exactly what the query wants (number, comparison, price, how-to, local provider). Check the current top 5 results for the query and match their format (table vs guide vs list).
2. **Completeness** - covers the follow-up questions a buyer asks next (People Also Ask, Search Console queries for the page).
3. **Trust (E-E-A-T)** - first-hand experience (our installs, portal record, photos), clear author/business, accurate dated facts, sources for government rules, no exaggeration.
4. **Page experience** - fast mobile page, readable tables, no intrusive pop-ups blocking content.
5. **Links** - internal links from strong pages; local citations and backlinks (enfsolar, directories, GBP).
6. **Freshness** - "2026" topics must be updated when rules/prices change (set `updated:`).

## 2. Length - the honest rule
Word count is **not** a ranking factor. Depth is. But depth for our topics needs room:
| Page type | Target body length | Why |
|---|---|---|
| Money / comparison / subsidy guide | **1,300 - 2,000 words** | Competing pages are long; buyers want tables, costs, FAQs |
| Units / sizing / how-to | **1,100 - 1,500 words** | Number answer + season/town tables + "what it can run" + sizing advice |
| Town landing page | 700 - 1,000 words of unique local copy | Must not be a copy of another town page |
| News / update | 600 - 900 words | Speed beats length; update later |
Minimum for any blog post on this site: **1,000 words of real text on the page** (body + FAQ, excluding table pipes/markup; this is about 1,200 by a normal word counter). `check_posts.js` warns below it. Never pad: every section must answer a real question. If you can't find 1,100 useful words, the topic is too narrow - merge it into an existing post.

## 3. On-page checklist (score each post before publish; aim 18/20)
1. Primary keyword in title (first 3-5 words), <= 60 chars (2)
2. Excerpt/meta 120-160 chars with the answer + a click reason (2)
3. Answer in the first 2-3 sentences with a number (2)
4. One H1 (title) and descriptive H2s that mirror real questions (1)
5. At least one table near the top (1)
6. Local signal: Tamil Nadu / Cuddalore / TNEB terms used naturally (1)
7. First-hand proof: portal record, real photo, engineering detail (2)
8. 4-6 FAQs in frontmatter (FAQPage schema) (1)
9. 3-6 internal links incl. a money page and /contact; descriptive anchor text (2)
10. Linked FROM at least 2 existing related posts (hub/spoke) (2)
11. Image with descriptive alt/filename; real photo preferred (1)
12. Dated facts ("as of Oct 2026") + official links for schemes (1)
13. No keyword stuffing; reads naturally; no em dashes, no emojis (1)
14. Body length meets section 2 target (1)

## 4. Topic clusters (hub and spoke)
Each cluster = one hub (broad) + spokes (specific) that link up to the hub and across to siblings:
- **Units/sizing hub** `/blog/2025-12-03-solar-panel-generation-units-tamil-nadu-guide` -> 1kW, 2kW, 3kW, 5kW, 10kW spokes
- **Brands hub** `/blog/2025-12-01-best-solar-panel-brands-tamil-nadu-puducherry` -> Premier vs Adani, Premier vs Waaree, Tata, Exide, price list
- **Subsidy hub** `/blog/2025-12-02-pm-surya-ghar-subsidy-tamil-nadu-puducherry` -> last date, Cuddalore process, rejections, apartments, payback
- **EB bill hub** `/blog/2026-04-30-how-to-calculate-eb-bill-tamil-nadu-examples` -> summer bill, Chennai bill, average bill, reduce bill
- **Local hub** `/service-areas/cuddalore` -> town pages, case studies
When publishing a spoke, add a link to it from the hub in the same commit.

## 5. Local SEO (Cuddalore first)
- **Google Business Profile** is the #1 local lever: exact NAP match with the site, primary category "Solar energy system service" (or the closest available), services listed, weekly posts, photos weekly, reply to every review (mention service + town naturally), ask every happy customer for a review.
- **Site:** LocalBusiness schema with geo, hours, areaServed; town pages with unique local details; embed map on contact page.
- **Citations:** same NAP on JustDial, IndiaMART, Sulekha, enfsolar, Facebook, Instagram.
- **Never publish customer locations** (owner rule) - "a home in Cuddalore district".

## 6. CTR (getting the click when we already rank)
- Pages with position 3-10 and CTR < 1.5% -> rewrite title/excerpt first (cheapest win).
- Title formulas that work here: "[Keyword]: [Number answer] ([TN/2026])", "[A] vs [B]: Which Is Better? (2026)", "[Topic] in Tamil Nadu: [Benefit/Number]".
- Put the number in the meta description so the snippet answers and still invites the click.

## 7. Google AI answers / LLMs
Short factual answer sentences, tables, FAQs, and the `public/llms.txt` summary make us quotable in AI Overviews and chat answers. Keep llms.txt updated with every new post.

## 8. Indexing and measurement
- After publish: Search Console "Request indexing" (about 10/day) - prioritise money pages and new posts.
- Month 1 check per post: indexed? impressions? position? -> if not indexed after 3 weeks, add more internal links from indexed pages.
- Monthly: pull Search Console (`seo-health-check`), update `../Marketing/BLOG-CONTENT-PLAN.md` tracker, refresh losers, double down on winners.

## 9. What NOT to do
Buying links, fake reviews, fabricated case studies or numbers, copying competitor text, doorway town pages that only swap the town name, hidden text, keyword-stuffed titles, publishing claims about government schemes without a date.
