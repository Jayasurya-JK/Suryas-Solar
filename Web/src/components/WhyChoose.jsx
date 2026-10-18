import { openBooking } from './BookingModal'

// Annotated rooftop: each marker points at a real part of one of our installations.
const PINS = [
  { n: 1, x: 47, y: 38, short: 'Tier-1 panels', label: 'Tier-1 DCR panels', text: 'TATA, Adani or Waaree modules that qualify for the subsidy', lx: 22, zone: 'top' },
  { n: 2, x: 80, y: 33, short: 'Tilted to sun', label: 'Tilted to the sun', text: 'Angle set for Cuddalore sunlight', lx: 80, zone: 'top' },
  { n: 3, x: 54.5, y: 73, short: 'Galvanized steel', label: 'Galvanized steel', text: 'Hot-dip galvanized structure that resists coastal rust', lx: 50, zone: 'bottom' },
  { n: 4, x: 30, y: 62, short: 'Raised frame', label: 'Raised off the roof', text: 'Room to clean, no water pooling under the panels', lx: 15, zone: 'bottom' },
  { n: 5, x: 72, y: 80, short: 'Anchored base', label: 'Anchored footing', text: 'Concrete pedestals built for cyclone winds', lx: 85, zone: 'bottom' },
]

// Diagram geometry in one unit system (width 100) so lines stay true at every screen size.
const PHOTO_H = 46.17 // photo is 1200 x 554
const TOP = 15 // label strip above the photo
const BOTTOM = 17 // label strip below the photo
const TOTAL_H = TOP + PHOTO_H + BOTTOM
const pinY = (y) => TOP + (y / 100) * PHOTO_H
const labelY = (zone) => (zone === 'top' ? TOP / 2 : TOP + PHOTO_H + BOTTOM / 2)
const pct = (v) => `${(v / TOTAL_H) * 100}%`

const REASONS = [
  { title: 'Official TATA & Exide partner', d: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z' },
  { title: 'Subsidy and net meter paperwork, done for you', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'We stay on call after installation', d: 'M18.36 5.64a9 9 0 11-12.73 0M12 2v10' },
]

const BANKS = [
  { name: 'SBI', src: '/images/SBI.webp' },
  { name: 'Union Bank', src: '/images/union-bank.webp' },
  { name: 'Canara Bank', src: '/images/canara-bank.webp' },
  { name: 'Indian Bank', src: '/images/indian-bank.webp' },
  { name: 'Bank of Maharashtra', src: '/images/bank-of-maharastra.webp' },
  { name: 'Indian Overseas Bank', src: '/images/indian-overseas-bank.webp' },
]

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-20">
      <div className="relative container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            <span className="w-6 h-px bg-amber-500" />Why choose Surya&apos;s Solar<span className="w-6 h-px bg-amber-500" />
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">Rooftop Solar Installer in Cuddalore</h2>
          <p className="mt-3 text-slate-600 md:text-lg">Don&apos;t take our word for it. Here is what goes into every system we build.</p>
        </div>

        {/* Proof diagram: markers on the photo, lines out to labels */}
        <figure className="mt-6 md:mt-8 max-w-5xl mx-auto">
          <div className="relative w-full" style={{ aspectRatio: `100 / ${TOTAL_H}` }}>
            <div className="absolute inset-x-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-slate-200" style={{ top: pct(TOP), height: pct(PHOTO_H) }}>
              <img src="/images/installs/raised-structure.webp" alt="Rooftop solar installed by Surya's Solar on a raised galvanized structure" loading="lazy" className="block w-full h-full object-cover" />
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 100 ${TOTAL_H}`} preserveAspectRatio="none" aria-hidden="true">
              {PINS.map((p) => {
                const y1 = pinY(p.y)
                const y2 = p.zone === 'top' ? labelY('top') + 2.4 : labelY('bottom') - 2.4
                return (
                  <g key={p.n}>
                    <line x1={p.x} y1={y1} x2={p.lx} y2={y2} stroke="white" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.9" />
                    <line x1={p.x} y1={y1} x2={p.lx} y2={y2} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </g>
                )
              })}
            </svg>

            {PINS.map((p) => (
              <span key={`pin-${p.n}`} className="absolute -translate-x-1/2 -translate-y-1/2 flex w-5 h-5 sm:w-6 sm:h-6" style={{ left: `${p.x}%`, top: pct(pinY(p.y)) }}>
                <span className="absolute inset-0 rounded-full bg-amber-300/60 animate-ping motion-reduce:animate-none" style={{ animationDuration: '2.6s' }} />
                <span className="relative w-full h-full rounded-full bg-amber-400 ring-2 ring-white shadow" />
              </span>
            ))}

            {PINS.map((p) => (
              <span key={`label-${p.n}`} className="absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2 py-1 sm:px-3 sm:py-1.5 shadow-md ring-1 ring-amber-200 text-[10px] sm:text-sm font-bold text-slate-900" style={{ left: `${p.lx}%`, top: pct(labelY(p.zone)) }}>
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-[9px] sm:text-[11px] font-black flex items-center justify-center">{p.n}</span>
                <span className="sm:hidden">{p.short}</span>
                <span className="hidden sm:inline">{p.label}</span>
              </span>
            ))}
          </div>
          <figcaption className="mt-1 text-xs text-slate-500 text-center">One of our installations in Cuddalore. Every system is built this way.</figcaption>
        </figure>

        {/* What each marker means */}
        <ol className="mt-8 max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-5">
          {PINS.map((p) => (
            <li key={p.n} className="flex gap-3">
              <span className="w-7 h-7 shrink-0 rounded-full bg-amber-400 text-xs font-black text-slate-900 flex items-center justify-center">{p.n}</span>
              <div>
                <div className="font-bold text-slate-900 leading-snug">{p.label}</div>
                <p className="mt-0.5 text-sm text-slate-500 leading-snug">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Beyond the roof */}
        <ul className="mt-10 max-w-5xl mx-auto flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-x-8 gap-y-3 border-t border-slate-200 pt-8">
          {REASONS.map((r) => (
            <li key={r.title} className="flex items-center gap-2.5">
              <svg className="w-5 h-5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={1.9} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={r.d} /></svg>
              <span className="font-semibold text-slate-800">{r.title}</span>
            </li>
          ))}
        </ul>

        {/* Subsidy + financing */}
        <div className="mt-12 rounded-3xl bg-slate-50 ring-1 ring-slate-200 text-slate-900 p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.6-4.02A11.96 11.96 0 0112 2.94a11.96 11.96 0 01-8.6 3.04A12 12 0 003 9c0 5.6 3.83 10.3 9 11.62 5.17-1.33 9-6.03 9-11.62 0-1.04-.13-2.05-.38-3.02z" /></svg>
              Government-approved PM Surya Ghar loans
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold leading-tight">Solar subsidy and easy financing</h3>
            <dl className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <dt className="sr-only">Subsidy</dt>
                <dd className="text-2xl sm:text-4xl font-black text-primary leading-none">₹1 lakh</dd>
                <dd className="mt-1.5 text-xs sm:text-sm text-slate-500">subsidy, paperwork done for you</dd>
              </div>
              <div>
                <dt className="sr-only">Interest</dt>
                <dd className="text-2xl sm:text-4xl font-black text-primary leading-none">6.75%*</dd>
                <dd className="mt-1.5 text-xs sm:text-sm text-slate-500">interest from</dd>
              </div>
              <div>
                <dt className="sr-only">Tenure</dt>
                <dd className="text-2xl sm:text-4xl font-black text-primary leading-none">10 yrs</dd>
                <dd className="mt-1.5 text-xs sm:text-sm text-slate-500">flexible tenure</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm text-slate-600">100% loan support from our team. 100+ local families have already used bank loans with us.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={openBooking} className="inline-flex items-center justify-center rounded-full bg-solar-orange px-6 py-3.5 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors">
                Book a free consultation
              </button>
              <button type="button" onClick={openBooking} className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3.5 font-semibold text-slate-800 hover:border-primary hover:text-primary transition-colors">
                Apply for a solar loan
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">*T&amp;C apply. Rates subject to bank approval.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Our banking partners</p>
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {BANKS.map((b) => (
                <li key={b.name} className="flex flex-col items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 px-2 py-3 text-center">
                  <img src={b.src} alt={b.name} loading="lazy" className="h-10 w-full object-contain" />
                  <span className="mt-1.5 text-[11px] sm:text-xs font-medium text-slate-500 leading-tight">{b.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
