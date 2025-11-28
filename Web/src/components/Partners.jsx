const partners = [
  { name: 'Adani Solar', logo: '/images/partner-logos/adani.png', alt: 'Adani Solar - Official Partner' },
  { name: 'Tata Power Solar', logo: '/images/partner-logos/tata.png', alt: 'Tata Power Solar - Authorized Dealer' },
  { name: 'Vikram Solar', logo: '/images/partner-logos/vikram.png', alt: 'Vikram Solar - Certified Installer' },
  { name: 'Waaree', logo: '/images/partner-logos/waaree.png', alt: 'Waaree Energies - Official Partner' },
  { name: 'Luminous', logo: '/images/partner-logos/luminous.png', alt: 'Luminous Solar - Authorized Partner' },
]

export default function Partners() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Official Partners & Trusted Brands
          </h2>
          <p className="text-gray-600">
            We work with India's leading solar manufacturers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.alt}
                className="max-w-full h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
