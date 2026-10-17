---
name: suryas-business-facts
description: Single source of truth for Surya's Solar business facts - phone numbers, address (NAP), email, service areas, prices, PM Surya Ghar subsidy rules, stats, warranties. Use whenever writing or editing customer-facing copy, blog posts, JSON-LD schema, llms.txt, Google Business Profile text, ads or social posts, or when checking that contact details/prices are consistent across the site ("NAP check", "is our phone number right everywhere", "update our price").
---

# Surya's Solar - business facts

Use these values verbatim. If a task needs a fact that is not here, ASK the owner - never invent prices, stats, reviews, certifications, brand partnerships or install counts.

## Identity & NAP (must match Google Business Profile exactly)

| Field | Value |
|---|---|
| Name | Surya's Solar |
| Primary phone / WhatsApp | +91 7904369094 (`tel:+917904369094`, `wa.me/917904369094`) |
| Second phone | +91 9655989595 |
| Email | suryassolarenergy@gmail.com |
| Address | No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur, Cuddalore - 607006, Tamil Nadu |
| Geo | 11.7563, 79.7689 |
| Hours | Site says Mon-Sat 9:00 AM - 6:00 PM; Google Business Profile says closes 8 pm - CONFIRM with owner, then make both match (WhatsApp 24/7) |
| Google Business Profile | Listed as "Suryas Solar", 5.0 stars, 45 Google reviews (Oct 2026). Showed "Own this business?" on 17 Oct 2026 - may be unclaimed |
| Website | https://www.suryassolar.com |
| Service areas (have pages) | Cuddalore, Puducherry, Panruti, Neyveli |
| Also served (no page yet) | Chidambaram, Nellikuppam, Villupuram region |

## Stats (homepage `content/pages/home.md`)
- 400+ kW installed, 100+ homes, 25-year panel warranty.

## Prices (from `src/pages/systems/*.jsx` - the current published numbers)
| System | Before subsidy | After PM Surya Ghar | Bill it suits |
|---|---|---|---|
| 3kW on-grid | ₹1,80,000 - ₹2,00,000 | ~₹1,10,000 | ₹1,500 - ₹3,500/month |
| 5kW on-grid | ₹3,00,000 - ₹3,30,000 | ~₹2,40,000 | ₹4,000 - ₹7,000/month |

Generation rule of thumb used on site: 1kW ≈ 4-5 units/day in Tamil Nadu (3kW ≈ 12-15 units/day).

## PM Surya Ghar Muft Bijli Yojana (residential)
- ₹30,000/kW for the first 2kW + ₹18,000 for the 3rd kW = **₹78,000 maximum** (3kW and above).
- 1kW = ₹30,000, 2kW = ₹60,000, 3kW+ = ₹78,000. Going above 3kW does not increase the subsidy.
- Subsidy rules change - when writing a dated "2026" claim, say "as of <month year>" and ask the owner if unsure.

## Differentiators the site already claims
"Engineering first": 3 earthing pits, UV-rated DC cables, 80-micron hot-dip galvanized structures (rust-proof for coastal Cuddalore), Tier-1 ALMM panels, TNEB net-meter and PED (Puducherry) paperwork handled.

## Known inconsistencies to fix (as of Oct 2026)
1. `public/llms.txt` has the WRONG phone (+91 95975 60105), email (jksurya85@gmail.com) and address (Manjakuppam), and older prices (3kW ₹1.6-1.9L, 5kW ₹2.5-3.0L). It also misses all posts after Jan 2026.
2. `content/settings/general.md` and `privacy-policy.jsx` say pincode 607002; correct is **607006** (confirmed from Google Business Profile, Oct 2026).
3. `src/lib/content.js` fallback phone is a placeholder (+919876543210).
4. `src/pages/index.jsx` JSON-LD has a hardcoded `aggregateRating` (5 / 100 reviews) but the real Google count is 45. Self-served LocalBusiness ratings never get stars; at minimum make it match reality (5.0 / 45) or remove it.

## Consistency check
Run: `node .claude/skills/suryas-business-facts/scripts/nap_check.js` from `Web/` - greps the codebase for phone numbers, emails and pincodes and flags anything not in the table above.
