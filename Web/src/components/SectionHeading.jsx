// One heading style for every homepage section: gold eyebrow, bold title, grey subtitle.
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', as: Tag = 'h2', className = '' }) {
  const center = align === 'center'
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600 ${center ? 'justify-center' : ''}`}>
          <span className="w-6 h-px bg-amber-500" aria-hidden="true" />
          {eyebrow}
          {center && <span className="w-6 h-px bg-amber-500" aria-hidden="true" />}
        </span>
      )}
      <Tag className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">{title}</Tag>
      {subtitle && <p className="mt-3 text-slate-600 md:text-lg leading-relaxed">{subtitle}</p>}
    </div>
  )
}
