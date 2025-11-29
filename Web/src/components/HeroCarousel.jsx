import { useState, useEffect, useRef } from 'react'

const slides = [
  {
    id: 1,
    image: '/images/hero-slide-1.jpg',
    headline: "Cuddalore's Most Trusted Residential Solar Experts",
    subhead: 'Power your home with clean, reliable solar energy. Save up to 90% on electricity bills.',
    primaryCTA: { text: 'Book Free Home Visit', href: '#booking' },
    secondaryCTA: { text: 'Get a Quote', href: '#booking' },
  },
  {
    id: 2,
    image: '/images/hero-slide-2.jpg',
    headline: 'Leading Rooftop Solar for Cuddalore Homes',
    subhead: 'Expert installation in 24 hours. Government subsidy assistance included.',
    primaryCTA: { text: 'Book Free Home Visit', href: '#booking' },
    secondaryCTA: { text: 'Get a Quote', href: '#booking' },
  },
  {
    id: 3,
    image: '/images/hero-slide-3.jpg',
    headline: 'Trusted by Cuddalore Families for Clean, Reliable Solar',
    subhead: '25-year warranty. 50+ happy homes powered by the sun.',
    primaryCTA: { text: 'Book Free Home Visit', href: '#booking' },
    secondaryCTA: { text: 'Get a Quote', href: '#booking' },
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const announceRef = useRef(null)

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [isPaused])

  useEffect(() => {
    if (announceRef.current) {
      announceRef.current.textContent = `Slide ${currentSlide + 1} of ${slides.length}: ${slides[currentSlide].headline}`
    }
  }, [currentSlide])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide()
    }
    if (touchStart - touchEnd < -75) {
      prevSlide()
    }
  }

  return (
    <section
      id="home"
      className="relative h-screen min-h-[600px] overflow-hidden pt-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Screen reader announcement */}
      <div
        ref={announceRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-start md:items-center pt-24 md:pt-0">
            <div className="container-custom">
              <div className="max-w-3xl">
                {index === 0 ? (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-fade-in leading-tight">
                    {slide.headline}
                  </h1>
                ) : (
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-fade-in leading-tight">
                    {slide.headline}
                  </h2>
                )}
                <p className="text-xl md:text-2xl text-white/90 mb-8 md:mb-10 animate-fade-in">
                  {slide.subhead}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
                  <a
                    href={slide.primaryCTA.href}
                    className="btn-primary text-center inline-block"
                  >
                    {slide.primaryCTA.text}
                  </a>
                  <a
                    href={slide.secondaryCTA.href}
                    className="btn-secondary text-center inline-block"
                  >
                    {slide.secondaryCTA.text}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide}
                />
              ))}
            </div>

            {/* Prev/Next Buttons */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-all"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-all"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-all ml-2"
                aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {isPaused ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
