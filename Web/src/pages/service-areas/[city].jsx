import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhyChoose from '../../components/WhyChoose'
import BookingForm from '../../components/BookingForm'
import WhatsAppFloat from '../../components/WhatsAppFloat'
import CountUp from 'react-countup'
import { getAllLocations, getLocationData } from '../../lib/locationsData'
import { getSiteSettings } from '../../lib/content'

export default function LocationPage({ location, settings }) {
  if (!location) return null

  return (
    <>
      <Head>
        <title>{location.title}</title>
        <meta name="description" content={location.description} />
        <link rel="canonical" href={`https://www.suryassolar.com/service-areas/${location.name.toLowerCase()}`} />
        <meta property="og:title" content={location.title} />
        <meta property="og:description" content={location.description} />
        <meta property="og:image" content="https://www.suryassolar.com/images/surya-solar-logo.webp" />
        <meta property="og:url" content={`https://www.suryassolar.com/service-areas/${location.name.toLowerCase()}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Surya's Solar",
              "image": "https://www.suryassolar.com/logo.png",
              "description": location.description,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": location.name,
                "addressRegion": "TN",
                "addressCountry": "IN"
              },
              "telephone": "+917904369094",
              "areaServed": location.name,
              "priceRange": "₹₹",
              "url": `https://www.suryassolar.com/service-areas/${location.name.toLowerCase()}`
            })
          }}
        />
      </Head>

      <Header settings={settings} />

      <main className="bg-white">

        {/* ══════════════════════════════════════════════
            HERO SECTION — full-screen premium dark hero
        ══════════════════════════════════════════════ */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2e6e 0%, #1542a7 50%, #1e62d4 100%)' }}>

          {/* Background solar image with overlay */}
          <div className="absolute inset-0">
            <img
              src="/images/form-picture.webp"
              alt={`Solar installation in ${location.name}`}
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04122e] via-[#04122e]/90 to-transparent" />
          </div>

          {/* Subtle animated glow rings */}
          <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20">
            <div className="max-w-2xl">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-blue-300/70 font-medium mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span className="text-blue-400/40">›</span>
                <span className="text-blue-300/70">Service Areas</span>
                <span className="text-blue-400/40">›</span>
                <span className="text-blue-200">{location.name}</span>
              </nav>

              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full border border-green-400/30 bg-green-400/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <span className="text-green-300 text-sm font-semibold tracking-wide">Serving {location.name} — Book Today</span>
              </div>

              {/* Heading */}
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
                {location.heroTitle}
              </h1>

              <p className="text-blue-200 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                {location.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#booking"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-solar-orange hover:bg-solar-orange-600 text-white font-bold text-base shadow-[0_8px_30px_rgba(255,95,21,0.4)] hover:shadow-[0_12px_40px_rgba(255,95,21,0.5)] transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Free Site Visit in {location.name}
                </a>
                <a
                  href="tel:+917904369094"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/20 text-white font-semibold text-base backdrop-blur-sm transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 7904369094
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-6 mt-10">
                {[
                  { icon: '✦', text: '10+ Years Experience' },
                  { icon: '✦', text: 'TNEB Approved Vendor' },
                  { icon: '✦', text: 'PM Surya Ghar Certified' },
                ].map(t => (
                  <div key={t.text} className="flex items-center gap-2 text-sm text-blue-300/80">
                    <span className="text-solar-orange text-xs">{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
        </section>

        {/* ══════════════════════════════════════════════
            STATS STRIP
        ══════════════════════════════════════════════ */}
        <section className="relative z-10 -mt-6 py-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 overflow-hidden">
              {[
                {
                  val: <CountUp end={10} suffix="+" duration={2.5} enableScrollSpy scrollSpyOnce />, sub: 'Years in Business', color: 'text-blue-600',
                  Icon: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                },
                {
                  val: <CountUp end={50} suffix="+" duration={2.5} enableScrollSpy scrollSpyOnce />, sub: `Homes in ${location.name}`, color: 'text-green-600',
                  Icon: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 22V12h6v10" /></svg>
                },
                {
                  val: <CountUp end={78} prefix="₹" suffix="K" duration={2.5} enableScrollSpy scrollSpyOnce />, sub: 'Max Govt Subsidy', color: 'text-indigo-600',
                  Icon: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                },
                {
                  val: <CountUp end={25} suffix=" Yr" duration={2.5} enableScrollSpy scrollSpyOnce />, sub: 'Panel Warranty', color: 'text-orange-500',
                  Icon: () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                },
              ].map(s => (
                <div key={s.sub} className="flex flex-col items-center py-7 px-4 text-center hover:bg-primary-50 transition-colors">
                  <div className={`mb-3 ${s.color}`}><s.Icon /></div>
                  <span className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">{s.val}</span>
                  <span className="text-xs lg:text-sm text-gray-500 font-medium mt-1.5">{s.sub}</span>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            LOCAL EXPERTISE SECTION
        ══════════════════════════════════════════════ */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left */}
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Local Expertise</span>
                <h2 className="mt-3 text-4xl md:text-5xl font-playfair font-bold text-gray-900 leading-tight mb-6">
                  Why We're the Best<br />Solar Installer in{' '}
                  <span className="relative inline-block">
                    <span className="text-primary">{location.name}</span>
                    <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 6 Q100 0 200 6" stroke="#D6006F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </svg>
                  </span>
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Installing solar in {location.name} is not a one-size-fits-all job. Our local engineers know the specific grid conditions, roof types, and TNEB processes in this district — making your installation smooth and hassle-free.
                </p>

                <div className="space-y-4 mb-8">
                  {location.localInsights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-primary-50 border border-transparent hover:border-primary/20 transition-all duration-200">
                      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium pt-1">{insight}</p>
                    </div>
                  ))}
                </div>

                {/* Popular systems pill row */}
                <div className="flex flex-wrap gap-3">
                  {location.popularSystems.map((sys, i) => (
                    <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {sys}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Map with styled frame */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl transform rotate-2 scale-[1.02]" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[480px] border-4 border-white">
                  <iframe
                    src={location.mapEmbed}
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Solar company in ${location.name} map`}
                  />
                  {/* Map label overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
                    <div className="text-xs font-bold text-gray-900">Surya's Solar</div>
                    <div className="text-[10px] text-primary font-semibold">{location.name} Service Area</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SYSTEMS SECTION
        ══════════════════════════════════════════════ */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Solar Systems</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-playfair font-bold text-gray-900">
                Choose Your Solar System
              </h2>
              <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">Both qualify for the PM Surya Ghar ₹78,000 subsidy</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  kw: '3kW',
                  badge: 'Perfect for 2BHK',
                  badgeBg: 'bg-primary',
                  href: '/systems/3kw-solar-system-with-subsidy',
                  price: '~₹1,10,000',
                  savings: '₹3,500/month',
                  units: '12–15 units/day',
                  ac: '1 AC supported',
                  gradient: 'from-primary-900 to-primary-700',
                },
                {
                  kw: '5kW',
                  badge: 'Best Seller',
                  badgeBg: 'bg-orange-500',
                  href: '/systems/5kw-solar-system-with-subsidy',
                  price: '~₹2,40,000',
                  savings: '₹6,000/month',
                  units: '20–25 units/day',
                  ac: '2 ACs supported',
                  gradient: 'from-[#1a1a2e] to-[#16213e]',
                },
              ].map(sys => (
                <Link
                  key={sys.kw}
                  href={sys.href}
                  className={`group relative rounded-3xl overflow-hidden ${sys.glow} hover:-translate-y-1 transition-all duration-300 block`}
                >
                  {/* Card top — dark gradient */}
                  <div className={`bg-gradient-to-br ${sys.gradient} p-8 pb-10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
                    <div className={`inline-block text-xs font-bold ${sys.badgeBg} text-white px-3 py-1.5 rounded-full mb-5`}>{sys.badge}</div>
                    <div className="text-6xl font-black text-white mb-1">{sys.kw}</div>
                    <div className="text-blue-300/80 text-sm font-medium">Solar System · PM Subsidy Eligible</div>
                  </div>

                  {/* Card bottom — white */}
                  <div className="bg-white p-6 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">After subsidy price</span>
                      <span className="font-black text-primary text-lg">{sys.price}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">Monthly savings</span>
                      <span className="font-bold text-green-600">{sys.savings}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">Daily generation</span>
                      <span className="font-semibold text-gray-800">{sys.units}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-500 text-sm">AC capacity</span>
                      <span className="font-semibold text-gray-800">{sys.ac}</span>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-primary font-bold text-sm group-hover:gap-3 transition-all">
                      <span>View Full Details & Pricing</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            WHY CHOOSE + BOOKING (reusable components)
        ══════════════════════════════════════════════ */}
        <WhyChoose />
        <BookingForm />

      </main>

      <Footer settings={settings} />
      <WhatsAppFloat
        phoneNumber={settings?.whatsapp || "917904369094"}
        message={`Hi, I'm from ${location.name} and I would like to get a solar quote.`}
      />
    </>
  )
}

export async function getStaticPaths() {
  const locations = getAllLocations()
  return {
    paths: locations.map(city => ({ params: { city } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const location = getLocationData(params.city)
  const settings = getSiteSettings()
  return { props: { location, settings } }
}
