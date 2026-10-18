import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import ProcessSteps from '../components/ProcessSteps'
import BusinessEnquiryForm from '../components/BusinessEnquiryForm'

const PAGE_URL = 'https://www.suryassolar.com/apartment-solar'
const RATE = 18000
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

const POWERS = [
    { t: 'Lifts', d: 'M8 7l4-4 4 4M8 17l4 4 4-4M5 3h14v18H5z' },
    { t: 'Water pumps', d: 'M12 3c4 4 6 7 6 10a6 6 0 01-12 0c0-3 2-6 6-10z' },
    { t: 'Corridor and parking lights', d: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z' },
    { t: 'Security and CCTV', d: 'M15 10l4.55-2.28A1 1 0 0121 8.62v6.76a1 1 0 01-1.45.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { t: 'EV charging', d: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { t: 'Gym and common hall', d: 'M3 21V9l9-6 9 6v12H3zm6 0v-6h6v6' },
]

const FAQS = [
    { q: 'Do apartments get the PM Surya Ghar subsidy?', a: 'Yes. A Resident Welfare Association (RWA) or Group Housing Society gets ₹18,000 per kW for a rooftop system that runs common facilities, up to 500 kW, counted at 3 kW per house. This applies in Tamil Nadu and Puducherry.' },
    { q: 'How is the apartment subsidy calculated?', a: 'Subsidy = ₹18,000 x the lower of (number of flats x 3 kW) and the plant size, with a 500 kW ceiling. A 20 kW plant in a 24-flat building gets 20 x ₹18,000 = ₹3,60,000.' },
    { q: 'Can a single flat owner install solar?', a: 'Usually not on a shared terrace. Individual flats can install only if they have an exclusive roof area and their own connection. The common-area system through the RWA is the normal route.' },
    { q: 'How much power does a common-area system make?', a: 'Roughly 4-5 units per kW per day in Tamil Nadu. A 20 kW system makes about 80-100 units a day, which can cut the common EB bill and the monthly maintenance charge.' },
    { q: 'What does the RWA need to decide?', a: 'A resolution approving the system, the roof area to use, and who will sign the application. We give you a simple summary for the RWA meeting and handle the portal application.' },
]

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

const Icon = ({ d }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
)

function SubsidyCalc() {
    const [flats, setFlats] = useState(24)
    const [kw, setKw] = useState(20)
    const eligibleKw = Math.min(flats * 3, kw, 500)
    const subsidy = eligibleKw * RATE
    const units = [kw * 4, kw * 5]
    const field = 'w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none'
    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-slate-900">Estimate your RWA subsidy</h3>
            <div className="mt-5 grid grid-cols-2 gap-4">
                <label className="block">
                    <span className="block text-sm font-semibold text-slate-700 mb-1">Number of flats</span>
                    <input type="number" min="1" inputMode="numeric" value={flats} onChange={(e) => setFlats(Math.max(0, Number(e.target.value) || 0))} className={field} />
                </label>
                <label className="block">
                    <span className="block text-sm font-semibold text-slate-700 mb-1">Plant size (kW)</span>
                    <input type="number" min="1" inputMode="numeric" value={kw} onChange={(e) => setKw(Math.max(0, Number(e.target.value) || 0))} className={field} />
                </label>
            </div>
            <div className="mt-5 rounded-2xl bg-primary text-white p-5 shadow-lg">
                <div className="text-sm text-blue-100">Estimated subsidy</div>
                <div className="text-3xl font-black text-yellow-300">{inr(subsidy)}</div>
                <div className="mt-1 text-sm text-blue-100">{eligibleKw} kW eligible x ₹18,000 · about {units[0]}-{units[1]} units a day</div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Estimate as of October 2026. Final amount is set on the PM Surya Ghar portal after inspection.</p>
        </div>
    )
}

export default function ApartmentSolarPage() {
    return (
        <>
            <Head>
                <title>Solar for Apartments in Tamil Nadu: ₹18,000/kW RWA Subsidy</title>
                <meta name="description" content="Rooftop solar for apartments and RWAs in Cuddalore, Puducherry and Tamil Nadu. ₹18,000 per kW subsidy for lifts, pumps and common lights. Free survey." />
                <link rel="canonical" href={PAGE_URL} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={PAGE_URL} />
                <meta property="og:title" content="Solar for Apartments: ₹18,000/kW RWA Subsidy" />
                <meta property="og:description" content="Common-area solar for lifts, pumps and lights, with the PM Surya Ghar RWA subsidy. Free survey in Cuddalore and Puducherry." />
                <meta property="og:image" content="https://www.suryassolar.com/images/apartment-rooftop-solar-rwa.webp" />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            </Head>

            <Header />

            <main className="bg-white">
                <section className="pt-24 lg:pt-28 pb-12 lg:pb-16 bg-gradient-to-b from-blue-50 via-blue-50/60 to-white">
                    <div className="container-custom grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
                        <div className="lg:col-start-2 lg:row-start-1">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                For apartments, RWAs and builders
                            </span>
                            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                                Solar for apartments: <span className="text-primary">₹18,000 per kW subsidy</span>
                            </h1>
                            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                                Put the shared terrace to work. A common-area solar system runs your lifts, pumps and lights, lowers the common EB bill and the monthly maintenance charge, with a PM Surya Ghar subsidy paid to the association.
                            </p>
                        </div>

                        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-36">
                            <BusinessEnquiryForm variant="apartment" />
                        </div>

                        <div className="lg:col-start-2 lg:row-start-2">
                            <SubsidyCalc />
                        </div>
                    </div>
                </section>

                <section className="container-custom py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">What it powers</h2>
                            <p className="mt-2 text-slate-600">The system connects to the common meter, so every resident shares the saving.</p>
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {POWERS.map((p) => (
                                    <div key={p.t} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0"><Icon d={p.d} /></span>
                                        <span className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">{p.t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">The rules in one look</h2>
                            <dl className="mt-5 divide-y divide-slate-200">
                                {[
                                    ['Who applies', 'RWA or Group Housing Society'],
                                    ['Subsidy', '₹18,000 per kW'],
                                    ['Counted at', '3 kW per house'],
                                    ['Maximum', '500 kW'],
                                    ['Where', 'Tamil Nadu and Puducherry'],
                                    ['Example', '24 flats, 20 kW plant: ₹3,60,000'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between gap-4 py-3 text-sm sm:text-base">
                                        <dt className="text-slate-500">{k}</dt>
                                        <dd className="font-semibold text-slate-900 text-right">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                            <Link href="/blog/2026-10-17-solar-for-apartments-tamil-nadu-rwa-subsidy" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Full apartment solar guide</Link>
                        </div>
                    </div>
                </section>

                <ProcessSteps
                    title="How it works for an apartment"
                    subtitle="We make it easy for the RWA committee."
                    facts={['Survey: free', 'RWA summary: provided', 'Portal: we apply']}
                    steps={[
                        { title: 'Free terrace survey', text: 'Space, shade and the common EB bill.' },
                        { title: 'RWA meeting summary', text: 'One page with size, cost, subsidy and savings.' },
                        { title: 'Resolution and application', text: 'RWA approves; we apply on the portal.' },
                        { title: 'Installation', text: 'Usually a few days on the terrace.' },
                        { title: 'Net meter and subsidy', text: 'Inspection, net meter, then subsidy to the RWA.' },
                    ]}
                />

                <section className="py-12 lg:py-16">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 text-center">Apartment solar <span className="text-primary">FAQs</span></h2>
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
                                <div className="font-bold text-slate-900">Own a shop, clinic or factory?</div>
                                <p className="text-sm text-slate-600">See commercial rooftop solar for businesses.</p>
                            </div>
                            <Link href="/commercial-solar" className="btn-primary text-sm whitespace-nowrap text-center">Commercial solar</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <WhatsAppFloat phoneNumber="917904369094" message="Hi Surya's Solar, I'd like a solar survey for our apartment." />
        </>
    )
}
