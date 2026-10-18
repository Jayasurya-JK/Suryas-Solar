import SectionHeading from './SectionHeading'

// Real Google reviews of Surya's Solar (all 5 stars). Names shortened to first name + initial.
// Source: Google Business Profile, 45 reviews, October 2026.
const GOOGLE_URL = 'https://maps.google.com/?cid=11101727010292054099'

const FEATURED = [
  { name: 'Sarathbabu T.', text: 'Affordable price, fast installation, good approach, overall marvelous.' },
  { name: 'Ramkumar', text: "Instant relief to electricity bill. Thank you Surya's Solar." },
  { name: 'Selvarasu S.', text: 'Good responsibility and perfect installation.' },
]

const SHORT = [
  { name: 'Raja S.', text: 'Good service and quality products' },
  { name: 'Kavitha', text: 'Excellent look' },
  { name: 'Hema Malini S.', text: 'Good service & excellent job' },
  { name: 'R. Padmanaban', text: 'Good work and excellent' },
  { name: 'Ganesan G.', text: 'Your work is excellent, keep it up' },
  { name: 'Muruganantham N.', text: 'Good work and very excellent' },
  { name: 'Sivaami V.', text: 'Excellent job, look is very good' },
  { name: 'Udhaya Kumar', text: 'Good work and service' },
]

const PHOTOS = [
  { src: '/images/installs/colourful-home.webp', alt: 'Rooftop solar on a family home installed by Surya\'s Solar' },
  { src: '/images/installs/large-array.webp', alt: 'Large rooftop solar array by Surya\'s Solar' },
  { src: '/images/installs/sunset-team.webp', alt: 'Surya\'s Solar team finishing an installation at sunset' },
]

const Stars = ({ className = 'w-4 h-4' }) => (
  <span className="inline-flex text-amber-400" aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" /></svg>
    ))}
  </span>
)

const G = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" /><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 010-4.22V7.05H2.18a11 11 0 000 9.9l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0012 1 11 11 0 002.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" /></svg>
)

export default function Testimonials() {
  return (
    <section className="py-14 md:py-20 bg-slate-50">
      <div className="container-custom">
        <SectionHeading eyebrow="Google reviews" title={<>Powered by trust, <span className="text-primary">chosen by customers</span></>} />

        {/* Rating summary */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black text-slate-900 leading-none">5.0</span>
            <div className="text-left">
              <Stars className="w-5 h-5" />
              <div className="mt-1 text-sm text-slate-600"><strong className="text-slate-900">45 Google reviews</strong> · 100% five-star</div>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-primary hover:text-primary transition-colors"><G />Read on Google</a>
            <a href="https://g.page/r/CVM40XnlQRGaEBM/review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">Write a review</a>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Featured quotes */}
          <div className="space-y-7">
            {FEATURED.map((r) => (
              <figure key={r.name} className="relative pl-6 border-l-2 border-amber-400">
                <blockquote className="text-xl sm:text-2xl font-semibold text-slate-900 leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-2.5 flex items-center gap-2 text-sm text-slate-500">
                  <Stars /> <span className="font-semibold text-slate-700">{r.name}</span> · <G /> Google review
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Installation photos */}
          <div>
            <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3 h-64 sm:h-80">
              {PHOTOS.map((p, i) => (
                <div key={p.src} className={`relative overflow-hidden rounded-2xl bg-slate-200 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                  <img src={p.src} alt={p.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">Recent rooftops installed by our team</p>
          </div>
        </div>

        {/* Short reviews */}
        <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
          {SHORT.map((r, i) => (
            <li key={r.name} className={`${i > 3 ? 'hidden sm:inline-flex' : 'inline-flex'} items-center gap-2 rounded-full bg-white border border-slate-200 pl-3 pr-4 py-2 text-sm shadow-sm`}>
              <span className="text-amber-400">★</span>
              <span className="text-slate-800">&ldquo;{r.text}&rdquo;</span>
              <span className="text-slate-400 whitespace-nowrap">· {r.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
