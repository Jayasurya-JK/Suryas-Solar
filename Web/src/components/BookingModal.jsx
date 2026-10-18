import { useEffect, useState } from 'react'
import BookingForm from './BookingForm'

// One booking form for the whole site, opened in place (no page jumps).
// Opens on: window event 'open-booking', or any click on a link to "#booking" / "/#booking".
export const openBooking = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-booking'))
}

export default function BookingModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      if (href === '#booking' || href === '/#booking') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('open-booking', show)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('open-booking', show)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (window.gtag) window.gtag('event', 'booking_modal_open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-[popIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-gradient-to-br from-primary-900 via-primary-700 to-primary px-6 pt-6 pb-5 text-white">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
            aria-label="Close booking form"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 id="booking-modal-title" className="text-2xl font-extrabold pr-10">Book Your Free Home Visit</h2>
          <p className="mt-1 text-sm text-blue-100">Our engineer checks your roof and bill and gives a written quote. Open all 7 days, 9 AM - 8 PM.</p>
        </div>
        <div className="px-6 py-5">
          <BookingForm variant="modal" onDone={() => setOpen(false)} />
        </div>
      </div>
    </div>
  )
}
