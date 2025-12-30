import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function TermsConditions() {
    return (
        <>
            <Head>
                <title>Terms & Conditions - Surya's Solar</title>
                <meta name="description" content="Service terms for Surya's Solar Cuddalore. Understand our installation policies, warranties, and jurisdiction details before booking." />

            </Head>

            <Header />

            <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
                <div className="container-custom max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
                        <p className="text-gray-500 mb-8">Last Updated: November 30, 2025</p>

                        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">1. General Terms</h2>
                                <p>
                                    By accessing and using the website of <strong>Surya's Solar</strong> (suryassolar.com), you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, please do not use our website.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information Accuracy</h2>
                                <p>
                                    The content provided on this website is for general information and use only. It is subject to change without notice. While we strive to keep information up to date, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the website or the information, products, or services contained on the website.
                                </p>
                            </section>

                            <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h2 className="text-xl font-bold text-blue-900 mb-3">3. Service & Installation Terms</h2>
                                <p className="font-medium text-blue-800">
                                    Please note that the terms listed here are generic website usage terms. Specific terms and conditions regarding solar installation, pricing, warranties, and subsidies will be provided and agreed upon <strong>after consultation</strong> and during the final agreement signing.
                                </p>
                                <p className="mt-2 text-sm text-blue-700">
                                    Every home and project is unique, and a tailored agreement will be created to suit your specific requirements.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
                                <p>
                                    This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
                                <p>
                                    Surya's Solar shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, or use of, the website.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">6. Governing Law</h2>
                                <p>
                                    These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts in Cuddalore, Tamil Nadu.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <WhatsAppFloat />
            <Footer />
        </>
    )
}
