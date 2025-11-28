const stats = [
  {
    id: 1,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    value: '50+',
    label: 'Happy Homes',
  },
  {
    id: 2,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    value: '100 kW+',
    label: 'Installations',
  },
  {
    id: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    value: '25 Years',
    label: 'Panel Warranty',
  },
]

export default function StatsStrip() {
  return (
    <section>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-700 py-3 text-center">
        <h2 className="text-white font-semibold text-lg md:text-xl tracking-wide">
          Cuddalore's #1 Trusted Solar Company
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="bg-white py-8 md:py-10">
        <div className="container-custom">
          <div className="grid grid-cols-3 gap-2 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-3">
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-xl md:text-3xl font-bold text-slate-800 mb-1">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-xs md:text-base text-slate-500 font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
