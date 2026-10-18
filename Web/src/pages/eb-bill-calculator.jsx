import { useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

const PAGE_URL = 'https://www.suryassolar.com/eb-bill-calculator'

// TNEB / TNPDCL domestic bi-monthly slabs (approx., same figures as our slab guide; reviewed Oct 2026).
// [units at end of slab, ₹ per unit]
const SLABS_UPTO_500 = [[200, 0], [400, 4.5], [500, 6]]
const SLABS_ABOVE_500 = [[100, 0], [400, 4.5], [500, 6], [600, 8], [800, 9], [1000, 10], [Infinity, 11]]

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

function calcBill(units, fixed) {
  const slabs = units <= 500 ? SLABS_UPTO_500 : SLABS_ABOVE_500
  const rows = []
  let prev = 0
  let energy = 0
  for (const [upto, rate] of slabs) {
    if (units <= prev) break
    const inSlab = Math.min(units, upto) - prev
    const cost = inSlab * rate
    rows.push({ label: `${prev + 1} - ${upto === Infinity ? 'above' : upto}`, units: inSlab, rate, cost })
    energy += cost
    prev = upto
  }
  return { rows, energy, total: energy + fixed }
}

const FAQS = [
  { q: 'How is the EB bill calculated in Tamil Nadu?', a: 'TNEB (TNPDCL) bills domestic homes every two months using telescopic slabs. If you use 500 units or less in two months, the first 200 units are free; above 500 units only the first 100 units are free and higher slab rates apply. A fixed charge is added.' },
  { q: 'What is the EB unit rate in Tamil Nadu in 2026?', a: 'For homes under 500 units: 0-200 free, 201-400 about ₹4.50 and 401-500 about ₹6 per unit. Above 500 units: 0-100 free, 101-400 about ₹4.50, 401-500 ₹6, 501-600 ₹8, 601-800 ₹9, 801-1,000 ₹10 and above 1,000 ₹11 per unit (approximate; check your bill).' },
  { q: 'Why does my bill jump after 500 units?', a: 'Crossing 500 units in a two-month cycle removes the extra 100 free units and moves your top units into the ₹8-11 slabs, so a small increase in use can raise the bill sharply.' },
  { q: 'Is this calculator accurate for my bill?', a: 'It gives a close estimate using the published domestic slab structure. Your actual bill may differ slightly because of the exact fixed charge, adjustments or tariff updates, so always compare with your TNPDCL bill.' },
  { q: 'How much solar do I need to bring my bill down?', a: 'Roughly, a 1kW system makes about 250 units every two months in Tamil Nadu. Divide your two-month units by 250 to get the kW you need; most homes with one AC need 3kW and homes with two ACs need about 5kW.' },
]

export default function EbBillCalculatorPage() {
  const [mode, setMode] = useState('units')
  const [units, setUnits] = useState('650')
  const [prevReading, setPrevReading] = useState('')
  const [currReading, setCurrReading] = useState('')
  const [fixed, setFixed] = useState(100)

  const usedUnits = useMemo(() => {
    if (mode === 'units') return Math.max(0, Math.round(Number(units) || 0))
    const d = (Number(currReading) || 0) - (Number(prevReading) || 0)
    return Math.max(0, Math.round(d))
  }, [mode, units, prevReading, currReading])

  const bill = useMemo(() => calcBill(usedUnits, fixed), [usedUnits, fixed])
  const nearCliff = usedUnits > 440 && usedUnits <= 500
  const overCliff = usedUnits > 500 && usedUnits <= 600
  const if500 = calcBill(500, fixed).total
  const solarKw = Math.max(1, Math.round(((usedUnits * 6) / 1500) * 2) / 2)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNEB EB Bill Calculator',
    url: PAGE_URL,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    provider: { '@type': 'LocalBusiness', '@id': 'https://www.suryassolar.com/#business', name: "Surya's Solar" },
  }

  return (
    <>
      <Head>
        <title>TNEB EB Bill Calculator 2026 | Tamil Nadu Slab Rates</title>
        <meta name="description" content="Free TNEB EB bill calculator for Tamil Nadu (2026 slabs). Enter units or meter readings to see your bi-monthly bill, slab breakdown and the 500-unit jump." />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content="TNEB EB Bill Calculator 2026 - Tamil Nadu" />
        <meta property="og:description" content="Calculate your bi-monthly TNEB bill with 2026 domestic slab rates, in seconds." />
        <meta property="og:image" content="https://www.suryassolar.com/images/how-to-calculate-eb-bill-tamil-nadu-examples.webp" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([appSchema, faqSchema]) }} />
      </Head>

      <Header />

      <main className="bg-white">
        <section className="bg-gradient-to-b from-blue-50 via-blue-50/60 to-white pt-24 lg:pt-28 pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            <div className="text-center lg:text-left lg:col-start-2 lg:row-start-1 lg:pt-4">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                Free tool <span aria-hidden="true">·</span> 2026 slab rates
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                TNEB EB Bill Calculator <span className="text-primary">2026</span>
              </h1>
              <p className="text-slate-600 text-lg max-w-xl mx-auto lg:mx-0">
                Enter your two-month units or meter readings to see your Tamil Nadu domestic EB bill, slab by slab, including the 200 free units and the 500-unit jump.
              </p>
            </div>

            {/* Calculator card */}
            <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-8">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5" role="tablist">
                {[['units', 'I know my units'], ['readings', 'Use meter readings']].map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => setMode(m)}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === m ? 'bg-white text-primary shadow' : 'text-slate-600'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {mode === 'units' ? (
                <div>
                  <label htmlFor="eb-units" className="block text-sm font-medium text-slate-700 mb-1">Units used in two months</label>
                  <input
                    id="eb-units"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="eb-prev" className="block text-sm font-medium text-slate-700 mb-1">Previous reading</label>
                    <input id="eb-prev" type="number" inputMode="numeric" value={prevReading} onChange={(e) => setPrevReading(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="eb-curr" className="block text-sm font-medium text-slate-700 mb-1">Current reading</label>
                    <input id="eb-curr" type="number" inputMode="numeric" value={currReading} onChange={(e) => setCurrReading(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label htmlFor="eb-fixed" className="block text-sm font-medium text-slate-700 mb-1">Fixed charge (see your bill)</label>
                <select id="eb-fixed" value={fixed} onChange={(e) => setFixed(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value={0}>Not included</option>
                  <option value={100}>About ₹100</option>
                  <option value={150}>About ₹150</option>
                </select>
              </div>

              <div className="mt-6 rounded-xl bg-primary text-white p-5 text-center">
                <p className="text-sm text-blue-100">Estimated bill for {usedUnits.toLocaleString('en-IN')} units (two months)</p>
                <p className="text-4xl font-black text-yellow-300 mt-1">{fmt(bill.total)}</p>
                <p className="text-xs text-blue-100 mt-1">about {fmt(bill.total / 2)} per month</p>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr><th className="text-left px-3 py-2">Slab (units)</th><th className="text-right px-3 py-2">Units</th><th className="text-right px-3 py-2">Rate</th><th className="text-right px-3 py-2">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bill.rows.map((r) => (
                      <tr key={r.label}>
                        <td className="px-3 py-2 text-slate-700">{r.label}</td>
                        <td className="px-3 py-2 text-right">{r.units}</td>
                        <td className="px-3 py-2 text-right">{r.rate === 0 ? 'Free' : `₹${r.rate.toFixed(2)}`}</td>
                        <td className="px-3 py-2 text-right font-semibold">{fmt(r.cost)}</td>
                      </tr>
                    ))}
                    {fixed > 0 && (
                      <tr><td className="px-3 py-2 text-slate-700" colSpan={3}>Fixed charge (approx.)</td><td className="px-3 py-2 text-right font-semibold">{fmt(fixed)}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {nearCliff && (
                <p className="mt-4 text-sm bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3">
                  You are {500 - usedUnits} units below the 500-unit limit. Crossing it removes 100 free units and moves you to the ₹8+ slabs.
                </p>
              )}
              {overCliff && (
                <p className="mt-4 text-sm bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3">
                  You crossed 500 units by {usedUnits - 500}. At exactly 500 units your bill would be about {fmt(if500)}, so these extra units cost about {fmt(bill.total - if500)}.
                </p>
              )}
              <p className="mt-3 text-xs text-slate-500">Approximate estimate using TNEB domestic slab rates (2026). Compare with your TNPDCL bill.</p>
            </div>

            {/* Right column: solar suggestion */}
            <div className="lg:col-start-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900">Want this bill close to zero?</h2>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  For {usedUnits.toLocaleString('en-IN')} units every two months, a rooftop solar system of about <strong className="text-slate-900">{solarKw}kW</strong> would cover most of it. Eligible Tamil Nadu homes get up to <strong className="text-slate-900">₹1 lakh subsidy</strong> for 3kW and above.
                </p>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <Link href={`/calc?bill=${Math.max(2000, Math.round(bill.total / 100) * 100)}`} className="text-center px-4 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-600">See solar savings</Link>
                  <Link href="/subsidy-eligibility" className="text-center px-4 py-3 rounded-full border border-primary text-primary font-semibold hover:bg-primary-50">Check subsidy</Link>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white text-center">
                {[['200', 'free units under 500'], ['500', 'unit jump point'], ['₹11', 'top slab per unit']].map(([v, l]) => (
                  <div key={l} className="px-2 py-4">
                    <p className="text-2xl font-black text-primary">{v}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">TNEB Domestic Slab Rates 2026</h2>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700"><tr><th className="text-left px-4 py-2">Two-month units</th><th className="text-left px-4 py-2">Up to 500 used</th><th className="text-left px-4 py-2">Above 500 used</th></tr></thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr><td className="px-4 py-2">0 - 100</td><td className="px-4 py-2">Free</td><td className="px-4 py-2">Free</td></tr>
                  <tr><td className="px-4 py-2">101 - 200</td><td className="px-4 py-2">Free</td><td className="px-4 py-2">₹4.50</td></tr>
                  <tr><td className="px-4 py-2">201 - 400</td><td className="px-4 py-2">₹4.50</td><td className="px-4 py-2">₹4.50</td></tr>
                  <tr><td className="px-4 py-2">401 - 500</td><td className="px-4 py-2">₹6.00</td><td className="px-4 py-2">₹6.00</td></tr>
                  <tr><td className="px-4 py-2">501 - 600</td><td className="px-4 py-2">-</td><td className="px-4 py-2">₹8.00</td></tr>
                  <tr><td className="px-4 py-2">601 - 800</td><td className="px-4 py-2">-</td><td className="px-4 py-2">₹9.00</td></tr>
                  <tr><td className="px-4 py-2">801 - 1,000</td><td className="px-4 py-2">-</td><td className="px-4 py-2">₹10.00</td></tr>
                  <tr><td className="px-4 py-2">Above 1,000</td><td className="px-4 py-2">-</td><td className="px-4 py-2">₹11.00</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Approximate per-unit rates; fixed charges are extra. Worked examples and the full explanation: <Link href="/blog/2026-04-30-how-to-calculate-eb-bill-tamil-nadu-examples" className="text-primary font-medium hover:underline">TNEB slab rates and EB bill calculation</Link>. Typical bills by home size: <Link href="/blog/2026-10-17-average-electricity-bill-tamil-nadu-by-home-size" className="text-primary font-medium hover:underline">average electricity bill in Tamil Nadu</Link>.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group bg-white border border-slate-200 rounded-xl p-4">
                  <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-3">
                    {f.q}
                    <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-600">
              Bill too high? Read <Link href="/blog/2026-04-27-why-is-electricity-bill-high-in-summer-tamil-nadu" className="text-primary font-medium hover:underline">why your EB bill is high in summer</Link> and <Link href="/blog/2026-04-28-how-to-reduce-electricity-bill-tamil-nadu-solar" className="text-primary font-medium hover:underline">how to reduce your electricity bill</Link>.
            </p>
          </div>
        </section>
      </main>

      <WhatsAppFloat message="Hi! I used your EB bill calculator and want to know how much solar would save me." />
      <Footer />
    </>
  )
}
