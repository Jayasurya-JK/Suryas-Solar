import Head from 'next/head';
import Link from 'next/link';
import SolarCalculator from '../components/SolarCalculator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { openBooking } from '../components/BookingModal';

const FAQS = [
  { q: 'How accurate is this calculator?', a: 'It converts your bill into units using TNEB bi-monthly slab rates, assumes about 1,500 units per kW per year of Tamil Nadu sunshine (about 4 units a day), and uses market-average system prices as of October 2026. Generation varies by season, so treat it as a close estimate; we confirm with a free site visit.' },
  { q: 'Does this include the subsidy?', a: 'Yes. The payback already deducts the subsidy for an eligible Tamil Nadu home: up to ₹1 lakh (₹78,000 PM Surya Ghar + ₹22,000 TN top-up) for 3kW and above. Puducherry homes get up to ₹78,000.' },
  { q: '3kW vs 5kW: which do I need?', a: 'If your bi-monthly bill is about ₹3,000 - ₹6,000, a 3kW system (12-15 units a day) is usually right. If it is ₹8,000 or more or you run two or more ACs, a 5kW system (20-25 units a day) is recommended. Both get the full ₹1 lakh subsidy.' },
  { q: 'What is the payback period?', a: 'The time it takes for your bill savings to repay the system cost after the subsidy. For homes with AC and bills above ₹4,000 bi-monthly it is typically 3.5 to 4.5 years; smaller bills take 5-6 years. After that, the savings are yours for 20+ years.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

const TOOLS = [
  { title: 'EB Bill Calculator', text: 'Check your TNEB bill slab by slab.', href: '/eb-bill-calculator', d: 'M9 7h6m-6 4h6m-6 4h3M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
  { title: 'Subsidy Checker', text: 'Up to ₹1 lakh, 30-second check.', href: '/subsidy-eligibility', d: 'M9 12l2 2 4-4m5.6-4.02A11.96 11.96 0 0112 2.94a11.96 11.96 0 01-8.6 3.04A12 12 0 003 9c0 5.6 3.83 10.3 9 11.62 5.17-1.33 9-6.03 9-11.62 0-1.04-.13-2.05-.38-3.02z' },
  { title: '3kW System', text: 'For bills around ₹3,000 - ₹6,000.', href: '/systems/3kw-solar-system-with-subsidy', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { title: '5kW System', text: 'For homes with 2 or more ACs.', href: '/systems/5kw-solar-system-with-subsidy', d: 'M13 10V3L4 14h7v7l9-11h-7z' },
];

const HOW = [
  { title: 'Your bill becomes units', text: 'We reverse the TNEB bi-monthly slabs (free units, then ₹4.50 to ₹11 per unit) to find how many units you really use.' },
  { title: 'Units become system size', text: 'Each kW of rooftop solar makes about 1,500 units a year in Cuddalore, Villupuram and Puducherry sunshine.' },
  { title: 'Size becomes savings and payback', text: 'Market-average price minus the up to ₹1 lakh subsidy, divided by your yearly savings, gives the payback.' },
];

export default function CalcPage() {
  return (
    <>
      <Head>
        <title>Solar Savings Calculator Tamil Nadu 2026 | Surya's Solar</title>
        <meta
          name="description"
          content="Free solar savings calculator for Tamil Nadu 2026. Enter your EB bill to get system size, yearly savings and payback after the ₹1 lakh subsidy, using TNEB slabs."
        />
        <link rel="canonical" href="https://www.suryassolar.com/calc" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.suryassolar.com/calc" />
        <meta property="og:title" content="Solar Savings Calculator - Tamil Nadu 2026" />
        <meta property="og:description" content="Enter your EB bill and see the solar size you need, yearly savings and payback after the ₹1 lakh subsidy." />
        <meta property="og:image" content="https://www.suryassolar.com/images/solar-roi-calculator-break-even-analysis.webp" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
        <SolarCalculator showBreakdown={true} headingLevel="h1" />

        {/* Next step */}
        <section className="container-custom pt-10 lg:pt-14">
          <div className="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 text-white p-6 sm:p-10 grid lg:grid-cols-[1.4fr_1fr] gap-6 items-center shadow-xl">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Get your exact numbers</h2>
              <p className="mt-2 text-blue-100 leading-relaxed">
                This is a close estimate. Our engineer checks your roof, shade and EB bill and gives you a written quote, with the up to <span className="font-bold text-yellow-300">₹1 lakh subsidy</span> paperwork handled.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button type="button" onClick={openBooking} className="inline-flex items-center justify-center rounded-full bg-solar-orange px-6 py-3.5 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors">
                Book Free Home Visit
              </button>
              <a href={'https://wa.me/917904369094?text=' + encodeURIComponent("Hi Surya's Solar, I used your solar calculator and want an exact quote.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 font-semibold hover:bg-white/10 transition-colors">
                Send your EB bill on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Common questions */}
        <section className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 text-center">Common questions</h2>
            <div className="mt-8 space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                    {f.q}
                    <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* How it works (SEO) */}
        <section className="bg-slate-50 py-12 lg:py-16">
          <div className="container-custom grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-14 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How this solar ROI calculator works</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Built for Tamil Nadu: TNEB bi-monthly slabs, local sunshine and the 2026 subsidy. Most AC homes break even in about 3.5 to 4.5 years, then enjoy two decades of near-free power, protected from future tariff hikes.
              </p>
            </div>
            <ol className="space-y-3">
              {HOW.map((h, i) => (
                <li key={h.title} className="flex gap-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center">{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-slate-900">{h.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{h.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Related tools */}
        <section className="container-custom py-12 lg:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">More free tools</h2>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 transition-all">
                <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={t.d} /></svg>
                </span>
                <div className="mt-3 font-bold text-slate-900 group-hover:text-primary transition-colors">{t.title}</div>
                <p className="mt-1 text-sm text-slate-500 leading-snug">{t.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <WhatsAppFloat />
      <Footer />
    </>
  );
}
