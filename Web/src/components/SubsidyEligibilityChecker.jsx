import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ConfettiBurst from './ConfettiBurst'

const WEB3FORMS_KEY = '111437b6-7422-4929-b9b3-b0361d387ee0'
const WHATSAPP_NUMBER = '917904369094'
const SUBSIDY_GUIDE = '/blog/2025-12-02-pm-surya-ghar-subsidy-tamil-nadu-puducherry'

const QUESTIONS = [
  {
    id: 'state',
    question: 'Where is your house?',
    options: [
      { value: 'tn', label: 'Tamil Nadu' },
      { value: 'py', label: 'Puducherry' },
      { value: 'other', label: 'Another state' },
    ],
  },
  {
    id: 'connection',
    question: 'What type of EB connection is it?',
    options: [
      { value: 'domestic', label: 'Home (domestic)' },
      { value: 'commercial', label: 'Shop, office or business' },
      { value: 'agri', label: 'Agricultural' },
    ],
  },
  {
    id: 'ownership',
    question: 'Do you own the house?',
    options: [
      { value: 'own', label: 'Yes, EB bill is in my name' },
      { value: 'family', label: 'Yes, but EB bill is in a family member\'s name' },
      { value: 'rented', label: 'No, I live on rent' },
    ],
  },
  {
    id: 'roof',
    question: 'What kind of roof do you have?',
    options: [
      { value: 'concrete', label: 'Concrete terrace' },
      { value: 'sheet', label: 'Sheet or tile roof' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
  {
    id: 'registration',
    question: 'Have you applied on the PM Surya Ghar portal?',
    options: [
      { value: 'no', label: 'Not yet' },
      { value: 'after', label: 'Yes, on or after 5 Aug 2026' },
      { value: 'before', label: 'Yes, before 5 Aug 2026' },
      { value: 'received', label: 'I already got a solar subsidy before' },
    ],
  },
  {
    id: 'bill',
    question: 'What is your EB bill for two months?',
    options: [
      { value: 'lt1000', label: 'Below ₹1,000' },
      { value: '1000-3000', label: '₹1,000 - ₹3,000' },
      { value: '3000-6000', label: '₹3,000 - ₹6,000' },
      { value: 'gt6000', label: 'Above ₹6,000' },
    ],
  },
]

const SIZE_BY_BILL = {
  lt1000: { kw: 2, label: '1-2kW' },
  '1000-3000': { kw: 3, label: '2-3kW' },
  '3000-6000': { kw: 3, label: '3kW' },
  gt6000: { kw: 5, label: '5kW' },
}

// PM Surya Ghar central subsidy and Tamil Nadu G.O. 102 top-up, by system size
const centralSubsidy = (kw) => (kw >= 3 ? 78000 : kw === 2 ? 60000 : 30000)
const tnTopUp = (kw) => (kw >= 3 ? 22000 : kw === 2 ? 10000 : 5000)

const rupees = (n) => `₹${n.toLocaleString('en-IN')}`

function getResult(a) {
  const size = SIZE_BY_BILL[a.bill]

  if (a.connection === 'agri') {
    return {
      status: 'no',
      headline: 'Agricultural connections are not covered',
      detail: 'PM Surya Ghar is only for home (domestic) connections. If you also have a home EB connection, you can apply for that house.',
    }
  }
  if (a.connection === 'commercial') {
    return {
      status: 'maybe',
      headline: 'No home subsidy, but solar still pays back fast',
      detail: 'Shops and offices do not get PM Surya Ghar subsidy, but businesses can claim accelerated depreciation tax benefits, and daytime use matches solar hours. We can work out your savings.',
    }
  }
  if (a.registration === 'received') {
    return {
      status: 'no',
      headline: 'The subsidy is given only once per home',
      detail: 'If your house already received a rooftop solar subsidy, it cannot be claimed again. We can still help you add more panels or service your existing system.',
    }
  }
  if (a.ownership === 'rented') {
    return {
      status: 'maybe',
      headline: 'The house owner needs to apply',
      detail: 'The subsidy goes to the owner whose name is on the EB connection. Share this with your house owner - we will guide them through it for free.',
    }
  }

  const getsTopUp = a.state === 'tn' && a.registration !== 'before'
  const central = centralSubsidy(size.kw)
  const topUp = getsTopUp ? tnTopUp(size.kw) : 0
  const total = central + topUp

  const notes = []
  if (a.state === 'tn' && a.registration === 'before') {
    notes.push('Applications made before 5 Aug 2026 get the central subsidy, but not the ₹22,000 Tamil Nadu top-up.')
  }
  if (a.state === 'py') {
    notes.push('The ₹22,000 top-up is a Tamil Nadu scheme and does not apply in Puducherry. Puducherry has reported its own state top-up (about ₹9,000-10,000 per kW); we confirm the current amount with PED.')
  }
  if (a.state === 'other') {
    notes.push('The central subsidy applies across India. We install in Cuddalore district and Puducherry, so pick a registered vendor near you.')
  }
  if (a.ownership === 'family') {
    notes.push('The EB bill must be in the applicant\'s name. A family member can apply, or we can guide you on the name transfer.')
  }
  if (a.roof === 'sheet') {
    notes.push('Sheet and tile roofs need a strong mounting structure. Our engineer checks this at the free site visit.')
  }
  if (a.roof === 'unsure') {
    notes.push('You need shade-free roof space (about 300 sq ft for 3kW). We check this at the free site visit.')
  }
  if (getsTopUp) {
    notes.push('The Tamil Nadu top-up is limited to the first 1 lakh eligible homes, so applying early is safer.')
  }

  return {
    status: 'yes',
    headline: `You look eligible for up to ${rupees(total)} subsidy`,
    detail: `Suggested system for your bill: ${size.label}.`,
    breakdown: [
      { label: 'PM Surya Ghar (central)', value: rupees(central) },
      ...(getsTopUp ? [{ label: 'Tamil Nadu top-up', value: rupees(topUp) }] : []),
      { label: 'Total subsidy', value: rupees(total), strong: true },
    ],
    notes,
    urgency: getsTopUp
      ? 'The ₹22,000 Tamil Nadu top-up is only for the first 1 lakh eligible homes, and families across Tamil Nadu are applying now. Book before it runs out.'
      : 'PM Surya Ghar is approved only till 31 March 2027, and installation takes a few weeks. Book early to be safe.',
  }
}

const STATUS_STYLES = {
  yes: 'bg-green-50 border-green-200 text-green-900',
  maybe: 'bg-amber-50 border-amber-200 text-amber-900',
  no: 'bg-slate-50 border-slate-200 text-slate-900',
}

// town: pre-fills the town and skips the "where is your house" question (used on town pages)
// source: page name sent with the lead email
export default function SubsidyEligibilityChecker({ town = '', source = 'Subsidy eligibility page' }) {
  const questions = town ? QUESTIONS.filter((q) => q.id !== 'state') : QUESTIONS
  const presetAnswers = town ? { state: town === 'Puducherry' ? 'py' : 'tn' } : {}

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(presetAnswers)
  const [lead, setLead] = useState({ name: '', mobile: '', town })
  const [showCelebration, setShowCelebration] = useState(false)
  const nameRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isDone = step >= questions.length
  const result = isDone ? getResult(answers) : null
  const current = questions[step]

  useEffect(() => {
    if (result && result.status === 'yes') setShowCelebration(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone])

  const claimNow = () => {
    setShowCelebration(false)
    setTimeout(() => {
      nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      nameRef.current?.focus({ preventScroll: true })
    }, 50)
  }

  const choose = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
    setStep((s) => s + 1)
  }

  const restart = () => {
    setStep(0)
    setAnswers(presetAnswers)
    setErrors({})
    setSubmitted(false)
  }

  const answerSummary = [
    ...(town ? [`Town page: ${town}`] : []),
    ...QUESTIONS.filter((q) => answers[q.id]).map((q) => {
      const opt = q.options.find((o) => o.value === answers[q.id])
      return `${q.question} ${opt ? opt.label : '-'}`
    }),
  ].join('\n')

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Surya's Solar, I checked my solar subsidy eligibility on your website.\n\n${answerSummary}\n\nResult: ${result ? result.headline : ''}\n\nPlease call me.`
  )}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!lead.name.trim()) newErrors.name = 'Please enter your name'
    if (!/^[6-9]\d{9}$/.test(lead.mobile)) newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setIsSubmitting(true)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Subsidy Eligibility Lead - ${lead.name}`,
          from_name: 'Suryas Solar Website',
          name: lead.name,
          mobile: lead.mobile,
          town: lead.town || '-',
          source,
          result: result.headline,
          answers: answerSummary,
        }),
      })
      if (!response.ok) throw new Error('Network response was not ok')
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', { form_name: 'subsidy_eligibility', result: result.status })
      }
      setSubmitted(true)
    } catch (error) {
      console.error('Eligibility form error:', error)
      setErrors({ submit: 'Something went wrong. Please try again or WhatsApp us.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-8">
      {showCelebration && result && (
        <>
          <ConfettiBurst />
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="celebration-title"
            onClick={claimNow}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[popIn_0.35s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary px-6 pt-7 pb-6 text-center text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300 mb-2">Congratulations!</p>
                <h2 id="celebration-title" className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  Your home is eligible
                </h2>
                <p className="mt-3 text-sm text-blue-100">You can get a solar subsidy of up to</p>
                <p className="text-4xl sm:text-5xl font-black text-yellow-300 mt-1">
                  {result.breakdown[result.breakdown.length - 1].value}
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="flex gap-3 items-start text-sm text-slate-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p><span className="font-bold text-amber-800">Grab it soon. </span>{result.urgency}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <div className="px-2 py-3">
                    <p className="text-xl font-black text-primary">122</p>
                    <p className="text-[0.7rem] leading-tight text-slate-500 mt-0.5">PM Surya Ghar installs</p>
                  </div>
                  <div className="px-2 py-3">
                    <p className="text-xl font-black text-primary flex items-center justify-center gap-1">
                      5.0
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" />
                      </svg>
                    </p>
                    <p className="text-[0.7rem] leading-tight text-slate-500 mt-0.5">45 Google reviews</p>
                  </div>
                  <div className="px-2 py-3">
                    <p className="text-xl font-black text-primary">Free</p>
                    <p className="text-[0.7rem] leading-tight text-slate-500 mt-0.5">subsidy paperwork</p>
                  </div>
                </div>
                <button type="button" onClick={claimNow} className="btn-primary w-full mt-5 text-lg">
                  Claim My Subsidy Now
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center w-full px-6 py-3 rounded-full bg-[#25D366] text-white font-bold hover:brightness-95 transition"
                >
                  Chat on WhatsApp
                </a>
                <button type="button" onClick={() => setShowCelebration(false)} className="mt-3 w-full text-sm text-slate-500 hover:underline">
                  See full result
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {!isDone && (
        <>
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
            <span>Question {step + 1} of {questions.length}</span>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="text-primary font-medium hover:underline">
                &larr; Back
              </button>
            )}
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / questions.length) * 100}%` }} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">{current.question}</h2>
          <div className="grid gap-3">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => choose(opt.value)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all hover:border-primary hover:bg-primary-50 ${
                  answers[current.id] === opt.value ? 'border-primary bg-primary-50 text-primary' : 'border-slate-200 text-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {isDone && (
        <>
          <div className={`rounded-xl border p-5 mb-6 ${STATUS_STYLES[result.status]}`}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1">
              {result.status === 'yes' ? 'Good news' : 'Your result'}
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{result.headline}</h2>
            <p className="text-sm sm:text-base">{result.detail}</p>
            {result.breakdown && (
              <dl className="mt-4 divide-y divide-green-200 bg-white/70 rounded-lg px-4">
                {result.breakdown.map((row) => (
                  <div key={row.label} className={`flex justify-between py-2 ${row.strong ? 'font-bold' : ''}`}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {result.notes && result.notes.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm">
                {result.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {result.status === 'yes' ? 'Claim your subsidy - get a free call back' : 'Talk to our engineer - free'}
                </h3>
                <p className="text-sm text-slate-600">
                  We confirm your eligibility on the official portal, handle the paperwork and give a written quote. No charge for the visit.
                </p>
              </div>
              <div>
                <label htmlFor="elig-name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  id="elig-name"
                  ref={nameRef}
                  type="text"
                  autoComplete="name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500" role="alert">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="elig-mobile" className="block text-sm font-medium text-slate-700 mb-1">Mobile number</label>
                <input
                  id="elig-mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength="10"
                  value={lead.mobile}
                  onChange={(e) => setLead({ ...lead, mobile: e.target.value.replace(/\D/g, '') })}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="10-digit mobile number"
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-500" role="alert">{errors.mobile}</p>}
              </div>
              <div>
                <label htmlFor="elig-town" className="block text-sm font-medium text-slate-700 mb-1">Town (optional)</label>
                <select
                  id="elig-town"
                  value={lead.town}
                  onChange={(e) => setLead({ ...lead, town: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select your town</option>
                  {['Cuddalore', 'Panruti', 'Neyveli', 'Chidambaram', 'Villupuram', 'Puducherry', 'Other'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {errors.submit && (
                <p className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{errors.submit}</p>
              )}
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Sending...' : 'Get My Free Call Back'}
              </button>
              <p className="text-xs text-slate-500 text-center">
                By submitting, you agree to be contacted by Surya's Solar about your enquiry. We never share your number.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex-1 h-px bg-slate-200" /> or <span className="flex-1 h-px bg-slate-200" />
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-[#25D366] text-white font-bold hover:brightness-95 transition"
              >
                Send my answers on WhatsApp
              </a>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Thank you, {lead.name.split(' ')[0]}!</h3>
              <p className="text-slate-600 mb-5">
                Our team will call you on {lead.mobile} soon (we are open Mon-Sun, 9 AM - 8 PM). Want a faster reply? Send your answers on WhatsApp.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#25D366] text-white font-bold hover:brightness-95 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
            <button type="button" onClick={restart} className="text-primary font-medium hover:underline">
              Check again
            </button>
            <Link href={SUBSIDY_GUIDE} className="text-primary font-medium hover:underline">
              Read the full ₹1 lakh subsidy guide &rarr;
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
