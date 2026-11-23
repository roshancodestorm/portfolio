import { useState } from 'react'

const ACCENTS = ['bg-peach', 'bg-mint', 'bg-cyan', 'bg-sun', 'bg-softblue']

/**
 * Project cover with a neo-brutalist fallback when an image is missing or
 * fails to load (including admin-uploaded entries with stale data URLs).
 */
export default function ProjectThumb({ src, title, accentIndex = 0, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = failedSrc === src

  const accent = ACCENTS[accentIndex % ACCENTS.length]
  const initial = (title || 'P').trim().charAt(0).toUpperCase() || 'P'

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={title ? `${title} cover art` : 'Project cover art'}
        className={`relative flex h-48 w-full items-center justify-center overflow-hidden sm:h-52 ${accent} ${className}`}
      >
        <span
          aria-hidden="true"
          className="absolute -top-10 -left-8 h-32 w-32 rounded-full border-3 border-ink bg-cream/70"
        />
        <span
          aria-hidden="true"
          className="absolute -right-6 -bottom-10 h-28 w-28 rounded-full border-3 border-ink bg-white/70"
        />
        <span
          aria-hidden="true"
          className="absolute top-6 right-10 h-7 w-7 rotate-12 rounded-md border-3 border-ink bg-coral"
        />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="font-display text-5xl leading-none font-bold text-ink drop-shadow-[2px_2px_0_#fff8e7]">
            {initial}
          </span>
          <span className="rounded border-2 border-ink bg-cream px-2.5 py-0.5 font-display text-[10px] font-bold tracking-[0.2em] text-ink uppercase">
            Project
          </span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={title ? `${title} project cover` : 'Project cover'}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`p-img h-48 w-full object-cover transition-transform duration-500 sm:h-52 ${className}`}
    />
  )
}
