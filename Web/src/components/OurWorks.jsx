import { useState, useEffect } from 'react'
import SectionHeading from './SectionHeading'

export default function OurWorks() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [cardsToShow, setCardsToShow] = useState(1)

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

    return (
        <section className="py-14 md:py-20 bg-white overflow-hidden relative">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                
                
            </div>

            <div className="container-custom relative z-10">
                <SectionHeading className="mb-10 md:mb-12" eyebrow="Project gallery" title={<>Our Recent <span className="text-primary">Installations</span></>} subtitle="The quality and precision of our rooftop solar installations across Cuddalore." />

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
                                            alt={`Rooftop solar installation by Surya's Solar in Cuddalore district - project ${index + 1}`}
                                            loading="lazy"
                                            decoding="async"
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
    )
}
