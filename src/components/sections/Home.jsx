import Button from '../ui/Button'
import ProfileImage from '../ui/ProfileImage'
import TypeWriter from '../ui/TypeWriter'
import Reveal from '../ui/Reveal'
import { SocialIconRow } from '../ui/SocialButtons'
import { TYPING_PHRASES } from '../../config/site'

const TICKER_ITEMS = [
  'AI / ML',
  'Software Developer',
  'React · Next.js',
  'Python',
  'NLP',
  'Machine Learning',
  'FastAPI',
  'Open to Work',
  'GitHub',
  'Lets Build Stuff',
]

export default function Home({ sectionId, profileImage, social, onNavigate, onResume }) {
  return (
    <section
      id={sectionId}
      className="relative scroll-section overflow-hidden border-b-3 border-ink"
      aria-label="Hero"
    >
      {/* decorative giant name behind content */}
      <div
        aria-hidden="true"
        className="bg-ghost top-[46%] text-[clamp(56px,10.5vw,148px)]"
      >
        ROSHAN KANNAUJIYA
      </div>

      <div className="section-shell relative z-10 grid min-h-[calc(100svh-72px)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        {/* Copy */}
        <div>
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border-3 border-ink bg-sun px-4 py-2 shadow-[3px_3px_0_#111827]">
              <span className="h-2.5 w-2.5 rounded-full bg-ink" />
              <span className="font-display text-sm font-bold tracking-[0.22em] uppercase">
                Hello, I&apos;m
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[clamp(38px,6vw,64px)] leading-[0.98] font-bold tracking-tight text-ink">
              ROSHAN
              <br />
              KANNAUJIYA
              <br />
              <span className="text-coral">· CodeStorm ·</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 font-display text-[clamp(17px,2.4vw,22px)] font-bold text-ink">
              <span className="text-inkmuted">I&apos;m a </span>
              <TypeWriter phrases={TYPING_PHRASES} className="text-coral" />
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button variant="peach" onClick={() => onNavigate('projects')}>
                View Projects
              </Button>
              <Button variant="" onClick={() => onNavigate('contact')}>
                Let&apos;s Connect
              </Button>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap gap-3">
              {['B.Tech AI & ML', 'Python', 'React', 'NLP'].map((s) => (
                <span key={s} className="bl-tag bg-softblue">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-8 border-t-2 border-dashed border-ink/20 pt-6">
              <p className="mb-4 font-display text-[12px] font-bold tracking-[0.18em] text-inkmuted uppercase">
                Find me on
              </p>
              <SocialIconRow links={social} />
            </div>
          </Reveal>
        </div>

        {/* Portrait */}
        <Reveal direction="scale" delay={150} className="relative z-10">
          <ProfileImage src={profileImage} />
          {/* floating accent chips */}
          <div className="anim-float absolute -left-4 top-8 z-20 hidden sm:block">
            <span className="bl-tag bg-mint !text-[13px]">▸ AI &amp; ML</span>
          </div>
          <div
            className="absolute -right-2 top-1/2 z-20 hidden sm:block"
            style={{ animation: 'floaty 4.5s ease-in-out infinite' }}
          >
            <span className="bl-tag bg-peach !text-[13px]">⚡ 4+ projects</span>
          </div>
          <button
            type="button"
            onClick={onResume}
            className="bl-tag anim-float absolute -bottom-4 left-6 z-20 bg-coral !py-2 !text-white !text-[13px] cursor-pointer hover:-translate-y-1"
          >
            ⤓ Download Resume
          </button>
        </Reveal>
      </div>

      {/* skill ticker */}
      <div className="relative z-10">
        <Ticker items={TICKER_ITEMS} />
      </div>
    </section>
  )
}

function Ticker({ items }) {
  const doubled = [...items, ...items]
  return (
    <div className="ticker" role="presentation" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={`${t}-${i}`}>{t}</span>
        ))}
      </div>
    </div>
  )
}