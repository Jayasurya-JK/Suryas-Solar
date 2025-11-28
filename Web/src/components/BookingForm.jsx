import { useState } from 'react'

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    pincode: '',
    visitDate: '',
    roofType: '',
    electricityBill: '',
    message: '',
    consent: false,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode'
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to be contacted'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to Netlify Forms
      const netlifyFormData = new FormData()
      netlifyFormData.append('form-name', 'booking')
      Object.keys(formData).forEach(key => {
        netlifyFormData.append(key, formData[key])
      })

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData).toString()
      })

      // Also submit to serverless function for webhook
      await fetch('/api/form-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      setShowSuccess(true)
      setFormData({
        name: '',
        mobile: '',
        email: '',
        pincode: '',
        visitDate: '',
        roofType: '',
        electricityBill: '',
        message: '',
        consent: false,
      })
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="booking" className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-800 mb-6 relative inline-block">
              Book Your Free Home Visit
              <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transform scale-x-75"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Get a personalized solar assessment and quote. Our experts will visit your home at your convenience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 md:h-auto">
              <img
                src="/images/default-installation.jpg"
                alt="Professional solar panel installation on residential rooftop"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Expert Installation</h3>
                  <p className="text-white/90">Completed in just 24 hours with premium quality panels</p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="card">
              <form
                onSubmit={handleSubmit}
                name="booking"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
              >
                {/* Hidden fields for Netlify */}
                <input type="hidden" name="form-name" value="booking" />
                <p className="hidden">
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.name}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      autoComplete="tel"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.mobile}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.email}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      autoComplete="postal-code"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="6-digit pincode"
                      maxLength="6"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.pincode}</p>
                    )}
                  </div>

                  {/* Visit Date */}
                  <div>
                    <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Visit Date
                    </label>
                    <input
                      type="date"
                      id="visitDate"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Roof Type */}
                  <div>
                    <label htmlFor="roofType" className="block text-sm font-medium text-gray-700 mb-1">
                      Roof Type
                    </label>
                    <select
                      id="roofType"
                      name="roofType"
                      value={formData.roofType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select roof type</option>
                      <option value="tiles">Tiles</option>
                      <option value="metal">Metal</option>
                      <option value="concrete">Concrete</option>
                      <option value="flat">Flat</option>
                      <option value="unknown">Not Sure</option>
                    </select>
                  </div>

                  {/* Electricity Bill */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Bi-monthly Electricity Bill
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'below-2000', label: 'Less than ₹2,000' },
                        { value: '2000-5000', label: '₹2,000 - ₹5,000' },
                        { value: 'above-5000', label: 'Above ₹5,000' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg border-2 cursor-pointer transition-all text-center ${formData.electricityBill === option.value
                              ? 'border-primary bg-primary/5 text-primary font-medium'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <input
                            type="radio"
                            name="electricityBill"
                            value={option.value}
                            checked={formData.electricityBill === option.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Any specific questions or requirements?"
                    />
                  </div>

                  {/* Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className={`mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary ${errors.consent ? 'border-red-500' : ''
                          }`}
                      />
                      <span className="text-sm text-gray-600">
                        I agree to be contacted by Surya's Solar regarding my inquiry <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.consent}</p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Schedule Free Home Visit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for choosing Surya's Solar. Our team will contact you within 24 hours to confirm your home visit.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
