# Blog Authoring Guide

Blog posts are written manually as Markdown files in `content/blog`. The site does not use a CMS. Add a new `.md` file, commit it, then run the normal build/deploy flow.

## Filename

Use this format:

```text
YYYY-MM-DD-short-topic-slug.md
```

Example:

```text
2026-05-09-how-to-size-solar-for-ac-tamil-nadu.md
```

## Frontmatter

Every post should start with YAML frontmatter:

```yaml
---
title: "How to Size Solar for AC in Tamil Nadu"
date: "2026-05-09"
author: "Surya's Solar Team"
excerpt: "A practical guide to choosing the right solar system size for homes using air conditioners in Tamil Nadu."
featuredImage: "/images/how-to-size-solar-for-ac-tamil-nadu.webp"
category: "Solar Guides"
tags: ["Solar Sizing", "Air Conditioning", "Tamil Nadu", "Residential Solar"]
faqs:
  - question: "Can a 3kW solar system run an AC?"
    answer: "Yes, a 3kW solar system can offset AC usage during sunny hours, but the right size depends on AC tonnage, run time, and total home load."
  - question: "Do I need a battery to run AC on solar?"
    answer: "Not for bill savings with an on-grid system. A battery is needed only if you want backup during power cuts."
---
```

Required fields:

- `title`
- `date`
- `author`
- `excerpt`
- `featuredImage`
- `category`
- `tags`

Optional field:

- `faqs`: Use this for post-specific FAQs. If omitted, the site falls back to the older automatic FAQ matching.

## Content Markers

Use these markers inside the Markdown body when a post needs embedded site components:

```html
<!-- COMPONENT: BOOKING_CTA -->
```

Shows the subsidy/home visit call-to-action.

```html
<!-- COMPONENT: CONTACT_CTA -->
```

Shows the rooftop assessment call-to-action.

```html
<!-- COMPONENT: SOLAR_CALCULATOR -->
```

Embeds the solar calculator.

```html
<!-- COMPONENT: FAQ_SECTION -->
```

Renders the FAQ accordion using the `faqs` frontmatter first. If no `faqs` are provided, it uses the fallback FAQ matcher.

## Publishing Checklist

Before publishing:

- Confirm the image exists in `public/images`.
- Keep the `excerpt` under roughly 160 characters when possible.
- Add `<!-- COMPONENT: FAQ_SECTION -->` near the end if the post has FAQs.
- Run `npm.cmd run build` and check that the post appears under `/blog`.

## Keyword Intent Map

Before writing a new post, choose one primary intent. Do not make multiple posts compete for the same main query.

Primary money pages:

- `3kW solar system price`: use `/blog/2026-05-05-3kw-solar-system-price-india-how-many-units-cost`
- `5kW solar system cost`: use `/blog/2026-05-06-5kw-solar-system-cost-tamil-nadu-2026-complete-guide`
- `solar panel cost Tamil Nadu`: use `/blog/2026-05-04-solar-panel-cost-tamil-nadu-2026-price-subsidy-savings`
- `solar cost Puducherry`: use `/blog/2026-05-08-solar-cost-puducherry-2026-1kw-3kw-5kw-price-guide`
- `best solar company Cuddalore`: use `/blog/2026-05-07-best-solar-company-cuddalore-what-to-check`
- `solar for electricity bill`: use `/blog/2026-05-01-how-much-solar-for-5000-electricity-bill-tamil-nadu`
- `home solar sizing`: use `/blog/2026-05-02-how-much-solar-needed-for-home-india`
- `solar savings and ROI`: use `/blog/2026-05-03-how-much-can-you-save-with-solar-panels-india`

Supporting posts should link back to the relevant primary money page instead of repeating the same title intent.

Examples:

- A post about AC usage should link to the electricity-bill sizing post, calculator, and 3kW/5kW pages.
- A post about subsidy should link to 3kW, 5kW, calculator, and contact pages.
- A post about Cuddalore or Puducherry should link to the matching service-area page.

Title rules:

- Put the primary keyword first.
- Keep the title clear and focused.
- Use H2s for secondary terms such as subsidy, units, ROI, TNEB, Cuddalore, or Puducherry.
- Avoid creating another post with the same primary keyword unless the older post is being replaced.
