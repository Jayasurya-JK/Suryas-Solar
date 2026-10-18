import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import SubsidyEligibilityChecker from '../components/SubsidyEligibilityChecker'

const PAGE_URL = 'https://www.suryassolar.com/subsidy-eligibility'
const SUBSIDY_GUIDE = '/blog/2025-12-02-pm-surya-ghar-subsidy-tamil-nadu-puducherry'

// Ad links can personalise the page, e.g. /subsidy-eligibility?town=neyveli (canonical stays the same)
const TOWNS = {
  cuddalore: 'Cuddalore',
  neyveli: 'Neyveli',
  panruti: 'Panruti',
  chidambaram: 'Chidambaram',
  villupuram: 'Villupuram',
  nellikuppam: 'Nellikuppam',
  vadalur: 'Vadalur',
  virudhachalam: 'Virudhachalam',
  puducherry: 'Puducherry',
}

const SUBSIDY_CARDS = [
  { size: '1kW', central: '₹30,000', topUp: '₹5,000', total: '₹35,000' },
  { size: '2kW', central: '₹60,000', topUp: '₹10,000', total: '₹70,000' },
  { size: '3kW+', central: '₹78,000', topUp: '₹22,000', total: '₹1,00,000', highlight: true },
]

const RULES = [
  { title: 'Home connection in the owner\'s name', text: 'Domestic TNEB connection. Shops, offices and farm connections are not covered.' },
  { title: 'Grid-connected system with DCR panels', text: 'Installed by a vendor registered on the PM Surya Ghar portal, like us.' },
  { title: 'TN top-up for new applications', text: 'Registered on or after 5 August 2026 (G.O. (Ms) No. 102). Not available in Puducherry.' },
  { title: 'Once per home', text: 'A house that already got a rooftop solar subsidy cannot claim it again.' },
]

const PROOF = [
  { value: '122', label: 'PM Surya Ghar installs' },
  { value: '5.0', label: '45 Google reviews' },
  { value: '10+', label: 'years in solar' },
]

const DOCUMENTS = [
  'Aadhaar card, with mobile number linked',
  'Latest EB bill in the applicant\'s name',
  'Bank passbook or cancelled cheque (same name)',
  'Property tax receipt or sale deed',
  'Passport-size photo',
]

const FAQS = [
  {
    question: 'Who is eligible for the ₹1 lakh solar subsidy in Tamil Nadu?',
    answer:
      'Owners of a house with a domestic TNEB connection in their name, who register on the PM Surya Ghar portal on or after 5 August 2026 and install a grid-connected system of 3kW or more through a registered vendor. They get ₹78,000 central subsidy plus the ₹22,000 Tamil Nadu top-up.',
  },
  {
    question: 'Can I get the subsidy if I live in a rented house?',
    answer:
      'No. The subsidy is paid to the house owner whose name is on the EB connection, so the owner has to apply.',
  },
  {
    question: 'Do shops and businesses get PM Surya Ghar subsidy?',
    answer:
      'No. PM Surya Ghar is only for residential connections. Businesses can instead claim accelerated depreciation tax benefits on solar.',
  },
  {
    question: 'Does the ₹22,000 Tamil Nadu top-up apply in Puducherry?',
    answer:
      'No. It is a Tamil Nadu state scheme. Puducherry homes still get the central subsidy of up to ₹78,000.',
  },
  {
    question: 'Is this eligibility check final?',
    answer:
      'It is a quick guide based on the scheme rules as of October 2026. We confirm your exact eligibility on the official portal during the free home visit.',
  },
]

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
)

export default function SubsidyEligibilityPage() {
  const router = useRouter()
  const town = TOWNS[String(router.query.town || '').toLowerCase()] || ''
  const isPuducherry = town === 'Puducherry'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <Head>
        <title>Solar Subsidy Eligibility Check Tamil Nadu 2026 | ₹1 Lakh</title>
        <meta
          name="description"
          content="Check in 30 seconds if your home qualifies for the ₹1 lakh solar subsidy in Tamil Nadu (₹78,000 PM Surya Ghar + ₹22,000 TN top-up). Free, instant result."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content="Solar Subsidy Eligibility Check - Tamil Nadu 2026" />
        <meta
          property="og:description"
          content="6 quick questions. Find out if your home gets up to ₹1 lakh solar subsidy and what system size suits your EB bill."
        />
        <meta property="og:image" content="https://www.suryassolar.com/images/subsidy-eligibility-checker.webp" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <Header />

      <main className="bg-white">
        {/* Hero: quiz on the left, offer and proof on the right (stacks on mobile: heading, quiz, details) */}
        <section className="bg-gradient-to-b from-blue-50 via-blue-50/60 to-white pt-24 lg:pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            <div className="text-center lg:text-left lg:col-start-2 lg:row-start-1 lg:pt-4">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                Free check <span aria-hidden="true">·</span> 30 seconds <span aria-hidden="true">·</span> {town ? 5 : 6} questions
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                {town && <span className="block text-primary text-2xl sm:text-3xl mb-1">{town} homes</span>}
                {isPuducherry ? 'Check Your ₹78,000 Solar Subsidy Eligibility' : 'Check Your ₹1 Lakh Solar Subsidy Eligibility'}
              </h1>
              <p className="text-slate-600 text-lg max-w-xl mx-auto lg:mx-0">
                {isPuducherry
                  ? 'PM Surya Ghar central subsidy for Puducherry homes, with PED approvals handled by us.'
                  : '₹78,000 PM Surya Ghar + ₹22,000 Tamil Nadu top-up, limited to the first 1 lakh eligible homes.'}
              </p>
            </div>

            <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-36">
              <SubsidyEligibilityChecker
                key={town}
                town={town}
                source={town ? `Eligibility page (ad link: ${town})` : 'Subsidy eligibility page'}
              />
            </div>

            <div className="lg:col-start-2 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {SUBSIDY_CARDS.map((c) => (
                  <div
                    key={c.size}
                    className={`rounded-2xl border p-3 sm:p-4 text-center ${c.highlight ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200'}`}
                  >
                    <p className={`text-sm font-bold ${c.highlight ? 'text-blue-100' : 'text-slate-500'}`}>{c.size}</p>
                    <p className={`text-lg sm:text-2xl font-black mt-1 ${c.highlight ? 'text-yellow-300' : 'text-slate-900'}`}>
                      {isPuducherry ? c.central : c.total}
                    </p>
                    <p className={`text-[0.7rem] mt-1 ${c.highlight ? 'text-blue-100' : 'text-slate-500'}`}>
                      {isPuducherry ? 'central subsidy' : `${c.central} + ${c.topUp} TN`}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Who gets the subsidy</h2>
                <ul className="space-y-4">
                  {RULES.map((r) => (
                    <li key={r.title} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
                        <CheckIcon />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{r.title}</p>
                        <p className="text-sm text-slate-600">{r.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white text-center">
                {PROOF.map((p) => (
                  <div key={p.label} className="px-2 py-4">
                    <p className="text-2xl font-black text-primary">{p.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight">{p.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 text-center lg:text-left">
                Official partner of TATA Power Solar and Exide. Open Mon to Sun, 9 AM to 8 PM.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Documents to keep ready</h2>
              <ul className="space-y-3">
                {DOCUMENTS.map((d) => (
                  <li key={d} className="flex gap-3 items-center bg-slate-50 rounded-xl px-4 py-3 text-slate-700">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-600">
                Most common delay: the name on the EB bill does not match the Aadhaar card. We help with the name transfer too.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Questions</h2>
              <div className="space-y-3">
                {FAQS.map((f) => (
                  <details key={f.question} className="group bg-white border border-slate-200 rounded-xl p-4">
                    <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between gap-3">
                      {f.question}
                      <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-10 text-slate-700 text-center">
            Full rules and the step-by-step process: <Link href={SUBSIDY_GUIDE} className="text-primary font-medium hover:underline">₹1 lakh solar subsidy in Tamil Nadu</Link>. Want to see savings first? Try the <Link href="/calc" className="text-primary font-medium hover:underline">solar savings calculator</Link>.
          </p>
          <p className="mt-2 text-xs text-slate-500 text-center">Rules as of October 2026. Government schemes change; we confirm on the official portal.</p>
        </section>
      </main>

      <WhatsAppFloat />
      <Footer />
    </>
  )
}
