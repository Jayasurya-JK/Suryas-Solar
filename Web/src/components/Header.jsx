import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    {
      name: 'Locations',
      isDropdown: true,
      items: [
        { name: 'Cuddalore', href: '/service-areas/cuddalore' },
        { name: 'Puducherry', href: '/service-areas/puducherry' },
        { name: 'Panruti', href: '/service-areas/panruti' },
        { name: 'Neyveli', href: '/service-areas/neyveli' },
      ],
    },
    {
      name: 'Solar Systems',
      isDropdown: true,
      items: [
        { name: '5kW System — Best Seller', href: '/systems/5kw-solar-system-with-subsidy' },
        { name: '3kW System', href: '/systems/3kw-solar-system-with-subsidy' },
      ],
    },
    { name: 'Calculator', href: '/calc' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ]

  const mobileNavLinks = [
    { name: 'Home', href: '/' },
    {
      name: 'Locations',
      isDropdown: true,
      items: [
        { name: 'Cuddalore', href: '/service-areas/cuddalore' },
        { name: 'Puducherry', href: '/service-areas/puducherry' },
        { name: 'Panruti', href: '/service-areas/panruti' },
        { name: 'Neyveli', href: '/service-areas/neyveli' },
      ],
    },
    {
      name: 'Solar Systems',
      isDropdown: true,
      items: [
        { name: '5kW System — Best Seller', href: '/systems/5kw-solar-system-with-subsidy' },
        { name: '3kW System', href: '/systems/3kw-solar-system-with-subsidy' },
      ],
    },
    { name: 'Calculator', href: '/calc' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ]

  return (
    <>
      {/* ════════════════════════════════════════════════
          HEADER WRAPPER — fixed, 2-row on desktop
      ════════════════════════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>


        {/* ── Main nav bar ── */}

        <div className={`bg-white transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden">
                  <picture>
                    <source srcSet="/images/surya-solar-logo.webp" type="image/webp" />
                    <img
                      src="/images/surya-solar-logo.webp"
                      alt="Surya's Solar - Clean Energy Solutions"
                      width="48" height="48"
                      className="w-full h-full object-contain scale-[1.4] group-hover:scale-[1.5] transition-transform duration-200"
                    />
                  </picture>
                </div>
                <div>
                  <div className="font-playfair font-bold text-xl leading-tight text-accent">Surya's Solar</div>
                  <div className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.18em] leading-tight">Clean Energy Solutions</div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                {navLinks.map((item) => {
                  if (item.isDropdown) {
                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <button className={`flex items-center gap-1.5 px-4 py-2.5 text-[0.92rem] font-semibold rounded-lg transition-all whitespace-nowrap ${
                          openDropdown === item.name
                            ? 'text-primary bg-primary-50'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        }`}>
                          {item.name}
                          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180 text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Dropdown */}
                        <div className={`absolute top-full left-0 pt-1.5 z-50 transition-all duration-150 ${
                          openDropdown === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                        }`}>
                          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[200px]">
                            {item.items.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center px-5 py-3.5 text-[0.9rem] text-gray-700 hover:bg-primary-50 hover:text-primary font-medium transition-colors border-b border-gray-50 last:border-0"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2.5 text-[0.92rem] font-semibold text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all whitespace-nowrap"
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                <Link
                  href="/contact"
                  className="px-4 py-2.5 text-[0.9rem] font-semibold text-gray-700 hover:text-primary border border-gray-200 hover:border-primary rounded-xl transition-all whitespace-nowrap"
                >
                  Contact Us
                </Link>
                <Link
                  href="/#booking"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-700 text-white text-[0.9rem] font-bold hover:from-primary-600 hover:to-primary-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Free Home Visit
                </Link>
              </div>

              {/* Mobile controls */}
              <div className="flex lg:hidden items-center gap-2">
                <a href="tel:+917904369094" className="p-2 text-primary hover:bg-primary-50 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    }
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════════════ */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary-900 to-primary">
            <div className="flex items-center gap-3">
              <img src="/images/surya-solar-logo.webp" alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <div className="font-playfair font-bold text-white text-base">Surya's Solar</div>
                <div className="text-blue-200 text-xs">Clean Energy Solutions</div>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Phone banner */}
          <a href="tel:+917904369094" className="flex items-center justify-center gap-2 bg-solar-orange/10 border-b border-orange-100 py-3 text-solar-orange font-bold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +91 7904369094 — Tap to Call
          </a>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto py-2">
            {mobileNavLinks.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setOpenMobileDropdown(openMobileDropdown === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full px-6 py-4 text-[0.92rem] font-medium text-gray-800 hover:bg-primary-50 hover:text-primary transition-colors border-b border-gray-50"
                    >
                      <span>{item.name}</span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${openMobileDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Mobile Dropdown */}
                    <div className={`overflow-hidden transition-all duration-300 ${openMobileDropdown === item.name ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-8 py-3 text-[0.85rem] font-medium text-gray-600 hover:bg-primary-50 hover:text-primary transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-6 py-4 text-[0.92rem] font-medium text-gray-800 hover:bg-primary-50 hover:text-primary transition-colors border-b border-gray-50"
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
