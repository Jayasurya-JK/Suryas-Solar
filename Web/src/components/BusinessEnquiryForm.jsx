import { useState } from 'react'

const WA_NUMBER = '917904369094'
const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition'

const BUSINESS_TYPES = ['Shop / showroom', 'Clinic / hospital', 'School / college', 'Hotel / lodge', 'Marriage / function hall', 'Rice mill / cashew unit', 'Factory / workshop', 'Warehouse / cold storage', 'Office', 'Other']
const BILLS = ['Below ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1 lakh', 'Above ₹1 lakh']

// Lead form for business buyers. variant: 'commercial' | 'apartment'
export default function BusinessEnquiryForm({ variant = 'commercial' }) {
    const isApt = variant === 'apartment'
    const [form, setForm] = useState({ name: '', mobile: '', type: '', bill: '', building: '', flats: '', town: '', botcheck: '' })
    const [error, setError] = useState('')
    const [status, setStatus] = useState('idle')

    const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        const mobile = form.mobile.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
        if (!form.name.trim()) return setError('Please enter your name.')
        if (!/^[6-9]\d{9}$/.test(mobile)) return setError('Please enter a valid 10-digit mobile number.')
        setStatus('sending')
        try {
            const details = isApt
                ? { apartment: form.building.trim(), flats: form.flats, town: form.town.trim() }
                : { business_type: form.type, monthly_eb_bill: form.bill, town: form.town.trim() }
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: '111437b6-7422-4929-b9b3-b0361d387ee0', // Web3Forms Access Key
                    subject: isApt ? 'New Apartment / RWA Solar Enquiry' : 'New Commercial Solar Enquiry',
                    from_name: 'Suryas Solar Website',
                    source: isApt ? 'apartment-solar page' : 'commercial-solar page',
                    name: form.name.trim(),
                    mobile,
                    ...details,
                    botcheck: form.botcheck,
                }),
            })
            if (!res.ok) throw new Error('Network response was not ok')
            if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'generate_lead', { form_name: isApt ? 'apartment_enquiry' : 'commercial_enquiry' })
            setStatus('done')
        } catch (err) {
            console.error('Form submission error:', err)
            setStatus('idle')
            setError('Something went wrong. Please call or WhatsApp us on +91 7904369094.')
        }
    }

    const waText = isApt
        ? "Hi Surya's Solar, I'd like a solar survey for our apartment."
        : "Hi Surya's Solar, I'd like a solar survey for my business."

    if (status === 'done') {
        return (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Thank you, {form.name.split(' ')[0]}</h2>
                <p className="mt-2 text-slate-600">Our engineer will call you to fix a free site survey. Keep your last 12 months of EB bills ready.</p>
                <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 font-bold text-white hover:bg-[#1ebe5a] transition-colors">
                    Send your EB bill on WhatsApp
                </a>
            </div>
        )
    }

    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{isApt ? 'Free survey for your apartment' : 'Free site survey for your business'}</h2>
            <p className="mt-1 text-sm text-slate-500">{isApt ? 'For RWA members, secretaries and builders.' : 'Roof check, load study and a written proposal.'}</p>
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" checked={!!form.botcheck} onChange={(e) => setForm({ ...form, botcheck: e.target.checked ? 'on' : '' })} />
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="b-name" className="block text-sm font-semibold text-slate-700 mb-1">Your name</label>
                        <input id="b-name" name="name" autoComplete="name" value={form.name} onChange={set} className={inputCls} placeholder="Your full name" />
                    </div>
                    <div>
                        <label htmlFor="b-mobile" className="block text-sm font-semibold text-slate-700 mb-1">Mobile number</label>
                        <input id="b-mobile" name="mobile" type="tel" inputMode="numeric" autoComplete="tel" value={form.mobile} onChange={set} className={inputCls} placeholder="10-digit mobile" />
                    </div>
                </div>
                {isApt ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="b-building" className="block text-sm font-semibold text-slate-700 mb-1">Apartment name <span className="font-normal text-slate-400">(optional)</span></label>
                            <input id="b-building" name="building" value={form.building} onChange={set} className={inputCls} placeholder="e.g. Sri Sai Apartments" />
                        </div>
                        <div>
                            <label htmlFor="b-flats" className="block text-sm font-semibold text-slate-700 mb-1">Number of flats</label>
                            <input id="b-flats" name="flats" type="number" inputMode="numeric" min="1" value={form.flats} onChange={set} className={inputCls} placeholder="e.g. 24" />
                        </div>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="b-type" className="block text-sm font-semibold text-slate-700 mb-1">Type of business</label>
                            <select id="b-type" name="type" value={form.type} onChange={set} className={inputCls}>
                                <option value="">Select</option>
                                {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="b-bill" className="block text-sm font-semibold text-slate-700 mb-1">Monthly EB bill</label>
                            <select id="b-bill" name="bill" value={form.bill} onChange={set} className={inputCls}>
                                <option value="">Select</option>
                                {BILLS.map((b) => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                <div>
                    <label htmlFor="b-town" className="block text-sm font-semibold text-slate-700 mb-1">Town <span className="font-normal text-slate-400">(optional)</span></label>
                    <input id="b-town" name="town" value={form.town} onChange={set} className={inputCls} placeholder="e.g. Cuddalore" />
                </div>
                {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full text-base disabled:opacity-70 disabled:cursor-not-allowed">
                    {status === 'sending' ? 'Sending...' : 'Book Free Site Survey'}
                </button>
                <p className="text-center text-sm text-slate-500">
                    Or call <a href="tel:+917904369094" className="font-semibold text-primary hover:underline">+91 7904369094</a>
                </p>
            </form>
        </div>
    )
}
