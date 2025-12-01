import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItemsDesktop = [
    { name: 'Home', href: '/' },
    // Services removed per requirement
    { name: 'Solar Calculator', href: '/calc' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blogs', href: '/blog' },
  ]

  const menuItemsMobile = [
    { name: 'Home', href: '/' },
    { name: 'Solar Calculator', href: '/calc' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blogs', href: '/blog' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-white/95 backdrop-blur-sm py-4'
          }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Clean Logo */}
            <Link href="/" className="flex items-center space-x-1 group">
              <div className="relative overflow-hidden w-12 h-12 flex items-center justify-center">
                <picture>
                  <source srcSet="/images/surya-solar-logo.webp" type="image/webp" />
                  <img
                    src="/images/surya-solar-logo.png"
                    alt="Surya's Solar Logo"
                    width="48"
                    height="48"
                    className="w-full h-full object-contain scale-150 group-hover:scale-[1.6] transition-transform duration-200"
                  />
                </picture>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-playfair font-bold text-xl text-accent uppercase tracking-wide leading-none">Surya's Solar</span>
                <span className="text-[0.65rem] text-primary font-bold uppercase tracking-[0.15em] leading-tight mt-0.5">Clean Energy Solutions</span>
              </div>
            </Link>

            {/* Clean Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItemsDesktop.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
                {/* Phone Button */}
                <a
                  href="tel:+917904369094"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 7904369094</span>
                </a>

                {/* CTA Button */}
                <Link
                  href="/#booking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Book Free Home Visit</span>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Clean Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'
          }`}
      >
        {/* Simple Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Clean Slide-in Menu Panel */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white transition-transform duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Branded Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-blue-600 font-bold text-lg">SS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-tight">SURYA'S SOLAR</span>
                <span className="text-xs text-blue-100">Clean Energy Solutions</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col bg-white">
            {menuItemsMobile.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-[15px] font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100"
              >
                {item.name}
              </Link>
            ))}

            {/* Call Button after Blogs */}
            <a
              href="tel:+917904369094"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mx-6 mt-4 mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              <span>Call +91 7904369094</span>
            </a>
          </nav>
        </div>
      </div>
    </>
  )
}
