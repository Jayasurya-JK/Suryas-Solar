import Head from 'next/head';
import SolarCalculator from '../components/SolarCalculator';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function CalcPage() {
  return (
    <>
      <Head>
        <title>Solar Savings Calculator | Surya's Solar</title>
        <meta
          name="description"
          content="Free Solar Savings Calculator 2025. Compare 3kW vs 5kW ROI. Calculate exact electricity bill savings & payback period for Tamil Nadu / Puducherry homes."
        />
        <link rel="canonical" href="https://suryassolar.com/calc" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
        <SolarCalculator showBreakdown={true} />

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
                  Our calculations are based on real-world data from TNEB tariffs (₹7.8 avg/unit) and Tamil Nadu's average solar irradiation (approx. 4-5 units per kW per day). While actual generation varies by season, this gives a highly realistic estimate of your potential savings.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Does this include the subsidy?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The calculator provides a "System Cost" estimate that serves as a baseline. The <strong>PM Surya Ghar subsidy</strong> (up to ₹78,000) is deducted from your final quotation, significantly improving the ROI shown here.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">3kW vs 5kW: Which do I need?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If your bi-monthly bill is <strong>₹1,500 - ₹3,500</strong>, a <strong>3kW system</strong> is usually sufficient. If your bill is <strong>above ₹4,000</strong> or you run multiple ACs, a <strong>5kW system</strong> is recommended to reach a "Zero Bill" status.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">What is the "Payback Period"?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The payback period is the time it takes for your electricity bill savings to cover the total cost of installation. In Cuddalore, thanks to high sunlight and subsidies, this is typically just <strong>3 to 4 years</strong>. After that, your electricity is essentially free!
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
      </main>

      <WhatsAppFloat />
      <Footer />
    </>
  );
}
