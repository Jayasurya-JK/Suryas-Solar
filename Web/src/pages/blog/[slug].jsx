import { useState, useEffect } from 'react'
import { getAllBlogPosts, getBlogPost, getSiteSettings } from '../../lib/content'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

import SolarCalculator from '../../components/SolarCalculator'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { FaInstagram } from 'react-icons/fa'

// Separate component to handle client-side share links
function ShareButtons({ title, isFooter = false }) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  if (!shareUrl) return null

  const iconClass = isFooter
    ? "p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
    : "p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white transition-all"

  const containerClass = isFooter
    ? "flex gap-3 justify-center"
    : "flex gap-4 flex-wrap"

  return (
    <div className={containerClass}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={isFooter ? "p-2 rounded-full bg-blue-50 text-blue-600" : "p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"}
        aria-label="Share on Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={isFooter ? "p-2 rounded-full bg-gray-50 text-gray-900" : "p-3 rounded-full bg-gray-50 text-gray-900 hover:bg-black hover:text-white transition-all"}
        aria-label="Share on X"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      </a>
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={isFooter ? "p-2 rounded-full bg-pink-50 text-pink-600" : "p-3 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all"}
        aria-label="Share on Instagram"
      >
        <FaInstagram className="w-5 h-5" />
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={isFooter ? "p-2 rounded-full bg-green-50 text-green-600" : "p-3 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"}
        aria-label="Share on WhatsApp"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
      </a>
      <button
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }}
        className={isFooter ? "p-2 rounded-full bg-gray-100 text-gray-600" : "p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white transition-all"}
        aria-label="Copy Link"
        title="Copy Link"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      </button>
    </div>
  )
}

export default function BlogPost({ post, settings }) {
  // Default FAQs for the cost breakdown post
  const costFaqs = [
    {
      question: "How much does a 3kW solar system cost in Cuddalore with subsidy?",
      answer: "A 3kW system typically costs between ₹1.6L - ₹1.9L. After the ₹78,000 PM Surya Ghar subsidy, your net cost is approximately ₹1L - ₹1.2L."
    },
    {
      question: "How much roof space do I need for a 3kW system?",
      answer: "You need approximately 300 sq. ft. of shadow-free roof area."
    },
    {
      question: "Will solar panels work during a power cut?",
      answer: "On-grid systems (most common) shut down during power cuts for safety. If you need backup, you should opt for a Hybrid Solar System with batteries."
    },
    {
      question: "What is the warranty on solar panels?",
      answer: "Most Tier-1 panels come with a 25-year performance warranty. Inverters typically have 5-10 years warranty."
    }
  ];

  // FAQs for the ROI/Payback post
  const roiFaqs = [
    {
      question: "What is the average payback period for solar in Tamil Nadu?",
      answer: "For most residential systems (3kW-5kW) in Tamil Nadu, the payback period is between 3 to 4 years, thanks to high solar irradiation and subsidies."
    },
    {
      question: "How much can I save per month with a 3kW system?",
      answer: "A 3kW system in Tamil Nadu generates approx. 360 units/month. At ₹8/unit, you can save around ₹2,800 - ₹3,000 per month."
    },
    {
      question: "How does the PM Surya Ghar subsidy impact ROI?",
      answer: "The subsidy (up to ₹78,000) significantly lowers your upfront cost, reducing your payback period by 1-2 years and boosting your 20-year ROI."
    },
    {
      question: "Does solar work during power cuts?",
      answer: "Standard on-grid systems shut down during power cuts for safety. If you need backup power, you should choose a Hybrid Solar System with battery storage."
    },
    {
      question: "Is solar maintenance expensive?",
      answer: "No, solar maintenance is very low. It mainly involves cleaning the panels every few weeks to remove dust. There are no moving parts to repair."
    }
  ];

  // FAQs for the Best Brands post
  const brandsFaqs = [
    {
      question: "Which solar panel brand is No.1 in Tamil Nadu?",
      answer: "Tata Power Solar and Waaree Energies are widely considered the top brands in Tamil Nadu due to their extensive service network and proven performance."
    },
    {
      question: "Which brand is best for Puducherry climate?",
      answer: "For Puducherry's humid coastal climate, we recommend brands like Panasonic or Adani TOPCon which offer superior corrosion resistance and anti-PID technology."
    },
    {
      question: "Mono PERC vs TOPCon: which is better?",
      answer: "TOPCon is the newer, more efficient technology with better ROI over 25 years. However, Mono PERC is still an excellent, cost-effective choice for most homes."
    },
    {
      question: "Is Loom Solar good for home use?",
      answer: "Yes, Loom Solar is a fantastic budget-friendly option for residential rooftops, offering high-efficiency Mono PERC panels at a competitive price."
    },
    {
      question: "What warranty should I look for?",
      answer: "Look for a 25-year performance warranty and at least a 10-12 year product warranty. All brands we install (Tata, Waaree, Adani) meet these standards."
    }
  ];

  // FAQs for the Subsidy post
  const subsidyFaqs = [
    {
      question: "Who is eligible for PM Surya Ghar subsidy?",
      answer: "Any residential homeowner with a valid electricity connection and a shadow-free roof is eligible. The applicant must own the property and have an Aadhaar-linked bank account."
    },
    {
      question: "How long does subsidy take to come?",
      answer: "Once the system is installed and inspected by TNEB/PED, the subsidy is typically credited directly to your bank account within 30 days."
    },
    {
      question: "Is subsidy available for apartments?",
      answer: "Individual apartment owners can apply if they have a separate roof area. For common areas, the Resident Welfare Association (RWA) can apply for a separate subsidy."
    },
    {
      question: "Do I need net metering for subsidy?",
      answer: "Yes, installing a bi-directional Net Meter is mandatory to avail the subsidy in Tamil Nadu and Puducherry."
    },
    {
      question: "Who installs the system — vendor or government?",
      answer: "The government provides the subsidy, but the installation is done by registered vendors like Surya's Solar. We handle the entire process for you."
    }
  ];

  // FAQs for the Inverter post
  const inverterFaqs = [
    {
      question: "Which inverter is best for Tamil Nadu?",
      answer: "For most homes in Tamil Nadu with stable grid power, an On-Grid inverter (Solis, Growatt, Waaree) is the best choice for maximum savings and ROI."
    },
    {
      question: "Which inverter is best for Pondicherry?",
      answer: "Due to occasional power cuts and coastal humidity, we recommend Hybrid inverters (SolaX, Deye) that offer battery backup and robust protection."
    },
    {
      question: "What inverter do I need for a 3kW system?",
      answer: "For a 3kW solar system, you need a 3kW or 3.3kW inverter. It's important to match the inverter capacity with your panel capacity."
    },
    {
      question: "Can I add battery later?",
      answer: "Only if you install a Hybrid inverter initially. Standard On-Grid inverters cannot connect to batteries directly."
    },
    {
      question: "Do inverters work during power cuts?",
      answer: "On-Grid inverters shut down during power cuts for safety. Hybrid inverters continue to run and power your home using the battery backup."
    }
  ];

  // FAQs for the Structure post
  const structureFaqs = [
    {
      question: "Which structure lasts longest?",
      answer: "Hot-Dip Galvanized (HDGI) and RCC structures have the longest lifespan (20+ years) due to their superior corrosion resistance."
    },
    {
      question: "Is Hot-Dip necessary?",
      answer: "In coastal areas like Cuddalore and Puducherry, Hot-Dip is absolutely necessary to prevent rust. In dry inland areas, standard GI may suffice."
    },
    {
      question: "Can solar damage my RCC roof?",
      answer: "No, if installed correctly with concrete pedestals (RCC structure), there is no drilling into the roof, so there is zero risk of leakage or damage."
    },
    {
      question: "Should I choose elevated structures?",
      answer: "Elevated structures are great if you want to use the roof space for other purposes, but they cost significantly more than standard low-height structures."
    },
    {
      question: "What is wind load?",
      answer: "Wind load is the force of wind on the panels. In coastal TN, structures must be designed to withstand wind speeds of 150-180 km/h for safety."
    }
  ];

  // FAQs for the Net Metering post
  const netMeteringFaqs = [
    {
      question: "What is net-metering?",
      answer: "Net-metering is a billing mechanism that allows you to export excess solar power to the grid and get a credit on your electricity bill."
    },
    {
      question: "Can I get zero bill?",
      answer: "Yes, if your solar system generates enough power to cover your entire monthly consumption (Import - Export <= 0), your energy bill can be zero."
    },
    {
      question: "How long approval takes?",
      answer: "In Tamil Nadu, the process typically takes 2-4 weeks. In Puducherry, it can be slightly faster, around 1-3 weeks."
    },
    {
      question: "Can hybrid inverter be used?",
      answer: "Yes, hybrid inverters are fully compatible with net-metering and are highly recommended for areas with power cuts."
    },
    {
      question: "Is net-metering available in Puducherry?",
      answer: "Yes, the Puducherry Electricity Department (PED) offers net-metering for residential consumers."
    },
    {
      question: "What if I export more units?",
      answer: "If you export more than you import, the excess units are typically carried forward as a credit to your next month's bill."
    }
  ];

  // FAQs for the 3kW vs 5kW post
  const comparisonFaqs = [
    {
      question: "Is 5kW worth the extra cost?",
      answer: "Yes, if your monthly bill is over ₹2,500. The extra generation pays for the cost difference in about 3-4 years, offering better long-term savings."
    },
    {
      question: "Can 3kW run AC?",
      answer: "Yes, a 3kW system can easily run one 1.5-ton AC along with other lights and fans. However, running multiple ACs simultaneously requires a 5kW system."
    },
    {
      question: "Will 5kW give zero bill?",
      answer: "For most homes with a bill under ₹4,000, a 5kW system can definitely bring the electricity bill down to zero or near-zero."
    },
    {
      question: "Roof space required?",
      answer: "A 3kW system needs about 240-300 sq. ft., while a 5kW system requires approximately 400-450 sq. ft. of shadow-free roof area."
    },
    {
      question: "Can I upgrade 3kW to 5kW later?",
      answer: "It is possible but expensive. You would need to replace the inverter and add more panels. It is much cheaper to install the correct size initially."
    }
  ];

  // FAQs for the Generation post
  const generationFaqs = [
    {
      question: "How many units does 1kW produce?",
      answer: "In Tamil Nadu, a 1kW solar system produces approximately 4-5 units per day, or about 120-150 units per month."
    },
    {
      question: "How many units does 5kW produce?",
      answer: "A 5kW system generates around 20-22 units per day, totaling 600-660 units per month, which is sufficient for most large homes."
    },
    {
      question: "Does weather affect solar?",
      answer: "Yes, cloudy days and rain reduce generation. However, Tamil Nadu's climate ensures high generation for over 300 days a year."
    },
    {
      question: "Does AC reduce solar efficiency?",
      answer: "No, using an AC increases your consumption, but it does not affect the solar panels' ability to generate power."
    },
    {
      question: "What affects generation the most?",
      answer: "Shading is the biggest factor. Even a small shadow can significantly drop output. Dust accumulation and panel orientation also play key roles."
    }
  ];

  // FAQs for the Myths vs Facts post
  const mythsFaqs = [
    {
      question: "Does solar work in rainy season?",
      answer: "Yes, solar panels work on light intensity, not heat. While generation drops during heavy rain, they still produce power on cloudy days."
    },
    {
      question: "Will my bill become zero?",
      answer: "It is possible if your solar system generates more power than you consume. However, a 'Zero Bill' depends on your usage habits and system size."
    },
    {
      question: "Can I upgrade 3kW to 5kW?",
      answer: "Yes, but it requires changing the inverter and adding more panels, which can be costly. It's better to install the right size from the start."
    },
    {
      question: "What about AC load?",
      answer: "A 5kW system can easily run 1-2 ACs. Even a 3kW system can run a small AC occasionally. Solar is excellent for offsetting high AC bills."
    },
    {
      question: "Does net-metering cost extra?",
      answer: "There are nominal government fees for the net meter and testing, but no recurring monthly charges for the net-metering service itself."
    }
  ];

  // FAQs for the System Types post
  const systemTypesFaqs = [
    {
      question: "Which is better: on-grid or hybrid?",
      answer: "On-grid is better for maximum savings if you have stable power. Hybrid is better if you need backup during power cuts."
    },
    {
      question: "Does on-grid work during power cuts?",
      answer: "No, on-grid systems automatically shut down during power cuts for safety reasons. You need a Hybrid system for backup."
    },
    {
      question: "Is subsidy available for hybrid?",
      answer: "Yes, the PM Surya Ghar subsidy applies to the solar generation part of a Hybrid system, but not the battery cost."
    },
    {
      question: "Do I need battery backup in TN?",
      answer: "In most TN cities with stable power, batteries are not strictly necessary. However, they provide peace of mind and security."
    },
    {
      question: "Can off-grid be connected to the grid?",
      answer: "No, true off-grid systems are completely independent. If you want grid connection + battery, you need a Hybrid system."
    }
  ];

  // FAQs for the Phase Upgrade post
  const phaseUpgradeFaqs = [
    {
      question: "Is 3kW allowed on single-phase?",
      answer: "Yes, TNEB generally allows up to 3kW (sometimes 4kW) on a single-phase connection, but upgrading to 3-phase is often recommended for better stability."
    },
    {
      question: "How much does 3-phase upgrade cost?",
      answer: "The cost typically ranges from ₹8,000 to ₹18,000, covering TNEB fees, meter cost, cabling, and electrician charges."
    },
    {
      question: "Does TNEB approve 5kW on single-phase?",
      answer: "No, for a 5kW solar system, a 3-phase connection is mandatory as per TNEB regulations."
    },
    {
      question: "How long does the upgrade process take?",
      answer: "Once you submit the application and pay the fees, the technical work and meter installation usually take 1-2 weeks."
    },
    {
      question: "Do I need new wiring?",
      answer: "Yes, the service wire from the pole to your meter needs to be changed to a 4-core cable, and your distribution board may need rewiring."
    }
  ];

  // Select FAQs based on the post title or slug
  let faqs = costFaqs;

  if (!post || !post.title) {
    return <div>Loading...</div>;
  }

  if (post.title.includes("ROI")) {
    faqs = roiFaqs;
  } else if (post.title.includes("Brands")) {
    faqs = brandsFaqs;
  } else if (post.title.includes("Subsidy")) {
    faqs = subsidyFaqs;
  } else if (post.title.includes("Inverter")) {
    faqs = inverterFaqs;
  } else if (post.title.includes("Structure")) {
    faqs = structureFaqs;
  } else if (post.title.includes("Net-Metering")) {
    faqs = netMeteringFaqs;
  } else if (post.title.includes("3kW vs 5kW")) {
    faqs = comparisonFaqs;
  } else if (post.title.includes("Generation")) {
    faqs = generationFaqs;
  } else if (post.title.includes("Myths")) {
    faqs = mythsFaqs;
  } else if (post.title.includes("On-Grid vs Off-Grid")) {
    faqs = systemTypesFaqs;
  } else if (post.title.includes("Phase Upgrade")) {
    faqs = phaseUpgradeFaqs;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://suryassolar.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://suryassolar.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://suryassolar.com/blog/${post.slug}`
      }
    ]
  };

  return (
    <>
      <Head>
        <title>{post.title} | Surya's Solar</title>
        <meta name="description" content={post.excerpt || `Read about ${post.title}`} />

        <link rel="canonical" href={`https://suryassolar.com/blog/${post.slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>
      <Header settings={settings} />

      <article className="py-12 bg-gray-50 min-h-screen pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main Content Column */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">

                {/* Back Link */}
                <Link
                  href="/blog"
                  className="inline-flex items-center text-gray-500 hover:text-solar-orange mb-6 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Blog
                </Link>

                {/* Post Header */}
                <header className="mb-8 border-b border-gray-100 pb-8">
                  {post.category && (
                    <span className="inline-block bg-orange-50 text-solar-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      {post.category}
                    </span>
                  )}

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">{post.author}</span>
                      </div>
                    )}

                  </div>
                </header>

                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] -mx-6 md:-mx-10 mb-10">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      width={1200}
                      height={600}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="prose prose-base md:prose-lg max-w-none 
                    prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
                    prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-10 sm:prose-h2:mt-12 prose-h2:mb-5 sm:prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-solar-orange prose-h2:pl-4
                    prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5 sm:prose-p:mb-6
                    prose-a:text-solar-orange prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:mb-2 prose-li:text-gray-700
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                    prose-blockquote:border-l-4 prose-blockquote:border-solar-orange prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-800
                    prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:w-full prose-img:h-auto prose-img:object-contain prose-img:mx-auto
                    prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm prose-table:border prose-table:border-gray-200
                    prose-thead:bg-blue-50 prose-thead:border-b prose-thead:border-blue-100
                    prose-th:text-blue-900 prose-th:font-bold prose-th:p-4 prose-th:text-left prose-th:text-sm sm:prose-th:text-base
                    prose-td:p-4 prose-td:border-b prose-td:border-gray-100 prose-td:text-gray-700 prose-td:text-sm sm:prose-td:text-base
                    prose-tr:hover:bg-gray-50 transition-colors
                    [&_table]:block [&_table]:overflow-x-auto [&_table]:whitespace-nowrap sm:[&_table]:table sm:[&_table]:whitespace-normal
                    [&_table]:-mx-4 [&_table]:w-[calc(100%+2rem)] [&_table]:max-w-[calc(100%+2rem)] [&_table]:rounded-none sm:[&_table]:mx-0 sm:[&_table]:w-full sm:[&_table]:max-w-none sm:[&_table]:rounded-xl
                    [&_thead]:bg-blue-50 [&_thead]:border-b [&_thead]:border-blue-100
                    [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:text-blue-900 [&_th]:uppercase [&_th]:tracking-wider
                    [&_td]:px-4 [&_td]:py-4 [&_td]:text-sm [&_td]:text-gray-600 [&_td]:border-b [&_td]:border-gray-100
                    [&_th:first-child]:sticky [&_th:first-child]:left-0 [&_th:first-child]:z-10 [&_th:first-child]:bg-blue-50
                    [&_td:first-child]:sticky [&_td:first-child]:left-0 [&_td:first-child]:z-10 [&_td:first-child]:bg-white [&_td:first-child]:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">

                  {post.content.split(/<!--\s*COMPONENT:\s*(\w+)\s*-->/).map((part, index) => {
                    if (part === 'SOLAR_CALCULATOR') {
                      return (
                        <div key={index} className="my-8 sm:my-12 not-prose bg-gray-50 rounded-none sm:rounded-2xl border-y sm:border border-gray-200 overflow-hidden shadow-sm -mx-6 sm:mx-0 w-[calc(100%+3rem)] sm:w-full">
                          <SolarCalculator />
                        </div>
                      )
                    }
                    if (part === 'BOOKING_CTA') {
                      return (
                        <div key={index} className="my-8 sm:my-12 not-prose bg-orange-50 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-orange-100 text-center shadow-sm">
                          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">Check Your Subsidy Eligibility</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-2xl mx-auto">
                            Find out if you are eligible for the PM Surya Ghar Muft Bijli Yojana subsidy scheme.
                          </p>
                          <Link
                            href="/#booking"
                            className="inline-flex items-center justify-center bg-solar-orange text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            Check Eligibility Now
                          </Link>
                        </div>
                      )
                    }
                    if (part === 'CONTACT_CTA') {
                      return (
                        <div key={index} className="my-8 sm:my-12 not-prose bg-blue-50 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-blue-100 text-center shadow-sm">
                          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">Get a Free Rooftop Assessment</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-2xl mx-auto">
                            Our engineers will visit your site, analyze shadow-free area, and provide a detailed solar report.
                          </p>
                          <Link
                            href="/#booking"
                            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            Book Free Assessment
                          </Link>
                        </div>
                      )
                    }
                    if (part === 'FAQ_SECTION') {
                      return (
                        <div key={index} className="my-8 sm:my-12 not-prose">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                          <div className="space-y-4">
                            {faqs.map((faq, i) => (
                              <details key={i} className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors list-none">
                                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 pr-4">{faq.question}</h3>
                                  <span className="flex-shrink-0 ml-2">
                                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </span>
                                </summary>
                                <div className="p-4 sm:p-5 pt-0 text-sm sm:text-base text-gray-600 bg-white border-t border-gray-100">
                                  {faq.answer}
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    // Default: render HTML
                    return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
                  })}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-6 pt-6 sm:mt-12 sm:pt-8 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">

                {/* CTA Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Switch to Solar?</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Get a customized solar solution for your home. Save up to 90% on electricity bills!
                    </p>
                    <ul className="space-y-3 mb-8 text-sm text-gray-700">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Free Site Visit
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Govt. Subsidy Support
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        25 Years Warranty
                      </li>
                    </ul>
                    <Link
                      href="/#booking"
                      className="block w-full bg-solar-orange text-white text-center px-6 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                    >
                      Book Free Consultation
                    </Link>
                  </div>
                </div>

                {/* Share Card - Hidden on Mobile since we have sticky footer */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hidden md:block">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
                  <ShareButtons title={post.title} />
                  {settings.instagram && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-2 uppercase font-semibold">Follow us</p>
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700"
                      >
                        <FaInstagram className="w-5 h-5" />
                        Instagram
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </article>

      <Footer settings={settings} />

      {/* Mobile Share Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-gray-900">Share this article</p>
          <ShareButtons title={post.title} isFooter={true} />
        </div>
      </div>


    </>
  )
}

export async function getStaticPaths() {
  const posts = getAllBlogPosts()

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = getBlogPost(params.slug)
  const settings = getSiteSettings()

  // Serialize date to string
  const serializedPost = {
    ...post,
    date: post.date ? post.date.toString() : new Date().toISOString()
  }

  return {
    props: {
      post: serializedPost,
      settings,
    },
  }
}
