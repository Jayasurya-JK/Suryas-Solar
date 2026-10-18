import { openBooking } from './BookingModal'

const FEATURES = [
  { title: 'End-to-end subsidy support', text: 'PM Surya Ghar Yojana documentation, portal updates and DISCOM approvals, plus the full subsidy and TNEB paperwork, made hassle-free.', tone: 'bg-primary-50 text-primary', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Official TATA Power Solar & Exide partner', text: 'Official TATA Power Solaroof partner, with Exide for batteries and systems.', tone: 'bg-amber-50 text-amber-600', d: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z' },
  { title: 'High-efficiency Tier-1 panels', text: 'Premium panels from TATA / Adani / Waaree for higher lifetime output.', tone: 'bg-green-50 text-green-600', d: 'M3 10h18M3 14h18m-9-4v8m-7-8v8m14-8v8M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z' },
  { title: 'Strong, coastal-grade mounting', text: 'High-strength structures built for harsh coastal weather, with 3-pit earthing for safety.', tone: 'bg-orange-50 text-orange-600', d: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Certified installation team', text: 'Our own trained engineers handle sizing, shadow analysis and installation.', tone: 'bg-violet-50 text-violet-600', d: 'M17 20h5v-2a3 3 0 00-5.36-1.86M17 20H7m10 0v-2c0-.66-.13-1.28-.36-1.86M7 20H2v-2a3 3 0 015.36-1.86M7 20v-2c0-.66.13-1.28.36-1.86m0 0a5 5 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Best-in-class after-sales service', text: 'After installation we stay on call for cleaning, checks and service.', tone: 'bg-sky-50 text-sky-600', d: 'M18.36 5.64a9 9 0 11-12.73 0M12 2v10' },
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
    <section className="py-14 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container-custom">
        {/* Story + photos */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative pb-10 sm:pb-12">
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] max-h-[560px] w-full rounded-3xl overflow-hidden shadow-xl">
              <img src="/images/installation-expert.webp" alt="Surya's Solar installation expert in Cuddalore" width="864" height="1081" loading="lazy" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
              <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow">
                <span className="w-2 h-2 rounded-full bg-green-500" />10+ Years Experience
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-5 pb-16 sm:p-6 sm:pb-16 sm:pr-48">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Trusted Rooftop Solar Partner</h3>
                <p className="mt-1 text-sm text-slate-200 leading-relaxed">With over a decade of expertise, we are trusted by satisfied residential and commercial customers.</p>
              </div>
            </div>
            <div className="hidden sm:block absolute -bottom-2 -right-2 lg:-right-6 w-44 lg:w-52 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              <img src="/images/2.webp" alt="Rooftop solar installation by Surya's Solar in Cuddalore" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-4 sm:left-6 flex items-center gap-4 rounded-2xl bg-white px-5 py-3.5 shadow-xl">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary leading-none">150+</p>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-tight">PM Surya Ghar<br />installations</p>
              </div>
              <span className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary leading-none">5.0<span className="text-amber-400 text-xl"> ★</span></p>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-tight">45 Google<br />reviews</p>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Why Choose Surya&apos;s Solar
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Rooftop Solar Installer in <span className="text-primary">Cuddalore</span>
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              For 10+ years, Surya&apos;s Solar has designed and installed on-grid and hybrid rooftop solar for homes, shops and offices across Cuddalore district and Puducherry, from our office in Kondur. We are a registered PM Surya Ghar vendor.
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              We handle every step: sizing from your EB bills, shadow analysis, coastal-grade structures, TNEB net meter and the full ₹1 lakh subsidy paperwork. After installation, we stay on call for service.
            </p>

            <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-3">
                  <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${f.tone}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={f.d} /></svg>
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-snug">{f.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-600 leading-relaxed">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button type="button" onClick={openBooking} className="btn-primary mt-7 text-base">
              Book a FREE solar consultation at home
            </button>
          </div>
        </div>

        {/* Financing */}
        <div className="mt-14 lg:mt-20 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden grid lg:grid-cols-[1.1fr_1fr]">
          <div className="p-6 sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-bold text-green-800">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" /></svg>
              Government Approved · PM Surya Ghar loans
            </span>
            <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900">Solar Subsidy + Easy Financing</h3>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Interest from <strong className="text-slate-900">6.75%</strong> with up to <strong className="text-slate-900">10 years</strong> financing. <strong className="text-slate-900">PM Surya Ghar Yojana</strong> support included. 100+ local families have already used bank loans with us.
            </p>
            <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              {[['6.75%*', 'Starting rate'], ['10 Years', 'Flexible tenure'], ['100%', 'Support']].map(([v, l]) => (
                <div key={l} className="px-2 py-3.5">
                  <div className="text-lg sm:text-2xl font-black text-primary">{v}</div>
                  <div className="text-xs sm:text-sm text-slate-500">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <button type="button" onClick={openBooking} className="inline-flex items-center justify-center gap-2 rounded-full bg-solar-orange px-6 py-3.5 font-bold text-white shadow-lg hover:bg-orange-600 transition-colors">
                Apply for Solar Loan
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <span className="text-xs text-slate-400">*T&amp;C apply. Rates subject to bank approval.</span>
            </div>
          </div>
          <div className="bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 sm:p-10 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-900">Trusted banking partners</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {BANKS.map((b) => (
                <div key={b.name} className="rounded-2xl bg-white border border-slate-200 p-3 flex flex-col items-center justify-center text-center shadow-sm">
                  <img src={b.src} alt={b.name} loading="lazy" className="h-10 sm:h-12 w-auto max-w-full object-contain" />
                  <span className="mt-2 text-[11px] sm:text-xs font-semibold text-slate-600 leading-tight">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
