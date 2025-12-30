import { useState } from 'react'
import Link from 'next/link'
import { FaInstagram } from 'react-icons/fa'

// Helper component for mobile accordion sections
const FooterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-800 md:border-none last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 md:py-0 md:mb-4 text-left group focus:outline-none"
      >
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <span className={`md:hidden transform transition-transform duration-300 text-primary ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 md:h-auto md:opacity-100 md:overflow-visible
          ${isOpen ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 md:max-h-none md:mb-0'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Solar Calculator', href: '/calc' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blogs', href: '/blog' },
  ]

  const services = [
    'Residential Solar',
    'Commercial Solar',
    'Solar Maintenance',
    'Government Subsidy',
    'Net Metering',
  ]

  const areasServed = [
    'Cuddalore',
    'Puducherry (Pondicherry)',
    'Neyveli Township',
    'Panruti',
    'Chidambaram',
    'Villupuram',
  ]

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/share/17h9eZYdQs/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/suryassolar.energy?igsh=Ymg5c2RsbWR3eTVp',
      icon: <FaInstagram className="w-5 h-5" />,
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/917904369094',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 pb-24 md:pb-0">
      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-5 md:gap-12">

          {/* Company Info - Always Visible */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative overflow-hidden w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg shrink-0">
                <picture>
                  <source srcSet="/images/surya-solar-logo.webp" type="image/webp" />
                  <img
                    src="/images/surya-solar-logo.webp"
                    alt="Surya's Solar Logo"
                    width="48"
                    height="48"
                    className="w-full h-full object-contain scale-125"
                  />
                </picture>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-playfair font-bold text-xl text-white uppercase tracking-wide leading-none">Surya's Solar</span>
                <span className="text-[0.65rem] text-gray-300 font-bold uppercase tracking-[0.15em] leading-tight mt-1">Clean Energy Solutions</span>
              </div>
            </div>
            <p className="text-sm mb-6">
              Cuddalore's most trusted solar company. Powering homes with clean, reliable, and affordable solar energy.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors block py-1 md:py-0"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Our Services */}
          <FooterSection title="Our Services">
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-sm py-1 md:py-0">
                  {service}
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Areas Served */}
          <FooterSection title="Areas Served">
            <ul className="space-y-2">
              {areasServed.map((area) => (
                <li key={area} className="text-sm py-1 md:py-0">
                  {area}
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Contact Us */}
          <FooterSection title="Contact Us">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 py-1 md:py-0">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Suryas+Solar+Cuddalore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur, Cuddalore - 607006
                </a>
              </li>
              <li className="flex items-center gap-2 py-1 md:py-0">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="flex flex-col">
                  <a href="tel:+917904369094" className="hover:text-primary transition-colors">
                    +91 7904369094
                  </a>
                  <a href="tel:+919655989595" className="hover:text-primary transition-colors">
                    +91 9655989595
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2 py-1 md:py-0">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:suryassolarenergy@gmail.com" className="hover:text-primary transition-colors">
                  suryassolarenergy@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 py-1 md:py-0">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon - Sat: 9:00 AM - 6:00 PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </FooterSection>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {currentYear} Surya's Solar. All rights reserved.</p>

          <p className="text-gray-500 text-xs md:text-sm">
            Designed & Developed by <span className="text-white font-semibold">Jay Web Studio</span>
          </p>

          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
