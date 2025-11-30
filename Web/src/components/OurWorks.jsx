import { useState, useEffect } from 'react'

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
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden relative">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full mb-4">
                        Project Gallery
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        Our Recent <span className="text-primary">Installations</span>
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Witness the quality and precision of our solar installations across Cuddalore.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Carousel Container */}
                    <div className="overflow-hidden rounded-2xl shadow-xl bg-white p-2 md:p-4">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)` }}
                        >
                            {[
                                '/images/1.jpg', '/images/2.jpg', '/images/3.jpg',
                                '/images/4.jpg', '/images/5.jpg', '/images/6.jpg',
                                '/images/7.jpg', '/images/8.jpeg', '/images/9.jpg'
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
    )
}
