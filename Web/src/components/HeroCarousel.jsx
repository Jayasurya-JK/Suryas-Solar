import { useState, useEffect, useRef } from 'react'

const slides = [
  {
    id: 1,
    imageDesktop: '/images/Banner_1_desktop.webp',
    imageDesktopWebP: '/images/Banner_1_desktop.webp',
    imageMobile: '/images/Banner_1_mobile.webp',
    imageMobileWebP: '/images/Banner_1_mobile.webp',
    headline: "Cuddalore's Most Trusted Residential Solar Experts",
    subhead: 'Power your home with clean, reliable solar energy. Save up to 90% on electricity bills.',
    primaryCTA: { text: 'Book Free Home Visit', href: '#booking' },
    secondaryCTA: { text: 'Get a Quote', href: '#booking' },
  },
  {
    id: 2,
    imageDesktop: '/images/Banner_3_desktop.webp',
    imageDesktopWebP: '/images/Banner_3_desktop.webp',
    imageMobile: '/images/Banner_3_mobile.webp',
    imageMobileWebP: '/images/Banner_3_mobile.webp',
    headline: 'Go Solar with PM Surya Ghar Subsidy + Easy EMI Support',
    subhead: 'We handle all paperwork, approvals, and installation—zero hassle for your family.',
    primaryCTA: { text: 'Book Free Home Visit', href: '#booking' },
    secondaryCTA: { text: 'Get a Quote', href: '#booking' },
  },
  {
    id: 3,
    imageDesktop: '/images/Banner_2_desktop.webp',
    imageDesktopWebP: '/images/Banner_2_desktop.webp',
    imageMobile: '/images/Banner_2_mobile.webp',
    imageMobileWebP: '/images/Banner_2_mobile.webp',
    headline: 'Trusted by Cuddalore Families for Clean, Reliable Solar',
    subhead: '25-year warranty. 50+ happy homes powered by the sun.',
    primaryCTA: { text: 'Book Free Home Visit', href: '#booking' },
    secondaryCTA: { text: 'Get a Quote', href: '#booking' },
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const announceRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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
      className="relative h-[550px] md:h-[650px] overflow-hidden pt-16"
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
          <div className="absolute inset-0 top-20">
            <picture>
              <source media="(min-width: 768px)" srcSet={slide.imageDesktopWebP} type="image/webp" />
              <source media="(min-width: 768px)" srcSet={slide.imageDesktop} />
              <source srcSet={slide.imageMobileWebP} type="image/webp" />
              <img
                src={slide.imageMobile}
                alt={slide.headline}
                width="800"
                height="666"
                className="w-full h-full object-cover object-top"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchpriority={index === 0 ? 'high' : 'auto'}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-end pb-20 md:pb-24">
            <div className="container-custom">
              <div className="max-w-3xl">
                {index === 0 ? (
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 animate-fade-in leading-tight">
                    {slide.headline}
                  </h1>
                ) : (
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 animate-fade-in leading-tight">
                    {slide.headline}
                  </h2>
                )}
                <p className="text-base md:text-xl text-white/90 animate-fade-in">
                  {slide.subhead}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container-custom">
          <div className="flex items-center justify-center">
            {/* Dots */}
            <div className="flex gap-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
