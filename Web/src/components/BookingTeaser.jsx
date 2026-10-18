import { openBooking } from './BookingModal'

// Compact homepage booking strip. The full form lives in the site-wide BookingModal.
const POINTS = ['Free roof and bill check', 'Written itemised quote', 'Subsidy paperwork handled']

export default function BookingTeaser() {
  return (
    <section id="booking" className="py-8 md:py-12 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden grid md:grid-cols-[1fr_1.2fr]">
          <div className="relative h-44 md:h-auto">
            <img
              src="/images/form-picture.webp"
              alt="Solar engineer explaining a rooftop solar plan"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
              <h2 className="text-white text-xl md:text-2xl font-bold leading-snug">Personalized Solar Plans &amp; Clear Paperwork</h2>
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <p className="text-slate-600">
              Get a tailored quotation and a smooth, high-quality installation from our own team. Open all 7 days, 9 AM - 8 PM.
            </p>
            <ul className="mt-4 space-y-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <button type="button" onClick={openBooking} className="btn-primary mt-6 w-full sm:w-auto text-base">
              Schedule Free Home Visit
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
