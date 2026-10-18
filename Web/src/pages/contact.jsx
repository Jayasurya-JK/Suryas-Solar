import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

const WA_NUMBER = '917904369094'
const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Suryas+Solar+Kondur+Cuddalore'

const FAQS = [
    { q: 'Which areas do you serve?', a: 'Cuddalore, Puducherry, Panruti, Neyveli, Chidambaram, Villupuram, Nellikuppam, Vadalur and nearby towns. Call us with your location and we will confirm a site visit date.' },
    { q: 'Is the site visit really free?', a: 'Yes. Our engineer visits your home, checks the shadow-free roof area and your EB bill, and gives you a written quote. There is no obligation to buy.' },
    { q: 'Do you handle the PM Surya Ghar subsidy paperwork?', a: 'Yes. As a registered PM Surya Ghar vendor we handle the application, the TNEB or PED net meter and the subsidy follow-up for you.' },
    { q: 'What are your office hours?', a: 'Our office in Kondur, Cuddalore is open all 7 days, Monday to Sunday, 9 AM to 8 PM. You can also WhatsApp us any time and we will reply during office hours.' },
    { q: 'Can I visit your office?', a: 'Yes. Visit us at No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur, Cuddalore - 607006. Bring your latest EB bill so we can size your system on the spot.' },
]

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

const AREAS = [
    { name: 'Cuddalore', href: '/service-areas/cuddalore' },
    { name: 'Puducherry', href: '/service-areas/puducherry' },
    { name: 'Panruti', href: '/service-areas/panruti' },
    { name: 'Neyveli', href: '/service-areas/neyveli' },
    { name: 'Chidambaram', href: '/service-areas/chidambaram' },
    { name: 'Villupuram', href: '/service-areas/villupuram' },
]

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
)
const PHONE = 'M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z'
const PIN = 'M17.66 16.66L13.41 20.9a2 2 0 01-2.83 0l-4.24-4.24a8 8 0 1111.32 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z'
const MAIL = 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
const CLOCK = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
const WA_PATH = 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 01-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 01-1.45-5.03c0-5.22 4.25-9.46 9.48-9.46 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 012.77 6.69c0 5.22-4.25 9.46-9.46 9.46zm8.05-17.51A11.32 11.32 0 0012.04.66C5.77.66.66 5.76.66 12.04c0 2 .52 3.96 1.52 5.69L.57 23.34l5.73-1.5a11.36 11.36 0 005.73 1.46h.01c6.27 0 11.38-5.1 11.38-11.38 0-3.04-1.18-5.9-3.33-8.05z'

const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', mobile: '', town: '', message: '', botcheck: '' })
    const [error, setError] = useState('')
    const [status, setStatus] = useState('idle') // idle | sending | done

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const mobile = form.mobile.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
        if (!form.name.trim()) return setError('Please enter your name.')
        if (!/^[6-9]\d{9}$/.test(mobile)) return setError('Please enter a valid 10-digit mobile number.')
        setStatus('sending')
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: '111437b6-7422-4929-b9b3-b0361d387ee0', // Web3Forms Access Key
                    subject: 'New Contact Inquiry - Surya\'s Solar',
                    from_name: 'Suryas Solar Website',
                    source: 'contact page',
                    name: form.name.trim(),
                    mobile,
                    town: form.town.trim(),
                    message: form.message.trim(),
                    botcheck: form.botcheck,
                }),
            })
            if (!response.ok) throw new Error('Network response was not ok')
            if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'generate_lead', { form_name: 'contact_page' })
            setStatus('done')
        } catch (err) {
            console.error('Form submission error:', err)
            setStatus('idle')
            setError('Something went wrong. Please call or WhatsApp us on +91 7904369094.')
        }
    }

    return (
        <>
            <Head>
                <title>Contact Surya's Solar | Solar Installer in Kondur, Cuddalore</title>
                <meta name="description" content="Contact Surya's Solar in Kondur, Cuddalore. Call or WhatsApp +91 7904369094 for a free home visit and written quote. Open all 7 days, 9 AM - 8 PM." />
                <link rel="canonical" href="https://www.suryassolar.com/contact" />

                <meta property="og:title" content="Contact Surya's Solar | Kondur, Cuddalore" />
                <meta property="og:description" content="Call or WhatsApp +91 7904369094 for a free home visit and written quote. Open all 7 days, 9 AM - 8 PM." />
                <meta property="og:image" content="https://www.suryassolar.com/images/1.webp" />
                <meta property="og:url" content="https://www.suryassolar.com/contact" />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Contact Surya's Solar | Kondur, Cuddalore" />
                <meta name="twitter:description" content="Call or WhatsApp +91 7904369094 for a free home visit. Open all 7 days, 9 AM - 8 PM." />
                <meta name="twitter:image" content="https://www.suryassolar.com/images/1.webp" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            </Head>

            <Header />

            <main className="bg-white">
                <section className="pt-24 lg:pt-28 pb-14 lg:pb-20 bg-gradient-to-b from-blue-50 via-blue-50/60 to-white">
                    <div className="container-custom grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
                        {/* Heading (right on desktop, first on mobile) */}
                        <div className="lg:col-start-2 lg:row-start-1">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Open all 7 days · 9 AM - 8 PM
                            </span>
                            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                                Contact <span className="text-primary">Surya&apos;s Solar</span>, Cuddalore
                            </h1>
                            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                                Call, WhatsApp or send a message. We will help you size the right system, explain the up to ₹1 lakh subsidy and book a free home visit.
                            </p>
                        </div>

                        {/* Form (left on desktop) */}
                        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-36">
                            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8">
                                {status === 'done' ? (
                                    <div className="text-center py-6">
                                        <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <Icon d="M5 13l4 4L19 7" className="w-7 h-7" />
                                        </div>
                                        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Message sent</h2>
                                        <p className="mt-2 text-slate-600">Thank you, {form.name.split(' ')[0]}. Our team will call you back during office hours.</p>
                                        <a href={waLink(`Hi, I just sent a message on your website. My name is ${form.name}.`)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white hover:bg-[#1ebe5a] transition-colors">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_PATH} /></svg>
                                            Chat on WhatsApp now
                                        </a>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Send us a message</h2>
                                        <p className="mt-1 text-sm text-slate-500">We call back during office hours.</p>
                                        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                                            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} checked={!!form.botcheck} onChange={(e) => setForm({ ...form, botcheck: e.target.checked ? 'on' : '' })} tabIndex={-1} autoComplete="off" />
                                            <div>
                                                <label htmlFor="c-name" className="block text-sm font-semibold text-slate-700 mb-1">Your name</label>
                                                <input id="c-name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Your full name" />
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="c-mobile" className="block text-sm font-semibold text-slate-700 mb-1">Mobile number</label>
                                                    <input id="c-mobile" name="mobile" type="tel" inputMode="numeric" autoComplete="tel" value={form.mobile} onChange={handleChange} className={inputCls} placeholder="10-digit mobile" />
                                                </div>
                                                <div>
                                                    <label htmlFor="c-town" className="block text-sm font-semibold text-slate-700 mb-1">Town <span className="font-normal text-slate-400">(optional)</span></label>
                                                    <input id="c-town" name="town" type="text" value={form.town} onChange={handleChange} className={inputCls} placeholder="e.g. Cuddalore" />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="c-message" className="block text-sm font-semibold text-slate-700 mb-1">Message <span className="font-normal text-slate-400">(optional)</span></label>
                                                <textarea id="c-message" name="message" rows={4} value={form.message} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Your monthly EB bill, roof type or any question" />
                                            </div>
                                            {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
                                            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full text-base disabled:opacity-70 disabled:cursor-not-allowed">
                                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                                            </button>
                                            <p className="text-center text-sm text-slate-500">
                                                Prefer chat?{' '}
                                                <a href={waLink("Hi Surya's Solar, I have a question about rooftop solar.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#128C7E] hover:underline">WhatsApp us</a>
                                            </p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contact details (right on desktop) */}
                        <div className="lg:col-start-2 lg:row-start-2 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0"><Icon d={PHONE} /></span>
                                    <span>
                                        <span className="block text-xs font-semibold text-slate-400">Call us</span>
                                        <a href="tel:+917904369094" className="block font-bold text-slate-900 hover:text-primary">+91 7904369094</a>
                                        <a href="tel:+919655989595" className="block font-bold text-slate-900 hover:text-primary">+91 9655989595</a>
                                    </span>
                                </div>
                                <a href={waLink("Hi Surya's Solar, I have a question about rooftop solar.")} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[#25D366]/50 hover:shadow-md transition">
                                    <span className="w-11 h-11 rounded-xl bg-green-50 text-[#25D366] flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_PATH} /></svg>
                                    </span>
                                    <span>
                                        <span className="block text-xs font-semibold text-slate-400">WhatsApp</span>
                                        <span className="block font-bold text-slate-900 group-hover:text-[#128C7E]">Chat with us</span>
                                    </span>
                                </a>
                                <a href="mailto:suryassolarenergy@gmail.com" className="group sm:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-primary/40 hover:shadow-md transition min-w-0">
                                    <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0"><Icon d={MAIL} /></span>
                                    <span className="min-w-0">
                                        <span className="block text-xs font-semibold text-slate-400">Email</span>
                                        <span className="block font-bold text-slate-900 group-hover:text-primary truncate">suryassolarenergy@gmail.com</span>
                                    </span>
                                </a>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                                <div className="flex gap-3">
                                    <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0"><Icon d={PIN} /></span>
                                    <div>
                                        <div className="font-bold text-slate-900">Visit our office</div>
                                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur, Cuddalore - 607006, Tamil Nadu</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0"><Icon d={CLOCK} /></span>
                                    <div>
                                        <div className="font-bold text-slate-900">Office hours</div>
                                        <p className="mt-1 text-sm text-slate-600">Monday to Sunday · 9 AM - 8 PM</p>
                                    </div>
                                </div>
                                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-primary hover:text-primary transition-colors">
                                    <Icon d={PIN} className="w-4 h-4" />
                                    Get directions
                                </a>
                            </div>

                            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                                <span className="text-amber-600 shrink-0 mt-0.5"><Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></span>
                                <p className="text-sm text-amber-900">
                                    Tamil Nadu homes can get up to <strong>₹1 lakh subsidy</strong> (₹78,000 PM Surya Ghar + ₹22,000 TN top-up), limited to the first 1 lakh homes.{' '}
                                    <Link href="/subsidy-eligibility" className="font-semibold underline">Check eligibility</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map + areas */}
                <section className="container-custom pb-14 lg:pb-20 grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-10 items-stretch">
                    <div className="h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                        <iframe
                            src="https://maps.google.com/maps?q=Suryas%20Solar%2C%20Nellikuppam%20Main%20Rd%2C%20Kondur%2C%20Cuddalore%20607006&hl=en&z=15&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Surya's Solar office location on Google Maps"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Areas we serve</h2>
                        <p className="mt-3 text-slate-600 leading-relaxed">
                            From our office in Kondur we install rooftop solar across Cuddalore district, Villupuram and Puducherry. Being local means faster site visits, TNEB and PED net meter know-how, and quick service after installation.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {AREAS.map((a) => (
                                <Link key={a.href} href={a.href} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary transition-colors">
                                    {a.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-slate-50 py-14 lg:py-20">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 text-center">Questions before you call</h2>
                        <div className="mt-8 space-y-3">
                            {FAQS.map((f) => (
                                <details key={f.q} className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                    <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-4">
                                        {f.q}
                                        <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                                    </summary>
                                    <p className="mt-3 text-slate-600 leading-relaxed">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <WhatsAppFloat phoneNumber={WA_NUMBER} message="Hi! I'd like to make an inquiry." />
        </>
    )
}
