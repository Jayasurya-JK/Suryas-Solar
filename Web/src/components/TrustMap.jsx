import { useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'
import INSTALLS from '../data/installs.json'
import { MAP, project } from '../data/regionMap'

// Impact maths (stated in the footnote)
const UNITS_PER_KWP = 1500 // units per kWp per year in Tamil Nadu
const CO2_KG_PER_UNIT = 0.72 // India grid emission factor (CEA), approx.

// Show rounded-down figures (e.g. 150+, 500+) so the site stays true as installs grow
const HOMES = Math.floor(INSTALLS.homesInstalled / 10) * 10
const KWP = Math.floor(INSTALLS.kwpInstalled / 50) * 50
const yearlyUnits = INSTALLS.kwpInstalled * UNITS_PER_KWP
const co2Tonnes = Math.round((yearlyUnits * CO2_KG_PER_UNIT) / 1000 / 10) * 10
const lakh = (n) => Math.round((n / 100000) * 10) / 10

// Deterministic random so pins stay in the same place on every load
function rng(seed) {
    let s = seed
    return () => {
        s = (s * 9301 + 49297) % 233280
        return s / 233280
    }
}

// Pins are scattered around the AREA centre, never at a customer's address
function buildPins() {
    const pins = []
    INSTALLS.areas.forEach((a, ai) => {
        if (!a.homes) return
        const [cx, cy] = project(a.lat, a.lng)
        const r = Math.min(46, 9 + Math.sqrt(a.homes) * 3.6)
        const rand = rng(ai * 97 + 13)
        for (let i = 0; i < a.homes; i++) {
            const ang = rand() * Math.PI * 2
            const dist = Math.sqrt(rand()) * r
            pins.push({ key: `${a.key}-${i}`, x: cx + Math.cos(ang) * dist, y: cy + Math.sin(ang) * dist * 0.85 })
        }
    })
    // draw top to bottom so lower pins overlap upper ones; stagger by distance from Cuddalore
    return pins.sort((p, q) => p.y - q.y)
}

// Count bubbles (HTML, so text stays readable on phones). Offsets in map pixels.
const BUBBLES = {
    cuddalore: { dx: 30, dy: -26, big: true },
    puducherry: { dx: 30, dy: -22 },
    nathapattu: { dx: -34, dy: 26 },
    vadalur: { dx: -26, dy: -24 },
    nellikuppam: { dx: -30, dy: -22 },
}

const TOWNS = [
    { name: 'Neyveli', lat: 11.545, lng: 79.48 },
    { name: 'Chidambaram', lat: 11.399, lng: 79.693 },
    { name: 'Panruti', lat: 11.776, lng: 79.553 },
    { name: 'Villupuram', lat: 11.94, lng: 79.49 },
]

const PIN = 'M0,0 C-4.6,-5.6 -6.4,-9 -6.4,-12 A6.4,6.4 0 1 1 6.4,-12 C6.4,-9 4.6,-5.6 0,0Z'

const ICONS = {
    rupee: 'M9 8h6M9 11h6M13 21l-4-5h1.5a3.5 3.5 0 000-7',
    bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
    leaf: 'M5 21c0-9 5-15 15-16-1 10-7 15-15 16zm0 0l7-7',
    bank: 'M3 10l9-6 9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18',
}

export default function TrustMap({ className = 'bg-white' }) {
    const ref = useRef(null)
    const [play, setPlay] = useState(false)
    const pins = buildPins()
    const bubbles = INSTALLS.areas.filter((a) => BUBBLES[a.key] && a.homes)
    const chips = [...INSTALLS.areas].filter((a) => a.homes).sort((a, b) => b.homes - a.homes)

    useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === 'undefined') return setPlay(true)
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect() } }, { threshold: 0.25 })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const stats = [
        { icon: 'rupee', tone: 'bg-amber-50 text-amber-600', value: lakh(INSTALLS.subsidyDisbursedRs), decimals: 1, prefix: '₹', suffix: ' lakh', label: 'Subsidy received by our customers' },
        { icon: 'bolt', tone: 'bg-green-50 text-green-600', value: lakh(yearlyUnits), decimals: 1, suffix: ' lakh', label: 'Units of clean power a year' },
        { icon: 'leaf', tone: 'bg-green-50 text-green-600', value: co2Tonnes, prefix: '~', suffix: ' tonnes', label: 'CO2 avoided every year' },
        { icon: 'bank', tone: 'bg-primary-50 text-primary', value: Math.floor(INSTALLS.loanFamilies / 50) * 50, suffix: '+', label: 'Local families used easy bank loans' },
    ]

    return (
        <section className={`py-12 lg:py-20 ${className}`}>
            <div className="container-custom">
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3.5 py-1.5 text-sm font-bold text-green-800">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.6-4.02A11.96 11.96 0 0112 2.94a11.96 11.96 0 01-8.6 3.04A12 12 0 003 9c0 5.6 3.83 10.3 9 11.62 5.17-1.33 9-6.03 9-11.62 0-1.04-.13-2.05-.38-3.02z" /></svg>
                        <span className="sm:hidden">Trusted by local families</span>
                        <span className="hidden sm:inline">Trusted by families across Cuddalore &amp; Puducherry</span>
                    </span>
                    <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                        Solar on rooftops across <span className="text-primary">Cuddalore and Puducherry</span>
                    </h2>
                </div>

                <div ref={ref} className="mt-8 lg:mt-12 grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 items-start">
                    {/* Map */}
                    <div>
                        <div className={`relative rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm overflow-hidden ${play ? 'tm-play' : ''}`}>
                            <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="w-full h-auto block lg:max-h-[620px]" role="img" aria-label={`Map of Cuddalore district and Puducherry: ${HOMES}+ homes with Surya's Solar rooftop solar, shown by area`}>
                                <path d={MAP.villupuram} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2" />
                                <path d={MAP.cuddalore} fill="#e0ecff" stroke="#9ec0f7" strokeWidth="1.6" />
                                <path d={MAP.puducherry} fill="#d3e3ff" stroke="#86aef2" strokeWidth="1.6" />
                                <text x={MAP.width - 16} y={MAP.height * 0.8} textAnchor="end" fill="#7dd3fc" style={{ fontSize: 17, fontStyle: 'italic', letterSpacing: 3 }}>Bay of Bengal</text>
                                {TOWNS.map((t) => {
                                    const [x, y] = project(t.lat, t.lng)
                                    return (
                                        <g key={t.name}>
                                            <circle cx={x} cy={y} r="3" fill="#94a3b8" />
                                            <text x={x} y={y + 19} textAnchor="middle" fill="#64748b" style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</text>
                                        </g>
                                    )
                                })}
                                {pins.map((p, i) => (
                                    <g key={p.key} transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}>
                                        <path d={PIN} className="tm-pin" style={{ animationDelay: `${Math.min(i * 9, 1400)}ms` }} fill="#16a34a" stroke="#fff" strokeWidth="1.4" />
                                    </g>
                                ))}
                            </svg>

                            {/* Count bubbles */}
                            {bubbles.map((a) => {
                                const [x, y] = project(a.lat, a.lng)
                                const b = BUBBLES[a.key]
                                const left = ((x + b.dx) / MAP.width) * 100
                                const top = ((y + b.dy) / MAP.height) * 100
                                return (
                                    <div key={a.key} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `${left}%`, top: `${top}%` }}>
                                        <span className="relative flex flex-col items-center">
                                            {b.big && play && <span className="absolute top-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-green-500/40 animate-ping" />}
                                            <span className={`relative flex items-center justify-center rounded-full bg-white border-2 border-green-600 font-black text-green-700 shadow-md ${b.big ? 'w-9 h-9 sm:w-11 sm:h-11 text-sm sm:text-base' : 'w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm'}`}>{a.homes}</span>
                                            <span className="mt-0.5 rounded-full bg-white/90 px-1.5 text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap shadow-sm">{a.name}</span>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Legend + area chips */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700"><span className="w-3 h-3 rounded-full bg-green-600" />Installed and generating</span>
                            <span className="text-xs text-slate-400">Pins show the area, not exact homes</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {chips.map((a) => (
                                <span key={a.key} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs sm:text-sm text-slate-700">
                                    {a.name}<strong className="text-green-700">{a.homes}</strong>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Numbers */}
                    <div className="space-y-3 lg:space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 text-white p-6 sm:p-8 shadow-xl">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-bold text-green-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Installed and generating
                            </div>
                            <div className="mt-3 flex items-end gap-3 flex-wrap">
                                <span className="text-5xl sm:text-6xl font-black leading-none">
                                    <CountUp end={HOMES} suffix="+" duration={2.2} enableScrollSpy scrollSpyOnce />
                                </span>
                                <span className="text-lg sm:text-xl font-bold text-blue-100 pb-1">homes powered</span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-xl bg-white/10 px-3 py-2.5">
                                    <div className="text-lg font-black text-yellow-300">{KWP}+ kWp</div>
                                    <div className="text-blue-100">installed</div>
                                </div>
                                <div className="rounded-xl bg-white/10 px-3 py-2.5">
                                    <div className="text-lg font-black text-yellow-300">5.0 ★</div>
                                    <div className="text-blue-100">Google rating</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {stats.map((s) => (
                                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.tone}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={ICONS[s.icon]} /></svg>
                                    </span>
                                    <div className="mt-2.5 text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">
                                        <CountUp end={s.value} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix || ''} duration={2} enableScrollSpy scrollSpyOnce />
                                    </div>
                                    <div className="mt-0.5 text-xs sm:text-sm text-slate-500 leading-snug">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Source: our PM Surya Ghar portal records, {INSTALLS.asOf}. Units at about {UNITS_PER_KWP.toLocaleString('en-IN')} per kWp a year; CO2 at about {CO2_KG_PER_UNIT} kg per unit (India grid average). Map data © OpenStreetMap.
                </p>
            </div>
        </section>
    )
}
