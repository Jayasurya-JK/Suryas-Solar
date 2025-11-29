export default function WhyChoose() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Why Choose <span className="text-primary">Surya's Solar</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-4">
            Book a <span className="font-semibold text-primary">FREE</span> solar consultation at home!
          </p>
          <a 
            href="/#booking" 
            className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300"
          >
            <span>Get Free Quote</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Main Content - Single Row on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* LEFT: Image with Text Overlay */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <div className="relative h-80">
              <img
                src="/images/installation-expert.png"
                alt="Solar Installation Expert"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-900">10+ Years Experience</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Trusted Rooftop Solar Partner
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  With over a decade of expertise, we're trusted by satisfied residential and commercial customers.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Feature Cards */}
          <div className="space-y-4">
            
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                    End-to-End Subsidy Support
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Complete assistance with <span className="font-semibold">PM Surya Ghar Yojana</span>—documentation, portal updates & DISCOM approvals made hassle-free.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                    5-Year Professional Maintenance
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Monthly deep cleaning, health checks & repairs included.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                    Strong & Durable Mounting
                  </h4>
                  <p className="text-gray-700 text-sm">
                    High-strength materials designed to withstand harsh weather and ensure secure installation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solar Loans Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-xl p-6 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* LEFT SIDE - Main Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-3">
                  <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-semibold text-xs">Government Approved</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                  Solar Subsidy + Easy Financing
                </h3>
                <p className="text-indigo-100 text-sm md:text-base lg:text-lg mb-6">
                  Interest from <span className="text-yellow-300 font-bold">6.75%</span> with up to 10 years financing. <span className="font-semibold">PM Surya Ghar Yojana</span> support included.
                </p>
                
                {/* CTA Button - Moved to Left Side */}
                <div className="text-center lg:text-left">
                  <a 
                    href="/#booking" 
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-xl transition-all duration-300 shadow-lg text-sm md:text-base lg:text-lg"
                  >
                    <span>Apply for Solar Loan</span>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <p className="text-indigo-200 text-[10px] md:text-xs mt-2">*T&C apply. Rates subject to bank approval.</p>
                </div>
              </div>

              {/* RIGHT SIDE - Banks, Stats & CTA */}
              <div>
                {/* Bank Partners - 3x2 Grid */}
                <div className="mb-6 lg:mb-8">
                  <p className="text-center text-indigo-200 text-xs md:text-sm font-medium mb-4">Trusted Banking Partners</p>
                  <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-5 max-w-md mx-auto">
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-md p-2 mx-auto">
                      <img 
                        src="/images/SBI.png" 
                        alt="SBI" 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                      <span className="text-blue-600 font-bold text-xs hidden">SBI</span>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-md p-2 mx-auto">
                      <img 
                        src="/images/Bank Of maharastra.png" 
                        alt="Bank of Maharashtra" 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                      <span className="text-orange-600 font-bold text-[9px] text-center leading-tight px-1 hidden">Bank of Maharashtra</span>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-md p-2 mx-auto">
                      <img 
                        src="/images/indian bank.png" 
                        alt="Indian Bank" 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                      <span className="text-blue-700 font-bold text-[9px] text-center leading-tight hidden">Indian Bank</span>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-md p-2 mx-auto">
                      <img 
                        src="/images/canara bank.png" 
                        alt="Canara Bank" 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                      <span className="text-yellow-600 font-bold text-[9px] text-center leading-tight hidden">Canara Bank</span>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-md p-2 mx-auto">
                      <img 
                        src="/images/union bank.png" 
                        alt="Union Bank" 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                      <span className="text-red-600 font-bold text-[9px] text-center leading-tight hidden">Union Bank</span>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-md p-2 mx-auto">
                      <img 
                        src="/images/indian overseasbank.png" 
                        alt="Indian Overseas Bank" 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                      <span className="text-indigo-600 font-bold text-[8px] text-center leading-tight px-1 hidden">Indian Overseas Bank</span>
                    </div>
                  </div>
                </div>
                
                {/* Features Grid */}
                <div className="flex justify-center gap-4 md:gap-8 lg:gap-10">
                  <div className="text-center">
                    <div className="text-yellow-300 font-bold text-xl md:text-3xl lg:text-4xl">6.75%*</div>
                    <div className="text-indigo-100 text-xs md:text-sm mt-1">Starting Rate</div>
                  </div>
                  <div className="w-px bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-yellow-300 font-bold text-xl md:text-3xl lg:text-4xl">10 Years</div>
                    <div className="text-indigo-100 text-xs md:text-sm mt-1">Flexible Tenure</div>
                  </div>
                  <div className="w-px bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-yellow-300 font-bold text-xl md:text-3xl lg:text-4xl">100%</div>
                    <div className="text-indigo-100 text-xs md:text-sm mt-1">Support</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
