import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { useEffect, useState } from 'react'

export default function AboutPage() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [cardsToShow, setCardsToShow] = useState(1)
    const [flippedCards, setFlippedCards] = useState({})

    const handleCardClick = (index) => {
        setFlippedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setCardsToShow(3)
            else if (window.innerWidth >= 768) setCardsToShow(2)
            else setCardsToShow(1)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % (9 - cardsToShow + 1))
        }, 3000)
        return () => clearInterval(timer)
    }, [cardsToShow])

    const partners = [
        { name: 'TATA Power Solaroof', logo: '/images/tata-solar-power.webp', logoWebP: '/images/tata-solar-power.webp', type: 'Official Partner' },
        { name: 'Premier Energies', logo: '/images/premier-energies.webp', logoWebP: '/images/premier-energies.webp', type: 'Solar Partner' },
        { name: 'Waaree', logo: '/images/waaree.webp', logoWebP: '/images/waaree.webp', type: 'Solar Partner' },
        { name: 'Adani Solar', logo: '/images/adani-power-.webp', logoWebP: '/images/adani-power-.webp', type: 'Solar Partner' }
    ]

    const whyChooseUs = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: '10+ Years of Experience',
            description: 'Decade-long expertise in solar installations across Cuddalore'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Strong Technical Team',
            description: 'Expert engineers and certified installers for quality work'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            title: 'Residential Rooftop Experts',
            description: 'Specialized in home solar installations with proven track record'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'PM Surya Ghar Official Vendor',
            description: 'Authorized vendor for government subsidy schemes'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            title: '100kW+ Installations',
            description: 'Successfully installed over 100kW across 50+ happy homes'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Trusted Brand Partners',
            description: 'Partnered with TATA, Premier, Waaree, and Adani for quality products'
        }
    ]

    return (
        <>
            <Head>
                <title>About Us - Surya's Solar | Cuddalore’s trusted residential solar expert</title>
                <meta
                    name="description"
                    content="Learn about Surya's Solar - Cuddalore's most trusted solar company with 10+ years of experience, 100kW+ installations, and official TATA Power Solaroof partner."
                />
                <meta name="keywords" content="solar company Cuddalore, TATA solar partner, PM Surya Ghar vendor, residential solar expert" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/surya-solar-logo.webp" />
                <link rel="canonical" href="https://suryassolar.com/about" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://suryassolar.com/about" />
                <meta property="og:title" content="About Surya's Solar - Cuddalore’s trusted residential solar expert" />
                <meta property="og:description" content="10+ years of experience, 100kW+ installations, Official TATA Power Solaroof Partner" />
                <meta property="og:image" content="https://suryassolar.com/images/og-home.webp" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://suryassolar.com/about" />
                <meta property="twitter:title" content="About Surya's Solar" />
                <meta property="twitter:description" content="Cuddalore's most trusted solar company with 10+ years of experience" />
                <meta property="twitter:image" content="https://suryassolar.com/images/og-home.webp" />
            </Head>

            <Header />

            <main className="bg-white pt-20">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12 md:py-28 overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-float-slow"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float-medium"></div>
                    </div>

                    <div className="container-custom relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 animate-fade-in leading-tight">
                                Cuddalore’s trusted residential solar expert
                            </h1>
                            <p className="text-lg md:text-2xl mb-6 md:mb-8 text-blue-100 animate-slide-up">
                                Powering homes with clean energy for over a decade
                            </p>
                            <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-base max-w-lg md:max-w-none mx-auto">
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full border border-white/20">
                                    ⭐ 10+ Years
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full border border-white/20">
                                    🏆 TATA Partner
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full border border-white/20">
                                    ⚡ 100kW+ Installed
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full border border-white/20">
                                    🏠 50+ Homes
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="py-10 md:py-20 bg-gray-50">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-gray-900">
                                Our Story
                            </h2>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                <p className="text-base md:text-xl mb-4 md:mb-6">
                                    Since our inception over a decade ago, <strong>Surya's Solar</strong> has been at the forefront of the solar revolution in Cuddalore. We started with a simple mission: to make clean, affordable solar energy accessible to every home in our community.
                                </p>
                                <p className="text-sm md:text-lg mb-4 md:mb-6">
                                    Today, we're proud to be <strong>Cuddalore’s trusted residential solar expert</strong>, having successfully installed over <strong>100kW of solar capacity</strong> across <strong>50+ happy homes</strong>. Our journey from a small local installer to an <strong>Official Partner of TATA Power Solaroof</strong> and an <strong>Official Vendor of PM Surya Ghar Muft Bijli Yojana</strong> reflects our commitment to excellence and customer satisfaction.
                                </p>
                                <p className="text-sm md:text-lg">
                                    What sets us apart is our <strong>specialized expertise in residential rooftop solar installations</strong>. We don't just install solar panels – we partner with homeowners to create customized energy solutions that maximize savings, minimize environmental impact, and provide energy independence for decades to come.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-10 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container-custom">
                        <h2 className="text-2xl md:text-5xl font-bold text-center mb-8 md:mb-16 text-gray-900">
                            Why Choose Surya's Solar?
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {whyChooseUs.map((item, index) => (
                                <div
                                    key={index}
                                    className="flip-card-container h-52 md:h-64 cursor-pointer"
                                    style={{ perspective: '1000px' }}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div
                                        className="flip-card-inner relative w-full h-full transition-transform duration-700 ease-out"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                        }}
                                    >
                                        {/* Front Side - Clean White with Icon */}
                                        <div
                                            className="flip-card-front absolute w-full h-full bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-4 md:p-6 flex flex-col items-center justify-center text-center"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                WebkitBackfaceVisibility: 'hidden'
                                            }}
                                        >
                                            {/* Icon with gradient background */}
                                            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-md">
                                                <div className="text-white scale-75 md:scale-100">
                                                    {item.icon}
                                                </div>
                                            </div>

                                            {/* Title with gradient text */}
                                            <h3 className="text-sm md:text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight px-2">
                                                {item.title}
                                            </h3>

                                            {/* Click indicator */}
                                            <div className="mt-3 md:mt-4 text-xs text-gray-400 animate-pulse">
                                                Tap to flip
                                            </div>
                                        </div>

                                        {/* Back Side - Elegant Gradient with Info */}
                                        <div
                                            className="flip-card-back absolute w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center justify-center"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                WebkitBackfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)'
                                            }}
                                        >
                                            {/* Small icon on back */}
                                            <div className="text-white/80 mb-2 md:mb-3 scale-75">
                                                {item.icon}
                                            </div>

                                            {/* Description */}
                                            <p className="text-xs md:text-sm text-white leading-relaxed text-center font-medium">
                                                {item.description}
                                            </p>

                                            {/* Decorative element */}
                                            <div className="mt-3 md:mt-4 w-12 h-1 bg-white/30 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </section>

                {/* Our Works Gallery Section */}
                <section className="py-10 md:py-20 bg-gray-50 overflow-hidden">
                    <div className="container-custom">
                        <h2 className="text-2xl md:text-5xl font-bold text-center mb-8 md:mb-16 text-gray-900">
                            Our Works
                        </h2>

                        <div className="relative max-w-6xl mx-auto">
                            {/* Carousel Container */}
                            <div className="overflow-hidden rounded-2xl shadow-xl bg-white p-2 md:p-4">
                                <div
                                    className="flex transition-transform duration-700 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)` }}
                                >
                                    {[
                                        '/images/1.webp', '/images/2.webp', '/images/3.webp',
                                        '/images/4.webp', '/images/5.webp', '/images/6.webp',
                                        '/images/7.webp', '/images/8.webp', '/images/9.webp'
                                    ].map((img, index) => (
                                        <div
                                            key={index}
                                            className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-2"
                                            style={{ flex: `0 0 ${100 / cardsToShow}%` }}
                                        >
                                            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden group">
                                                <img
                                                    src={img}
                                                    alt={`Solar Installation Project ${index + 1}`}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                    <span className="text-white font-medium">Project {index + 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Dots */}
                            <div className="flex justify-center mt-6 gap-2">
                                {[...Array(9 - cardsToShow + 1)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-primary-600 w-6 md:w-8' : 'bg-gray-300 hover:bg-primary-400'
                                            }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Partners Section */}
                <section className="py-10 md:py-20 bg-white">
                    <div className="container-custom">
                        <h2 className="text-2xl md:text-5xl font-bold text-center mb-4 md:mb-6 text-gray-900">
                            Our Trusted Partners
                        </h2>
                        <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
                            We partner with India's leading solar brands to deliver world-class quality and reliability
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
                            {partners.map((partner, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center group"
                                >
                                    <div className="mb-3 md:mb-4 relative h-16 md:h-20 w-full flex items-center justify-center">
                                        <picture>
                                            <source srcSet={partner.logoWebP} type="image/webp" />
                                            <img
                                                src={partner.logo}
                                                alt={partner.name}
                                                className="max-h-full max-w-full object-contain transition-all duration-300"
                                                loading="lazy"
                                            />
                                        </picture>
                                    </div>
                                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 md:px-3 py-1 rounded-full">
                                        {partner.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-10 md:py-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">
                                Ready to Go Solar?
                            </h2>
                            <p className="text-base md:text-xl mb-8 md:mb-12 text-blue-100">
                                Join 50+ happy homeowners who've made the switch to clean energy
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                                <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20">
                                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">📍</div>
                                    <h3 className="font-bold mb-2 text-sm md:text-base">Visit Us</h3>
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Suryas+Solar+Cuddalore"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs md:text-sm text-blue-100 hover:text-white transition-colors block"
                                    >
                                        No.33, Sri Gokul Enterprises Building,<br />
                                        Nellikuppam Main Rd, Chavadi,<br />
                                        Kondur, Cuddalore - 607006
                                    </a>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20">
                                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">📧</div>
                                    <h3 className="font-bold mb-2 text-sm md:text-base">Email Us</h3>
                                    <a
                                        href="mailto:suryassolarenergy@gmail.com"
                                        className="text-xs md:text-sm text-blue-100 hover:text-white transition-colors break-all"
                                    >
                                        suryassolarenergy@gmail.com
                                    </a>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20">
                                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">📞</div>
                                    <h3 className="font-bold mb-2 text-sm md:text-base">Call Us</h3>
                                    <p className="text-xs md:text-sm text-blue-100">
                                        <a href="tel:+917904369094" className="hover:text-white transition-colors">+91 7904369094</a><br />
                                        <a href="tel:+919655989595" className="hover:text-white transition-colors">+91 9655989595</a>
                                    </p>
                                </div>
                            </div>

                            <a
                                href="/#booking"
                                className="inline-block bg-accent hover:bg-accent-600 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
                            >
                                Book Free Home Visit
                            </a>
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
