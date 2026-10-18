import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../components/Header'
import HeroCarousel from '../components/HeroCarousel'
import TrustMap from '../components/TrustMap'
import BookingTeaser from '../components/BookingTeaser'
import TimelineSteps from '../components/TimelineSteps'
import Partners from '../components/Partners'
import SolarCalculator from '../components/SolarCalculator'
import WhyChoose from '../components/WhyChoose'
import OurWorks from '../components/OurWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { getHomeContent, getSiteSettings } from '../lib/content'

const GUIDES = [
  { tag: 'Subsidy', title: '₹1 Lakh Solar Subsidy in Tamil Nadu', text: '₹78,000 PM Surya Ghar + ₹22,000 TN top-up: who gets it and how to apply.', href: '/blog/2025-12-02-pm-surya-ghar-subsidy-tamil-nadu-puducherry', image: '/images/Blog 4.webp' },
  { tag: 'Prices', title: 'Solar Panel Price List 2026', text: 'Per-watt rates by brand and 1kW to 10kW system prices after subsidy.', href: '/blog/2026-10-17-solar-panel-price-list-tamil-nadu-by-brand', image: '/images/solar-panel-cost-tamil-nadu-2026.webp' },
  { tag: 'Sizing', title: '3kW vs 5kW: Which Size Fits Your Bill?', text: 'Units per day, ACs supported and the right size for your EB bill.', href: '/blog/2025-12-03-3kw-vs-5kw-solar-system-comparison', image: '/images/3kW vs 5kW Comparison.webp' },
  { tag: 'Savings', title: 'Solar Payback After ₹1 Lakh Subsidy', text: 'How many years until solar pays for itself, by bill size.', href: '/blog/2026-10-17-solar-payback-after-1-lakh-subsidy-tamil-nadu', image: '/images/solar-roi-calculator-break-even-analysis.webp' },
  { tag: 'EB Bill', title: 'TNEB Slab Rates & EB Bill Calculation', text: 'Why your bill jumps after 500 units, with worked examples.', href: '/blog/2026-04-30-how-to-calculate-eb-bill-tamil-nadu-examples', image: '/images/how-to-calculate-eb-bill-tamil-nadu-examples.webp' },
  { tag: 'Buying Tips', title: 'How to Compare Solar Quotations', text: 'A 12-point checklist so a cheap quote does not cost you the subsidy.', href: '/blog/2026-10-17-how-to-compare-solar-quotations-checklist', image: '/images/solar-scam-warnings-cuddalore.webp' },
]

const QUICK_LINKS = [
  { label: 'Solar savings calculator', href: '/calc' },
  { label: 'Subsidy eligibility check', href: '/subsidy-eligibility' },
  { label: '3kW system', href: '/systems/3kw-solar-system-with-subsidy' },
  { label: '5kW system', href: '/systems/5kw-solar-system-with-subsidy' },
  { label: 'All solar guides', href: '/blog' },
]

const TOWNS = [
  { label: 'Cuddalore', href: '/service-areas/cuddalore' },
  { label: 'Puducherry', href: '/service-areas/puducherry' },
  { label: 'Panruti', href: '/service-areas/panruti' },
  { label: 'Neyveli', href: '/service-areas/neyveli' },
]

const ABOUT_POINTS = [
  'Registered PM Surya Ghar vendor',
  'Official TATA Power Solar & Exide partner',
  'Full subsidy and TNEB paperwork',
  'Coastal-grade structures, 3-pit earthing',
]

export default function Home({ content, settings }) {
  useEffect(() => {
    // Handle hash navigation on load
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          // Clean up URL after scroll for a professional look
          window.history.replaceState(null, '', window.location.pathname);
        }, 100);
      }
    }
  }, []);

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.suryassolar.com/#business",
    "name": "Surya's Solar",
    "alternateName": "Suryas Solar",
    "description": settings.siteDescription || "Cuddalore's most trusted solar company",
    "image": "https://www.suryassolar.com/images/Banner_1_desktop.webp",
    "logo": "https://www.suryassolar.com/images/surya-solar-logo.webp",
    "url": "https://www.suryassolar.com",
    "telephone": settings.phone || "+917904369094",
    "email": settings.email || "suryassolarenergy@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur",
      "addressLocality": "Cuddalore",
      "addressRegion": "Tamil Nadu",
      "postalCode": "607006",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "11.7563",
      "longitude": "79.7689"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "sameAs": [settings.facebook, settings.instagram, settings.linkedin].filter(Boolean),
    "priceRange": "₹₹",
    "areaServed": [
      {
        "@type": "City",
        "name": "Cuddalore"
      },
      {
        "@type": "City",
        "name": "Puducherry"
      },
      {
        "@type": "City",
        "name": "Neyveli"
      },
      {
        "@type": "City",
        "name": "Panruti"
      },
      {
        "@type": "City",
        "name": "Chidambaram"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "45"
    }
  }

  return (
    <>
      <Head>
        <title>{settings.siteTitle || "Surya's Solar - Cuddalore’s trusted residential solar expert"}</title>
        <meta name="description" content={settings.siteDescription || "Rooftop solar in Cuddalore: 100+ homes, 400+ kW installed. PM Surya Ghar subsidy + free home visit. TATA partner. Book today."} />
        <meta name="keywords" content={settings.siteKeywords || "solar panel Cuddalore, residential solar, rooftop solar"} />

        <link rel="canonical" href="https://www.suryassolar.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.suryassolar.com" />
        <meta property="og:title" content={settings.siteTitle || "Surya's Solar"} />
        <meta property="og:description" content={settings.siteDescription || "Power your home with clean solar energy"} />
        <meta property="og:image" content={settings.ogImage || "https://www.suryassolar.com/images/Banner_1_desktop.webp"} />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Surya's Solar" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.suryassolar.com" />
        <meta property="twitter:title" content={settings.siteTitle || "Surya's Solar"} />
        <meta property="twitter:description" content={settings.siteDescription || "Power your home with clean solar energy"} />
        <meta property="twitter:image" content={settings.ogImage || "https://www.suryassolar.com/images/Banner_1_desktop.webp"} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Surya's Solar" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Cuddalore" />
        <meta name="geo.position" content="11.7563;79.7689" />
        <meta name="ICBM" content="11.7563, 79.7689" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload LCP Hero Images */}
        <link rel="preload" as="image" href="/images/Banner_1_mobile.webp" media="(max-width: 767px)" />
        <link rel="preload" as="image" href="/images/Banner_1_desktop.webp" media="(min-width: 768px)" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </Head>

      <Header settings={settings} />
      <main>
        <HeroCarousel slides={content.heroSlides} />
        <div className="bg-gradient-to-r from-primary to-primary-700 py-3 text-center px-4">
          <h2 className="text-white font-semibold text-sm md:text-xl tracking-wide">
            <span className="text-yellow-300 font-bold text-base md:text-2xl">Cuddalore’s</span> trusted residential solar expert
          </h2>
        </div>
        <TrustMap className="bg-gradient-to-b from-white to-slate-50" />
        <BookingTeaser />
        <OurWorks />
        <TimelineSteps steps={content.timelineSteps} />
        <Partners partners={content.partners} />
        <SolarCalculator />
        <WhyChoose />
        <Testimonials testimonials={content.testimonials} />

        {/* Guides: photo cards (swipe on mobile, 3 columns on desktop) */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-gray-100">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full mb-4">
                Learn Before You Buy
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Solar <span className="text-primary">Guides</span> &amp; Prices
              </h2>
              <p className="text-slate-600 text-lg">Honest answers from our engineers to the questions Tamil Nadu homeowners ask most.</p>
            </div>

            <div className="flex lg:grid lg:grid-cols-3 gap-5 no-scrollbar overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
              {GUIDES.map((g) => (
                <a
                  key={g.href}
                  href={g.href}
                  className="group snap-start flex-shrink-0 w-[80%] sm:w-[45%] lg:w-auto bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={encodeURI(g.image)}
                      alt={g.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary text-xs font-bold">{g.tag}</span>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-primary transition-colors">{g.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{g.text}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read guide
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {QUICK_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary shadow-sm transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* About: real install photo + short story + proof */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/images/2.webp" alt="Rooftop solar installation by Surya's Solar in Cuddalore" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 right-4 sm:right-8 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4">
                <div>
                  <p className="text-3xl font-black text-primary leading-none">150+</p>
                  <p className="text-xs text-slate-500 mt-1">PM Surya Ghar<br />installations</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-3xl font-black text-primary leading-none">5.0</p>
                  <p className="text-xs text-slate-500 mt-1">45 Google<br />reviews</p>
                </div>
              </div>
            </div>

            <div className="pt-6 lg:pt-0">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full mb-4">
                About Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Rooftop Solar Installer in <span className="text-primary">Cuddalore</span>
              </h2>
              <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                For 10+ years, Surya&apos;s Solar has designed and installed on-grid and hybrid rooftop solar for homes, shops and offices across Cuddalore district and Puducherry, from our office in Kondur.
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed">
                We handle every step: sizing from your EB bills, shadow analysis, coastal-grade structures, TNEB net meter and the full ₹1 lakh subsidy paperwork. After installation, we stay on call for service.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {ABOUT_POINTS.map((p) => (
                  <div key={p} className="flex gap-3 items-center">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service areas: dark band with town chips + subsidy CTA */}
        <section className="pb-16 md:pb-24 bg-white">
          <div className="container-custom">
            <div className="relative overflow-hidden rounded-3xl px-6 py-10 md:px-12 md:py-14 text-white" style={{ background: 'linear-gradient(135deg, #0f2e6e 0%, #1542a7 55%, #1e62d4 100%)' }}>
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
              <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                    Serving Cuddalore District &amp; <span className="text-yellow-300">Puducherry</span>
                  </h2>
                  <p className="mt-3 text-blue-100 max-w-xl">
                    Free home visits all 7 days, 9 AM to 8 PM. Pick your town to see local details and check your subsidy in 30 seconds.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {TOWNS.map((t) => (
                      <a
                        key={t.href}
                        href={t.href}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white hover:text-primary transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {t.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-sm text-blue-100">Up to</p>
                  <p className="text-4xl md:text-5xl font-black text-yellow-300">₹1,00,000</p>
                  <p className="text-sm text-blue-100 mt-1">solar subsidy for eligible Tamil Nadu homes</p>
                  <a
                    href="/subsidy-eligibility"
                    className="mt-5 flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-solar-orange hover:bg-solar-orange-600 text-white font-bold shadow-lg transition-colors"
                  >
                    Check My Eligibility
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section id="contact">
        <Footer settings={settings} />
      </section>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloat
        phoneNumber={settings.whatsapp || "917904369094"}
        message="Hi! I'm interested in solar installation for my home."
      />
    </>
  )
}

// Load CMS content at build time
export async function getStaticProps() {
  const content = getHomeContent()
  const settings = getSiteSettings()

  return {
    props: {
      content,
      settings
    }
  }
}
