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
  if (!post || !post.title) {
    return <div>Loading...</div>;
  }
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

  // FAQs for the ROI Calculator post
  const roiFaqs = [
    {
      question: "What is the payback period for 3kW solar?",
      answer: "With the ₹78,000 subsidy and current TNEB rates, the payback period is approximately 3.2 to 3.6 years."
    },
    {
      question: "How much will I save in 25 years?",
      answer: "A 3kW system can generate lifetime savings of approximately ₹8.5 Lakhs over its 25-year lifespan."
    },
    {
      question: "Is solar a better investment than FD or Gold?",
      answer: "Yes, solar offers tax-free returns of over 20% by eliminating expenses, beating both FD (7%) and Gold (10%)."
    },
    {
      question: "What maintenance costs should I expect?",
      answer: "Maintenance is minimal—mostly cleaning. You may need to replace the inverter once in year 11-12 (approx ₹25,000)."
    },
    {
      question: "Does solar increase home resale value?",
      answer: "Yes, homes with zero electricity bills are highly attractive and can command a premium of ₹3-4 Lakhs."
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



  // --- NEW 2026 FAQs Definitions ---



  const maintenanceFaqs = [
    { question: "How often should I clean my panels?", answer: "In Cuddalore: Every 10-15 days in summer (dust season), once a month in monsoon. Check visually - if panels look dirty, clean them." },
    { question: "Can I use tap water for cleaning?", answer: "Only if it's soft water. Cuddalore bore water is hard (high TDS). Use RO reject water or rainwater to avoid white calcium spots." },
    { question: "Is annual professional servicing necessary?", answer: "Recommended. A technician checks cable health, earthing resistance, and inverter diagnostics. Costs ₹1,500-2,500/year. Prevents major failures." },
    { question: "My generation dropped suddenly. What should I check?", answer: "(1) Clean the panels, (2) Check inverter display for error codes, (3) Look for new shadows (tree growth, new building), (4) Check if the net meter is working." },
    { question: "Can dust really reduce generation by 20%?", answer: "Yes. A thick dust layer acts like a curtain. Field tests in Tamil Nadu confirm 15-25% loss in neglected systems. Clean panels = more money." }
  ];

  const coastalFaqs = [
    { question: "How far from the coast do I need salt-resistant panels?", answer: "Within 10km of the Bay of Bengal, salt mist is significant. Areas like Devanampattinam, Silver Beach, Pondicherry White Town all need IEC 61701 Level 6 panels." },
    { question: "Can I upgrade my existing structure to galvanized?", answer: "Yes, but it's expensive. You'd need to dismantle panels, remove old structure, install new HDG structure. Usually costs 40% of original system price." },
    { question: "How do I know if my panels have coastal certification?", answer: "Check the module datasheet (PDF). Look for \"IEC 61701\" certification. The severity level should be mentioned. Demand this PDF from your installer." },
    { question: "Is aluminium better than galvanized steel?", answer: "For coastal areas, both work. Aluminium is lighter (good for sheet roofs), HDG is stronger (good for elevated/high-wind structures). We choose based on your specific roof." },
    { question: "Can salt damage already installed panels?", answer: "Yes. If panels aren't coastal-rated, you'll see white powder on frames (corrosion) and performance drops. Replace them before warranty expires." }
  ];

  const scamFaqs = [
    { question: "How do I verify if an installer is certified?", answer: "Ask for: (1) MNRE empanelment certificate, (2) Electrical Contractor License, (3) GST registration. Check PM Surya Ghar portal vendor list." },
    { question: "What if vendor disappears after installation?", answer: "Panel warranty is from manufacturer (not installer). Inverter warranty is from brand. Keep all original invoices and warranty cards safely." },
    { question: "Can I get subsidy if my installer isn't MNRE empanelled?", answer: "No. Only empanelled vendors appear on PM Surya Ghar portal. Using non-empanelled installer = zero subsidy." },
    { question: "How do I check if panels are genuine?", answer: "Scan QR code/barcode on panel. It should show manufacturer details. Fake panels have no QR or lead to random websites." },
    { question: "What's the safest payment method?", answer: "Pay in phases: 30% advance, 40% on installation, 30% after net meter. NEVER pay 100% upfront. Get signed receipts." }
  ];

  const futureFaqs = [
    { question: "Should I wait for better technology before buying?", answer: "No. Waiting means losing 2-3 years of free electricity. Current tech (Mono PERC, Hybrid inverters) is mature and will last 25 years." },
    { question: "Will perovskite panels be available soon in India?", answer: "Lab-stage only. Commercial availability is 5-10 years away. Buy proven tech today rather than waiting for future promises." },
    { question: "Are floating solar farms coming to Cuddalore?", answer: "Possible on Veeranam Lake or farm ponds, but this is for large MW-scale projects (government/commercial), not residential." },
    { question: "Will solar become cheaper in 2027?", answer: "Unlikely. Global silicon prices are rising. Panel prices may increase 5-10%. Buy now to lock current prices and start saving immediately." },
    { question: "What about vehicle-to-grid (V2G) systems?", answer: "Interesting for EV owners, but not mainstream yet. Focus on proven rooftop solar + net metering for now." }
  ];

  const bifacialFaqs = [
    { question: "Can I use Bifacial panels on a normal terrace roof?", answer: "Yes, but you need elevated structure (6-12 inches gap). Ground reflection adds 5-15% extra generation depending on roof color (white is best)." },
    { question: "Are Poly panels still sold in 2026?", answer: "Rarely. 95% of market is Mono PERC or Bifacial. Poly is outdated technology with lower efficiency." },
    { question: "Do Bifacial panels cost more?", answer: "Yes, ~10-15% more than Mono PERC. But the extra generation makes up the difference in 2-3 years." },
    { question: "Can I mix Mono and Bifacial in same system?", answer: "Technically yes, but not recommended. They have different voltage curves. Keep strings uniform for best performance." },
    { question: "Which panel type works best in Cuddalore's climate?", answer: "Mono PERC is standard. Bifacial if you have white terrace tiles or elevated structure. Both work well in hot climates." }
  ];

  const loansFaqs = [
    { question: "What's the minimum CIBIL score needed for a solar loan?", answer: "Most banks require 650+. If your score is lower, consider the PM Surya Ghar scheme which has subsidized rates." },
    { question: "Can I get a loan if I'm self-employed?", answer: "Yes. You need 2 years of ITR and business proof. Some NBFCs are more flexible than banks." },
    { question: "Is the interest tax-deductible?", answer: "For residential systems, no. But if you use solar for a home-based business, you can claim it as a business expense. Consult your CA." },
    { question: "Can I prepay the loan without penalty?", answer: "Most solar loans from Tata Capital, HDFC, yes. But check your sanction letter for prepayment clauses." },
    { question: "What if I sell the house before the loan is paid off?", answer: "The loan is tied to YOU, not the property. You must either: (1) Pay off the loan from the sale proceeds, or (2) Transfer the loan liability to the buyer (rare)." }
  ];

  const comparisonFaqs = [
    { question: "I have 2 ACs. Is 3kW enough or do I need 5kW?", answer: "If both ACs run simultaneously during the day, you need 5kW. If you use them in shifts (1 AC at a time), 3kW with good load management works." },
    { question: "Can I upgrade from 3kW to 5kW later?", answer: "Yes, but it's expensive. You'll need a new inverter, additional panels, and fresh TNEB liaisoning. It's cheaper to install the right size initially." },
    { question: "Will 3kW run my home during a power cut?", answer: "Standard On-Grid systems don't work during cuts. You need a Hybrid system with battery for backup. That costs 40% more than On-Grid." },
    { question: "My neighbor has 3kW and generates more units than me. Why?", answer: "Check for: (1) Shadow on your panels, (2) Dust accumulation, (3) Panel orientation (South is best), (4) Inverter efficiency. Ask us for a health check." },
    { question: "Can I run a submersible pump with 3kW?", answer: "A 1HP pump draws ~1kW. Yes, 3kW can run it during the day. But for agriculture, you might need 5-10kW depending on pump size." }
  ];

  const subsidyFaqs = [
    { question: "Can I apply if my electricity bill is in my father's name?", answer: "The subsidy and EB bill name must match. You have two options: (1) Transfer the EB connection to your name first, or (2) Open a joint bank account with your father for subsidy credit." },
    { question: "How long does TNEB take to approve feasibility?", answer: "In Cuddalore, feasibility approval is usually auto-generated within 3-7 days on the National Portal. Manual delays happen only if the local transformer is overloaded." },
    { question: "Can I get subsidy for a 5kW system?", answer: "Yes, you can install 5kW. But the subsidy is capped at ₹78,000 (for 3kW capacity). The extra 2kW gets no subsidy but still generates free power." },
    { question: "What if I already installed solar last year without knowing about the scheme?", answer: "Retroactive claims are not allowed. The subsidy application must be filed BEFORE installation. Existing systems are not eligible." },
    { question: "Is there a deadline for 2026?", answer: "The scheme is ongoing until the national target of 1 crore homes is met. However, apply early as processingcan slow down if there's a rush at year-end." }
  ];

  const resaleValueFaqs = [
    { question: "Does the bank value the solar system in a Home Loan?", answer: "Yes. Modern valuers include the cost of fixed assets like Solar Power Plants in the total valuation of the property. This helps the buyer get a higher loan amount." },
    { question: "What if the panels are 10 years old?", answer: "Solar panels have a life of 25 years. A 10-year-old system still has 15 years of life left. It usually operates at 90% efficiency. It is still a highly valuable asset." },
    { question: "Can I take the solar system with me to my new house?", answer: "Technically, yes. But financially, no. The cost of dismantling, transport, and re-installation (plus new liaisoning) is high. It is almost always better to sell it with the house (for a premium) and buy a brand new system for your new home." },
    { question: "Do I need to inform TNEB?", answer: "Only the standard name transfer is required. No special solar permission is needed to sell the house." },
    { question: "How much premium can I realistically ask?", answer: "Market data shows 4-6% premium in Cuddalore. For an ₹80 lakh property, that means ₹3-5 lakhs extra. The key is to market it explicitly as a \"Zero Bill Home\" in your listing." }
  ];

  const commercialTaxFaqs = [
    { question: "Can I claim depreciation if I'm under GST composition scheme?", answer: "Yes for income tax. It's separate from GST. Consult your CA to file ITR correctly." },
    { question: "Do I get depreciation every year?", answer: "Yes. 40% in Year 1 (WDV). Year 2 gets 40% of remaining value. Continues till asset value nears zero." },
    { question: "Can I claim both subsidy and depreciation?", answer: "Residential subsidies and commercial depreciation are separate schemes. If you install at factory/office, you get depreciation. Subsidy is only for homes." },
    { question: "What if I install solar before Sept 30?", answer: "You get 100% of the depreciation (40%) in that financial year. After Sept 30, you get only 50% (20%) that year." },
    { question: "Can a school or trust claim depreciation?", answer: "Yes, if they have taxable income from other activities. Non-profit trusts with zero tax liability gain nothing from depreciation." }
  ];

  const zedFaqs = [
    { question: "Can I use solar without net meter using ZED?", answer: "Yes. ZED ensures you only use what you generate. No export = no TNEB approval needed initially. But for subsidy, you need net meter eventually." },
    { question: "Does ZED reduce my generation?", answer: "No. It intelligently limits export. If you're consuming 2kW and generating 4kW, extra 2kW is curtailed instead of exported." },
    { question: "Can I remove ZED later after getting net meter?", answer: "Yes. Once net meter is installed, you can disable/remove the ZED function. The inverter works normally." },
    { question: "Which inverters have built-in ZED?", answer: "Deye, GoodWe, SolaX hybrids. Most modern inverters have this feature. Older models need external ZED module." },
    { question: "Is ZED legal in Tamil Nadu?", answer: "Yes. TNEB allows it as a temporary measure until net meter arrives. Final commissioning still needs TNEB approval." }
  ];

  const tnebBillFaqs = [
    { question: "Why is my bill not zero even with solar?", answer: "You pay fixed charges (₹20-150/month) + any excess consumption beyond generation. Check your net export vs import." },
    { question: "What happens to units I export to TNEB?", answer: "They are \"banked\" (stored as credit). You can use them in future months. Banking expires after 1 financial year." },
    { question: "Can I get cash for excess units?", answer: "No. TNEB doesn't pay for surplus. Design your system to match consumption, not overproduce." },
    { question: "How do I read the net meter display?", answer: "kWh received = What you imported from grid. kWh delivered = What you exported. Net = Delivered - Received." },
    { question: "My neighbor has same solar but lower bill. Why?", answer: "Compare: (1) System size, (2) Sanctioned load (fixed charges vary), (3) Billing cycle dates. Bills are personalized." }
  ];

  const enphaseFaqs = [
    { question: "Is Enphase available in Cuddalore?", answer: "Yes. Surya's Solar is a certified Enphase partner. We stock IQ8+ micro-inverters." },
    { question: "Can I monitor each panel separately?", answer: "Yes. The Enphase app shows panel-level generation. You can see exactly which panel is underperforming." },
    { question: "What is the warranty?", answer: "25 years on micro-inverters. Compared to 5-10 years on string inverters. This alone justifies the cost." },
    { question: "Can I expand my system later?", answer: "Easily. Add 1 panel + 1 micro-inverter at a time. No need to reconfigure strings like in traditional systems." },
    { question: "Does Enphase work during power cuts?", answer: "The IQ8+ model works with Encharge battery for backup. Standard IQ7 does not. Clarify your model." }
  ];

  const voltageFaqs = [
    { question: "How do I know if I have low voltage issues?", answer: "Buy a voltmeter (₹200). Check at 11 AM and 2 PM. If readings <190V consistently, you need Hybrid, not On-Grid." },
    { question: "Can I add battery to my existing On-Grid system?", answer: "Not directly. You need to replace the On-Grid inverter with a Hybrid inverter. We offer exchange discounts." },
    { question: "How much battery capacity do I need?", answer: "For 5 hours backup: 1kWh per kW of load. Example: 2kW load (fans, lights, TV) needs 10kWh battery." },
    { question: "Do Hybrid inverters work during power cuts?", answer: "Yes. They automatically switch to battery power. Your appliances keep running seamlessly." },
    { question: "Is Hybrid worth the extra cost?", answer: "If you live in Panruti/Vadalur with frequent voltage drops OR you want backup, yes. Else, stick with On-Grid." }
  ];

  const dcCableFaqs = [
    { question: "Can I use normal house wire for solar?", answer: "Never. House wire (PVC) degrades under UV. Solar DC cable has XLPO insulation rated for 25 years outdoors." },
    { question: "What is \"tinned copper\" and why does it matter?", answer: "Copper plated with tin. Prevents oxidation and galvanic corrosion in coastal climates like Cuddalore. Bare copper turns green and fails." },
    { question: "How do I verify if my installer used quality cable?", answer: "Check the cable print. It should say \"Solar Cable\", \"1.5kV DC\", and brand name (Polycab/Siechem). Silver-colored strands = tinned copper." },
    { question: "Can I reuse old solar cables if I upgrade?", answer: "If <5 years old AND UV-rated, yes. But cables are 10% of system cost. False  savings here risk your entire investment." },
    { question: "What is MC4 connector and is it really necessary?", answer: "It's a waterproof, click-lock connector standard in solar. Rated IP68. Using tape or wire nuts is illegal and fire-hazardous." }
  ];

  const earthingFaqs = [
    { question: "Can I use the same earthing pit for AC and DC?", answer: "No. IS 3043 mandates separate pits for safety. Sharing pits can cause dangerous back-currents during faults." },
    { question: "How do I test if my earthing is working?", answer: "Use an Earth Tester. Insert probes into the ground, measure resistance. Should be <5 Ohms. We do this for free during installation." },
    { question: "What happens if lightning strikes my panels?", answer: "The Lightning Arrester on the roof captures the surge and channels it to the LA earthing pit. Your panels and inverter are safe. This is why LA earthing is separate." },
    { question: "Do I need to water earthing pits?", answer: "Not if you use Chemical Earthing (BFC compound). It's maintenance-free. Salt/charcoal pits need monthly watering." },
    { question: "Can earthing pits corrode over time?", answer: "GI pipes corrode in 3-5 years. Copper-bonded rods last 15-20 years. We only use copper-bonded for durability." }
  ];

  const shadowFaqs = [
    { question: "Can I install panels if I have a coconut tree nearby?", answer: "It depends on the distance and height. Use the 2X rule: If tree is 30ft tall, panels should be 60ft away. We do free shadow analysis." },
    { question: "What if shadow only falls in the morning or evening?", answer: "Morning/evening shadow (before 9 AM, after 4 PM) causes minimal loss. Peak shadow (10 AM - 2 PM) is critical. Design your layout to avoid peak shadow." },
    { question: "Are Half-Cut panels more expensive?", answer: "They cost 5-10% more than standard panels, but the performance gain in partially shaded conditions easily justifies the cost." },
    { question: "Can I trim my neighbor's tree if it shades my panels?", answer: "Legally, no. Trees on their property are their right. Better solutions: Use Enphase micro-inverters or elevate your structure." },
    { question: "What is a Bypass Diode and how does it help?", answer: "It's a safety component inside the panel that reroutes current around shaded cells. Prevents hotspots and reduces loss. All good panels have them." }
  ];

  let faqs = costFaqs;
  const t = post.title.toLowerCase();

  if (t.includes("roi") || t.includes("calculator")) {
    faqs = roiFaqs;
  } else if (t.includes("brands") || t.includes("panel")) {
    faqs = brandsFaqs;
  } else if (t.includes("subsidy") || t.includes("scheme")) {
    faqs = subsidyFaqs;
  } else if (t.includes("inverter") && !t.includes("micro")) {
    faqs = inverterFaqs;
  } else if (t.includes("rust") || t.includes("coastal")) {
    faqs = coastalFaqs;
  } else if (t.includes("net meter") || t.includes("how to get tneb")) {
    faqs = netMeteringFaqs;
  } else if (t.includes("3kw") || t.includes("price") || t.includes("cost")) {
    faqs = comparisonFaqs;
  } else if (t.includes("generation")) {
    faqs = generationFaqs;
  } else if (t.includes("myth")) {
    faqs = mythsFaqs;
  } else if (t.includes("on-grid vs hybrid") || t.includes("system type")) {
    faqs = systemTypesFaqs;
  } else if (t.includes("hybrid") || t.includes("on-grid")) {
    faqs = inverterFaqs;
  } else if (t.includes("phase upgrade")) {
    faqs = phaseUpgradeFaqs;
  } else if (t.includes("loan") || t.includes("emi") || t.includes("finance")) {
    faqs = loansFaqs;
  } else if (t.includes("maintenance") || t.includes("clean")) {
    faqs = maintenanceFaqs;
  } else if (t.includes("scam") || t.includes("warning")) {
    faqs = scamFaqs;
  } else if (t.includes("future") || t.includes("trends")) {
    faqs = futureFaqs;
  } else if (t.includes("bifacial") || t.includes("mono")) {
    faqs = bifacialFaqs;
  } else if (t.includes("resale") || t.includes("value") || t.includes("real estate")) {
    faqs = resaleValueFaqs;
  } else if (t.includes("tax") || t.includes("depreciation") || t.includes("commercial")) {
    faqs = commercialTaxFaqs;
  } else if (t.includes("zero export") || t.includes("zed")) {
    faqs = zedFaqs;
  } else if (t.includes("tneb solar bill") || t.includes("import vs export")) {
    faqs = tnebBillFaqs;
  } else if (t.includes("enphase") || t.includes("micro-inverter")) {
    faqs = enphaseFaqs;
  } else if (t.includes("voltage") || t.includes("fluctuation")) {
    faqs = voltageFaqs;
  } else if (t.includes("cable") || t.includes("wire") || t.includes("fire")) {
    faqs = dcCableFaqs;
  } else if (t.includes("earthing") || t.includes("safety") || t.includes("lightning") || t.includes("grounding")) {
    faqs = earthingFaqs;
  } else if (t.includes("shadow") || t.includes("shading") || t.includes("tree")) {
    faqs = shadowFaqs;
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
        <title>{`${post.title} | Surya's Solar`}</title>
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
        <meta property="og:title" content={`${post.title} | Surya's Solar`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`https://suryassolar.com${post.featuredImage}`} />
        <meta property="og:url" content={`https://suryassolar.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Surya's Solar`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={`https://suryassolar.com${post.featuredImage}`} />
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
                  className="inline-flex items-center text-gray-500 hover:text-solar-orange transition-colors font-medium mb-8 mt-6 group"
                >
                  <svg
                    className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4 4-4m-4 4h18" />
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
                      priority={true}
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
