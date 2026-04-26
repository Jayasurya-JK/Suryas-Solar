import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../components/Header'
import HeroCarousel from '../components/HeroCarousel'
import StatsStrip from '../components/StatsStrip'
import BookingForm from '../components/BookingForm'
import TimelineSteps from '../components/TimelineSteps'
import Partners from '../components/Partners'
import SolarCalculator from '../components/SolarCalculator'
import WhyChoose from '../components/WhyChoose'
import OurWorks from '../components/OurWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { getHomeContent, getSiteSettings } from '../lib/content'

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
    "name": settings.siteTitle || "Surya's Solar",
    "description": settings.siteDescription || "Cuddalore's most trusted solar company",
    "image": "https://www.suryassolar.com/images/Banner_1_desktop.webp",
    "logo": "https://www.suryassolar.com/images/surya-solar-logo.webp",
    "url": "https://www.suryassolar.com",
    "telephone": settings.phone || "+917904369094",
    "email": settings.email || "suryassolarenergy@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address || "No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur",
      "addressLocality": settings.city || "Cuddalore",
      "addressRegion": settings.state || "Tamil Nadu",
      "postalCode": settings.pincode || "607006",
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
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      settings.facebook || "https://facebook.com/suryassolar",
      settings.instagram || "https://instagram.com/suryassolar",
      settings.linkedin || "https://linkedin.com/company/suryassolar"
    ],
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
      "ratingValue": "5",
      "reviewCount": "50"
    }
  }

  return (
    <>
      <Head>
        <title>{settings.siteTitle || "Surya's Solar - Cuddalore’s trusted residential solar expert"}</title>
        <meta name="description" content={settings.siteDescription || "Surya's Solar: Cuddalore's #1 Residential Solar Installer. Get max subsidy under PM Surya Ghar Yojana. Recognized Tata Power & Adani Partner. Book Free Visit!"} />
        <meta name="keywords" content={settings.siteKeywords || "solar panel Cuddalore, residential solar, rooftop solar"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

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
        <StatsStrip stats={content.stats} />
        <section id="booking">
          <BookingForm />
        </section>
        <OurWorks />
        <TimelineSteps steps={content.timelineSteps} />
        <Partners partners={content.partners} />
        <SolarCalculator />
        <WhyChoose />
        <Testimonials testimonials={content.testimonials} />
        
        {/* SEO Text Block to increase Text-to-HTML ratio */}
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="container-custom max-w-5xl mx-auto text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 mb-6">Your Trusted Solar Installation Partner in Tamil Nadu</h2>
            <div className="text-gray-600 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Surya's Solar is the premier provider of residential and commercial solar energy systems across Tamil Nadu and Puducherry. 
                Based in Cuddalore, we specialize in designing and installing high-efficiency On-Grid, Off-Grid, and Hybrid solar power plants 
                tailored specifically for the regional climate. Our certified engineering team manages the entire process end-to-end: from precise 
                3kW to 10kW load calculations and structural shadow analysis, to complete TNEB net-metering liaisoning and PM Surya Ghar Muft Bijli Yojana subsidy processing.
              </p>
              <p>
                We are fiercely committed to helping local homeowners and large-scale businesses completely eliminate their electricity bills while significantly 
                increasing their property value through clean, renewable energy. Whether you are actively comparing N-Type TopCon vs Bifacial solar panels, 
                calculating your long-term solar ROI, or seeking professional post-installation maintenance and generation tracking, Surya's Solar delivers 
                uncompromised engineering quality, transparent pricing, and robust 25-year performance warranties.
              </p>
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
