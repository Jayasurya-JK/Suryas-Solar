import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - Surya's Solar</title>
                <meta name="description" content="Privacy Policy for Surya's Solar. Learn how we collect, use, and protect your personal information." />
                <link rel="icon" href="/images/Surya solar Logo.png" />
            </Head>

            <Header />

            <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
                <div className="container-custom max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                        <p className="text-gray-500 mb-8">Last Updated: November 30, 2025</p>

                        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                                <p>
                                    Welcome to <strong>Surya's Solar</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, and protect your data when you visit our website <strong>suryassolar.com</strong>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                                <p>We collect information that you voluntarily provide to us when you fill out forms on our website, such as:</p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li><strong>Personal Information:</strong> Name, phone number, email address, and location (pincode/city).</li>
                                    <li><strong>Service Details:</strong> Electricity bill amount and specific solar requirements.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                                <p>We use the information we collect for the following purposes:</p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>To schedule free home visits and consultations.</li>
                                    <li>To provide accurate solar quotations and savings estimates.</li>
                                    <li>To contact you regarding your inquiry via phone, email, or WhatsApp.</li>
                                    <li>To improve our website and customer service.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Protection</h2>
                                <p>
                                    We implement appropriate security measures to maintain the safety of your personal information. We do not sell, trade, or rent your personal identification information to third parties.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contact Us</h2>
                                <p>
                                    If you have any questions about this Privacy Policy, please contact us at:
                                </p>
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p><strong>Surya's Solar</strong></p>
                                    <p>No.33, Nellikuppam Main Rd, Kondur</p>
                                    <p>Cuddalore - 607002</p>
                                    <p>Email: suryassolarenergy@gmail.com</p>
                                    <p>Phone: +91 7904369094</p>
                                </div>
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
