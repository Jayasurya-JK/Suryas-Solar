import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    id: 1,
    title: 'Free Home Visit',
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
    description: 'Professional installation with premium components completed in just one day.',
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
    description: 'System activated! Start saving on bills and we help you claim your subsidy amount.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function TimelineSteps() {
  const [visibleSteps, setVisibleSteps] = useState(new Set())
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set([...prev, entry.target.dataset.step]))
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    )

    const stepElements = document.querySelectorAll('[data-step]')
    stepElements.forEach((el) => observerRef.current.observe(el))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <section className="py-10 md:py-14 relative overflow-hidden bg-gradient-to-b from-blue-50/30 to-white">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Get Solar Installed in 6 Easy Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide end-to-end support from design, installation, maintenance along with complete subsidy paperwork.
          </p>
        </div>

        <div className="relative">
          {/* Central Timeline Line (Desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-blue-200 hidden md:block" />

          {/* Left Timeline Line (Mobile) */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-blue-200 md:hidden" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.id}
                data-step={step.id}
                className={`relative flex flex-col md:flex-row items-center justify-center transition-all duration-700 transform ${visibleSteps.has(step.id.toString())
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
                  } ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >

                {/* Mobile: Number Circle & Connector */}
                <div className="absolute left-6 -translate-x-1/2 top-8 md:hidden flex items-center z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-800 text-white font-bold flex items-center justify-center border-4 border-white shadow-lg">
                    {step.id}
                  </div>
                  <div className="w-8 h-0.5 bg-blue-200 absolute left-full top-1/2 -translate-y-1/2" />
                </div>

                {/* Desktop: Center Column (Number Circle) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-800 text-white text-xl font-bold flex items-center justify-center border-4 border-white shadow-lg">
                    {step.id}
                  </div>
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-1/2 flex items-center ${index % 2 === 0 ? 'md:pr-16 pl-20 justify-end' : 'md:pl-16 pl-20 justify-start'
                  }`}>

                  {/* Wrapper for Card + Connector Line */}
                  <div className={`relative flex items-center w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>

                    {/* The Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-50 relative group w-full z-10">
                      {/* Floating Icons around the box */}
                      <div className="absolute -top-3 -right-3 animate-float-slow">
                        {/* Sun Icon */}
                        <svg className="w-8 h-8 text-orange-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-2 -left-2 animate-float-medium">
                        <div className="w-4 h-4 rounded-full bg-blue-200 opacity-60" />
                      </div>
                      <div className="absolute top-1/2 -right-4 animate-float-fast hidden md:block">
                        <svg className="w-5 h-5 text-blue-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>

                      {/* Subtle Top Right Glow */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100 -z-10" />

                      <div className="relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center">
                            {step.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-primary mb-2">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* The Connector Line (Physically attached to card wrapper) */}
                    <div className={`hidden md:block h-0.5 bg-blue-200 absolute top-1/2 -translate-y-1/2 ${index % 2 === 0 ? '-right-16 w-16' : '-left-16 w-16'
                      }`} />
                  </div>
                </div>

                {/* Empty Side for Desktop Layout Balance */}
                <div className="w-full md:w-1/2 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <a href="#booking" className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-blue-200/50">
            Start Your Solar Journey Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
