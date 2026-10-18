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

## Stats and proof
- **PM Surya Ghar vendor export (18 Oct 2026, owner):** 212 applications, **151 installed homes, 520.5 kWp** (owner rule 18 Oct 2026: on the site always show ROUNDED-DOWN figures, **150+ homes / 500+ kWp**, never the exact count, because it keeps growing; bank loans shown as 100+ local families), 94 homes already paid **₹71.8 lakh subsidy** in total, **112 families used bank loans** via the portal (Union Bank, SBI, Bank of Maharashtra, Canara, Indian Bank...), so "EMI / easy bank loan support" is TRUE. Areas: Cuddalore district 178, Puducherry 25, Villupuram 3, other 6. Site-wide numbers come from `src/data/installs.json` (area totals only; raw export is never stored). Earlier vendor page (Oct 2026): rating 5/5 from 149 ratings. Contact on portal: Jayakumar P. Portal lists "Brand name: EXIDE SUNDAY SOLAR SOLUTIONS".
- **Official partners (owner-confirmed 17 Oct 2026): TATA Power Solar and Exide (Exide Sunday Solar Solutions).** 10+ years experience is accurate.
- Site copy uses "100+ homes, 400+ kW" (still true) and "150+ homes, 500+ kW" (homepage meta). 25-year panel warranty.
- Google Business Profile: 5.0 from 45 reviews.

## Typical market prices (from `src/pages/systems/*.jsx` - market averages, NOT our quotes)
| System | Before subsidy | After PM Surya Ghar | Bill it suits |
|---|---|---|---|
| 3kW on-grid | ₹1,80,000 - ₹2,00,000 | ~₹1,10,000 | ₹1,500 - ₹3,500/month |
| 5kW on-grid | ₹3,00,000 - ₹3,30,000 | ~₹2,40,000 | ₹4,000 - ₹7,000/month |

Generation rule of thumb used on site: 1kW ≈ 4-5 units/day in Tamil Nadu (3kW ≈ 12-15 units/day).

## Subsidy (residential) - the #1 marketing hook in 2026
**Central PM Surya Ghar Muft Bijli Yojana:** ₹30,000/kW for the first 2kW + ₹18,000 for the 3rd kW = **₹78,000 max** (3kW+). Approved till FY 2026-27 (31 March 2027). Outlay ₹75,021 crore; ~60 lakh households covered by Oct 2026 vs 1 crore target.

**Tamil Nadu state top-up - G.O. (Ms) No. 102, Energy Dept, 19 Sep 2026** (announced in TN Budget, 5 Aug 2026):
| Size | Central | TN top-up | Total |
|---|---|---|---|
| 1kW | ₹30,000 | ₹5,000 | ₹35,000 |
| 2kW | ₹60,000 | ₹10,000 | ₹70,000 |
| 3kW+ | ₹78,000 | ₹22,000 | **₹1,00,000** |
- Domestic (Tariff 1A) TANGEDCO connections only; registration on PM Surya Ghar portal **on/after 5 Aug 2026** (no backdating); grid-connected (hybrid reported OK, off-grid not); empanelled vendor only; reported cap: **first 1,00,000 applicants / ₹50 crore**. Paid by TEDA via DBT after commissioning. **Not applicable in Puducherry** (central only there).
- Sources are installer blogs + news briefs, not the G.O. text itself. Always write "as of <month year>" and "reported" for the cap; ask the owner if any detail changes.

**Owner's strategy (Oct 2026):** use subsidy urgency (central scheme ends Mar 2027, TN top-up capped) to drive walk-ins and bookings.

**Prices on the site are MARKET AVERAGES, not Surya's Solar quotes (owner, 17 Oct 2026).** Always word them as "typical market price" and push to "free site visit for your exact written quote". Never write "our price is ...". Site after-subsidy figures: 3kW ~₹88,000, 5kW ~₹2,18,000 (market average minus ₹1 lakh).

## Differentiators the site already claims
"Engineering first": 3 earthing pits, UV-rated DC cables, 80-micron hot-dip galvanized structures (rust-proof for coastal Cuddalore), Tier-1 ALMM panels, TNEB net-meter and PED (Puducherry) paperwork handled.

## Known inconsistencies to fix (as of Oct 2026)
1. `public/llms.txt` has the WRONG phone (+91 95975 60105), email (jksurya85@gmail.com) and address (Manjakuppam), and older prices (3kW ₹1.6-1.9L, 5kW ₹2.5-3.0L). It also misses all posts after Jan 2026.
2. `content/settings/general.md` and `privacy-policy.jsx` say pincode 607002; correct is **607006** (confirmed from Google Business Profile, Oct 2026).
3. `src/lib/content.js` fallback phone is a placeholder (+919876543210).
4. `src/pages/index.jsx` JSON-LD has a hardcoded `aggregateRating` (5 / 100 reviews) but the real Google count is 45. Self-served LocalBusiness ratings never get stars; at minimum make it match reality (5.0 / 45) or remove it.

## Consistency check
Run: `node .claude/skills/suryas-business-facts/scripts/nap_check.js` from `Web/` - greps the codebase for phone numbers, emails and pincodes and flags anything not in the table above.
