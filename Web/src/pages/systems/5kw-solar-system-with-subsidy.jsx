import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhyChoose from '../../components/WhyChoose'
import BookingForm from '../../components/BookingForm'
import WhatsAppFloat from '../../components/WhatsAppFloat'
import { getSiteSettings } from '../../lib/content'
import CountUp from 'react-countup'

// ── Clean SVG Icons ──────────────────────────────────────────────
const BoltIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)
const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const RupeeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const TrendIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)
const AcIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" />
  </svg>
)
const FridgeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2H4V6zM4 10h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9zm4 2v4" />
  </svg>
)
const HeaterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
)
const LightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)
const TvIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const SYSTEM = {
  kw: '5kW',
  kwhPerDay: '20–25',
  recommended: '3BHK Home',
  subsidyAmount: '₹78,000',
  priceFrom: '₹3,00,000 – ₹3,30,000',
  priceAfterSubsidy: '~₹2,40,000',
  billRange: '₹4,000 – ₹7,000',
  appliances: [
    { name: '1.5 Ton ACs', qty: 'Up to 2 (8 hrs)', Icon: AcIcon },
    { name: 'Refrigerator 500L', qty: '1 unit (24 hrs)', Icon: FridgeIcon },
    { name: 'Water Heater / Geyser', qty: '1 unit (2 hrs)', Icon: HeaterIcon },
    { name: 'Lights & Fans', qty: '10–15 units', Icon: LightIcon },
    { name: 'TV & Computer', qty: '8+ hrs daily', Icon: TvIcon },
  ],
  whatsapp: "Hi, I want the exact quotation for a 5kW Solar System."
}

export default function FiveKwPage({ settings }) {
  return (
    <>
      <Head>
        <title>5kW Solar Panel System Price in Tamil Nadu (With ₹78,000 Subsidy)</title>
        <meta name="description" content="Get the complete breakdown of a 5kW solar system price in Tamil Nadu. Claim the ₹78,000 PM Surya Ghar Subsidy. Can it run 2 ACs? Get your free quote today." />
        <link rel="canonical" href="https://suryassolar.com/systems/5kw-solar-system-with-subsidy" />
        <meta property="og:title" content="5kW Solar Panel System Price in Tamil Nadu (With Subsidy)" />
        <meta property="og:description" content="Get the complete breakdown of a 5kW solar system price in Tamil Nadu. Claim the ₹78,000 PM Surya Ghar Subsidy." />
        <meta property="og:url" content="https://suryassolar.com/systems/5kw-solar-system-with-subsidy" />
      </Head>

      <Header settings={settings} />

      <main className="bg-white">

        {/* ══ HERO ══ */}
        <section className="relative min-h-[82vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2e6e 0%, #1542a7 50%, #1e62d4 100%)' }}>
        {/* Glow orb */}
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,165,0,0.12) 0%, transparent 70%)' }} />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20">
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-blue-200/70 font-medium mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span className="text-blue-300/40">›</span>
                <span className="text-blue-200/70">Systems</span>
                <span className="text-blue-300/40">›</span>
                <span className="text-white">5kW Solar System</span>
              </nav>

              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400/30">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-orange-200 text-sm font-semibold tracking-wide">Best Seller — {SYSTEM.recommended}</span>
              </div>

              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                5kW Solar System<br />
                <span className="text-orange-400">With Subsidy</span><br />
                <span className="text-3xl md:text-4xl text-blue-200/80 font-normal">in Tamil Nadu</span>
              </h1>

              <p className="text-blue-100/90 text-lg leading-relaxed mb-10 max-w-xl">
                Eliminate up to <strong className="text-white">₹6,000/month</strong> from your TNEB electricity bill. Exact pricing after the{' '}
                <strong className="text-yellow-300">₹78,000 PM Surya Ghar subsidy</strong> — calculated for your home.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#booking" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Get Free Quote Now
                </a>
                <a href="tel:+917904369094" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-white/25 bg-white/8 hover:bg-white/15 text-white font-semibold text-base backdrop-blur-sm transition-all">
                  <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 7904369094
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* ══ STATS ══ */}
        <section className="relative z-10 -mt-2">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 overflow-hidden">
              {[
                { val: <CountUp end={25} prefix="20–" duration={2.5} enableScrollSpy scrollSpyOnce />, sub: 'Units Generated / Day', Icon: BoltIcon, color: 'text-blue-600' },
                { val: <CountUp end={25} suffix=" Years" duration={2.5} enableScrollSpy scrollSpyOnce />, sub: 'Panel Performance Warranty', Icon: ShieldIcon, color: 'text-green-600' },
                { val: <CountUp end={78000} prefix="₹" separator="," duration={2.5} enableScrollSpy scrollSpyOnce />, sub: 'Govt Subsidy Available', Icon: RupeeIcon, color: 'text-indigo-600' },
                { val: <CountUp end={4} prefix="< " suffix=" Years" duration={2.5} enableScrollSpy scrollSpyOnce />, sub: 'Return on Investment', Icon: TrendIcon, color: 'text-orange-500' },
              ].map(s => (
                <div key={s.sub} className="flex flex-col items-center py-7 px-4 text-center hover:bg-primary-50 transition-colors">
                  <div className={`mb-3 ${s.color}`}><s.Icon /></div>
                  <span className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">{s.val}</span>
                  <span className="text-xs lg:text-sm text-gray-500 font-medium mt-1.5 leading-snug">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SYSTEM DETAILS ══ */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">System Details</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-playfair font-bold text-gray-900">What Runs on a 5kW System?</h2>
              <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
                Ideal if your bi-monthly TNEB bill is between <strong>{SYSTEM.billRange}</strong>
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Appliance card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100">
                  <h3 className="text-gray-900 font-bold text-lg">Daily Appliance Capacity</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Generating {SYSTEM.kwhPerDay} units per day</p>
                </div>
                <div className="p-6">
                  {SYSTEM.appliances.map((a, i) => (
                    <div key={a.name} className={`flex items-center justify-between py-4 ${i < SYSTEM.appliances.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary flex-shrink-0">
                          <a.Icon />
                        </div>
                        <span className="font-medium text-gray-800">{a.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-lg">{a.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing card */}
              <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2e6e 0%, #1542a7 100%)' }}>
                <div className="p-8 relative">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-16 -mt-16" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
                  <div className="relative z-10">
                    <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">Pricing After Subsidy</div>
                    <h3 className="text-white text-2xl font-bold mb-8">5kW System Cost Breakdown</h3>
                    <div className="space-y-5 mb-8">
                      <div className="flex items-center justify-between pb-5 border-b border-white/10">
                        <div>
                          <div className="text-white/50 text-xs mb-0.5">Market Price</div>
                          <div className="text-white font-semibold">Premium Tier-1 Panels</div>
                        </div>
                        <span className="text-white font-bold text-base">{SYSTEM.priceFrom}</span>
                      </div>
                      <div className="flex items-center justify-between pb-5 border-b border-white/10">
                        <div>
                          <div className="inline-block bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded font-bold mb-1">MINUS</div>
                          <div className="text-white font-semibold">PM Surya Ghar Subsidy</div>
                        </div>
                        <span className="text-green-400 font-bold text-base">−{SYSTEM.subsidyAmount}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-white font-semibold text-lg">You Pay</div>
                        <span className="text-yellow-300 font-black text-4xl">{SYSTEM.priceAfterSubsidy}</span>
                      </div>
                    </div>
                    <p className="text-white/40 text-xs mb-6">*Prices vary based on panel technology. Includes GST and standard installation.</p>
                    <a href="#booking" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-all">
                      Get Exact Quote for My Home
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Frequently Asked</span>
              <h2 className="mt-3 text-4xl font-playfair font-bold text-gray-900">Common Questions</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: 'Can a 5kW system run two 1.5 ton ACs simultaneously?',
                  a: 'Yes — a 5kW system generates 20–25 units per day, which comfortably powers two 5-Star Inverter ACs running 8 hours each, plus your full household load of lights, fans, fridge, and TV. We recommend Inverter ACs for solar use due to their soft-start and variable compressor technology.'
                },
                {
                  q: 'How is the ₹78,000 PM Surya Ghar subsidy processed?',
                  a: 'Our team handles all documentation and DISCOM coordination. After installation and net-meter upgrade, the subsidy amount is credited directly to your bank account within 30–60 days. You do not need to visit any government office.'
                },
                {
                  q: 'What is the payback period for a 5kW system?',
                  a: 'With current TNEB tariffs in Tamil Nadu and the PM Surya Ghar subsidy applied, the typical payback period is 3.5–4 years. After that, you generate free electricity for 21+ more years.'
                },
                {
                  q: 'What panel brands does Surya\'s Solar use?',
                  a: 'We supply ALMM-listed, Tier-1 panels from TATA Power, Adani Solar, and Waaree — all BIS certified and required for the PM Surya Ghar subsidy. We do not use unverified brands.'
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-gray-900 text-[0.95rem] list-none select-none">
                    <span>{faq.q}</span>
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ml-4 group-open:bg-primary transition-colors">
                      <svg className="w-4 h-4 text-gray-500 group-open:text-white group-open:rotate-180 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-50 pt-4">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <WhyChoose />
        <BookingForm />
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat phoneNumber={settings?.whatsapp || "917904369094"} message={SYSTEM.whatsapp} />
    </>
  )
}

export async function getStaticProps() {
  const settings = getSiteSettings()
  return { props: { settings } }
}
