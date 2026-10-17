import Head from 'next/head'
import Link from 'next/link'

// Short link for customers: suryassolar.com/review (WhatsApp, QR code on handover sheet).
// Replace with the official "Ask for reviews" link from Google Business Profile (g.page/r/.../review) for one-tap review.
const GOOGLE_REVIEW_URL = 'https://maps.google.com/?cid=11101727010292054099'

const TIPS = [
  'Which town you live in (for example Cuddalore, Panruti, Puducherry)',
  'System size and type (for example 3kW on-grid)',
  'How the installation, paperwork or subsidy went',
  'How your EB bill changed after solar',
]

export default function ReviewPage() {
  return (
    <>
      <Head>
        <title>Review Surya&apos;s Solar on Google</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content="Thank you for choosing Surya's Solar. Share your experience on Google in one minute." />
        <link rel="canonical" href="https://www.suryassolar.com/review" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary px-6 py-8 text-center text-white">
            <img src="/images/surya-solar-logo.webp" alt="Surya's Solar" className="w-16 h-16 mx-auto rounded-full bg-white p-1" />
            <h1 className="mt-4 text-2xl font-extrabold">Thank you for choosing Surya&apos;s Solar</h1>
            <p className="mt-2 text-blue-100 text-sm">Your review helps other families in Cuddalore and nearby towns choose solar with confidence.</p>
          </div>

          <div className="px-6 py-6">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-primary hover:bg-primary-600 text-white text-lg font-bold shadow-lg transition-colors"
            >
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" />
              </svg>
              Write a Google Review
            </a>
            <p className="mt-2 text-center text-xs text-slate-500">Opens Google. Tap the stars, write a few words, and post.</p>

            <div className="mt-6">
              <p className="text-sm font-bold text-slate-900">Not sure what to write? You could mention:</p>
              <ul className="mt-3 space-y-2">
                {TIPS.map((t) => (
                  <li key={t} className="flex gap-3 items-start text-sm text-slate-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">Please write in your own words, in English or Tamil.</p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-600">
              Need help with your system? Call or WhatsApp{' '}
              <a href="https://wa.me/917904369094" className="text-primary font-semibold hover:underline">+91 7904369094</a>
              <div className="mt-3">
                <Link href="/" className="text-primary font-medium hover:underline">Visit suryassolar.com</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
