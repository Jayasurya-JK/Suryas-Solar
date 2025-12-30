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
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
        <SolarCalculator showBreakdown={true} />
      </main>

      <WhatsAppFloat />
      <Footer />
    </>
  );
}
