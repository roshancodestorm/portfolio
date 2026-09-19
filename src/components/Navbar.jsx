import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { NAV_LINKS, LINKS, DEVELOPER_SHORT } from '../config/site'

function NavLink({ item, active, onNavigate }) {
  const isActive = active === item.id
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      aria-current={isActive ? 'page' : undefined}
      className={`group relative px-2 py-2 text-[13.5px] font-bold tracking-wide transition-transform duration-200 hover:-translate-y-[2px] ${
        isActive ? 'text-coral' : 'text-ink hover:text-coral'
      }`}
    >
      {item.label}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 bg-coral transition-all duration-250 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </button>
  )
}

export default function Navbar({ activeSection, onNavigate, onResume }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  const handleNavigate = (id) => {
    setOpen(false)
    onNavigate(id)
  }

  return (
    <header className="sticky top-0 z-50 border-b-3 border-ink bg-cream">
      <div className="section-shell flex h-[72px] items-center justify-between gap-4 px-[32px] max-sm:px-[18px]">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-1 font-display text-[22px] font-bold tracking-tight text-ink"
          aria-label="Go to home"
        >
          <span className="relative">
            {DEVELOPER_SHORT}
            <span className="absolute -right-2 -top-1 h-2.5 w-2.5 rounded-full border-2 border-ink bg-coral transition-transform duration-200 group-hover:scale-125" />
          </span>
        </button>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.id} item={item} active={activeSection} onNavigate={onNavigate} />
          ))}
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-10 w-10 items-center justify-center rounded-md border-3 border-ink bg-ink text-cream shadow-[3px_3px_0_#111827] transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#111827] hover:bg-coral hover:text-ink"
          >
            <FaGithub className="text-lg" />
          </a>
          <button
            type="button"
            onClick={onResume}
            className="bl-btn bl-btn-peach h-10 !px-4 text-[13px]"
          >
            Resume
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-lg border-3 border-ink bg-white shadow-[3px_3px_0_#111827] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block h-[3px] w-6 bg-ink transition-transform duration-200 ${
              open ? 'translate-y-[8px] rotate-45' : ''
            }`}
          />
          <span className={`block h-[3px] w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span
            className={`block h-[3px] w-6 bg-ink transition-transform duration-200 ${
              open ? '-translate-y-[8px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden border-t-3 border-ink bg-cream transition-all duration-300 md:hidden ${
          open ? 'max-h-[430px] opacity-100' : 'max-h-0 opacity-0 border-t-0'
        }`}
      >
        <nav className="section-shell flex flex-col gap-1 py-4" aria-label="Mobile" aria-hidden={!open}>
          {NAV_LINKS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={`flex items-center justify-between rounded-lg border-3 border-ink px-4 py-3 text-left font-display font-bold text-ink transition-transform hover:-translate-y-[2px] ${
                activeSection === item.id ? 'bg-cyan shadow-[4px_4px_0_#111827]' : 'bg-white shadow-[3px_3px_0_#111827]'
              }`}
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={`rounded-full border-2 border-ink ${i % 3 === 0 ? 'bg-coral' : i % 3 === 1 ? 'bg-mint' : 'bg-peach'} px-2 py-0.5 text-[10px] uppercase`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
          <div className="mt-2 flex items-center gap-3">
            <button type="button" onClick={onResume} className="bl-btn bl-btn-peach h-11 flex-1 !px-4 text-[13px]">
              Resume
            </button>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-3 border-ink bg-ink text-cream shadow-[3px_3px_0_#111827]"
            >
              <FaGithub className="text-lg" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}