const partners = [
  { name: 'Tata Power Solar', logo: '/images/tata-solar-power.png', alt: 'Tata Power Solar - Authorized Dealer', tagline: 'Authorized Dealer', highlight: true },
  { name: 'Premier Energies', logo: '/images/Premier energies.png', alt: 'Premier Energies - Certified Partner', tagline: 'Solar Partner', highlight: false },
  { name: 'Waaree Energies', logo: '/images/waaree.png', alt: 'Waaree Energies - Official Partner', tagline: 'Solar Partner', highlight: false },
  { name: 'Adani Solar', logo: '/images/adani-power-.png', alt: 'Adani Solar - Official Partner', tagline: 'Solar Partner', highlight: false },
]

export default function Partners() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Official Partners & <span className="text-primary">Trusted Brands</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            We work with India's leading solar manufacturers
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
            >
              <div className="mb-4 h-24 md:h-32 lg:h-36 w-full flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
              <div className="text-center mt-2">
                {partner.highlight ? (
                  <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full shadow-lg">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[10px] md:text-sm font-bold text-white tracking-wide whitespace-nowrap">
                      {partner.tagline}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs md:text-sm font-medium text-gray-500">
                    {partner.tagline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
