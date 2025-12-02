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
    "image": "https://suryassolar.com/images/Banner_1_desktop.png",
    "logo": "https://suryassolar.com/images/surya-solar-logo.png",
    "url": "https://suryassolar.com",
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
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "11.7563",
        "longitude": "79.7689"
      },
      "geoRadius": "50000"
    },
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
        <meta name="description" content={settings.siteDescription || "Leading residential solar installation in Cuddalore"} />
        <meta name="keywords" content={settings.siteKeywords || "solar panel Cuddalore, residential solar, rooftop solar"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/surya-solar-logo.png" />
        <link rel="canonical" href="https://suryassolar.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://suryassolar.com" />
        <meta property="og:title" content={settings.siteTitle || "Surya's Solar"} />
        <meta property="og:description" content={settings.siteDescription || "Power your home with clean solar energy"} />
        <meta property="og:image" content={settings.ogImage || "https://suryassolar.com/images/Banner_1_desktop.png"} />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Surya's Solar" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://suryassolar.com" />
        <meta property="twitter:title" content={settings.siteTitle || "Surya's Solar"} />
        <meta property="twitter:description" content={settings.siteDescription || "Power your home with clean solar energy"} />
        <meta property="twitter:image" content={settings.ogImage || "https://suryassolar.com/images/Banner_1_desktop.png"} />

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
