import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { openBooking } from '../components/BookingModal'
import ProcessSteps from '../components/ProcessSteps'
import TrustMap from '../components/TrustMap'

const PRINCIPLES = [
    { title: 'Engineering first', text: 'Shadow check and load calculation before we quote, so your system is sized to your EB bill, not to a sales target.' },
    { title: 'Built for the coast', text: 'Hot-dip galvanized structures, 3 earthing pits and UV-rated DC cables for salt air and cyclone season.' },
    { title: 'DCR panels for the subsidy', text: 'We show you the datasheet and DCR certificate of the exact panel model before you decide.' },
    { title: 'Paperwork handled', text: 'PM Surya Ghar application, TNEB or PED net meter and subsidy follow-up, done by our own team.' },
    { title: 'Local service', text: 'Our office is in Kondur, Cuddalore, so we are close by when you need us after installation.' },
]

const STEPS = [
    { title: 'Free home visit', text: 'We check your roof, shade and EB bill.' },
    { title: 'Design and written quote', text: 'Exact panel, inverter and structure, itemised.' },
    { title: 'Installation', text: 'Usually 1-3 days on your terrace.' },
    { title: 'Net meter and subsidy', text: 'We follow up until the subsidy reaches your account.' },
]

const WORKS = [
    { src: '/images/1.webp', alt: 'Rooftop solar installation at sunset by Surya\'s Solar in Cuddalore', big: true },
    { src: '/images/3.webp', alt: 'Surya\'s Solar team on a completed rooftop solar system' },
    { src: '/images/2.webp', alt: 'Technician fixing solar panels on a raised structure' },
    { src: '/images/8.webp', alt: 'Rooftop solar installation in Madagadipet, Puducherry' },
    { src: '/images/9.webp', alt: 'Solar panels on a raised structure above a family home' },
    { src: '/images/6.webp', alt: 'Completed on-grid rooftop solar system', desktopOnly: true },
]

const FAQS = [
    { q: "Is Surya's Solar the same as Surya Solar or other \"Surya\" brands?", a: "No. Surya's Solar is an independent rooftop solar installer based in Kondur, Cuddalore. We are not connected to other companies or panel brands with \"Surya\" in their name. We are also not the government scheme \"PM Surya Ghar\"; we are a registered vendor that installs systems under it." },
    { q: "Is Surya's Solar a registered PM Surya Ghar vendor?", a: "Yes. Surya's Solar is registered on the official PM Surya Ghar portal, with 150+ installations and 500+ kWp installed in Cuddalore district." },
    { q: "Where is Surya's Solar located?", a: "No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur, Cuddalore - 607006. We are open Monday to Sunday, 9 AM to 8 PM." },
    { q: "Which areas do you serve?", a: "Cuddalore, Puducherry, Panruti, Neyveli, Chidambaram, Villupuram, Nellikuppam, Vadalur and nearby towns." },
    { q: "Which brands do you install?", a: "We are an official partner of TATA Power Solar and Exide. For subsidy homes we use DCR panels and show you the datasheets of the exact models before you decide." },
    { q: "Do you install solar for shops and businesses?", a: "Yes. We design on-grid and hybrid systems for shops, clinics, offices and schools as well as homes." },
]

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

const Check = () => (
    <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </span>
)

const WA_LINK = 'https://wa.me/917904369094?text=' + encodeURIComponent("Hi Surya's Solar, I'd like a free home visit for rooftop solar.")

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>About Surya's Solar | Rooftop Solar Installer in Cuddalore</title>
                <meta
                    name="description"
                    content="Surya's Solar is a rooftop solar installer in Kondur, Cuddalore: 10+ years in solar, 150+ PM Surya Ghar installations, official TATA Power Solar and Exide partner."
                />
                <link rel="canonical" href="https://www.suryassolar.com/about" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.suryassolar.com/about" />
                <meta property="og:title" content="About Surya's Solar - Rooftop Solar Installer in Cuddalore" />
                <meta property="og:description" content="10+ years in solar, 150+ PM Surya Ghar installations, official TATA Power Solar and Exide partner." />
                <meta property="og:image" content="https://www.suryassolar.com/images/1.webp" />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://www.suryassolar.com/about" />
                <meta property="twitter:title" content="About Surya's Solar" />
                <meta property="twitter:description" content="Rooftop solar installer in Kondur, Cuddalore. 150+ PM Surya Ghar installations, 10+ years in solar." />
                <meta property="twitter:image" content="https://www.suryassolar.com/images/1.webp" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            </Head>

            <Header />

            <main className="bg-white">
                {/* Hero */}
                <section className="pt-24 lg:pt-28 pb-12 lg:pb-16 bg-gradient-to-b from-blue-50 via-blue-50/60 to-white">
                    <div className="container-custom grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Registered PM Surya Ghar vendor · Cuddalore
                            </span>
                            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                                About Surya&apos;s Solar: <span className="text-primary">Cuddalore&apos;s rooftop solar team</span>
                            </h1>
                            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                                For over 10 years we have been putting solar on homes and businesses across Cuddalore district and Puducherry. We are a local team in Kondur that designs every system, installs it ourselves and handles the subsidy and net meter paperwork until the job is truly finished.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button type="button" onClick={openBooking} className="btn-primary text-base">
                                    Book Free Home Visit
                                </button>
                                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 hover:border-[#25D366] hover:text-[#128C7E] transition-colors">
                                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 01-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 01-1.45-5.03c0-5.22 4.25-9.46 9.48-9.46 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 012.77 6.69c0 5.22-4.25 9.46-9.46 9.46zm8.05-17.51A11.32 11.32 0 0012.04.66C5.77.66.66 5.76.66 12.04c0 2 .52 3.96 1.52 5.69L.57 23.34l5.73-1.5a11.36 11.36 0 005.73 1.46h.01c6.27 0 11.38-5.1 11.38-11.38 0-3.04-1.18-5.9-3.33-8.05z" /></svg>
                                    WhatsApp Us
                                </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                <Image src="/images/1.webp" alt="Rooftop solar installation by Surya's Solar in Cuddalore" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                            </div>
                            <div className="absolute -bottom-5 left-4 sm:left-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg border border-slate-100">
                                <div className="flex text-amber-400" aria-hidden="true">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" /></svg>
                                    ))}
                                </div>
                                <div className="text-sm leading-tight">
                                    <div className="font-bold text-slate-900">5.0 on Google</div>
                                    <div className="text-slate-500">45 reviews</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <TrustMap />

                {/* Story + principles */}
                <section className="container-custom py-14 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14">
                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Our story</h2>
                        <div className="mt-5 space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                Surya&apos;s Solar started in Cuddalore with one simple idea: a family should be able to switch to solar without worrying about the paperwork, the quality of the structure, or who to call when something needs attention.
                            </p>
                            <p>
                                Today we are a <strong className="text-slate-900">registered vendor on the PM Surya Ghar portal</strong> with <strong className="text-slate-900">150+ installations and 500+ kWp</strong> in Cuddalore district, and an <strong className="text-slate-900">official partner of TATA Power Solar and Exide</strong>.
                            </p>
                            <p>
                                Most of our work is residential rooftop solar. We also design on-grid and hybrid systems for shops, clinics, offices and schools.
                            </p>
                        </div>
                        <div className="mt-8 relative aspect-[4/3] max-w-md rounded-2xl overflow-hidden shadow-md">
                            <Image src="/images/4.webp" alt="The Surya's Solar installation team on a customer's terrace" fill sizes="(max-width: 1024px) 100vw, 28rem" className="object-cover" />
                        </div>
                    </div>
                    <div className="lg:pt-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                            <h3 className="text-xl font-extrabold text-slate-900">How we do solar</h3>
                            <ul className="mt-6 space-y-5">
                                {PRINCIPLES.map((p) => (
                                    <li key={p.title} className="flex gap-3">
                                        <Check />
                                        <div>
                                            <div className="font-bold text-slate-900">{p.title}</div>
                                            <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{p.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <ProcessSteps
                    title="From first call to subsidy"
                    subtitle="One team, start to finish."
                    steps={STEPS}
                />

                {/* Work gallery */}
                <section className="container-custom py-14 lg:py-20">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Our recent work</h2>
                            <p className="mt-3 text-slate-600">Real installations by our team across Cuddalore district and Puducherry.</p>
                        </div>
                        <Link href="/service-areas/cuddalore" className="text-primary font-semibold hover:underline">See our service areas</Link>
                    </div>
                    <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:auto-rows-[220px]">
                        {WORKS.map((w) => (
                            <div key={w.src} className={`relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3] lg:aspect-auto ${w.big ? 'col-span-2 lg:col-span-2 lg:row-span-2' : ''} ${w.desktopOnly ? 'hidden lg:block' : ''}`}>
                                <Image src={w.src} alt={w.alt} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Partners */}
                <section className="container-custom pb-14 lg:pb-20">
                    <div className="rounded-2xl border border-slate-200 p-6 sm:p-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Official partners</h2>
                            <p className="mt-3 text-slate-600 max-w-xl">
                                We are an official partner of TATA Power Solar and Exide. For subsidy homes we use DCR panels from leading Indian makers and show you the exact model before you decide.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:w-[28rem]">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center justify-center gap-3 h-32">
                                <img src="/images/tata-solar-power.webp" alt="TATA Power Solaroof" className="h-12 w-auto max-w-full object-contain" />
                                <span className="text-xs font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full">Official Partner</span>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center justify-center gap-3 h-32">
                                <div className="h-12 flex items-center text-2xl font-extrabold text-slate-800">Exide</div>
                                <span className="text-xs font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full">Official Partner</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Visit + CTA */}
                <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 lg:py-20">
                    <div className="container-custom grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">Visit us or book a free home visit</h2>
                            <p className="mt-3 text-blue-100 max-w-lg">
                                Bring your EB bill to our office, or let our engineer come to you. Homes can get up to <span className="font-bold text-yellow-300">₹1 lakh subsidy</span> (₹78,000 PM Surya Ghar + ₹22,000 Tamil Nadu top-up).
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button type="button" onClick={openBooking} className="inline-flex items-center justify-center rounded-full bg-solar-orange px-6 py-3 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors">
                                    Book Free Home Visit
                                </button>
                                <a href="tel:+917904369094" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10 transition-colors">
                                    Call +91 7904369094
                                </a>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { t: 'Office', body: <>No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur, Cuddalore - 607006</>, href: 'https://www.google.com/maps/search/?api=1&query=Suryas+Solar+Cuddalore', link: 'Open in Maps' },
                                { t: 'Hours', body: <>Monday to Sunday<br />9 AM - 8 PM</> },
                                { t: 'Phone', body: <><a href="tel:+917904369094" className="hover:underline">+91 7904369094</a><br /><a href="tel:+919655989595" className="hover:underline">+91 9655989595</a></> },
                                { t: 'Email', body: <a href="mailto:suryassolarenergy@gmail.com" className="hover:underline break-all">suryassolarenergy@gmail.com</a> },
                            ].map((c) => (
                                <div key={c.t} className="rounded-2xl bg-white/10 border border-white/15 p-5">
                                    <div className="text-xs font-bold uppercase tracking-wide text-blue-200">{c.t}</div>
                                    <div className="mt-2 text-sm leading-relaxed">{c.body}</div>
                                    {c.href && (
                                        <a href={c.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-yellow-300 hover:underline">{c.link}</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-14 lg:py-20">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 text-center">
                            About Surya&apos;s Solar: <span className="text-primary">FAQs</span>
                        </h2>
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

            <WhatsAppFloat
                phoneNumber="917904369094"
                message="Hi! I'd like to know more about Surya's Solar and your services."
            />
        </>
    )
}
