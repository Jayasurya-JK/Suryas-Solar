import { openBooking } from './BookingModal'

// Compact "how it works" stepper: vertical timeline on phones, one horizontal row on desktop.
// steps: [{ title, text }]
export default function ProcessSteps({
    title,
    subtitle,
    steps,
    facts = ['Install: 1-3 days', 'Total: 6-10 weeks', 'Paperwork: we handle it'],
    cta = false,
    className = 'bg-slate-50',
}) {
    const cols = { 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' }[steps.length] || 'lg:grid-cols-4'

    return (
        <section className={`py-12 md:py-16 ${className}`}>
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">{title}</h2>
                        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
                    </div>
                    {facts.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {facts.map((f) => (
                                <span key={f} className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700">{f}</span>
                            ))}
                        </div>
                    )}
                </div>

                <ol className={`mt-6 lg:mt-8 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 lg:p-8 grid ${cols} gap-0 lg:gap-6`}>
                    {steps.map((s, i) => {
                        const last = i === steps.length - 1
                        return (
                            <li key={s.title} className="relative flex lg:flex-col gap-4 lg:gap-0 pb-5 last:pb-0 lg:pb-0">
                                {/* connector: vertical on phones, horizontal on desktop */}
                                {!last && (
                                    <>
                                        <span className="lg:hidden absolute left-4 top-9 bottom-0 w-px -translate-x-1/2 bg-primary/20" aria-hidden="true" />
                                        <span className="hidden lg:block absolute top-4 left-10 right-[-1.5rem] h-px bg-primary/20" aria-hidden="true" />
                                    </>
                                )}
                                <span className={`relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-black ${last ? 'bg-green-600 text-white' : 'bg-primary text-white'} ring-4 ring-white`}>
                                    {last ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    ) : i + 1}
                                </span>
                                <div className="min-w-0 lg:mt-4">
                                    <h3 className="font-bold text-slate-900 leading-snug">{s.title}</h3>
                                    <p className="mt-0.5 text-sm text-slate-600 leading-relaxed">{s.text}</p>
                                </div>
                            </li>
                        )
                    })}
                </ol>

                {cta && (
                    <div className="mt-6 text-center">
                        <button type="button" onClick={openBooking} className="btn-primary text-base">
                            Book Free Home Visit
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
