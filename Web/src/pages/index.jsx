import Head from 'next/head'
import Header from '../components/Header'
import HeroCarousel from '../components/HeroCarousel'
import StatsStrip from '../components/StatsStrip'
import BookingForm from '../components/BookingForm'
import TimelineSteps from '../components/TimelineSteps'
import Partners from '../components/Partners'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

export default function Home() {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Surya's Solar",
    "description": "Cuddalore's most trusted solar company. Expert residential and commercial solar installation with government subsidy assistance.",
    "image": "https://suryassolar.com/images/og-home.jpg",
    "logo": "https://suryassolar.com/images/logo.png",
    "url": "https://suryassolar.com",
    "telephone": "+919876543210",
    "email": "info@suryassolar.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "Cuddalore",
      "addressRegion": "Tamil Nadu",
      "postalCode": "607001",
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
      "https://facebook.com/suryassolar",
      "https://instagram.com/suryassolar",
      "https://linkedin.com/company/suryassolar"
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
        <title>Surya's Solar - Cuddalore's #1 Trusted Solar Company | Residential Solar Experts</title>
        <meta name="description" content="Leading residential solar installation in Cuddalore. Expert 24-hour installation, 25-year warranty, government subsidy assistance. Book your free home visit today!" />
        <meta name="keywords" content="solar panel Cuddalore, residential solar, rooftop solar Cuddalore, solar installation, solar subsidy, Cuddalore solar company" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://suryassolar.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://suryassolar.com" />
        <meta property="og:title" content="Surya's Solar - Cuddalore's #1 Trusted Solar Company" />
        <meta property="og:description" content="Power your home with clean solar energy. 50+ happy homes, 100kW+ installations, 25-year warranty. Book free home visit!" />
        <meta property="og:image" content="https://suryassolar.com/images/og-home.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Surya's Solar" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://suryassolar.com" />
        <meta property="twitter:title" content="Surya's Solar - Cuddalore's #1 Trusted Solar Company" />
        <meta property="twitter:description" content="Power your home with clean solar energy. 50+ happy homes, 100kW+ installations, 25-year warranty." />
        <meta property="twitter:image" content="https://suryassolar.com/images/og-home.jpg" />

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

      <Header />
      <main>
        <HeroCarousel />
        <StatsStrip />
        <BookingForm />
        <TimelineSteps />
        <Partners />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
