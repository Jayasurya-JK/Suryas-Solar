---
name: solar-content-writer
description: Plan and write high-ranking, high-converting content for Surya's Solar - blog posts, town/landing page copy, Google Business Profile posts, WhatsApp/Instagram captions - with Tamil Nadu + local (Cuddalore) SEO, the brand voice, the ₹1 lakh subsidy campaign, and ready-to-paste AI image prompts for Gemini (Nano Banana) / ChatGPT. Use for "what should we write next", "write a blog about", "content plan", "content calendar", "image prompt", "GBP post", "social post", "Instagram caption", or before running the new-blog-post skill.
---

# Solar content writer (strategy + writing)

Load first: `suryas-business-facts` skill (facts) and `../Marketing/MARKETING-PLAYBOOK.md` (positioning, calendar, campaign). For publishing mechanics (file, frontmatter, validation, build) hand off to the `new-blog-post` skill.

## 1. Choose the topic (data first)
1. Check the playbook calendar for the next item.
2. Check demand: latest Search Console export in `../Google_performance_report/` (Queries.csv) - prefer queries with high impressions at position 5-20, or zero coverage.
3. Check cannibalization: `grep -h "^title:" content/blog/*.md` and the Keyword Intent Map in `BLOG-AUTHORING.md`. If a post already targets the query, refresh it instead.
4. Classify: **Money** (cost, subsidy, system size, best company - must link to /systems and /contact), **Local** (town + solar), **Problem** (EB bill, AC, units), **Trust** (case study, quality, scams), **Comparison** (brands, panel types).

## 2. Brand voice
- Helpful local engineer talking to a Tamil Nadu homeowner. Simple English, short sentences, no hype words ("revolutionary", "ultimate"), no emojis, plain hyphens (never em/en dashes).
- Use local words: EB bill, TNEB / TANGEDCO / TNPDCL, units, net meter, terrace, PED (Puducherry), lakh, ₹ with Indian commas (₹1,80,000).
- Honest verdicts ("Mono PERC wins on low dark roofs") build trust; say when solar is NOT worth it.
- Proof over claims: portal numbers, real installs, real bills. Never invent customers, numbers, quotes or reviews.
- Every subsidy/date claim: "as of <month year>"; caps are "reported"; link the official portal.

## 3. Structure that ranks (and gets cited by Google AI answers)
1. **Title** (<= 60 chars): primary keyword first + concrete promise/number. E.g. "3kW Solar: How Many Units Per Day, Price & Payback (TN 2026)".
2. **Excerpt** (120-160 chars): contains the actual answer + one reason to click.
3. **Answer box**: first 2-3 sentences directly answer the query with numbers.
4. **One table** near the top (prices, units, subsidy, comparison).
5. H2s = the follow-up questions people ask (use "People also ask" phrasing, Search Console queries).
6. Local proof section: Cuddalore/coastal/TNEB specifics, a real example.
7. Subsidy hook where relevant: link the flagship `/blog/2025-12-02-pm-surya-ghar-subsidy-tamil-nadu-puducherry`.
8. Internal links (3-6): money page + /calc + /systems/3kw or 5kw + /service-areas/<town> + /contact.
9. `faqs:` frontmatter (4-6 real questions), `<!-- COMPONENT: FAQ_SECTION -->`, then `<!-- COMPONENT: CONTACT_CTA -->`.
10. Length: minimum **1,000 words of real text** (body + FAQ, as counted by check_posts.js) for any blog post, 1,300-2,000 for money/comparison/subsidy posts (see `seo-specialist` skill section 2). Reach it with real follow-up questions (how to check, mistakes, what to ask, scenarios), never filler. Score every post with the `seo-specialist` checklist before publishing.

## 4. Local SEO patterns
- Town pages / town posts: name the town in title, H1, first sentence, one H2, image alt and meta description. Mention real local details (coastal salt, soil, coconut-tree shade, TNEB section office, typical roof types, distance from Kondur office). Ask the owner for real installs in that town.
- Expansion order: Cuddalore -> Panruti, Neyveli, Chidambaram, Villupuram, Nellikuppam, Vadalur, Virudhachalam, Kurinjipadi, Puducherry -> statewide.
- Every local page links to the nearest service-area page and the contact page; add new towns to the Footer/Header and `scripts/generate-sitemap.js` (see `new-landing-page` skill).

## 5. Image prompts (owner generates in Gemini Nano Banana / ChatGPT)
For every post give the owner: filename, size, alt text and 1 prompt (+1 variation). Save target: `public/images/<slug-keyword>.webp`, 1200x675 (16:9). Owner converts to webp (or Claude runs `png_to_webp_converter.py`).

Prompt template:
```
Photorealistic 16:9 photo, natural daylight, [SCENE] on a typical Tamil Nadu
concrete terrace house in Cuddalore (flat white-painted roof, coconut trees,
blue sky, light coastal haze). [SUBJECT DETAILS]. Indian homeowners/technicians
in everyday clothing where people appear. Realistic proportions, no brand logos,
no watermark, no text in the image. Shot on a 35mm lens, eye level, sharp focus.
```
Scene ideas by topic: subsidy -> family on terrace beside new panels with documents/phone; EB bill -> close-up of a TNEB bill and calculator on a table with panels visible through window; units -> panels at noon with an inverter display; AC -> living room with split AC, panels visible outside; coastal -> hot-dip galvanized structure close-up with sea breeze; town page -> recognisable but generic local street + rooftop solar.
Rules: never generate fake "our installation" or fake customer photos (use real ones), no text in images (Google can't read it and AI text is often wrong), no other companies' logos.

## 6. Repurpose every post (same day)
- **Google Business Profile post** (<= 1,500 chars, first 100 chars carry the hook, CTA "Call now", link to the post).
- **WhatsApp status / broadcast**: 2-3 lines + link.
- **Instagram carousel**: 5 slides (hook, 3 key facts, CTA "WhatsApp 7904369094").
Write these in the same reply as the post so the owner can paste them.

## 7. Before handing to `new-blog-post`
Checklist: facts match `suryas-business-facts`; no em dashes; title <= 60 chars; answer in first 3 sentences; table present; FAQ in frontmatter; 3-6 internal links; image filename + prompt given; playbook calendar updated (mark done).
