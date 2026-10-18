import { useEffect, useRef, useState } from 'react'
import { openBooking } from './BookingModal'

const steps = [
  {
    id: 1,
    title: 'Free Home Visit',
    short: 'Roof, shade and EB bill check.',
    description: 'Our solar expert will visit your home and assess your rooftop for installation.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Personalized Quote',
    short: 'Written, itemised proposal.',
    description: 'Based on your energy requirements, our team will create a custom proposal for you.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Govt Paperwork & Subsidy Assistance',
    short: 'PM Surya Ghar and EB approvals, done for you.',
    description: 'We handle all paperwork for you and help for a smooth coordination with the local EB office.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'High-Quality Installation',
    short: 'Premium components, usually 1-3 days.',
    description: 'Professional installation with premium components, usually completed in 1-3 days.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Connection to the Grid',
    short: 'EB fixes the net meter, system goes live.',
    description: 'Seamless integration with the electricity board for net metering and grid connectivity.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Redeem Your Subsidy',
    short: 'We help you claim it to your bank.',
    description: 'System activated! Start saving on bills and we help you claim your subsidy amount.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function TimelineSteps() {
  const listRef = useRef(null)
  const [progress, setProgress] = useState(0)

  // Fill the line as the list scrolls through the middle of the screen
  useEffect(() => {
    const onScroll = () => {
      const el = listRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const mid = window.innerHeight * 0.6
      const p = (mid - r.top) / r.height
      setProgress(Math.max(0, Math.min(1, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const reached = (i) => progress >= (i + 0.35) / steps.length
  const active = steps.reduce((acc, _, i) => (reached(i) ? i : acc), -1)

  return (
    <section className="py-14 md:py-20 bg-slate-50">
      <div className="container-custom grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20">
        {/* Left: heading stays in view on desktop */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            <span className="w-6 h-px bg-amber-500" />How it works
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Solar installed in <span className="text-primary">6 easy steps</span>
          </h2>
          <p className="mt-4 text-slate-600 md:text-lg max-w-md">
            End-to-end support: design, installation and maintenance, with the complete subsidy paperwork.
          </p>
          <div className="mt-6 hidden lg:flex items-center gap-4">
            <button type="button" onClick={openBooking} className="btn-primary text-base">Start Your Solar Journey Today</button>
            <span className="text-sm text-slate-500">Usually 6-10 weeks, end to end</span>
          </div>
        </div>

        {/* Right: scroll-driven stepper */}
        <ol ref={listRef} className="relative">
          <span className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-slate-200 rounded-full" aria-hidden="true" />
          <span className="absolute left-[19px] top-3 w-[2px] rounded-full bg-gradient-to-b from-amber-400 via-primary to-primary transition-[height] duration-150 ease-out" style={{ height: `calc(${progress * 100}% - 12px)` }} aria-hidden="true" />
          {steps.map((step, i) => {
            const on = reached(i)
            return (
              <li key={step.id} className="relative flex gap-5 pb-8 last:pb-0">
                <span className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 ${on ? 'bg-primary text-white shadow-lg shadow-blue-500/30 scale-100' : 'bg-white text-slate-400 ring-2 ring-slate-200 scale-90'} ${i === active ? 'animate-[sunGlow_2.8s_ease-in-out_infinite] motion-reduce:animate-none' : ''}`}>
                  <span className="[&_svg]:w-5 [&_svg]:h-5">{step.icon}</span>
                  {on && i !== active && <span className="absolute inset-0 rounded-full ring-4 ring-primary/15" />}
                </span>
                <div className={`pt-1 transition-all duration-500 ${on ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-1'}`}>
                  <span className={`text-[11px] font-bold tracking-[0.18em] ${on ? 'text-amber-600' : 'text-slate-400'}`}>STEP {String(step.id).padStart(2, '0')}</span>
                  <h3 className="mt-0.5 text-lg md:text-xl font-bold text-slate-900 leading-snug">{step.title}</h3>
                  <p className="mt-1 text-sm md:hidden text-slate-500">{step.short}</p>
                  <p className="mt-1 hidden md:block text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="lg:hidden">
          <button type="button" onClick={openBooking} className="btn-primary w-full text-base">Start Your Solar Journey Today</button>
        </div>
      </div>
    </section>
  )
}
