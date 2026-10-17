---
name: new-blog-post
description: Write, publish or refresh a blog post on suryassolar.com (Markdown in content/blog). Use for "write a blog on X", "new article", "add a post about", "refresh/update the old post on", or turning a Search Console query into content. Handles keyword-intent check against existing posts, frontmatter, FAQs, internal links, component markers, featured image, llms.txt update and validation.
---

# New / refreshed blog post

Read `BLOG-AUTHORING.md` (Keyword Intent Map + frontmatter rules) and load the `suryas-business-facts` skill before writing. Facts, prices and subsidy amounts come only from there.

## 1. Pick the intent (don't cannibalize)
- List existing posts: `ls content/blog` and grep titles: `grep -h "^title:" content/blog/*.md`.
- If an existing post already targets the same primary query, **refresh that post** (update content + `updated:` date, keep slug/URL) instead of creating a new one.
- If the idea came from Search Console, check `../Google_performance_report/` for the query's impressions/position and mention it to the owner.
- Confirm with the owner: primary keyword, target location (Cuddalore / Puducherry / Tamil Nadu), and which money page it supports.

## 2. File + frontmatter
- Filename: `content/blog/YYYY-MM-DD-primary-keyword-slug.md` (today's date, lowercase, hyphens; the slug is the permanent URL).
- Frontmatter (follow the latest posts' format):
```yaml
---
title: 'Primary Keyword First: Clear Promise (Tamil Nadu 2026)'   # <= ~60 chars
date: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
author: Surya's Solar Engineering Team
excerpt: >-
  120-160 chars. Used as meta description. Include the keyword and a reason to click.
featuredImage: /images/<slug-ish-name>.webp
category: Solar Guides | Solar Finance | Technical | Subsidy & Policy | Local
tags: [ ... 4-6 tags ... ]
faqs:
  - question: ...
    answer: ...   # 3-5 real questions people search, short direct answers
---
```

## 3. Body
- Open with the direct answer in the first 2-3 sentences (good for Google snippets and AI answers), then detail.
- H2 per sub-question; use tables for prices / unit generation / comparisons; use ₹ and "units" (TNEB language).
- Local proof: Cuddalore coastal rust, TNEB net-meter process, Puducherry PED, coconut-tree shading, summer EB bills.
- Internal links (3-6): the relevant money page from the Keyword Intent Map, `/calc`, `/systems/3kw-solar-system-with-subsidy` or `/systems/5kw-...`, the matching `/service-areas/<city>`, and `/contact`. Use root-relative links with no trailing slash.
- Component markers (each on its own line):
  - mid-article: `<!-- COMPONENT: SOLAR_CALCULATOR -->` or `<!-- COMPONENT: BOOKING_CTA -->`
  - near end: `<!-- COMPONENT: FAQ_SECTION -->` then `<!-- COMPONENT: CONTACT_CTA -->`
- Style: plain hyphens (no em/en dashes), no emojis, simple English, 1,200-2,000 words unless the topic is narrow.

## 4. Image
- Needs a `.webp` at the `featuredImage` path in `public/images/`. If the owner has none, ask; offer to convert a PNG/JPG (existing `png_to_webp_converter.py`) or generate one via Canva/Higgsfield if they want. Never ship a broken image path.

## 5. Sync + validate
- Add the post under the right section in `public/llms.txt`.
- If it becomes a new money page, add it to the Keyword Intent Map in `BLOG-AUTHORING.md`.
- Run `node .claude/skills/new-blog-post/scripts/check_posts.js` (validates frontmatter, image exists, internal links resolve, dashes, duplicate titles) and fix every error.
- Run `npm run build`; confirm the post is in `public/sitemap.xml`.
- Show the owner the title, excerpt and URL, then hand off to the `ship-site` skill to commit and deploy.
