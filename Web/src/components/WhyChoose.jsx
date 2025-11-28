export default function WhyChoose() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          Why choose Surya's Solar for your home
        </h2>
        <p className="text-center text-lg text-gray-700 mb-12">
          Book a FREE solar consultation at home!
        </p>
        <div className="text-center mb-16">
          <button className="bg-primary hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
            Get Quote
          </button>
        </div>

        {/* Feature Cards Grid - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Left Column - Text card with overlapping image */}
          <div className="relative flex items-stretch">
            {/* Text Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 w-[55%] flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                Trusted Rooftop Solar Partner
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                With 10+ years of expertise in solar solutions, we're trusted by a growing base of satisfied residential and commercial customers, serving across districts with proven reliability.
              </p>
            </div>
            {/* Overlapping Image */}
            <div className="w-[50%] -ml-[5%] z-10">
              <img
                src="/images/installation-expert.png"
                alt="Solar Installation Expert"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          </div>

          {/* Right Column - 3 Stacked Cards */}
          <div className="flex flex-col gap-4">
            {/* End-to-End Subsidy Support */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-5 flex items-center shadow-sm">
              <div className="flex items-center space-x-4 w-full">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary mb-1">End-to-End Subsidy Support</h3>
                  <p className="text-gray-600 text-sm">
                    Complete assistance with PM Surya Ghar Yojana—documentation, portal updates & DISCOM approvals made hassle-free.
                  </p>
                </div>
              </div>
            </div>

            {/* 5-Year Professional Maintenance */}
            <div className="bg-white rounded-2xl p-5 flex flex-col shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-1">5-Year Professional Maintenance</h3>
              <p className="text-gray-600 text-sm mb-3">
                Monthly deep cleaning, health checks & repairs included.
              </p>
              <img 
                src="/images/maintenance-expert.jpg" 
                alt="Maintenance Expert" 
                className="w-full h-auto rounded-xl"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>

            {/* Strong & Durable Mounting Structure */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 flex items-center shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">Strong & Durable Mounting Structure</h3>
                  <p className="text-gray-600 text-sm">
                    Engineered for long-lasting performance with high-strength materials designed to withstand harsh weather and ensure secure rooftop installation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solar Loans Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                Easy Solar Loans Delivered to Your Doorstep
              </h3>
              <p className="text-base text-gray-700 mb-3 leading-relaxed">
                Get interest rates starting from <span className="text-primary font-bold">6.75%</span> and long-term financing up to 10 years. We handle subsidy paperwork, portal submissions, DISCOM approvals, and bank coordination to make your solar journey smooth and worry-free.
              </p>
              <p className="text-sm text-gray-500 italic">
                We assist with PM Surya Ghar Yojana subsidy claims. No hidden fees.
              </p>
            </div>
            
            {/* Right Side - Highlight Area + CTA + Bank Logos */}
            <div className="flex flex-col items-center">
              {/* Highlight Title */}
              <h4 className="text-xl md:text-2xl font-bold text-primary mb-5 text-center">
                Government-Backed Solar Subsidy + Loan Support
              </h4>
              
              {/* Bank Logos Grid */}
              <div className="grid grid-cols-4 gap-5 mb-5 w-full max-w-xs">
                {/* SBI */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-blue-600 font-bold text-xs">SBI</span>
                </div>
                {/* HDFC */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-red-600 font-bold text-xs">HDFC</span>
                </div>
                {/* Kotak */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-red-500 font-bold text-xs">Kotak</span>
                </div>
                {/* Canara */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-yellow-600 font-bold text-xs">Canara</span>
                </div>
                {/* PNB */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-pink-600 font-bold text-xs">PNB</span>
                </div>
                {/* BOB */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-orange-600 font-bold text-xs">BOB</span>
                </div>
                {/* Axis */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-purple-600 font-bold text-xs">Axis</span>
                </div>
                {/* IDFC */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-sm mx-auto">
                  <span className="text-green-600 font-bold text-xs">IDFC</span>
                </div>
              </div>
              
              {/* CTA Button - Below Bank Logos */}
              <div className="text-center">
                <button className="bg-primary hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors duration-200 shadow-md">
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
