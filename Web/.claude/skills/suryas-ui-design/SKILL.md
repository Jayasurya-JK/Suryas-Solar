---
name: suryas-ui-design
description: UI/UX design rules for suryassolar.com. Use before building or changing any page, section, form, popup or component on the Surya's Solar site, so new work matches the existing premium-but-simple look and the owner's standards. Covers layout, components, lead forms/funnels, mobile, and the localhost approval loop.
---

# Surya's Solar UI/UX rules

The owner judges every UI change on localhost before it ships. The bar: **clean, premium, simple** - like the existing home and town pages. Anything that looks like a basic template ("childish") gets rejected.

## Never do this
- **No dash bullets** (`- item`) or dash separators (`A - B - C`) in UI. Use icon rows, check circles, stat strips or `·` middots instead. (Owner feedback, Oct 2026.)
- No plain `list-disc` lists in hero/popup/funnel areas. Use the icon list pattern below.
- No emojis anywhere. Use inline SVG icons (Heroicons-style paths, `stroke="currentColor"`).
- No fake urgency (countdown timers, "only 3 left"). Urgency must be a true fact: TN top-up limited to first 1 lakh homes; PM Surya Ghar ends 31 Mar 2027.
- Don't force capitals on units: `1kW` not `1KW` (avoid `uppercase` on text containing kW/kWp).
- No single centred narrow column on desktop for lead pages. Use the space.

## Layout patterns
- **Lead/funnel page (desktop):** two columns, `grid lg:grid-cols-2 gap-8 lg:gap-14`. **Form/quiz LEFT, content RIGHT** (owner's preference). Form column `lg:sticky lg:top-36`.
- **Mobile order:** heading first, then the form/quiz, then supporting detail. Do it with grid placement (`lg:col-start-2 lg:row-start-1` on the heading, `lg:col-start-1 lg:row-start-1 lg:row-span-2` on the form) rather than duplicating markup. Reference: `src/pages/subsidy-eligibility.jsx`.
- Page width `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (`.container-custom`). Body text sections `max-w-6xl`.
- Hero background: `bg-gradient-to-b from-blue-50 via-blue-50/60 to-white`; town pages use the dark blue gradient hero.
- Top padding under the fixed header + subsidy banner: `pt-24 lg:pt-28`.

## Design tokens (tailwind.config.js)
- Primary blue `primary` (#0f4bd6), dark `primary-900`; accent pink `accent` (#D6006F, logo); orange `solar-orange` for hero CTAs; WhatsApp green `#25D366`; highlight numbers `text-yellow-300` on blue.
- Headings: `font-extrabold text-slate-900`; town pages use `font-playfair` for section titles. Body `text-slate-600`.
- Radius: cards `rounded-2xl`, buttons `rounded-full` (`.btn-primary`, `.btn-secondary`), option buttons `rounded-xl`.
- Borders `border-slate-200`; soft fills `bg-slate-50`, `bg-primary-50`.

## Component patterns (copy these)
- **Check list:** `flex gap-3` + `w-6 h-6 rounded-full bg-green-100 text-green-600` circle with a check SVG, then bold title + `text-sm text-slate-600` line.
- **Stat strip (proof):** `grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border bg-white text-center`, big `font-black text-primary` value + `text-xs text-slate-500` label. Facts only: 122 PM Surya Ghar installs, 5.0 from 45 Google reviews, 10+ years (check `suryas-business-facts`).
- **Price/amount cards:** 3 cards, the recommended one filled `bg-primary text-white shadow-lg` with `text-yellow-300` amount.
- **Notice box:** `bg-amber-50 border-amber-200 rounded-xl p-3` with a clock/info icon on the left.
- **Badge/pill:** `inline-flex items-center gap-2 text-xs font-bold uppercase text-primary bg-primary-100 rounded-full px-3 py-1`, green dot, items separated by `·`.
- **FAQ accordion:** `<details className="group ...">` with a `+` that rotates 45° on open; add FAQPage JSON-LD.
- **Popup/modal:** blue gradient header with the key number, white body, one primary CTA + WhatsApp + quiet text link to dismiss; `z-[60]`, backdrop `bg-black/60 backdrop-blur-sm`, `animate-[popIn_0.35s_ease-out]`. Celebration: `ConfettiBurst` (respects reduced motion).

## Lead forms and funnels
- Minimum fields: name + 10-digit mobile (`/^[6-9]\d{9}$/`), optional town. Every extra field costs leads.
- Submit to Web3Forms (key in `BookingForm.jsx`), include `source` (which page) and answers; fire `gtag('event','generate_lead', ...)`.
- Always offer WhatsApp as a second path with a prefilled message.
- Show the useful result before asking for the phone number (trust), then the form right under it.
- Reusable: `SubsidyEligibilityChecker` (`town` prop pre-fills and skips the state question).

## Approval loop (mandatory)
1. Run `npm run dev`, open the page with Playwright.
2. Screenshot at **400px** (mobile) and **1440px** (desktop), plus any popup/result states. Save under `.playwright-mcp/`.
3. Look at the screenshots yourself first: alignment, wrapping, overlap with the floating "Book today" bar and WhatsApp button, unit casing, no dashes.
4. Show the owner; deploy only after approval (`ship-site`).
