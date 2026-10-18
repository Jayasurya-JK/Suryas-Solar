import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import ProcessSteps from '../components/ProcessSteps'
import BusinessEnquiryForm from '../components/BusinessEnquiryForm'

const PAGE_URL = 'https://www.suryassolar.com/commercial-solar'

const Icon = ({ d }) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
)

const INDUSTRIES = [
    { name: 'Shops and showrooms', size: '5 - 25 kW', note: 'Lights, AC and display power during business hours.', d: 'M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6' },
    { name: 'Clinics and hospitals', size: '10 - 150 kW', note: 'Heavy daytime AC and equipment load.', d: 'M12 6v12M6 12h12M4 4h16v16H4z' },
    { name: 'Schools and colleges', size: '10 - 200 kW', note: 'Classes run in daytime, terraces are large.', d: 'M12 4l9 5-9 5-9-5 9-5zm-6 7.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5' },
    { name: 'Hotels and lodges', size: '10 - 100 kW', note: 'AC and water heating all day, common in Puducherry.', d: 'M3 21V7l9-4 9 4v14M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01' },
    { name: 'Marriage and function halls', size: '10 - 50 kW', note: 'Big roofs and high AC bills on event days.', d: 'M4 21V10l8-6 8 6v11M9 21v-5h6v5' },
    { name: 'Rice mills and cashew units', size: '20 - 150 kW', note: 'Processing machines run in daytime shifts.', d: 'M12 3c4 4 6 7 6 10a6 6 0 01-12 0c0-3 2-6 6-10z' },
    { name: 'Small factories and workshops', size: '20 - 100 kW', note: 'Including units in and around SIPCOT Cuddalore.', d: 'M3 21V11l6-4v4l6-4v4l6-4v14H3zM7 17h2M11 17h2M15 17h2' },
    { name: 'Warehouses and cold storage', size: '30 - 300 kW', note: 'Steady load and plenty of roof space.', d: 'M3 10l9-6 9 6v11H3V10zm4 11v-7h10v7' },
]

const COSTS = [
    ['20 kW', '₹48,000 - ₹55,000', '₹9.6 - 11 lakh'],
    ['50 kW', '₹44,000 - ₹50,000', '₹22 - 25 lakh'],
    ['100 kW', '₹40,000 - ₹46,000', '₹40 - 46 lakh'],
]

const BENEFITS = [
    { title: 'Daytime power, daytime savings', text: 'Businesses use most of their power when the sun is up, so more solar units are used directly.' },
    { title: '40% accelerated depreciation', text: 'A tax-paying business can depreciate the plant at 40% a year. Confirm with your auditor.' },
    { title: 'Payback often 3-5 years', text: 'For businesses with strong daytime use. Panels are rated for 25 years.' },
]

const WHY = [
    { title: 'Sized from your real bills', text: 'We study 12 months of EB bills and your working hours, not a rule of thumb.' },
    { title: 'Built for the coast', text: 'Hot-dip galvanized structures and stainless fasteners for salt air near SIPCOT and the coast.' },
    { title: 'Safety first', text: 'Proper earthing, lightning protection and DC/AC protection on every system.' },
    { title: 'TNPDCL and PED paperwork', text: 'We handle approvals, meter changes and inspection for Tamil Nadu and Puducherry.' },
    { title: 'Trusted brands', text: 'Official partner of TATA Power Solar and Exide, with ALMM-listed panels.' },
    { title: 'Local service team', text: 'Office in Kondur, Cuddalore, close by for cleaning and service.' },
]

const FAQS = [
    { q: 'Is there a government subsidy for commercial solar?', a: 'No. The PM Surya Ghar subsidy is only for homes and apartment common areas. Businesses instead benefit from 40% accelerated depreciation (for tax-paying businesses), lower power bills and a short payback.' },
    { q: 'How much does commercial rooftop solar cost in Tamil Nadu?', a: 'As a market range in 2026, about ₹48,000-55,000 per kW for a 20 kW system, falling to about ₹40,000-46,000 per kW at 100 kW. Your exact price comes in a written proposal after a free site survey.' },
    { q: 'How much roof space does a business need?', a: 'Roughly 80-100 sq ft of shadow-free roof per kW. A 20 kW system needs about 1,600-2,000 sq ft. Metal sheet and RCC roofs both work.' },
    { q: 'Can solar be installed on a metal sheet roof?', a: 'Yes. Panels are fixed on rails clamped to the sheet seams or purlins. We check the age and strength of the sheets first.' },
    { q: 'How long does a commercial installation take?', a: 'A small commercial system is installed in a few days; larger systems take one to a few weeks, plus the time for TNPDCL or PED approval and metering.' },
    { q: 'What do I need for the site survey?', a: 'Your last 12 months of EB bills, the sanctioned load, and access to the roof. Our engineer does the rest.' },
]

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Commercial rooftop solar installation',
    provider: { '@type': 'LocalBusiness', name: "Surya's Solar", telephone: '+91 7904369094', url: 'https://www.suryassolar.com' },
    areaServed: ['Cuddalore', 'Puducherry', 'Panruti', 'Neyveli', 'Chidambaram', 'Villupuram'],
    url: PAGE_URL,
}

const Check = () => (
    <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </span>
)

export default function CommercialSolarPage() {
    return (
        <>
            <Head>
                <title>Commercial Solar in Cuddalore & Puducherry | Surya's Solar</title>
                <meta name="description" content="Rooftop solar for shops, hospitals, schools, hotels, mills and factories in Cuddalore and Puducherry. 2026 cost per kW, 40% depreciation, free site survey." />
                <link rel="canonical" href={PAGE_URL} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={PAGE_URL} />
                <meta property="og:title" content="Commercial Rooftop Solar in Cuddalore & Puducherry" />
                <meta property="og:description" content="Solar for shops, hospitals, schools, hotels, mills and factories. Cost per kW, tax benefit and a free site survey." />
                <meta property="og:image" content="https://www.suryassolar.com/images/rooftop-solar-industries-commercial.webp" />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            </Head>

            <Header />

            <main className="bg-white">
                <section className="pt-24 lg:pt-28 pb-12 lg:pb-16 bg-gradient-to-b from-blue-50 via-blue-50/60 to-white">
                    <div className="container-custom grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
                        <div className="lg:col-start-2 lg:row-start-1">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                For business · Free site survey
                            </span>
                            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                                Commercial rooftop solar in <span className="text-primary">Cuddalore and Puducherry</span>
                            </h1>
                            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                                For shops, clinics, schools, hotels, mills and small factories. Use the sun for the power you already use in the daytime, and cut your commercial EB bill for the next 25 years.
                            </p>
                        </div>

                        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-36">
                            <BusinessEnquiryForm variant="commercial" />
                        </div>

                        <div className="lg:col-start-2 lg:row-start-2 space-y-5">
                            <ul className="space-y-4">
                                {BENEFITS.map((b) => (
                                    <li key={b.title} className="flex gap-3">
                                        <Check />
                                        <div>
                                            <div className="font-bold text-slate-900">{b.title}</div>
                                            <p className="text-sm text-slate-600 mt-0.5">{b.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 text-center">
                                {[['122', 'PM Surya Ghar installs'], ['420 kWp', 'installed so far'], ['10+', 'years in solar']].map(([v, l]) => (
                                    <div key={l} className="bg-white px-2 py-4">
                                        <div className="text-xl sm:text-2xl font-black text-primary">{v}</div>
                                        <div className="mt-0.5 text-[11px] sm:text-xs text-slate-500">{l}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500">Official partner of TATA Power Solar and Exide · Registered PM Surya Ghar vendor</p>
                        </div>
                    </div>
                </section>

                {/* Industries */}
                <section className="container-custom py-12 lg:py-16">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Who we install for</h2>
                        <p className="mt-2 text-slate-600">Businesses across Cuddalore district and Puducherry that use power in the daytime. Typical sizes below; your size comes from your bills.</p>
                    </div>
                    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {INDUSTRIES.map((x) => (
                            <div key={x.name} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                                <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center"><Icon d={x.d} /></span>
                                <div className="mt-3 font-bold text-slate-900 leading-snug">{x.name}</div>
                                <div className="mt-1 text-xs font-semibold text-primary">{x.size}</div>
                                <p className="mt-1 text-sm text-slate-600 leading-snug hidden sm:block">{x.note}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cost + tax */}
                <section className="bg-slate-50 py-12 lg:py-16">
                    <div className="container-custom grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">What it costs (2026)</h2>
                            <p className="mt-2 text-slate-600">Market ranges for on-grid commercial systems, not our quote. Bigger systems cost less per kW.</p>
                            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <table className="w-full text-left text-sm sm:text-base whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">System</th>
                                            <th className="px-4 py-3 font-semibold">Cost per kW</th>
                                            <th className="px-4 py-3 font-semibold">Approx. total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {COSTS.map(([s, k, t]) => (
                                            <tr key={s}>
                                                <td className="px-4 py-3 font-bold text-slate-900">{s}</td>
                                                <td className="px-4 py-3 text-slate-700">{k}</td>
                                                <td className="px-4 py-3 font-semibold text-slate-900">{t}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-3 text-sm text-slate-500">Smaller shop systems (5-15 kW) are quoted after the survey. Full breakdown: <Link href="/blog/2026-10-18-rooftop-solar-for-industries-commercial-tamil-nadu" className="text-primary font-semibold hover:underline">rooftop solar for industries in Tamil Nadu</Link>.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                                <h3 className="text-lg font-extrabold text-slate-900">No subsidy, but a tax benefit</h3>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                    PM Surya Ghar is only for homes and apartments. A tax-paying business can instead claim <strong className="text-slate-900">40% accelerated depreciation</strong>: on a ₹20 lakh plant, the first-year depreciation is about ₹8 lakh, which lowers taxable profit.
                                </p>
                                <Link href="/blog/2026-01-19-commercial-solar-tax-benefits" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">See the worked example</Link>
                            </div>
                            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex gap-3">
                                <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-sm text-amber-900">Metering and settlement rules for business connections are set by TNERC and can change. We check the current order for your tariff before we design.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why us */}
                <section className="container-custom py-12 lg:py-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Why businesses choose Surya&apos;s Solar</h2>
                    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                        {WHY.map((w) => (
                            <div key={w.title} className="flex gap-3">
                                <Check />
                                <div>
                                    <div className="font-bold text-slate-900">{w.title}</div>
                                    <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{w.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <ProcessSteps
                    title="How a business project works"
                    subtitle="Clear steps, one team, written proposal before you decide."
                    facts={['Survey: free', 'Proposal: in writing', 'Approvals: we handle them']}
                    steps={[
                        { title: 'Share your EB bills', text: 'Last 12 months and your sanctioned load.' },
                        { title: 'Free site survey', text: 'Roof, shade, space, cable route and load.' },
                        { title: 'Written proposal', text: 'Size, layout, cost and expected payback.' },
                        { title: 'Approval and install', text: 'TNPDCL or PED approval, then installation.' },
                        { title: 'Commissioning', text: 'Inspection, metering and handover with service support.' },
                    ]}
                />

                {/* FAQ + apartments link */}
                <section className="py-12 lg:py-16">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 text-center">Commercial solar <span className="text-primary">FAQs</span></h2>
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
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <div className="font-bold text-slate-900">Managing an apartment?</div>
                                <p className="text-sm text-slate-600">Apartment associations get ₹18,000 per kW subsidy for common-area solar.</p>
                            </div>
                            <Link href="/apartment-solar" className="btn-primary text-sm whitespace-nowrap text-center">Apartment solar</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <WhatsAppFloat phoneNumber="917904369094" message="Hi Surya's Solar, I'd like a solar survey for my business." />
        </>
    )
}
