---
name: competitor-teardown
description: Audience-first competitor review for Surya's Solar - study a rival solar company's website (design, SEO, offers, lead capture), work out WHO it is built to attract and WHY, then decide what fits Surya's Solar and what to ignore. Use when the owner shares a competitor URL or asks "check this site", "can we use their design/SEO", "what are competitors doing", "how do we beat X". Never copy blindly - every borrowed idea must fit our buyer, our size and our facts.
---

# Competitor teardown (think, don't copy)

A competitor's site is shaped by **their** buyers, size and goals. Copying a page built for a 1 MW textile-mill buyer will not help a Cuddalore family with a ₹3,000 EB bill. Always answer "who is this for?" before "should we use it?".

## 1. Collect facts (Playwright, ~5 minutes)
Open the homepage plus the 1-2 pages closest to the question (e.g. their commercial page). For each, run in `browser_run_code_unsafe`:

```js
async (page) => { await page.goto(URL, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000);
  return await page.evaluate(() => { const t = s => [...document.querySelectorAll(s)].map(e => e.textContent.trim().replace(/\s+/g,' ')).filter(Boolean);
    return { title: document.title, desc: document.querySelector('meta[name="description"]')?.content,
      h1: t('h1'), h2: t('h2').slice(0,30), h3: t('h3').slice(0,30), words: document.body.innerText.split(/\s+/).length,
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent.slice(0,120)),
      nav: [...new Set(t('header a, nav a'))].slice(0,40), forms: document.querySelectorAll('form').length,
      tel: [...document.querySelectorAll('a[href^="tel:"]')].length, wa: document.querySelectorAll('a[href*="wa.me"]').length } }) }
```

Then fetch `/sitemap_index.xml` or `/sitemap.xml` and count URLs per type (posts, location pages, projects, products). Take full-page screenshots at **400px and 1440px** - judge mobile first, most of our visitors are on phones.

## 2. Read the audience (the most important step)
Write one line for each:
- **Who pays them most?** (homes / shops / factories / institutions / dealers). Look at menu order, hero headline, case studies, form fields.
- **Where?** (city, state, all-India). Location pages far outside their base usually mean SEO reach, not real service.
- **What scale?** kW homes vs MW plants. Project sizes and client names tell you.
- **How do they convert?** Call, WhatsApp, form, app, referral, dealer network.
- **What trust do they lean on?** Years, customer count, named projects, brands, guarantees.

## 3. Judge each idea with the fit test
For every design, SEO or offer idea, score it against Surya's Solar:

| Question | If "no", don't adopt |
|---|---|
| Does our buyer (Cuddalore/Puducherry home, shop, school, apartment, small factory) need this? | |
| Can we back it with **true facts** (check `suryas-business-facts`)? | Never claim scale, guarantees or partners we don't have |
| Does it keep our UI rules (`suryas-ui-design`: premium-simple, no dashes, form left)? | |
| Does it help rank for a query we target (Keyword Intent Map) without thin or doorway pages? | |
| Is it worth the effort now vs other tasks? | |

## 4. Also list their weaknesses
Broken mobile layout, slow pages, stock photos, vague claims, thin location pages, no prices, weak forms. Each weakness is a place we can win.

## 5. Output
Save `Marketing/COMPETITOR-<NAME>.md` with: snapshot numbers, who they target, what works, what is weak, **Adopt / Adapt / Avoid** table with reasons, and the 3-5 concrete actions for us (pages, sections, offers), plus any facts we need from the owner. Update `Marketing/MARKETING-PLAYBOOK.md` if positioning or personas change. Tell the owner in plain words; big changes (new service lines, pricing, guarantees) are the owner's decision.
