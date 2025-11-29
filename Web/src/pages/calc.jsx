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
          content="Calculate your potential solar energy savings with our easy-to-use calculator. Get instant estimates on system size, annual savings, and payback period." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <SolarCalculator showBreakdown={true} />
      </main>

      <WhatsAppFloat />
      <Footer />
    </>
  );
}
