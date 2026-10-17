import Head from 'next/head';
import SolarCalculator from '../components/SolarCalculator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function CalcPage() {
  return (
    <>
      <Head>
        <title>Solar Savings Calculator Tamil Nadu 2026 | Surya's Solar</title>
        <meta
          name="description"
          content="Free solar savings calculator for Tamil Nadu 2026. Enter your EB bill to get system size, yearly savings and payback after the ₹1 lakh subsidy, using TNEB slabs."
        />
        <link rel="canonical" href="https://www.suryassolar.com/calc" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.suryassolar.com/calc" />
        <meta property="og:title" content="Solar Savings Calculator - Tamil Nadu 2026" />
        <meta property="og:description" content="Enter your EB bill and see the solar size you need, yearly savings and payback after the ₹1 lakh subsidy." />
        <meta property="og:image" content="https://www.suryassolar.com/images/solar-roi-calculator-break-even-analysis.webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
        <SolarCalculator showBreakdown={true} headingLevel="h1" />

        {/* FAQ Section specific to Calculator */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-8 sm:mb-10">
              Common Questions About Solar Savings
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">How accurate is this calculator?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  It converts your bill into units using TNEB bi-monthly slab rates, assumes about 1,500 units per kW per year of Tamil Nadu sunshine (about 4 units a day), and uses market-average system prices as of October 2026. Generation varies by season, so treat it as a close estimate; we confirm with a free site visit.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Does this include the subsidy?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Yes. The payback already deducts the subsidy for an eligible Tamil Nadu home: up to <strong>₹1 lakh</strong> (₹78,000 PM Surya Ghar + ₹22,000 TN top-up) for 3kW and above. Puducherry homes get up to ₹78,000. <a href="/subsidy-eligibility" className="text-primary font-medium hover:underline">Check your eligibility</a>.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">3kW vs 5kW: Which do I need?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If your bi-monthly bill is about <strong>₹3,000 - ₹6,000</strong>, a <strong>3kW system</strong> (12-15 units a day) is usually right. If it is <strong>₹8,000 or more</strong> or you run two or more ACs, a <strong>5kW system</strong> (20-25 units a day) is recommended. Both get the full ₹1 lakh subsidy.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">What is the "Payback Period"?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The payback period is the time it takes for your bill savings to repay the system cost after the subsidy. For homes with AC and bills above ₹4,000 bi-monthly it is typically <strong>3.5 to 4.5 years</strong>; smaller bills take 5-6 years. After that, the savings are yours for 20+ years.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm mb-4">
                Still have questions? Our experts are here to help.
              </p>
              <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                Contact an Expert
              </a>
            </div>
          </div>
        </section>

        {/* SEO Text Block for Solar ROI Calculations */}
        <section className="bg-white py-12 border-t border-slate-100">
          <div className="container-custom max-w-4xl mx-auto text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Precision Solar ROI & Savings Calculation in Tamil Nadu</h2>
            <div className="text-slate-600 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Calculating your accurate solar return on investment (ROI) is the most critical step before installing a rooftop solar plant. Our advanced solar savings calculator is specifically calibrated for TNEB (Tamil Nadu Generation and Distribution Corporation) bi-monthly billing slabs and the high solar irradiance levels typical of districts like Cuddalore, Villupuram, and Puducherry. By inputting your average electricity bill, our tool instantly computes the optimal system size-whether it is a compact 3kW setup for standard homes or a robust 5kW to 10kW system for high-consumption households running multiple air conditioners.
              </p>
              <p>
                Beyond basic generation estimates, understanding the financial impact of the subsidy is vital. In 2026, eligible Tamil Nadu homes get up to ₹1 lakh (₹78,000 from PM Surya Ghar Muft Bijli Yojana plus the ₹22,000 Tamil Nadu top-up), bringing the typical break-even point for AC homes down to about 3.5 to 4.5 years. Once the system pays for itself, you will enjoy over two decades of virtually free electricity, protected against future TNEB tariff hikes. Use this calculator as your initial guide, and contact Surya's Solar for a comprehensive, on-site technical feasibility and shadow analysis.
              </p>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppFloat />
      <Footer />
    </>
  );
}
