export default function SectionHeader({ eyebrow, title, accent, right, className = '' }) {
  return (
    <div
      className={`mb-14 flex flex-wrap items-end justify-between gap-6 ${className}`}
    >
      <div>
        {eyebrow && (
          <div className="mb-3 flex items-center gap-2">
            <span className="block h-3 w-3 rounded-[3px] border-2 border-ink bg-coral" />
            <span className="font-display text-sm font-bold tracking-[0.18em] uppercase text-inkmuted">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="section-title">
          {title} {accent && <span className="section-accent">/{accent}</span>}
        </h2>
      </div>
      {right}
    </div>
  )
}