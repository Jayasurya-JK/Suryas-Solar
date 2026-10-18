import SectionHeading from './SectionHeading'

// Brands we work with. No partnership labels on the page.
const BRANDS = [
  { name: 'Tata Power Solaroof', logo: '/images/tata-logo.webp' },
  { name: 'Exide Industries', logo: '/images/exide-logo.svg' },
  { name: 'Premier Energies', logo: '/images/premier-energies.webp' },
  { name: 'Waaree Energies', logo: '/images/waaree-logo.webp' },
  { name: 'Adani Solar', logo: '/images/adani-logo.webp' },
  { name: 'Loom Solar', logo: '/images/loom-logo.webp' },
]

// Compact logo row for use inside another section
export function BrandRow() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Brands we install</p>
      <ul className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
        {BRANDS.map((b) => (
          <li key={b.name} className="flex items-center justify-center h-14 rounded-xl bg-white ring-1 ring-slate-200/70 px-2">
            <img src={b.logo} alt={b.name} loading="lazy" className="max-h-8 w-full object-contain" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Partners() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        <SectionHeading eyebrow="Brands we install" title={<>Trusted <span className="text-primary">Brands</span> We Work With</>} subtitle="India's leading solar and battery manufacturers" />

        <ul className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5 max-w-6xl mx-auto">
          {BRANDS.map((b) => (
            <li
              key={b.name}
              className={`group flex items-center justify-center h-24 md:h-32 rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] px-5 md:px-7 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(15,75,214,0.25)] transition-all duration-300`}
            >
              <img src={b.logo} alt={b.name} loading="lazy" className="max-h-12 md:max-h-14 w-full max-w-[150px] object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
