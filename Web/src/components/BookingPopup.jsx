import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function BookingPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Don't show on home page
        if (router.pathname === '/') {
            return
        }

        let timer
        if (!isVisible) {
            timer = setTimeout(() => {
                setIsVisible(true)
            }, 60000) // Show after 60 seconds
        }

        return () => clearTimeout(timer)
    }, [isVisible, router.pathname])

    const handleClose = () => {
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4 sm:p-6 bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-sm w-full pointer-events-auto transform transition-all animate-fade-in-up relative">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close popup"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-solar-orange">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">Free Solar Consultation</h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Get a customized solar proposal for your home. Save up to 90% on electricity bills!
                    </p>

                    <button
                        onClick={() => {
                            handleClose()
                            router.push('/#booking')
                        }}
                        className="block w-full bg-solar-orange text-white text-center px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    )
}
