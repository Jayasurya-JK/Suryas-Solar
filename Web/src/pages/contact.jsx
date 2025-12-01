import Head from 'next/head'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: '',
        'bot-field': ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const netlifyFormData = new FormData()
            netlifyFormData.append('form-name', 'contact')
            Object.keys(formData).forEach(key => {
                netlifyFormData.append(key, formData[key])
            })

            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(netlifyFormData).toString()
            })

            setShowSuccess(true)
            setFormData({ name: '', email: '', mobile: '', message: '' })
        } catch (error) {
            console.error('Form submission error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Head>
                <title>Contact Us - Surya's Solar | Cuddalore</title>
                <meta name="description" content="Get in touch with Surya's Solar for all your solar energy needs in Cuddalore. Visit our office or call us for a free consultation." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/surya-solar-logo.png" />
            </Head>

            <Header />

            <main className="bg-white pt-20">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-primary-600 to-primary-900 text-white py-12 md:py-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
                    </div>
                    <div className="container-custom relative z-10 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                            Have questions about going solar? We're here to help you every step of the way.
                        </p>
                    </div>
                </section>

                {/* Contact Info & Form Section */}
                <section className="py-10 md:py-20 bg-gray-50">
                    <div className="container-custom">
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                            {/* Contact Information */}
                            <div className="space-y-6 md:space-y-8">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                        Contact Information
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        Fill out the form or contact us directly using the details below.
                                    </p>
                                </div>

                                {/* Info Cards */}
                                <div className="grid gap-4 md:gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-md flex items-start gap-4 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                            📍
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                            <a
                                                href="https://www.google.com/maps/search/?api=1&query=Suryas+Solar+Cuddalore"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 text-sm md:text-base hover:text-primary transition-colors"
                                            >
                                                No.33, Sri Gokul Enterprises Building,<br />
                                                Nellikuppam Main Rd, Chavadi,<br />
                                                Kondur, Cuddalore - 607006
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-md flex items-start gap-4 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                            📞
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                            <div className="text-gray-600 text-sm md:text-base space-y-1">
                                                <a href="tel:+917904369094" className="block hover:text-primary-600 transition-colors">+91 7904369094</a>
                                                <a href="tel:+919655989595" className="block hover:text-primary-600 transition-colors">+91 9655989595</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-md flex items-start gap-4 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                                            📧
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                            <a href="mailto:suryassolarenergy@gmail.com" className="text-gray-600 text-sm md:text-base hover:text-primary-600 transition-colors break-all">
                                                suryassolarenergy@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 md:space-y-6"
                                    name="contact"
                                    method="POST"
                                    data-netlify="true"
                                    data-netlify-honeypot="bot-field"
                                >
                                    <input type="hidden" name="form-name" value="contact" />
                                    <p className="hidden">
                                        <label>
                                            Don't fill this out if you're human:
                                            <input
                                                name="bot-field"
                                                value={formData['bot-field']}
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </p>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                            <input
                                                type="tel"
                                                id="mobile"
                                                name="mobile"
                                                required
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="pb-10 md:pb-20 bg-gray-50">
                    <div className="container-custom">
                        <div className="h-80 md:h-96 w-full bg-gray-200 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                            <iframe
                                src="https://maps.google.com/maps?q=11.768513,79.733547&hl=en&z=16&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Surya's Solar Location"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <WhatsAppFloat
                phoneNumber="917904369094"
                message="Hi! I'd like to make an inquiry."
            />

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center transform transition-all scale-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                        <p className="text-gray-600 mb-6">
                            Thank you for contacting us. We'll get back to you shortly.
                        </p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
